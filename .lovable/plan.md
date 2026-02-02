
# Fix: Dashboard Flickering - Complete Solution

## Problem Analysis

The flickering occurs because of a **race condition between multiple redirect mechanisms** when navigating to or loading the dashboard:

1. **Event Confusion**: When the app loads with an existing session, Supabase fires `INITIAL_SESSION`, not `SIGNED_IN`. The current AuthContext only redirects on `SIGNED_IN` events, so returning users don't get the forced redirect.

2. **Triple Redirect Competition**: Three systems are trying to redirect simultaneously:
   - `AuthContext.tsx` uses `window.location.href` (hard page reload)
   - `Dashboard.tsx` uses `<Navigate>` (React Router)
   - `ImprovedProtectedRoute.tsx` shows loading states and may also redirect

3. **Loading State Flicker**: The `loading` state in AuthContext is set to `true` during `SIGNED_IN`, then `false`, causing child components to re-render multiple times.

---

## Solution: Unified Redirect Strategy

The fix consolidates all post-login navigation into a single source of truth:

```text
Page Load / Login
       |
       v
AuthContext.onAuthStateChange
       |
       +-- SIGNED_IN ---------> Redirect based on role (window.location.href)
       |
       +-- INITIAL_SESSION ---> DO NOT redirect here (let components handle)
       |
       v
Dashboard.tsx (smart router)
       |
       +-- Waits for role to be populated
       |
       v
Redirect based on role using <Navigate>
```

---

## Implementation Plan

### 1. Fix AuthContext.tsx - Remove redirect for non-login events

The key issue is that `window.location.href` causes a full page reload, which conflicts with React's client-side navigation. The redirect should ONLY happen on fresh login (`SIGNED_IN`), not on page refresh (`INITIAL_SESSION`).

**Changes:**
- Keep the `SIGNED_IN` redirect logic (for fresh logins)
- Remove any redirect behavior for `INITIAL_SESSION` and `TOKEN_REFRESHED` events
- Just update the user/session state for non-login events

### 2. Fix Dashboard.tsx - Prevent double redirects

The Dashboard component should wait for the role to be fully populated before redirecting. It should NOT redirect if the AuthContext already performed a `window.location.href` redirect.

**Changes:**
- Add a flag to detect if a redirect is already in progress
- Use `useLocation` to check if we came from a fresh login
- Add debounce to prevent rapid re-renders

### 3. Fix ImprovedProtectedRoute.tsx - Clean role checking

The protected route should only show loading states, not perform complex redirect logic that competes with other components.

**Changes:**
- Simplify role checking logic
- Extend timeout slightly to allow AuthContext to complete
- Only redirect to login if role is definitively missing

### 4. Add Landing Page redirect for logged-in users

If a logged-in user lands on `/`, they should be redirected to their dashboard.

**Changes:**
- Add a check in `LandingPage.tsx` or create a wrapper component
- Redirect authenticated users to `/dashboard`

---

## Detailed File Changes

### File 1: `src/contexts/AuthContext.tsx`

**Problem:** Uses `window.location.href` for redirects which causes full page reloads and conflicts with React Router.

**Solution:** Only use `window.location.href` on `SIGNED_IN` events (fresh logins). For `INITIAL_SESSION` (page refresh with existing session), just update state and let components handle routing.

**Key Changes:**
- Lines 123-165: Keep `SIGNED_IN` redirect logic
- Lines 166-184: For other events, ONLY update state, no redirects
- Lines 196-217: For initial session load, ONLY update state, no redirects

### File 2: `src/pages/Dashboard.tsx`

**Problem:** Competes with AuthContext for redirects, causing flickering.

**Solution:** Add a small delay before redirecting to ensure AuthContext has finished its work.

**Key Changes:**
- Add a `redirecting` state to track if redirect is in progress
- Use `requestAnimationFrame` or a small delay before executing redirect
- Only redirect once per mount

### File 3: `src/components/auth/ImprovedProtectedRoute.tsx`

**Problem:** Shows loading states that flicker as state updates.

**Solution:** Simplify and reduce the number of loading state conditions.

**Key Changes:**
- Combine loading conditions into a single check
- Extend role timeout to 8 seconds (matching AuthContext)
- Add `key` prop stability for loading components

### File 4: `src/pages/LandingPage.tsx` (New redirect wrapper)

**Problem:** Logged-in users can access the landing page.

**Solution:** Redirect authenticated users to `/dashboard`.

**Key Changes:**
- Add `useAuth` hook
- If user is logged in and role is loaded, redirect to `/dashboard`
- Show landing page only for guests

---

## Technical Details

### Why window.location.href Causes Flickering

When you use `window.location.href = '/dashboard'`, it triggers a **full page reload**:
1. Browser starts loading the new URL
2. React app unmounts
3. React app mounts again from scratch
4. AuthContext initializes again
5. Supabase detects existing session (`INITIAL_SESSION`)
6. Components render while loading state is true
7. User/role data populates
8. Components re-render

This cycle causes the flickering because each step involves a re-render.

### The Fix: Hybrid Approach

Use `window.location.href` ONLY for fresh logins (guaranteed single redirect), and let React Router handle all other navigation.

```typescript
// In onAuthStateChange:
if (event === 'SIGNED_IN') {
  // Fresh login - do hard redirect to prevent race conditions
  window.location.href = getRedirectPath(user);
} else if (event === 'INITIAL_SESSION') {
  // Page refresh - just update state, let components handle routing
  setUser(user);
  setSession(session);
  setLoading(false);
}
```

---

## Testing Checklist

| Scenario | Expected Behavior |
|----------|-------------------|
| Fresh login as admin | Redirects to `/super-admin` (no flicker) |
| Fresh login as teacher | Redirects to `/admin` (no flicker) |
| Fresh login as student | Redirects to `/dashboard` then to student area |
| Page refresh while logged in | Stays on current page (no flicker) |
| Navigate to `/dashboard` while logged in | Smooth redirect based on role |
| Access `/super-admin` as student | Redirect to `/login` |
| Access landing page while logged in | Redirect to `/dashboard` |

---

## Summary of Changes

| File | Change |
|------|--------|
| `AuthContext.tsx` | Only redirect on `SIGNED_IN`; just update state for other events |
| `Dashboard.tsx` | Add redirect debounce; prevent double redirects |
| `ImprovedProtectedRoute.tsx` | Simplify loading state logic |
| `LandingPage.tsx` | Add redirect for logged-in users |
