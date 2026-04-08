

## Plan: Teacher Invite Flow + Student Visibility Fix

### Problem Summary

1. **Teachers can't log in**: Teachers apply via a form (no password), so they have no Supabase Auth account. The "Approve" button only updates a database row — it never creates an auth user or sends an invite.
2. **Students can't see teachers**: The `get_approved_teachers` RPC checks `profile_complete = true AND can_teach = true AND is_available = true`, but the approve flow only sets these flags if a `user_id` exists on the application (which it doesn't, since no auth account was created).

### Phase 1: Teacher Invite & Set Password

**Step 1 — Create an Edge Function `approve-teacher`**

A new Edge Function that uses the service role key to:
- Accept `{ applicationId, email, firstName, lastName }` from the admin client
- Call `supabaseClient.auth.admin.inviteUserByEmail(email, { data: { full_name, role: 'teacher' }, redirectTo: 'https://engleuphoria.lovable.app/set-password' })`
- Create a row in `public.users` with `id = authUser.id, email, full_name, role = 'teacher'`
- Insert into `user_roles` with `role = 'teacher'`
- Create an initial `teacher_profiles` row linked to the new `user_id`
- Update `teacher_applications` to `current_stage = 'approved', status = 'accepted'`
- Send a branded welcome email via the transactional email system

**Step 2 — Create `/set-password` page**

A new page (reusing the existing `ResetPassword` pattern) that:
- Listens for the `SIGNED_IN` or `PASSWORD_RECOVERY` auth event from the invite link token
- Shows a "Welcome to EnglEuphoria — Set Your Password" form
- Calls `supabase.auth.updateUser({ password })` to set the password
- Redirects to `/teacher` (Teacher Dashboard) after success

**Step 3 — Update `handleFinalApprove` in `TeacherApplicationReview.tsx`**

Replace the current direct DB update with a call to the new `approve-teacher` Edge Function. This removes the need for client-side admin API access.

**Step 4 — Add route in `App.tsx`**

Register `/set-password` as a public route pointing to the new `SetPassword` page.

### Phase 2: Student Dashboard Visibility

**Step 5 — Update `get_approved_teachers` RPC**

The existing function filters on `profile_complete = true AND can_teach = true AND is_available = true`. The Edge Function from Step 1 will set `can_teach = true`, `is_available = true`, and `profile_complete = true` on the new teacher profile, so teachers will appear automatically.

**Step 6 — Verify RLS on `teacher_profiles`**

Confirm the existing RLS policy allows authenticated students to SELECT approved teacher profiles (per the memory note, this is already standardized with 3 policies including one for authenticated users to view approved profiles).

### Database Migration

Add a `SET PASSWORD` redirect URL to Supabase config — no schema changes needed since `users`, `user_roles`, and `teacher_profiles` tables already exist.

### Technical Details

- The `approve-teacher` Edge Function uses `SUPABASE_SERVICE_ROLE_KEY` (already available in Edge Functions by default)
- The invite email link will contain a token that auto-signs the teacher in when they visit `/set-password`
- The `set-password` page detects the session via `onAuthStateChange` and enables the password form
- After password set, the teacher is redirected to their dashboard where the existing first-login welcome flow (confetti + Studio Guide) triggers

### Files to Create/Modify

- **Create**: `supabase/functions/approve-teacher/index.ts`
- **Create**: `src/pages/SetPassword.tsx`
- **Modify**: `src/components/admin/TeacherApplicationReview.tsx` — call Edge Function instead of direct DB update
- **Modify**: `src/App.tsx` — add `/set-password` route

