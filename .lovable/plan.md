

## Plan: Fix Content Creator Dashboard Redirect

### Root Cause

After thorough investigation, the issue is a **stale redirect guard** combined with a **missing fallback redirect in Login.tsx**.

Here's what happens:

1. User logs in → `SIGNED_IN` event fires in AuthContext
2. AuthContext checks `sessionStorage.getItem('auth_redirect_done')`
3. If this flag is already set (from a previous login in the same tab/session), AuthContext **skips the redirect entirely** and just updates user state
4. Login.tsx sees `user` is set → shows spinner saying "Redirecting to your dashboard..."
5. But **Login.tsx never actually navigates anywhere** — it relies entirely on AuthContext's hard redirect, which was skipped
6. User is stuck on `/login` with a spinner, or the spinner clears and shows the login form again

The `auth_redirect_done` flag persists in `sessionStorage` across page reloads within the same tab. If the user logs out and logs back in quickly, or if the flag isn't properly cleared, the redirect is silently skipped.

### Database confirmation

The user (`f.zahra.djaanine@gmail.com`) has both `teacher` and `content_creator` roles in `user_roles`. The priority logic correctly picks `content_creator`. The role resolution code is fine — the problem is purely in the redirect mechanism.

### Fix

**File: `src/pages/Login.tsx`** — Add a `useEffect` that redirects authenticated users to `/dashboard` (the smart router), which then routes to `/content-creator` based on role. This acts as a safety net when AuthContext's hard redirect doesn't fire.

```tsx
useEffect(() => {
  if (!loading && user) {
    const role = (user as any).role;
    if (role === 'admin') window.location.href = '/super-admin';
    else if (role === 'content_creator') window.location.href = '/content-creator';
    else if (role === 'teacher') window.location.href = '/admin';
    else if (role === 'parent') window.location.href = '/parent';
    else window.location.href = '/dashboard';
  }
}, [loading, user]);
```

**File: `src/contexts/AuthContext.tsx`** — In the `SIGNED_IN` handler, when `auth_redirect_done` is already set, still perform the role-based redirect if the current path is `/login`. This ensures fresh logins always redirect even if the flag is stale.

Change the block at lines 137-154 from "just update user state" to "update user state AND redirect if on /login":

```tsx
if (sessionStorage.getItem('auth_redirect_done')) {
  // Update user state
  (async () => {
    if (!mounted) return;
    try {
      const dbUser = await fetchUserFromDatabase(currentSession.user.id);
      const finalUser = dbUser || await createFallbackUser(currentSession.user);
      if (mounted) setUser(finalUser);
      
      // Safety: if still on /login, redirect based on role
      if (window.location.pathname === '/login') {
        const role = (finalUser as any).role;
        if (role === 'admin') window.location.href = '/super-admin';
        else if (role === 'content_creator') window.location.href = '/content-creator';
        else if (role === 'teacher') window.location.href = '/admin';
        else if (role === 'parent') window.location.href = '/parent';
        else window.location.href = '/dashboard';
      }
    } catch (err) {
      // existing error handling
    }
  })();
  return;
}
```

### Files changed: 2

| File | Change |
|------|--------|
| `src/pages/Login.tsx` | Add useEffect to redirect authenticated users based on role |
| `src/contexts/AuthContext.tsx` | Add safety redirect when `auth_redirect_done` flag is stale and user is on `/login` |

