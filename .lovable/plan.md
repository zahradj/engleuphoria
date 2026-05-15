## Plan: Fix the "Sign in button keeps loading" loop

### Root cause (diagnosis)

The Supabase `auth/token` call is succeeding in **~85 ms** (auth logs at 15:35:52 and 15:38:17 both return 200). Both affected accounts have valid rows in `public.user_roles`:

- `f.zahra.djaanine@gmail.com` → `{student, content_creator}` (priority resolves to `content_creator`)
- `ygn.livra@gmail.com` → `{student}`

So credentials, network, and RLS are all fine. The freeze is **client-side**, in three places that compound:

**1. `AuthContext.signIn()` (src/contexts/AuthContext.tsx, lines 432–544) is too heavy and runs everything sequentially before navigating:**
- `signInWithPassword` →
- `users.select` → conditional `users.upsert` + `ensure_user_role` RPC → OR `user_roles.select` + (sometimes) `users.select` + `ensure_user_role` RPC →
- `fetchUserRoleFromDatabase` AGAIN →
- (for students) `student_profiles.select` →
- finally `window.location.href = …`

That's 4–6 sequential awaited round-trips while the form button shows "Signing in…". Any one of them stalling stalls the whole submit.

**2. `createFallbackUser()` (lines 147–165) blocks `setLoading(false)` on a DB role fetch.** After `window.location.href` reloads the page, `initializeAuth` `await`s `createFallbackUser`, which itself `await`s `fetchUserRoleFromDatabase`. If that query is briefly slow or transiently errors, `createFallbackUser` falls back to `role = 'student'`. For `f.zahra` (real role `content_creator`) that means:
- `/content-creator` mounts → `ImprovedProtectedRoute` sees `userRole === 'student'`, required `'content_creator'` →
- `<Navigate to="/login?reason=access_denied" />` → user lands back on `/login` → "Access Denied" toast → user signs in again → same loop.

This explains the user reporting *"keeps loading, keeps signing in"* (the same person hitting the button twice 2 minutes apart in the auth log).

**3. `Login.tsx` (lines 56–88) renders the loader whenever `loading || user`** and waits up to **8 s** for `user.role` to populate. While AuthContext is mid-fetch, the form is replaced by the spinner. Combined with #1 and #2, the user never gets stable navigation to their dashboard.

---

### Fix

**A. Slim down `AuthContext.signIn` so it only does what's required to redirect:**
- Keep `signInWithPassword`.
- Replace the whole users/user_roles/student_profiles cascade with a SINGLE call: `fetchUserRoleFromDatabase(user.id)` (which already has its own `users.role` fallback).
- Resolve `redirectPath` from that role + `user_metadata.hub_type` (no `student_profiles` round-trip — that fetch happens later inside the dashboard).
- Move the auto-heal (`users` upsert + `ensure_user_role` RPC) into a **fire-and-forget** background call so it can't block the redirect.
- Then `window.location.href = redirectPath`.

Result: form spinner clears in ~150 ms (one auth call + one role lookup), not 1–5 s.

**B. Make `createFallbackUser` non-blocking on role:**
- Synchronously build the fallback user from `user_metadata.role` (the value that was set at signup) so `setLoading(false)` fires immediately.
- Background-fetch the canonical role from `user_roles` via `fetchUserRoleFromDatabase` and `setUser(prev => ({...prev, role: dbRole}))` when it returns.
- Remove the `await` chain inside `initializeAuth` for the fallback path.

This eliminates the "transient null → defaults to student → access_denied bounce" path.

**C. Loosen `Login.tsx` redirect gate:**
- If `user` is present, redirect immediately based on `(user as any).role || user_metadata.role || 'student'` instead of waiting for role to "verify" with an 8 s spinner.
- Keep the `loading` spinner (but only while `loading === true`, not when `user` exists with no role).

**D. (Defensive) `ImprovedProtectedRoute`:**
- Already has the metadata-fallback logic (lines 33–48, 113–124). Keep as-is — once B is in place, role will be present in time and this branch won't trigger.

### Files to edit

- `src/contexts/AuthContext.tsx` — rewrite `signIn`'s post-success block; rewrite `createFallbackUser` + the `initializeAuth` fallback path so they don't await role.
- `src/pages/Login.tsx` — redirect on `user` presence using metadata role fallback; drop the 8 s "Verifying role…" gate.

No DB migrations, no RLS changes, no edge function changes. The DB is already correct — this is purely repairing the client boot/sign-in flow.

### Verification after the fix

1. Sign in as `ygn.livra@gmail.com` (student) → expect immediate spinner clear → land on `/playground` (or appropriate hub) without bouncing back to `/login`.
2. Sign in as `f.zahra.djaanine@gmail.com` (content_creator + student) → expect to land on `/content-creator`, not `/login?reason=access_denied`.
3. Confirm the form button never sits in "Signing in…" / "Verifying role…" longer than ~1 s on a healthy connection.
