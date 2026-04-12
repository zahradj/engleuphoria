
Goal: fix the real backend/UI mismatches without introducing the wrong email architecture.

What I found:
- The bio length issue is not caused by `teacher_profiles.bio` being `varchar(255)`. In the migrations, `teacher_profiles.bio` is already `TEXT`, and `teacher_applications.bio` is also `TEXT`.
- The save failure is more likely coming from logic/policy mismatches:
  - `ProfileOnboardingModal.tsx` updates `teacher_applications.current_stage` by matching the logged-in user email. That can silently fail if the invited auth email and application email do not line up exactly.
  - The project has both `intro_video_url` and `video_url` history, so teacher data still carries schema drift risk.
  - `approve-teacher` uses Supabase Auth invitations, so the plain “You’ve been invited” email is coming from the auth invite template, not from the branded app email templates.
- The interview invite already goes through the dedicated `send-interview-invite` function and the branded `interview-invitation` template. The likely remaining problem is missing/empty meeting link data in the interview record, not a frontend-only issue.

Implementation plan:

1. Verify and normalize the teacher profile data path
- Audit all write/read paths that touch `teacher_profiles` and `teacher_applications`:
  - `ProfileOnboardingModal.tsx`
  - `ProfileSetupTab.tsx`
  - `approve-teacher`
  - `InterviewRoom.tsx`
- Standardize on canonical fields (`bio`, `video_url`, `profile_image_url`, `certificate_urls`) and explicitly stop relying on legacy `intro_video_url` semantics in onboarding flows.

2. Fix teacher profile submission robustness
- Refactor `ProfileOnboardingModal.tsx` to:
  - continue using the insert-then-update fallback,
  - keep `profile_complete: true`,
  - surface precise backend error messages,
  - update the related application record more reliably by `user_id` first, with safe fallback logic instead of email-only matching.
- Review `ProfileSetupTab.tsx` too, because it still uses a parallel profile-save path and can reintroduce inconsistent behavior.

3. Align application stage transitions with database constraints
- Keep stage values strictly within the allowed set already used in the database.
- Ensure the flow is:
  - invite/approval path -> approved only when truly onboarded,
  - profile submission -> final_review,
  - final admin approval -> approved / active-teaching state in profile flags.
- Reconcile any duplicate or conflicting transitions between admin review screens and interview approval screens.

4. Fix the invitation email experience at the correct layer
- Since approval currently uses Supabase Auth `inviteUserByEmail`, update the auth invite template rather than replacing the flow with Resend.
- Rework the auth invite email copy/design to be congratulatory and branded for teacher onboarding, while keeping the secure password setup link intact.
- If needed, pass richer teacher-facing context through invite metadata and render it in the custom invite template.

5. Tighten interview invite data integrity
- Review `send-interview-invite` and the scheduling UI together.
- Ensure interview records always include the required join link source before the email is sent.
- If no meeting link exists, return a clear error and prevent sending a broken invite.
- Keep using the branded `interview-invitation` app email template and existing logging into `system_emails`.

6. Database-side cleanup if needed
- Add a focused migration only if inspection confirms real schema drift still affecting runtime behavior, for example:
  - normalizing legacy video-field usage,
  - adding missing indexes/constraints that support the fixed lookup path,
  - removing any remaining conflicting policy or legacy trigger if discovered.
- Do not create a migration just to convert bio fields to `TEXT`, because that already appears to be true in the project history.

Technical notes:
- I would not switch this flow to Resend just to fix the invitation email. The app already has custom auth email infrastructure plus branded app-email templates. The correct fix is to brand the auth invite template and keep the existing secure invite flow.
- The plain two-line invitation is specifically explained by `approve-teacher/index.ts` calling `inviteUserByEmail(...)`, while the current auth invite template file still contains generic wording.
- There is also a stage/status mismatch risk: project memory says `teacher_applications.current_stage` accepts values like `application_submitted`, `interview_scheduled`, `final_review`, `approved`, `rejected`, so frontend transitions need to stay exactly inside that set.

Files likely to update:
- `src/components/teacher/dashboard/ProfileOnboardingModal.tsx`
- `src/components/teacher/ProfileSetupTab.tsx`
- `src/pages/InterviewRoom.tsx`
- `supabase/functions/approve-teacher/index.ts`
- `supabase/functions/send-interview-invite/index.ts`
- `supabase/functions/_shared/email-templates/invite.tsx`
- possibly one small migration if a real schema/policy mismatch is confirmed during implementation
