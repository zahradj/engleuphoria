

# Fix Interview Scheduling, Email Sending, and Admin Access

## Current State Summary

After thorough investigation, here is what exists and what needs fixing:

### What Already Works
- **Interview Room page** (`/interview/:token`) already exists with a full evaluation sidebar (7-point vetting checklist, hub assignment, notes, Approve & Reject buttons)
- **Admin role check** in the interview room already works (queries `user_roles` table)
- **Transactional email templates** exist for `final-welcome` and `interview-invitation`
- **Lovable Email domain** (`notify.engleuphoria.com`) is configured but DNS is still pending

### Problems to Fix

**1. `send-teacher-emails` edge function uses Resend directly (no Resend connection)**
The `send-teacher-emails` function imports `Resend` and uses `RESEND_API_KEY`, but there is no Resend connector linked to this project. This means all emails sent through `TeacherApplicationsManagement.tsx` (approval, rejection, interview invite) fail silently. The function also sends from `noreply@engleuphoria.com` via Resend, but the domain is not verified there.

**2. `teacher_interviews` RLS policy references `users` table directly**
The admin policy on `teacher_interviews` does `SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'`. This should use the `has_role()` function instead, matching the pattern used on `interviews`.

**3. `from` address inconsistency**
- `send-teacher-emails` uses `noreply@engleuphoria.com` via Resend (broken)
- `send-transactional-email` uses `noreply@notify.engleuphoria.com` via Lovable Emails
- User wants `support@engleuphoria.com`

**4. Approve flow uses wrong `user_id` for teacher profile update**
In `InterviewRoom.tsx` line 157, the code updates `teacher_profiles` where `user_id = interview.admin_id` (the admin's ID, not the teacher's). There is a fallback that tries to get the teacher's `user_id` from the application, but the first update is wrong.

---

## Plan

### Step 1: Fix `teacher_interviews` RLS policy (migration)
- Drop the admin policy that queries `users` table directly
- Recreate it using `has_role(auth.uid(), 'admin')` to match the standard pattern

### Step 2: Migrate `send-teacher-emails` to use Lovable's transactional email system
Instead of relying on Resend (which has no connection), route all teacher lifecycle emails through `send-transactional-email` which uses the already-configured Lovable Email infrastructure.

**Changes in `TeacherApplicationsManagement.tsx`:**
- Replace `supabase.functions.invoke('send-teacher-emails', ...)` calls with `supabase.functions.invoke('send-transactional-email', ...)` using the existing templates (`interview-invitation`, `final-welcome`, `application-received`)

**Changes in `VideoReviewPanel.tsx`:**
- Same pattern — replace `send-teacher-emails` calls with `send-transactional-email`

### Step 3: Update `from` address to `support@engleuphoria.com`
- Change `SITE_NAME` and `FROM_DOMAIN` in `send-transactional-email/index.ts` so emails come from `EnglEuphoria Support <support@engleuphoria.com>` (the `SENDER_DOMAIN` stays as `notify.engleuphoria.com` since that's the verified sending subdomain; `FROM_DOMAIN` controls what appears in the From header)
- Update `FROM_DOMAIN` to `engleuphoria.com` so the from address reads `support@engleuphoria.com`

### Step 4: Fix the Approve flow in InterviewRoom.tsx
- Remove the incorrect first `teacher_profiles` update that uses `admin_id`
- Keep only the correct fallback that fetches `user_id` from the application

### Step 5: Deploy updated edge functions
- Redeploy `send-transactional-email` with the updated from address

---

## Technical Details

### Migration SQL
```sql
DROP POLICY IF EXISTS "Admins can manage interviews" ON public.teacher_interviews;
CREATE POLICY "Admins can manage interviews" ON public.teacher_interviews
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
```

### Email routing change
All teacher lifecycle emails will use existing transactional templates. For email types that don't have a template yet (rejection, video_rejection, video_approved), simple templates will be created and registered.

### Files to modify
- `supabase/functions/send-transactional-email/index.ts` — update FROM_DOMAIN
- `src/components/admin/TeacherApplicationsManagement.tsx` — switch to transactional email
- `src/components/admin/VideoReviewPanel.tsx` — switch to transactional email
- `src/pages/InterviewRoom.tsx` — fix teacher profile update bug
- New migration for `teacher_interviews` RLS fix
- New transactional email templates for rejection scenarios

### Important note on email delivery
Emails will only start delivering once the DNS verification for `notify.engleuphoria.com` is complete. You can monitor this in **Cloud > Emails**. Until then, the emails will be enqueued but not sent.

