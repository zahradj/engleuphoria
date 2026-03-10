

## Fix: Login Page Flickering and Reload Loop

### Root Causes

1. **Triple redirect race**: When a user is authenticated and lands on `/login`, three separate mechanisms all try to redirect simultaneously:
   - `Login.tsx` useEffect (line 24-33) does `window.location.href`
   - `AuthContext` `onAuthStateChange` SIGNED_IN handler (line 157-163) also does `window.location.href` when on `/login`
   - `signIn()` function itself (line 536) does `window.location.href`
   
   Multiple `window.location.href` calls in the same tick cause the browser to start a navigation, get interrupted, and restart — producing visible flickering.

2. **StrictMode double-initialization**: The `initializedRef.current = false` cleanup (line 335) causes both React mounts to run full auth initialization — creating two `onAuthStateChange` subscriptions that both fire events and update state, doubling all side effects.

3. **Interim user without role**: `getSession()` at line 282 sets `setUser(initialSession.user as any)` — this user has no `.role`. Login.tsx sees a truthy `user`, shows the "Redirecting..." spinner, but `(user as any).role` is `undefined`, so the redirect target becomes `/dashboard` instead of the role-specific route. Then the role-enriched user arrives milliseconds later and triggers another redirect.

### Fix Plan

**File: `src/contexts/AuthContext.tsx`**
- Remove the `initializedRef.current = false` from cleanup (line 335). Instead, use a subscription ref that persists across StrictMode remounts — unsubscribe the old subscription before creating a new one.
- In the `SIGNED_IN` handler (lines 147-173): Remove the "if on /login, redirect" logic. Login.tsx already handles that. Having it in both places causes double redirects.
- In `getSession()` initial session handling (line 282): Do NOT set the interim user without a role. Wait for the DB fetch to complete before calling `setUser`. This prevents Login.tsx from seeing a half-baked user object and triggering a premature redirect.

**File: `src/pages/Login.tsx`**
- Change the redirect useEffect to use `navigate()` (React Router) instead of `window.location.href`. This avoids a full page reload which re-triggers the entire auth initialization cycle.
- Add a guard: only redirect if the user object has a `.role` property. This prevents redirecting before the role is resolved.

### Files Changed

| File | Change |
|---|---|
| `src/contexts/AuthContext.tsx` | Fix StrictMode double-init, remove duplicate /login redirect from SIGNED_IN handler, don't set interim role-less user |
| `src/pages/Login.tsx` | Use `navigate()` instead of `window.location.href`, guard on role existence |

