

# Fix Authentication Email Service & Admin Notification System

## Problem Analysis

After thorough investigation, I've identified several issues preventing proper email delivery and admin notifications:

### Issue 1: Email Sending Using Resend Test Domain
All edge functions are currently using `resend.dev` domain (test emails):
- `notify-admin-new-registration` uses `notifications@engleuphoria.com` (correct but needs domain verification)
- `send-user-emails` uses `noreply@resend.dev` (test only)
- `send-teacher-emails` uses `onboarding@resend.dev` (test only)
- Other functions use `@resend.dev` domains

Resend's test domain (`@resend.dev`) only sends emails to the account owner's email - not to actual users.

### Issue 2: Missing Supabase Auth Email Hook
Supabase's built-in authentication emails (signup confirmation, password reset) are not connected to your custom edge functions. By default, Supabase uses its own email templates, which may be disabled or misconfigured.

### Issue 3: Admin Notifications Not Being Created
The `notify-admin-new-registration` function sends emails but doesn't insert records into the `admin_notifications` table - so admins won't see in-app notifications.

### Issue 4: Incomplete Teacher Onboarding Flow
The teacher flow (Sign up -> Profile -> Equipment Test -> Interview -> Approval) needs proper stage tracking and admin visibility.

---

## Solution Architecture

```text
┌──────────────────────────────────────────────────────────────────────┐
│                         USER SIGNS UP                                 │
└─────────────────────────────┬────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    auth.users INSERT TRIGGER                         │
│                         handle_new_user()                            │
└─────────────────────────────┬────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│  INSERT INTO users      │     │  INSERT INTO user_roles │
│  (profile data)         │     │  (role assignment)      │
└─────────────────────────┘     └─────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────────────────────────┐
│              AFTER INSERT TRIGGER (new function)                     │
│              notify_admin_new_user()                                 │
└─────────────────────────────┬────────────────────────────────────────┘
              │
              ├──────────────────────────────────┐
              ▼                                  ▼
┌─────────────────────────┐     ┌─────────────────────────────────────┐
│ INSERT admin_notifications│   │ Call edge function (optional email) │
│ (in-app notification)    │   │                                      │
└─────────────────────────┘     └─────────────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: Fix Resend Email Domain Configuration

**What needs to happen:**
1. You need to verify your domain `engleuphoria.com` in Resend Dashboard
2. Update all edge functions to use verified domain instead of `resend.dev`

**Update the following edge functions:**

| Function | Current "from" | Updated "from" |
|----------|---------------|----------------|
| `send-user-emails` | `noreply@resend.dev` | `noreply@engleuphoria.com` |
| `send-teacher-emails` | `onboarding@resend.dev` | `noreply@engleuphoria.com` |
| `notify-admin-new-student` | `notifications@resend.dev` | `notifications@engleuphoria.com` |
| `notify-teacher-booking` | `notifications@resend.dev` | `notifications@engleuphoria.com` |
| `send-lesson-reminders` | `lessons@resend.dev` | `noreply@engleuphoria.com` |

---

### Phase 2: Create Database Trigger for Admin Notifications

**New SQL Migration:**

```sql
-- Function to create admin notifications on new user registration
CREATE OR REPLACE FUNCTION public.notify_admin_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_user RECORD;
  user_role TEXT;
  notification_title TEXT;
  notification_message TEXT;
