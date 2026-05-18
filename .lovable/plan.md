## Why the curriculum vanishes

Two bugs combine:

1. **Auth guard race on `/content-creator`.** `ImprovedProtectedRoute` reads `user.role` (the `profiles.role` column, which is `student` for this account) before the `user_roles` query resolves to `content_creator`. The guard immediately redirects to `/dashboard`. A moment later the role resolves, the user lands back on `/content-creator`, and the studio mounts **fresh**. This is visible in the console logs (`Access denied; routing authenticated user to dashboard router` followed by `userRole: content_creator`). It also fires on every tab focus / token refresh that emits `SIGNED_IN`.

2. **`CreatorProvider` keeps everything in memory only.** `curriculumData`, `activeBlueprintContext`, and `activeLessonData` live in `useState` with no persistence. Any unmount — the auth flicker above, refreshing the tab, or navigating to `/dashboard` and back — empties them. So the generated blueprint disappears.

The two together produce exactly the reported symptom: generate blueprint → click a lesson → guard briefly rejects → studio remounts → curriculum gone.

## Fix

### 1. Persist Creator Studio state (`src/components/creator-studio/CreatorContext.tsx`)

- Hydrate `curriculumData`, `activeBlueprintContext`, `activeLessonData`, and `currentStep` from `sessionStorage` on mount (lazy `useState` initializer).
- Write each back to `sessionStorage` in a small `useEffect` whenever it changes (JSON stringify, wrapped in try/catch, quota-safe).
- Use a single namespaced key prefix (`creator_studio:*`) so it can be cleared in one shot.
- Clear the keys on explicit reset (e.g. when the user signs out — already handled by AuthContext clearing storage on `SIGNED_OUT`; just piggy-back on that path).

This guarantees the curriculum survives any remount, refresh, or navigation round-trip.

### 2. Stop the auth guard from redirecting during role hydration (`src/components/auth/ImprovedProtectedRoute.tsx` + `src/contexts/AuthContext.tsx`)

- When `requiredRole` is set and the canonical role is still being resolved (we have a `user` but the `user_roles` query has not completed yet), render the loading state instead of redirecting. Today the guard only waits when `userRole` is fully null; if `profiles.role` returns `student` first it immediately bails out.
- Expose a `roleResolved` / `roleLoading` flag from `AuthContext` (set false at the start of `HYDRATE`, true once `STEP 3B` resolves) and have the guard treat `roleLoading` exactly like `loading`.
- Keep the resolved role in `sessionStorage` for the **entire session**, not just until the first auth event matches it. Today it is removed at line 264 of `AuthContext.tsx` as soon as the canonical role equals the cached one, which means the next `SIGNED_IN` event has no cache to fall back on. Keep it until `SIGNED_OUT`.

### 3. Verify

- Generate a blueprint on `/content-creator/blueprint`.
- Click "Open Unified Generator" on a lesson.
- Confirm the blueprint is still visible when navigating back, and that the lesson generator receives the resolved blueprint.
- Hard refresh `/content-creator/blueprint` and confirm the curriculum is restored from sessionStorage.
- Check console: no more `Access denied; routing authenticated user to dashboard router` for a user whose final role is `content_creator`.

## Out of scope

- No changes to the generator pipeline, edge functions, or DB schema. The previous fixes around `generate-curriculum-blueprint`, blueprint field hydration, and slot upserts stay as-is.
- No UI redesign.
