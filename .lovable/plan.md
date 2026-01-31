
# Fix: Invalid Login Credentials After Student Signup

## Problem Summary

When you signed up as a student and completed the learning path, the login fails with "Invalid login credentials". This happens because:

1. **User exists in Supabase Auth** (`auth.users` table) - the signup was successful
2. **User record is missing from the `users` table** - the profile wasn't created
3. **Role is missing from `user_roles` table** - no role was assigned

When you try to login, the app tries to fetch your profile from the `users` table, and since there's no record, the authentication appears to fail.

## Why This Happened

The `handle_new_user` database trigger should automatically create records in `users` and `user_roles` tables when a new user signs up. However, for the affected user account, this trigger either:
- Failed silently (database error)
- Ran but the user wasn't properly passed role/name metadata

## Solution

### Part 1: Fix the Existing User (Immediate)
Create the missing records for the affected user so they can login.

### Part 2: Make the Signup Flow More Robust (Prevent Future Issues)
1. Add a check in `AuthContext` to handle missing user profiles gracefully
2. Update the login flow to create missing profile records if they don't exist
3. Add better error handling in the signup process to verify profile creation

---

## Technical Changes

### 1. Database Migration - Create Missing User Records
Run a SQL migration to create the missing profile for `zahra.djaanine@gmail.com`:

```sql
-- Insert missing user record
INSERT INTO users (id, email, full_name, role)
SELECT 
  id,
  email,
  split_part(email, '@', 1) as full_name,
  'student' as role
FROM auth.users
WHERE id = '1567ea83-dd18-4e37-881b-280e7c8b21b8'
ON CONFLICT (id) DO NOTHING;

-- Insert missing user_role record
INSERT INTO user_roles (user_id, role)
VALUES ('1567ea83-dd18-4e37-881b-280e7c8b21b8', 'student')
ON CONFLICT (user_id, role) DO NOTHING;
```

### 2. Update AuthContext.tsx - Handle Missing Profiles
Modify the `signIn` function to auto-create missing user profiles:

```typescript
// In signIn function, after successful auth:
if (data.user) {
  // Check if user profile exists, if not create it
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('id', data.user.id)
    .maybeSingle();
    
  if (!existingUser) {
    // Auto-create missing profile
    await supabase.from('users').insert({
      id: data.user.id,
      email: data.user.email,
      full_name: data.user.email?.split('@')[0] || 'User',
      role: 'student'
    });
    
    await supabase.from('user_roles').insert({
      user_id: data.user.id,
      role: 'student'
    }).onConflict('user_id, role').ignore();
  }
}
```

### 3. Update SimpleAuthForm.tsx - Verify Profile After Signup
Add a verification step after signup to ensure the profile was created:

```typescript
// After successful signup, verify profile exists
if (data?.user) {
  const { data: profile } = await supabase
    .from('users')
    .select('id')
    .eq('id', data.user.id)
    .maybeSingle();
    
  if (!profile) {
    // Manually create profile if trigger failed
    await supabase.from('users').insert({
      id: data.user.id,
      email: formData.email,
      full_name: formData.fullName,
      role: formData.role
    });
  }
}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| **New Migration** | SQL to create missing user records |
| `src/contexts/AuthContext.tsx` | Add missing profile auto-creation in `signIn` |
| `src/components/auth/SimpleAuthForm.tsx` | Verify profile creation after signup |
| `src/pages/StudentSignUp.tsx` | Add profile verification step |

---

## Summary

After these changes:
- The affected user will be able to login immediately (after migration)
- Future signups will have a fallback mechanism to create profiles even if the trigger fails
- The login process will auto-repair missing profiles for any users affected by this issue
