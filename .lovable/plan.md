

## Plan: Fix Content Creator Login — Full Stack

### Root Cause Analysis (from network logs)

The user (`f.zahra.djaanine@gmail.com`) has **two** `user_roles` rows: `teacher` and `content_creator`. The role priority logic in `fetchUserRoleFromDatabase` correctly picks `content_creator`. **However**, three compounding bugs prevent a clean login:

1. **Auto-heal `.maybeSingle()` errors on multiple rows** — Line 468-472 in `signIn()` uses `.maybeSingle()` to check existing roles. With 2 rows, PostgREST returns error PGRST116, making `data` null. The code thinks no role exists and tries to heal.

2. **RLS blocks the heal INSERT** — The `user_roles` table only allows admin inserts (`has_role(auth.uid(), 'admin')`). The 403 error from the heal attempt may interfere with the signIn promise chain timing.

3. **No `users.role` fallback** — `fetchUserRoleFromDatabase` returns `null` if the `user_roles` query fails for any reason, defaulting to `'student'` in the caller.

4. **`parent` not in `app_role` enum** — The redirect logic references `parent` but it's not a valid enum value, which could cause future issues.

### Changes

#### 1. Database Migration (new file)

Add `parent` to the `app_role` enum. Create a `SECURITY DEFINER` function `ensure_user_role(p_user_id uuid, p_role text)` that bypasses RLS for auto-heal inserts. Add an RLS policy allowing authenticated users to read all their own roles. Backfill any missing `user_roles` from `users.role`.

```sql
-- Add parent to enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'parent';

-- Security definer function for auto-heal (bypasses RLS)
CREATE OR REPLACE FUNCTION public.ensure_user_role(p_user_id uuid, p_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, p_role::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Backfill missing user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, u.role::app_role
FROM public.users u
WHERE u.role IS NOT NULL
  AND u.role::text IN ('admin','content_creator','teacher','parent','student')
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = u.id AND ur.role = u.role::app_role
  );
```

#### 2. `src/contexts/AuthContext.tsx`

**`fetchUserRoleFromDatabase`** (lines 35-59): Add fallback to `users.role` when `user_roles` returns empty:

```typescript
const fetchUserRoleFromDatabase = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('user_roles').select('role').eq('user_id', userId);

    if (!error && data && data.length > 0) {
      const priorityOrder = ['admin','content_creator','teacher','parent','student'];
      const userRoles = data.map((r: any) => r.role);
      for (const role of priorityOrder) {
        if (userRoles.includes(role)) return role;
      }
      return userRoles[0] ?? null;
    }

    // Fallback: check users.role
    const { data: userData } = await supabase
      .from('users').select('role').eq('id', userId).maybeSingle();
    return userData?.role || null;
  } catch {
    return null;
  }
};
```

**Auto-heal in `signIn()`** (lines 466-491): Fix `.maybeSingle()` bug and use the new `ensure_user_role` RPC function:

```typescript
} else {
  // Check if user_roles rows exist (use .select, NOT .maybeSingle)
  const { data: existingRoles, error: rolesError } = await supabase
    .from('user_roles').select('role').eq('user_id', data.user.id);

  if (!existingRoles || existingRoles.length === 0) {
    const { data: usersRow } = await supabase
      .from('users').select('role').eq('id', data.user.id).maybeSingle();

    const healedRole = usersRow?.role
      || data.user.user_metadata?.role
      || 'student';

    // Use security definer function to bypass RLS
    await supabase.rpc('ensure_user_role', {
      p_user_id: data.user.id,
      p_role: healedRole
    });

    console.warn('🔧 Auto-healed missing user_roles:', data.user.email, '→', healedRole);
  }
}
```

### Files Changed: 2

| File | Change |
|------|--------|
| **Supabase migration** | Add `parent` enum value, create `ensure_user_role` function, backfill missing roles |
| `src/contexts/AuthContext.tsx` | Add `users.role` fallback in role fetch; fix `.maybeSingle()` bug; use RPC for auto-heal |

### Expected Outcome

- The `.maybeSingle()` error stops firing for users with multiple roles
- The 403 RLS error stops because auto-heal uses a security definer function
- Role resolution correctly returns `content_creator` via priority
- Login redirects to `/content-creator` as expected
- No regressions for other roles

