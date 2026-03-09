

## Fix: Auth initialization timeout too aggressive

### Root Cause

Console log confirms: `Auth initialization timeout - forcing loading = false`

The 3-second safety timeout (line 312) fires before the auth initialization completes (`getSession()` → `fetchUserFromDatabase()` → two sequential Supabase queries). This sets `loading = false` while `user` is still `null`, causing `ImprovedProtectedRoute` to redirect to `/login`.

### Changes

#### `src/contexts/AuthContext.tsx`

1. **Increase safety timeout from 3000ms to 10000ms** — The init chain makes 3+ sequential network calls (getSession, users table, user_roles table). 3 seconds is not enough on slower connections.

2. **Track when initial fetch completes to skip timeout** — Add an `initialFetchDoneRef` that gets set to `true` once the initial session fetch succeeds. The timeout checks this ref and only forces loading=false if the fetch truly hasn't completed.

3. **Set user from `getSession` immediately before fetching DB data** — Set a minimal user object right after `getSession()` returns (before the slower `fetchUserFromDatabase` call). This way even if the DB fetch is slow, `ImprovedProtectedRoute` sees a user and doesn't redirect to login. The role gets patched in once the DB fetch completes.

```text
Timeline (current - broken):
  0ms: getSession() starts
  ~500ms: getSession() returns session
  ~500ms: fetchUserFromDatabase() starts (2 queries)
  ~3000ms: TIMEOUT fires → loading=false, user=null → redirect to /login
  ~3500ms: fetchUserFromDatabase() returns (too late)

Timeline (fixed):
  0ms: getSession() starts  
  ~500ms: getSession() returns → set interim user (no role yet)
  ~500ms: fetchUserFromDatabase() starts
  ~3500ms: fetchUserFromDatabase() returns → set full user with role
  ~10000ms: TIMEOUT fires (but initialFetchDoneRef=true, so no-op)
```

### Files Changed: 1

| File | Change |
|------|--------|
| `src/contexts/AuthContext.tsx` | Increase timeout to 10s, add initialFetchDoneRef guard, set interim user from session immediately |

