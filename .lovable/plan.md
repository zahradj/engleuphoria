

## Plan: Auto-heal missing `user_roles` for legacy content creators

### Root cause

In `signIn()` (line 440-466), the code checks if a `users` row exists. If it does (`existingUser` is truthy), it skips everything — including checking whether a `user_roles` row exists. Legacy content creators have a `users` record with `role = 'content_creator'` but no corresponding `user_roles` entry, so `fetchUserRoleFromDatabase` returns `null` and they default to `'student'`.

### Fix — single file change

**File: `src/contexts/AuthContext.tsx`**, lines 440-466

After the existing `users` table check, add a `user_roles` check when the user row already exists:

```
if (existingUser) {
  // Check if user_roles row exists
  const { data: existingRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', data.user.id)
    .maybeSingle();

  if (!existingRole) {
    // Fetch the role from users table to use as fallback
    const { data: usersRow } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle();

    const healedRole = usersRow?.role
      || data.user.user_metadata?.role
      || 'student';

    await supabase.from('user_roles').insert({
      user_id: data.user.id,
      role: healedRole
    });

    console.warn('🔧 Auto-healed missing user_roles row:', data.user.email, '→', healedRole);
  }
}
```

The existing `!existingUser` branch (create both `users` + `user_roles`) stays unchanged. The `user_roles` table has a `unique(user_id, role)` constraint, so repeated logins won't create duplicates — the insert will simply be a no-op conflict.

### Files changed: 1

| File | Change |
|------|--------|
| `src/contexts/AuthContext.tsx` | Add `user_roles` auto-heal check inside `signIn()` when `existingUser` is truthy |

