

## Plan: Assign content_creator Role to Gmail Account

### What This Does
Creates a database migration that assigns the `content_creator` role to `f.zahra.djaanine@gmail.com` in the `user_roles` table, ensuring the account can sign in and access the content creator dashboard.

### Prerequisites
The account must already exist in Supabase Auth. If it doesn't, you need to either:
- Sign up via the app first, OR
- I create the account via an edge function (like the existing `admin-create` pattern)

### Migration (single SQL file)

```sql
-- Assign content_creator role to f.zahra.djaanine@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'content_creator'::app_role
FROM auth.users
WHERE email = 'f.zahra.djaanine@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

This is safe — it only acts if the account exists and doesn't duplicate the role if already assigned.

### Important Security Note
Passwords should never be stored in code or migrations. The password `Timosha1994@` should only be entered through the Supabase Auth signup flow (app UI or Supabase dashboard). I strongly recommend changing it after setup since it's now been shared in chat.

### Files Changed
| File | Action |
|---|---|
| New migration SQL | Create — assigns `content_creator` role |

