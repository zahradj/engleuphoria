

## Fix: Force single `content_creator` role for target account

### Current database state
- `users.role` = `teacher`
- `user_roles` has TWO rows: `teacher` and `content_creator`
- Frontend priority logic already picks `content_creator` — so the role resolution itself is correct

### What you need to do manually

Run this in [Supabase SQL Editor](https://supabase.com/dashboard/project/dcoxpyzoqjvmuuygvlme/sql/new):

```sql
begin;

-- 1) Update users.role to content_creator
update public.users u
set role = 'content_creator'
from auth.users au
where u.id = au.id
  and lower(au.email) = lower('f.zahra.djaanine@gmail.com');

-- 2) Remove all user_roles rows for this user
delete from public.user_roles ur
using auth.users au
where ur.user_id = au.id
  and lower(au.email) = lower('f.zahra.djaanine@gmail.com');

-- 3) Insert exactly one content_creator role
insert into public.user_roles (user_id, role)
select au.id, 'content_creator'::public.app_role
from auth.users au
where lower(au.email) = lower('f.zahra.djaanine@gmail.com');

commit;

-- 4) Verify
select au.email, u.role as users_role, ur.role as user_roles_role
from auth.users au
left join public.users u on u.id = au.id
left join public.user_roles ur on ur.user_id = au.id
where lower(au.email) = lower('f.zahra.djaanine@gmail.com');
```

### Why this should already work without the SQL fix

The frontend `fetchUserRoleFromDatabase` (lines 35-67) already handles multiple roles with priority `content_creator` > `teacher`. So even with both rows present, it should return `content_creator`. 

**If login is still failing**, the issue is likely elsewhere — possibly:
1. The `SIGNED_IN` handler's stale `auth_redirect_done` flag blocking redirect
2. An RLS policy preventing the `user_roles` SELECT from returning data

After running the SQL, test by logging in. If it still fails, I can investigate the actual auth flow by checking console logs and network requests.

### No code changes needed

The frontend already has the correct priority logic and fallback. This is a data-only fix.

