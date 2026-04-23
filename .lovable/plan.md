

# Plan: Fix "Database error saving new user" — Missing Type Resolution

## Root Cause

The `handle_new_user()` trigger function declares a variable of type `student_level`, but the function has **no `search_path` configuration** (confirmed: `proconfig` is NULL). When the trigger fires from the `auth.users` table insert, PostgreSQL cannot resolve the `student_level` type because it looks in the `auth` schema context, not `public`.

Error: `ERROR: type "student_level" does not exist (SQLSTATE 42704)`

## Fix (Single Migration)

Recreate the `handle_new_user()` function with two changes:

1. Add `SET search_path = public` to the function definition so all type lookups resolve correctly.
2. Fully qualify the type as `public.student_level` in the variable declaration for extra safety.

### SQL Migration

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_role TEXT;
  user_full_name TEXT;
  hub_meta TEXT;
  resolved_level public.student_level;
BEGIN
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
  
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, user_full_name, user_role)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    role = COALESCE(EXCLUDED.role, public.users.role);
  
  IF user_role IN ('student', 'teacher', 'admin', 'content_creator', 'parent') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, user_role::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'student'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  IF user_role = 'teacher' THEN
    INSERT INTO public.teacher_profiles (user_id, profile_complete, can_teach, profile_approved_by_admin)
    VALUES (NEW.id, false, false, false)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  IF user_role = 'student' THEN
    hub_meta := NEW.raw_user_meta_data->>'hub_type';
    CASE hub_meta
      WHEN 'academy' THEN resolved_level := 'academy';
      WHEN 'professional', 'success' THEN resolved_level := 'professional';
      ELSE resolved_level := 'playground';
    END CASE;
    
    INSERT INTO public.student_profiles (user_id, student_level, onboarding_completed)
    VALUES (NEW.id, resolved_level, false)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

## No Frontend Changes Required

The trigger fix is the only change needed. Once the function can resolve the `student_level` type, signups will succeed and the existing frontend routing logic will work.

## Files Affected
- One database migration only (no code file changes)

