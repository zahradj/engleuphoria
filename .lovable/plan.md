

# Fix: "Verifying Your Access" Infinite Loading

## Problem

After signing up and signing in for the first time, the `/dashboard` page gets stuck showing "Verifying your access... Please wait a moment" and never redirects.

## Root Causes

**1. Dashboard.tsx has no escape from its fallback state (primary issue)**
The component has a 5-second timeout (line 33-43) that sets `redirectPath = '/playground'`, but it only fires when `redirectPath` is null. If the Navigate on line 132 fires (setting `redirectExecutedRef.current = true`) but the user ends up back on `/dashboard` due to a transient routing issue, the fallback spinner on lines 136-144 renders forever with no timeout.

**2. signIn() auto-heal may silently fail**
The `signIn()` function tries to create missing `users` and `user_roles` rows (lines 444-455), but uses `.insert().single()` which can fail silently if RLS blocks the insert. If this fails, there are no database rows for the user, and subsequent data fetches return empty results.

**3. Email verification flow skips auto-heal entirely**
When a user verifies their email and arrives via `SIGNED_IN` event in the auth listener, the auto-heal logic (which only lives in `signIn()`) never runs. So the user can be authenticated but missing their `users`, `user_roles`, and `student_profiles` rows.

## Implementation Plan

### Step 1: Fix Dashboard.tsx fallback escape hatch
- Remove `redirectExecutedRef` — it's preventing re-navigation on remounts
- Change the 5-second timeout to apply unconditionally: if no redirect has happened within 5 seconds of having a user with role, force navigate to `/playground`
- Add a secondary hard timeout (10s) that forces redirect regardless of state

### Step 2: Add auto-heal to AuthContext's INITIAL_SESSION handler
- In the `INITIAL_SESSION` and `SIGNED_IN` event handlers (lines 186-226), after fetching/creating the user, check if `users` and `user_roles` rows exist
- If missing, create them using the same logic from `signIn()` (lines 432-483)
- Use `supabase.rpc('ensure_user_role', ...)` for the role insert (bypasses RLS)

### Step 3: Make signIn() auto-heal more robust
- Replace `.insert().single()` with `.upsert()` to handle race conditions
- Add error handling so failures are logged (not swallowed)

### Step 4: Ensure student_profiles fallback works
- In `useStudentLevel`, when `student_profiles` has no row, explicitly set `loading = false` and `studentLevel = null` (already works, but add a defensive timeout of 5s)

## Files Changed

| File | Change |
|------|--------|
| `src/pages/Dashboard.tsx` | Remove `redirectExecutedRef`, add hard fallback timeout, simplify redirect logic |
| `src/contexts/AuthContext.tsx` | Add auto-heal to INITIAL_SESSION handler, make signIn auto-heal use upsert |
| `src/hooks/useStudentLevel.ts` | Add 5s safety timeout |

## Technical Details

```text
Current broken flow:
  signIn() → window.location.href='/dashboard' → full reload
    → AuthContext INITIAL_SESSION fires
    → fetchUserFromDatabase() → no rows (auto-heal was in signIn, not here)
    → createFallbackUser() → role='student'
    → Dashboard: role='student', studentLevel=null → redirectPath='/playground'
    → Navigate fires, ref=true → somehow loops → fallback forever

Fixed flow:
  signIn() → window.location.href='/dashboard' → full reload
    → AuthContext INITIAL_SESSION fires
    → auto-heal creates missing users/user_roles rows
    → fetchUserFromDatabase() → returns user with role
    → Dashboard: role='student' → redirectPath='/playground'
    → Navigate fires → /playground loads
    → Hard timeout (10s) as safety net if anything fails
```

