

# Plan: Finalize Post-Interview Approval & First Login Welcome

## What We're Building

Three interconnected pieces to complete the teacher hiring pipeline:

1. **Enhanced Evaluation Sidebar** in the Interview Room with additional checklist items and hub re-tagging
2. **"Final Welcome" transactional email** sent on approval
3. **First-login welcome experience** on the Teacher Dashboard with confetti and a guided tour

---

## Technical Details

### 1. Enhance Interview Room Evaluation Sidebar

**File: `src/pages/InterviewRoom.tsx`**

- **Expand checklist** to include: Camera/Lighting Quality, Background (Professional/Playground-friendly), Energy & Tone (replace current 4 items with the requested ones plus Subject Knowledge, Tech Stability, Demo Performance — 7 total)
- **Add Hub Re-tagging**: A dropdown/toggle group below the checklist letting the admin override the hub assignment (Playground / Academy / Professional) even if the teacher originally applied for a different one
- **Update `handleApprove`** to:
  - Save the overridden hub type to the interview record
  - Update `teacher_profiles` (set `can_teach: true`, `is_available: true`, `profile_approved_by_admin: true`)
  - Send the "Final Welcome" transactional email
  - Set a `welcome_shown` flag to `false` in `teacher_profiles` (for first-login detection)

### 2. Create "Final Welcome" Email Template

**New file: `supabase/functions/_shared/transactional-email-templates/final-welcome.tsx`**

- Subject: "Welcome to the Team! Your EnglEuphoria Teacher Dashboard is Live."
- Body includes: congratulations message with teacher name and hub, link to `/teacher-dashboard`, next steps (review curriculum, sync calendar)
- Branded with indigo-600 buttons, dark footer, Inter font (matching existing templates)

**Update: `supabase/functions/_shared/transactional-email-templates/registry.ts`**
- Import and register `final-welcome` template

**Deploy**: `send-transactional-email` edge function after template changes

### 3. Database Migration

Add a `welcome_shown` boolean column to `teacher_profiles` (default `false`). This tracks whether the teacher has seen the first-login celebration. When the approve action fires, it stays `false`; after the teacher dismisses the welcome popup, it gets set to `true`.

### 4. First-Login Welcome Experience on Teacher Dashboard

**New file: `src/components/teacher/dashboard/WelcomeSuccessModal.tsx`**

- Triggers when teacher status is `APPROVED` and `profile.welcome_shown === false`
- Shows a modal with:
  - Confetti animation (using existing `triggerCelebration` from `services/celebration.ts`)
  - "Welcome to EnglEuphoria!" heading
  - 3-step "Studio Guide" cards: (1) Enter your Dashboard, (2) Review your first lesson, (3) Sync your calendar
  - Profile preview showing their photo and bio as students see it
  - "Get Started" dismiss button
- On dismiss: updates `teacher_profiles.welcome_shown = true`

**Update: `src/components/teacher/dashboard/TeacherDashboardShell.tsx`**
- Import and render `WelcomeSuccessModal` when `status === 'APPROVED'` and `profile?.welcome_shown === false`

### 5. Wire Approval in InterviewRoom to Send Email

**Update: `src/pages/InterviewRoom.tsx` → `handleApprove`**

After updating `teacher_applications` and `teacher_profiles`:
```
supabase.functions.invoke('send-transactional-email', {
  body: {
    templateName: 'final-welcome',
    recipientEmail: interview.teacher_email,
    idempotencyKey: `final-welcome-${interview.application_id}`,
    templateData: { name: interview.teacher_name, hubType: selectedHub },
  }
})
```

---

## Summary of File Changes

| File | Action |
|------|--------|
| `src/pages/InterviewRoom.tsx` | Expand checklist, add hub re-tag, wire email + profile updates |
| `supabase/functions/_shared/transactional-email-templates/final-welcome.tsx` | New template |
| `supabase/functions/_shared/transactional-email-templates/registry.ts` | Register new template |
| `src/components/teacher/dashboard/WelcomeSuccessModal.tsx` | New first-login component |
| `src/components/teacher/dashboard/TeacherDashboardShell.tsx` | Render welcome modal |
| Database migration | Add `welcome_shown` boolean to `teacher_profiles` |

