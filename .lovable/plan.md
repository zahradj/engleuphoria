
# Fix: Admin Login Redirect Not Working

## Problem Summary

When logging in as admin, the success toast shows "Welcome back! Successfully signed in" but the app stays on the login page instead of redirecting to `/super-admin`.

## Root Cause Analysis

After investigating the auth flow, I found **two critical timing issues**:

### Issue 1: Safety Timeout Conflicts with SIGNED_IN Handler

```text
TIMELINE OF EVENTS:
0ms    - signInWithPassword() called
~50ms  - Auth successful, SIGNED_IN event fires
~50ms  - setLoading(true) called in handler
~50ms  - setTimeout(..., 0) schedules async role fetch
~100ms - Toast shows "Successfully signed in"
~200ms - Role fetch starts (inside setTimeout)
~500ms - Role fetch completes
...
1500ms - SAFETY TIMEOUT FIRES → setLoading(false)  <-- PROBLEM!
         (User now sees login page, not loading spinner)
~600ms - window.location.href = '/super-admin' should fire
         (But page may have already re-rendered)
```

The 1500ms safety timeout in AuthContext (lines 252-257) sets `loading = false` while the SIGNED_IN redirect handler is still working. This causes the Login page to stop showing a loading state.

### Issue 2: Redirect Blocked by Page State

When `loading` becomes `false`:
1. The Login page renders (no longer showing spinner)
2. The user stays on the login page
3. Even when `window.location.href` fires later, React may have already unmounted components

## Solution

Implement **two key fixes**:

### Fix 1: Track SIGNED_IN redirect state separately

Add a `signInRedirectInProgress` ref that prevents the safety timeout from setting `loading = false` during a redirect.

### Fix 2: Move redirect BEFORE setting loading to false

Ensure `window.location.href` is called BEFORE any state updates that could trigger re-renders.

---

## Implementation Plan

### File 1: `src/contexts/AuthContext.tsx`

**Changes:**

1. **Add a redirect-in-progress flag** (new ref):
```typescript
const signInRedirectRef = useRef(false);
```

2. **Update SIGNED_IN handler** (lines 122-163):
   - Set `signInRedirectRef.current = true` BEFORE the setTimeout
   - This prevents the safety timeout from interfering

3. **Update safety timeout** (lines 252-257):
   - Check `signInRedirectRef.current` before setting loading to false
   - If a redirect is in progress, skip the timeout action

4. **Remove the setTimeout deferral for redirects**:
   - The current `setTimeout(..., 0)` introduces a race condition
   - Instead, use `queueMicrotask()` or handle the async operation inline with proper state management

**Specific code changes:**

```typescript
// Line ~30: Add new ref
const signInRedirectRef = useRef(false);

// Lines 122-163: Update SIGNED_IN handler
if (event === 'SIGNED_IN') {
  signInRedirectRef.current = true; // Block safety timeout
  setLoading(true);
  
  // Fetch role and redirect
  (async () => {
    try {
      const dbUser = await fetchUserFromDatabase(currentSession.user.id);
      const finalUser = dbUser || await createFallbackUser(currentSession.user);
      
      if (!mounted) return;
      setUser(finalUser);
      
      const email = currentSession.user.email ?? '';
      const role = (finalUser as any).role;
      
      console.log('🔐 SIGNED_IN redirect - email:', email, 'role:', role);
      
      // REDIRECT IMMEDIATELY - before any more state updates
      if (email === 'f.zahra.djaanine@engleuphoria.com' && role === 'admin') {
        window.location.href = '/super-admin';
        return;
      }
      if (email === 'f.zahra.djaanine@gmail.com' && role === 'teacher') {
        window.location.href = '/admin';
        return;
      }
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Error in SIGNED_IN handler:', err);
      signInRedirectRef.current = false;
      setLoading(false);
      window.location.href = '/dashboard';
    }
  })();
}

// Lines 252-257: Update safety timeout
const timeout = setTimeout(() => {
  // Don't interfere if a SIGNED_IN redirect is in progress
  if (signInRedirectRef.current) {
    console.log('⏳ Safety timeout skipped - redirect in progress');
    return;
  }
  if (mounted && loading) {
    console.warn('Auth initialization timeout - forcing loading = false');
    setLoading(false);
  }
}, 3000); // Also increase timeout to 3 seconds
```

### File 2: `src/pages/Login.tsx`

**Changes:**

Add a redirect state to show loading when user is authenticated but redirect is pending.

```typescript
const { user, loading } = useAuth();

// If user exists (login succeeded), show loading until redirect completes
if (loading || user) {
  return (
    <div className="min-h-screen flex items-center justify-center...">
      <Loader2 className="h-12 w-12 animate-spin..." />
      <p>Redirecting to your dashboard...</p>
    </div>
  );
}
```

This ensures the Login page shows a loading state even after `loading` becomes `false`, because the redirect is still in progress.

---

## Visual Flow After Fix

```text
TIMELINE AFTER FIX:
0ms    - signInWithPassword() called
~50ms  - Auth successful, SIGNED_IN event fires
~50ms  - signInRedirectRef = true (blocks timeout)
~50ms  - setLoading(true)
~100ms - Toast shows "Successfully signed in"
~200ms - Role fetch starts
~500ms - Role fetch completes
~500ms - window.location.href = '/super-admin' FIRES IMMEDIATELY
         (Page navigates to admin dashboard)
...
3000ms - Safety timeout fires but sees signInRedirectRef = true
         (Does nothing - redirect already complete)
```

---

## Testing Checklist

| Test Case | Expected Result |
|-----------|-----------------|
| Login as admin (f.zahra.djaanine@engleuphoria.com) | Redirects to /super-admin |
| Login as teacher (f.zahra.djaanine@gmail.com) | Redirects to /admin |
| Login as regular student | Redirects to /dashboard then to student area |
| Slow network (role fetch takes >1.5s) | Loading spinner stays visible, no timeout |
| Page refresh while logged in | Stays on current page |

---

## Summary of Changes

| File | Change |
|------|--------|
| `AuthContext.tsx` | Add `signInRedirectRef` to coordinate between SIGNED_IN handler and safety timeout; remove setTimeout wrapper; increase timeout to 3s |
| `Login.tsx` | Show loading state when user exists (redirect pending) |
