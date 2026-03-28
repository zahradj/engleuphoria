

## Fix Content Creator Dashboard Access — Auth Init Race Condition

### Root Cause

In React StrictMode (used in development), the `AuthContext` double-mounts:

1. **First mount**: `initializeAuth` runs, sets `initializedRef.current = true`, starts async DB fetches
2. **Cleanup**: `mounted = false` — the async callbacks now skip `setUser`/`setLoading` because they check `if (!mounted) return`
3. **Second mount**: `initializeAuth` returns early (guard: `if (initializedRef.current) return`) — nothing happens
4. **Result**: `loading` stays `true` until the 10s safety timeout forces it to `false`, but by then `user` is still `null` → `ImprovedProtectedRoute` redirects to `/login`

The console warning confirms this: *"Auth initialization timeout - forcing loading = false"*

### Fix

**File: `src/contexts/AuthContext.tsx`**

Reset `initializedRef.current = false` in the cleanup function so the second StrictMode mount can properly re-initialize:

```typescript
return () => {
  mounted = false;
  initializedRef.current = false; // Allow re-init on StrictMode remount
  clearTimeout(timeout);
  if (cleanup instanceof Promise) {
    cleanup.then(cleanupFn => cleanupFn?.());
  }
};
```

Also add a safety measure: when the timeout fires and there IS a valid session but no user yet, create a fallback user from the session instead of leaving `user` as `null`:

```typescript
const timeout = setTimeout(async () => {
  if (signInRedirectRef.current) return;
  if (initialFetchDoneRef.current) return;
  if (mounted && loading) {
    console.warn('Auth initialization timeout - forcing loading = false');
    // Try to recover user from existing session
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (currentSession?.user) {
      const fallback = await createFallbackUser(currentSession.user);
      setUser(fallback);
    }
    setLoading(false);
  }
}, 10000);
```

### Files Changed

| File | Action |
|---|---|
| `src/contexts/AuthContext.tsx` | Reset `initializedRef` on cleanup; recover user in timeout handler |

