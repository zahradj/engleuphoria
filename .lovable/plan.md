## Root cause

The console logs (path `/dashboard`, `userRole: "student"`, `cachedRole: null`, plus repeated `Access denied; routing authenticated user to dashboard router … requiredRole: content_creator, userRole: student`) prove what's actually happening. It is NOT a hung request — sign-in succeeds. The user is being **bounced in a redirect ping‑pong** because the app reads the wrong role on the destination page:

For `f.zahra.djaanine@gmail.com` the DB has TWO `user_roles` rows: `student` + `content_creator`. The priority resolver correctly picks `content_creator`. But on the destination page, the gate sees `student` first and redirects.

There are three concrete defects causing this:

1. **`signIn()` clears the sessionStorage cache at the start** (`AuthContext.tsx` lines 487–489 — `removeItem('auth_redirect_done')` and `removeItem('auth_resolved_role')`). Supabase fires the `SIGNED_IN` listener event during the in-flight `await signInWithPassword(...)`. At that moment the cache is empty and `signInRedirectRef` was just reset to `false`, so the listener path runs `createFallbackUserSync` with `role = user_metadata.role = 'student'`, calls `setUser(fallback)`, and kicks off an unrelated background hydration. `Login.tsx`'s redirect effect then immediately fires with the bogus `student` role.

2. **`ImprovedProtectedRoute` ignores the resolved-role cache.** Line 32: `userRole = user.role || user.user_metadata.role`. Even when `signIn()` later writes `auth_resolved_role = 'content_creator'`, the guard never looks at sessionStorage, so on the new page render it sees the metadata role (`student`), denies, and `Navigate`s to `/dashboard`. `Dashboard.tsx` has the same race because the user object has not been hydrated yet.

3. **Hydration eagerly clears the cache** (`hydrateUserInBackground` line 261 calls `sessionStorage.removeItem('auth_resolved_role')` as soon as the canonical user loads). Any subsequent re-mount, refresh, or redirect that happens before the new `user` object propagates falls back to metadata role again, re-triggering the bounce.

Net effect: SIGNED_IN → Login redirect with stale role → ImprovedProtectedRoute denies on `/content-creator` → Navigate to `/dashboard` → Dashboard router still has `role=student` → Navigate to `/playground` → hydration finishes → user.role becomes `content_creator` → still on wrong page → user perceives the Sign In button as "stuck" because the URL never settles on the correct dashboard.

The same pattern hits any multi-row `user_roles` user (teachers who are also content creators, admins, etc.) and any student whose `user_metadata.role` is missing/stale.

## Fix plan

### A. `src/contexts/AuthContext.tsx`

1. **Set the redirect guard BEFORE calling `signInWithPassword`.** Move these to the top of the `signIn` try-block (right after the rate-limit check), instead of clearing them:
   - `signInRedirectRef.current = true;`
   - `sessionStorage.setItem('auth_redirect_done', 'true');`
   - Do NOT clear `auth_resolved_role` here — leave any prior value (a stale value is harmless because we'll overwrite it).
   
   Reset the guard to `false` only on a real error before returning (`error` branch).

2. **Make the auth listener ignore SIGNED_IN events while the in-flight signIn is running.** In the `onAuthStateChange` callback, check the ref/sessionStorage flag FIRST — before `setUser(fallback)` and any `setLoading(false)`. Today the early return is after the fallback user has been set, which already corrupted state.

3. **Stop pre-emptively clearing the resolved-role cache in `hydrateUserInBackground`.** Only clear it when the canonical user's role actually matches what we cached. If the canonical fetch returned `null`, keep the cache so re-renders still see the right role. Add a TTL / `signOut` cleanup instead of clearing on first hydration.

4. **`createFallbackUserSync` already reads the cache — keep it.** No change here once items 1–3 are applied.

### B. `src/components/auth/ImprovedProtectedRoute.tsx`

5. **Resolve role with cache fallback.** Replace line 32 with:
   ```ts
   const cachedRole = typeof window !== 'undefined'
     ? sessionStorage.getItem('auth_resolved_role')
     : null;
   const userRole =
     (user as any)?.role ||
     cachedRole ||
     (user as any)?.user_metadata?.role ||
     null;
   ```
   This is the same pattern `Dashboard.tsx` already uses; the route guard must use it too or the ping-pong continues.

6. **Don't ping-pong to `/dashboard` when the cached role matches `requiredRole`.** In the role-mismatch branch (line 136), if `cachedRole === requiredRole` allow the render — the canonical fetch is in flight and will confirm in <1s.

### C. `src/pages/Login.tsx`

7. **Guard the redirect effect against the in-flight signIn race.** In the `useEffect` at lines 19–48, skip redirect when `signInRedirectRef`/`sessionStorage.getItem('auth_redirect_done') === 'true'` AND the cached role exists — let `signIn()`'s own `window.location.href` perform the navigation. Today both fire and they disagree on the role.

### D. Data hygiene for the demo accounts

8. **Backfill `users.role` to match the priority winner from `user_roles`.** Right now `f.zahra.djaanine@gmail.com` has `users.role = 'student'` but a `content_creator` entry in `user_roles`. Even after the code fixes, hydration overwrites the user object with `users.*` first and only then sets `role` from the resolver — fine — but keeping these in sync prevents any other place that reads `users.role` directly (there are several) from disagreeing. One-time UPDATE via migration:
   ```sql
   UPDATE public.users u
   SET role = sub.role
   FROM (
     SELECT user_id,
            (ARRAY_AGG(role ORDER BY
              CASE role
                WHEN 'admin' THEN 1
                WHEN 'content_creator' THEN 2
                WHEN 'teacher' THEN 3
                WHEN 'parent' THEN 4
                ELSE 5
              END))[1] AS role
     FROM public.user_roles
     GROUP BY user_id
   ) sub
   WHERE u.id = sub.user_id AND u.role IS DISTINCT FROM sub.role;
   ```

### E. Verification

After implementing, log in as each affected account and confirm in the console that:
- `[AUTH FLOW] STEP 5` shows the correct `role`,
- no `[AUTH ROUTE] Access denied` lines appear,
- the URL settles on `/content-creator` (Fatima), `/teacher` (Djaanine), and `/academy` (Lita) without bouncing through `/dashboard` or `/playground`.

## Files to change

- `src/contexts/AuthContext.tsx` — items 1, 2, 3
- `src/components/auth/ImprovedProtectedRoute.tsx` — items 5, 6
- `src/pages/Login.tsx` — item 7
- New migration to backfill `public.users.role` — item 8

No UI/UX changes; this is purely auth-flow correctness.
