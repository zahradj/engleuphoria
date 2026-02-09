

# Fix: Infinite Page Reload Loop

## Root Cause

The `SIGNED_IN` event in Supabase's `onAuthStateChange` fires **not only on fresh login** but also **on every page load when a valid session exists**. The current code performs `window.location.href` on every `SIGNED_IN` event, which causes a full page reload, which triggers another `SIGNED_IN`, creating an infinite loop:

```text
Login -> SIGNED_IN -> window.location.href = '/super-admin'
  -> Page reload -> SIGNED_IN -> window.location.href = '/super-admin'
  -> Page reload -> SIGNED_IN -> ... (infinite)
```

## Solution

Use a `sessionStorage` flag to track whether the redirect has already been performed for this login session. This ensures `window.location.href` only fires **once** per login.

## Changes

### File: `src/contexts/AuthContext.tsx`

1. Inside the `SIGNED_IN` handler (around line 123), **before** performing the redirect, check if a flag `auth_redirect_done` exists in `sessionStorage`. If it does, treat this as an `INITIAL_SESSION` instead (just update state, no redirect).

2. **Before** calling `window.location.href`, set `sessionStorage.setItem('auth_redirect_done', 'true')`.

3. In the `signOut` function, clear the flag: `sessionStorage.removeItem('auth_redirect_done')`.

4. In the `INITIAL_SESSION` branch, also remove the `setTimeout` wrapper and handle the user fetch inline (same pattern as `getSession` below it) to avoid race conditions with double-fetching.

### Technical Detail

```typescript
// In SIGNED_IN handler:
if (event === 'SIGNED_IN') {
  // Check if we already redirected for this session
  if (sessionStorage.getItem('auth_redirect_done')) {
    // This is a page reload, not a fresh login - treat like INITIAL_SESSION
    // Just update user state, no redirect
    const dbUser = await fetchUserFromDatabase(currentSession.user.id);
    const finalUser = dbUser || await createFallbackUser(currentSession.user);
    setUser(finalUser);
    return;
  }

  // Fresh login - proceed with redirect
  signInRedirectRef.current = true;
  setLoading(true);
  // ... fetch role, then:
  sessionStorage.setItem('auth_redirect_done', 'true');
  window.location.href = '/super-admin'; // Only fires ONCE
}
```

```typescript
// In signOut:
sessionStorage.removeItem('auth_redirect_done');
window.location.replace('/');
```

### Why sessionStorage?

- Persists across page reloads within the same browser tab (needed since `window.location.href` causes a reload)
- Automatically cleared when the tab is closed
- Does not persist across different tabs (each tab gets its own login flow)

## Files Changed

| File | Change |
|------|--------|
| `AuthContext.tsx` | Add `sessionStorage` guard to prevent repeated SIGNED_IN redirects; clear flag on sign out |

No other files need changes.

