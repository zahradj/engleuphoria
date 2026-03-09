

# Fix Content Creator Login Redirect

## Root Cause Analysis

After tracing the full login flow, there are two likely causes:

1. **Missing `user_roles` entry**: When `fetchUserRoleFromDatabase()` finds no row in `user_roles` for the content creator user, it returns `null`. The fallback on line 64 of AuthContext defaults to `'student'`. This means Dashboard.tsx treats the user as a student and redirects to `/playground` instead of `/content-creator`.

2. **No direct redirect for content_creator**: The SIGNED_IN handler in AuthContext has hardcoded redirects for specific admin/teacher emails (lines 167-174), then falls through to `/dashboard` for everyone else. While Dashboard.tsx does handle `content_creator`, adding a direct redirect would be more reliable and skip the intermediate hop.

## Fixes

### 1. Add content_creator to SIGNED_IN redirect handler
**`src/contexts/AuthContext.tsx`** (lines ~162-175)
- Add a check: if role is `content_creator`, redirect directly to `/content-creator` instead of going through `/dashboard`
- This eliminates the intermediate Dashboard.tsx hop and potential race conditions

### 2. Verify `user_roles` table entry (manual step)
The user needs to verify in the Supabase SQL Editor that their content creator account has a `user_roles` entry with `role = 'content_creator'`:
```sql
SELECT ur.role, u.email FROM user_roles ur
JOIN auth.users u ON ur.user_id = u.id
WHERE ur.role = 'content_creator';
```
If missing, insert it:
```sql
INSERT INTO user_roles (user_id, role)
SELECT id, 'content_creator' FROM auth.users
WHERE email = 'your-content-creator@email.com';
```

### 3. Add fallback in INITIAL_SESSION handler
When the page reloads after redirect, the INITIAL_SESSION/SIGNED_IN reload branch should also route content_creator correctly. Currently it just sets user state without redirecting (which is correct -- Dashboard.tsx handles it). But if role defaults to 'student' due to missing user_roles entry, the user gets stuck.

## Summary

| File | Change |
|------|--------|
| `src/contexts/AuthContext.tsx` | Add `content_creator` direct redirect in SIGNED_IN handler |
| Supabase SQL Editor (manual) | Verify/insert `user_roles` entry for the content creator user |

