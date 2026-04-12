

## Teacher Onboarding Pipeline Fix

### Problems Identified

1. **"Failed to save profile"**: The `ProfileOnboardingModal` never sets `profile_complete = true` after submission. The teacher profile stays invisible because `profile_complete`, `can_teach`, and `profile_approved_by_admin` are all `false`. There's also a duplicate INSERT RLS policy (`secure_teacher_profiles_insert`) that could cause confusion.

2. **Interview email silently fails**: The `TeacherApplicationsManagement.tsx` calls `sendEmail('interview_invite', ...)` which invokes `send-transactional-email` directly from the client. Meanwhile, there's also a dedicated `send-interview-invite` Edge Function that does the same thing server-side. The client call may fail silently without proper error surfacing. The `interviewLink` is never populated (no zoom_link or internal room link is passed from this component).

3. **No status progression after profile submission**: After a teacher submits their profile, there's no mechanism to update the application status to reflect "profile submitted / pending review." The teacher just sees a generic success toast.

4. **Generic error messages**: The profile save error is a catch-all "Failed to save profile" with no specifics about what went wrong.

### Plan

**Step 1: Fix ProfileOnboardingModal submission logic**
- After successful insert/update to `teacher_profiles`, set `profile_complete = true` in the same payload
- Add specific field-level validation with descriptive error messages (bio length, video URL format, missing photo/certs)
- Show a loading spinner during submission (already exists) and a branded success state after completion
- Update the teacher's application `current_stage` to `'final_review'` after profile submission so admins see them in the review queue

**Step 2: Fix interview email trigger in TeacherApplicationsManagement**
- Replace the direct `send-transactional-email` client call with a call to the existing `send-interview-invite` Edge Function (which has proper admin auth, interview data lookup, and system_emails logging)
- Ensure the interview link is populated: use the internal room URL when available, or pass the zoom_link from the interview dialog

**Step 3: Remove duplicate RLS policy**
- Drop the `secure_teacher_profiles_insert` policy (duplicate of "Teachers can insert their profile")

**Step 4: Improve error specificity**
- Replace the generic "Failed to save profile" toast with parsed error details from Supabase (e.g., "Bio is required", "File too large", "Invalid video URL")
- Add a visual success state in the modal after submission showing "Profile submitted for review"

### Files to modify
- `src/components/teacher/dashboard/ProfileOnboardingModal.tsx` — fix submission logic, validation, error messages
- `src/components/admin/TeacherApplicationsManagement.tsx` — fix interview email to use the Edge Function
- One database migration to drop the duplicate RLS policy

