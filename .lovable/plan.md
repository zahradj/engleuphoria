## Diagnosis

The auth service itself is working: recent Supabase auth logs show successful password logins for both reported accounts. The hang is client-side.

### Most likely root causes found

1. **`SimpleAuthForm` keeps its own button spinner alive**
   - After `signIn()` returns without an error, the form sets `verifyingRole=true` and never resets it.
   - If redirect is blocked, delayed, or the route bounces back to `/login`, the button remains stuck on “Verifying role…” / loading.

2. **Auth callbacks still contain async work that can stall auth event processing**
   - `AuthContext` has `onAuthStateChange` branches that await `autoHealUserRows()` and `fetchUserFromDatabase()` inside the auth callback path.
   - Supabase recommends not awaiting additional Supabase calls inside `onAuthStateChange`; this can produce silent hangs/deadlocks around login/session restoration.

3. **Role resolution can still use legacy fallback paths**
   - `fetchUserRoleFromDatabase()` reads `user_roles`, then falls back to `users.role`.
   - For the content creator account, `users.role = student` while `user_roles = {content_creator, student}`. If the `user_roles` read stalls/errors, the app can still resolve the wrong role and bounce away from `/content-creator`.

4. **Destination pages have extra role redirects/spinners**
   - `ImprovedProtectedRoute` already guards `/teacher` and `/content-creator`, but `TeacherDashboard` repeats role checks and shows its own “Redirecting…” loader. This can mask whether auth succeeded or the destination rejected the user.
   - `CreatorStudioShell` relies on the global app error boundary, but there is no route-local boundary to make creator/teacher crashes obvious.

5. **RLS is not obviously failing in logs, but needs explicit client handling**
   - `user_roles` policies allow users to read their own roles.
   - `users` policies allow users to read their own profile.
   - I did not find recent Postgres policy/permission/recursion errors in Supabase logs.
   - Still, the code does not explicitly log/handle the `data: null + error: null` case that can look like an RLS block.

## Implementation Plan

### 1. Add nuclear auth logging

Update `src/contexts/AuthContext.tsx` to log each auth step with a stable prefix, for example:

```text
[AUTH FLOW] STEP 1: signIn called
[AUTH FLOW] STEP 2: Supabase auth success
[AUTH FLOW] STEP 3: Fetching roles for user
[AUTH FLOW] STEP 4: Role query returned
[AUTH FLOW] STEP 5: Redirecting to /content-creator
```

Also log:
- auth event type from `onAuthStateChange`
- whether session exists
- resolved role source: `user_roles`, `users.role`, metadata, fallback
- redirect destination
- explicit errors and timeout fallbacks

### 2. Make role/profile reads RLS-aware and timeout-safe

Refactor the auth helper reads so every Supabase query is wrapped with:
- a short timeout
- `try/catch`
- explicit handling for `data === null && error === null`
- console warnings that identify suspected RLS/missing-row cases

For role resolution:
- Treat `user_roles` as authoritative.
- Do **not** let stale `users.role = student` override or accidentally replace a higher-priority `user_roles` role.
- Use priority: `admin > content_creator > teacher > parent > student`.

### 3. Remove async Supabase work from `onAuthStateChange`

Change the listener so it only:
- records the new session
- creates a synchronous metadata/sessionStorage fallback user immediately
- sets `loading=false`
- launches profile/role hydration in a fire-and-forget task outside the callback stack

This avoids auth event deadlocks and prevents `loading` from staying true forever.

### 4. Fix the login button spinner root cause

Update `src/components/auth/SimpleAuthForm.tsx`:
- remove or time-limit `verifyingRole`
- add logs around submit start, `signIn()` result, and redirect wait
- if `signIn()` returns success but navigation does not happen within a few seconds, reset the button and show a clear error instead of infinite loading

### 5. Make route guards diagnostic and non-looping

Update `src/components/auth/ImprovedProtectedRoute.tsx`:
- log required role, actual role, auth loading state, and redirect decisions
- do not mutate `(user as any).role` inside the route guard
- when access is denied, route to a safe dashboard/router with diagnostic logging rather than creating a `/login` bounce loop for authenticated users

### 6. Add destination error boundaries

Wrap `/teacher/*` and `/content-creator/*` route contents in a route-level error boundary so:
- real crashes show a visible error state
- console logs identify the destination crash
- the user does not see an unexplained infinite spinner

### 7. Verify after implementation

After the patch, verify with:
- TypeScript/build harness results
- browser console logs during a login attempt
- network request logs for `/token`, `user_roles`, and `users`
- direct route checks for `/content-creator`, `/teacher`, and student dashboard routes

No database migration is required unless the new logs reveal an actual RLS policy failure.