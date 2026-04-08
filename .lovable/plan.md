

## Plan: Parent Mastery Report, Teacher Unit Report, and Quiz-Triggered Communication

This adds the automated parent notification email, the teacher's diagnostic Unit Report with one-click PDF + send, and the celebration/retry UI on the student dashboard.

---

### Step 1 — Parent Mastery Report Email Template

**New file**: `supabase/functions/_shared/transactional-email-templates/unit-mastery-report.tsx`

A branded React Email template matching existing style (indigo-600 buttons, dark footer, Inter font). Props:

- `studentName`, `unitName`, `overallScore`
- `phonicsSummary`, `vocabularyCount`, `vocabularyWords[]`, `grammarPattern`
- `realWorldWin` (e.g., "They can now ask: 'What is it?'")
- `homeActivity` (mission for parent + child)
- `skillScores` (listening/speaking/reading/writing/phonics/grammar percentages)

The email displays: a Victory Badge header, skill breakdown table with status icons, the "Real-World Win" highlight, and a Home Activity mission box.

**Update**: `registry.ts` — add `unit-mastery-report` entry.

---

### Step 2 — Auto-Trigger Email on Quiz Pass

**New file**: `src/utils/sendMasteryReport.ts`

A utility function that:
1. Fetches the student's `parent_email` from `student_profiles`
2. Pulls vocabulary from `student_vocabulary_progress` for the unit
3. Pulls phonics data from `student_phonics_progress`
4. Pulls milestone result from `mastery_milestone_results`
5. Calls `supabase.functions.invoke('send-transactional-email', ...)` with `templateName: 'unit-mastery-report'`

This function is called from the existing quiz completion flow (wherever `mastery_milestone_results` is inserted and `passed = true`).

---

### Step 3 — Teacher's Final Unit Report Component

**New file**: `src/components/teacher/dashboard/UnitMasteryReport.tsx`

A diagnostic report view accessible from the Teacher Dashboard Students tab. Features:

- **Student selector** dropdown to pick a student
- **Unit selector** showing completed units
- Auto-populated data: quiz scores, skill breakdown, vocabulary list, phonics mastery, grammar patterns
- **AI-Assisted Summary**: Calls the `curriculum-expert-agent` with a `generate_report_summary` mode to draft a professional narrative ("Overall, Alex has shown 85% Mastery...")
- **Editable fields**: Teacher can edit the AI-generated summary, add "Voice of the Teacher" notes (Win + Work), and customize the Home Activity
- **"Approve & Send" button**: Generates a PDF (using browser print/html2canvas), emails it to the parent via `send-transactional-email`, and marks the unit as archived in the roadmap

---

### Step 4 — Student Dashboard Celebration + Retry UI

**Modify**: `src/components/student/curriculum/UnitRoadmap.tsx`

- When a milestone is passed (score >= 80%): show a confetti/celebration animation and an "unlocked" badge on the next unit
- When failed (< 80%): show a "Let's Practice More" button that navigates to the review lesson

---

### Step 5 — Teacher Dashboard Integration

**Modify**: `src/components/teacher/dashboard/TeacherDashboardContent.tsx` or navigation

- Add a "Reports" tab or a "Generate Report" button on the Students tab
- Link to the `UnitMasteryReport` component
- Show real-time quiz results feed (query `mastery_milestone_results` for the teacher's students)

---

### Summary

| Area | Action |
|------|--------|
| Email template | `unit-mastery-report.tsx` — branded parent report with skill breakdown |
| Registry | Add to `registry.ts` |
| Utility | `sendMasteryReport.ts` — auto-trigger on quiz pass |
| Teacher UI | `UnitMasteryReport.tsx` — diagnostic report with AI summary + send |
| Student UI | Celebration animation on pass, retry button on fail |
| Teacher Dashboard | Reports tab / Generate Report button |
| Edge Function | Add `generate_report_summary` mode to `curriculum-expert-agent` |
| Deploy | `send-transactional-email` + `curriculum-expert-agent` |

### Files to Create
- `supabase/functions/_shared/transactional-email-templates/unit-mastery-report.tsx`
- `src/utils/sendMasteryReport.ts`
- `src/components/teacher/dashboard/UnitMasteryReport.tsx`

### Files to Modify
- `supabase/functions/_shared/transactional-email-templates/registry.ts`
- `src/components/student/curriculum/UnitRoadmap.tsx`
- `src/components/teacher/dashboard/TeacherDashboardContent.tsx` (or nav)
- `supabase/functions/curriculum-expert-agent/index.ts`