BEGIN
  -- Get the user's role
  user_role := COALESCE(NEW.role, 'student');
  
  -- Set notification content based on role
  IF user_role = 'teacher' THEN
    notification_title := 'New Teacher Registration';
    notification_message := format('Teacher %s (%s) has registered and is awaiting profile completion.', 
                                   NEW.full_name, NEW.email);
  ELSE
    notification_title := 'New Student Registration';
    notification_message := format('Student %s (%s) has joined the platform.', 
                                   NEW.full_name, NEW.email);
  END IF;
  
  -- Create notification for all admins
  FOR admin_user IN 
    SELECT ur.user_id 
    FROM user_roles ur 
    WHERE ur.role = 'admin'
  LOOP
    INSERT INTO admin_notifications (
      admin_id,
      notification_type,
      title,
      message,
      metadata,
      is_read
    ) VALUES (
      admin_user.user_id,
      CASE WHEN user_role = 'teacher' THEN 'new_teacher' ELSE 'new_student' END,
      notification_title,
      notification_message,
      jsonb_build_object(
        'user_id', NEW.id,
        'email', NEW.email,
        'full_name', NEW.full_name,
        'role', user_role,
        'registered_at', NEW.created_at
      ),
      false
    );
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- Create trigger on users table
DROP TRIGGER IF EXISTS on_new_user_notify_admin ON users;
CREATE TRIGGER on_new_user_notify_admin
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_new_user();
```

---

### Phase 3: Update `handle_new_user()` to Also Insert Role

**Updated SQL:**

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Extract role from metadata, default to 'student'
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
  
  -- Insert into users table
  INSERT INTO users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    user_role
  );
  
  -- Also insert into user_roles table (secure role storage)
  INSERT INTO user_roles (user_id, role)
  VALUES (NEW.id, user_role::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- If teacher, create empty teacher_profiles record
  IF user_role = 'teacher' THEN
    INSERT INTO teacher_profiles (user_id, profile_complete, can_teach, profile_approved_by_admin)
    VALUES (NEW.id, false, false, false)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;
```

---

### Phase 4: Create Welcome Email Edge Function

**New edge function: `send-welcome-email`**

This function will be called after user signup to send a proper welcome email:

```typescript
// Handles: student-welcome, teacher-welcome emails
// Triggered from frontend after successful signup

Deno.serve(async (req) => {
  // Send welcome email based on role
  // For students: Welcome + how to get started
  // For teachers: Welcome + complete your profile instructions
});
```

---

### Phase 5: Update Admin Notification Center

**Add new notification types:**

```typescript
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'new_student':
      return <UserPlus className="w-4 h-4 text-green-500" />;
    case 'new_teacher':
      return <GraduationCap className="w-4 h-4 text-blue-500" />;
    case 'teacher_pending_approval':
      return <Clock className="w-4 h-4 text-orange-500" />;
    // ... existing types
  }
};
```

---

### Phase 6: Teacher Onboarding Flow Notifications

**Additional trigger for teacher profile updates:**

```sql
CREATE OR REPLACE FUNCTION public.notify_admin_teacher_ready_for_review()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- When teacher completes their profile, notify admins
  IF NEW.profile_complete = true AND OLD.profile_complete = false THEN
    INSERT INTO admin_notifications (...)
    VALUES (..., 'teacher_pending_approval', 
            'Teacher Ready for Review',
            format('%s has completed their profile and is awaiting approval.', ...));
  END IF;
  
  RETURN NEW;
END;
$$;
```

---

## Summary of Changes

| Component | Change |
|-----------|--------|
| **Resend Domain** | Verify `engleuphoria.com` and update all edge functions |
| **Database Trigger** | New `notify_admin_new_user()` function creates admin_notifications |
| **handle_new_user()** | Updated to insert into `user_roles` and create `teacher_profiles` |
| **Admin Dashboard** | Update notification types for new_student/new_teacher |
| **Welcome Emails** | New edge function for role-based welcome emails |
| **Teacher Flow** | Trigger to notify admin when teacher is ready for review |

---

## Prerequisites (Action Required from You)

Before I implement this, please confirm:

1. **Have you verified your domain `engleuphoria.com` in Resend?**
   - Go to: https://resend.com/domains
   - Add your domain and complete DNS verification
   
2. **Is your Resend API key scoped to your domain?**
   - Check: https://resend.com/api-keys
   - Ensure the key is associated with `engleuphoria.com`

If not yet done, I can proceed with the code changes and you can update the domain later. The emails will only work after domain verification.

