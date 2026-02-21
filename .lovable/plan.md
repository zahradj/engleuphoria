
# Professional Dashboard: Skill Radar, Learning Velocity, and Executive Polish

## Overview

Upgrade the Professional ("Hub") Dashboard with three categories of improvements: (1) a data-connected Skill Radar chart with interactive tooltips and a target overlay, (2) a Learning Velocity line chart with milestone markers, and (3) executive-grade UI polish including professional color palette, typography, and credit balance prominence.

---

## 1. Database: Create `student_skills` Table

A new table to persist per-student skill scores (sourced from teacher feedback and AI placement tests).

```text
CREATE TABLE public.student_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL CHECK (skill_name IN (
    'professional_vocabulary', 'fluency', 'grammar_accuracy', 'business_writing', 'listening'
  )),
  current_score NUMERIC(4,1) DEFAULT 0 CHECK (current_score BETWEEN 0 AND 10),
  target_score NUMERIC(4,1) DEFAULT 8 CHECK (target_score BETWEEN 0 AND 10),
  cefr_equivalent TEXT DEFAULT 'A1',
  next_focus TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, skill_name)
);

-- RLS: students read their own, teachers/admins can update
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;

-- Students can read their own skills
CREATE POLICY "Students can view own skills"
  ON public.student_skills FOR SELECT
  USING (student_id = auth.uid());

-- Students can insert their own (for placement test seeding)
CREATE POLICY "Students can insert own skills"
  ON public.student_skills FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Admins and teachers can update any student skills
CREATE POLICY "Teachers and admins can update skills"
  ON public.student_skills FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'teacher')
  );

-- Admins can view all skills
CREATE POLICY "Admins can view all skills"
  ON public.student_skills FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
```

**Seeding logic**: When a student has no `student_skills` rows yet, the component will auto-seed 5 rows using a baseline derived from their `placement_test_score` in `student_profiles`.

---

## 2. Upgrade `SkillsRadarChart.tsx` -- Data-Connected with Tooltips

**File:** `src/components/student/hub/SkillsRadarChart.tsx`

Changes:
- Fetch real data from `student_skills` table via Supabase
- If no data exists, compute baseline from placement test score and insert seed rows
- Change the 5 axes to: Professional Vocabulary, Fluency, Grammar Accuracy, Business Writing, Listening
- Add a custom Tooltip that shows:
  - "Current Level: [CEFR]. Focus on '[next_focus]' to reach [next CEFR]."
- Keep the existing "Target" overlay polygon (already implemented) but connect it to the `target_score` column
- Use Deep Navy (#1A2B3C) and Slate Gold (#C9A96E) accents for the professional palette

---

## 3. Upgrade `LearningVelocityChart.tsx` -- Weekly Line Chart with Milestones

**File:** `src/components/student/hub/LearningVelocityChart.tsx`

Changes:
- Switch from daily "hours studied" to a weekly "Progress Points" view
  - X-axis: Week labels (Week 1, Week 2, ...)
  - Y-axis: Progress Points (derived from completed lessons count and average lesson scores from `student_lesson_progress`)
- Fetch real data from `student_lesson_progress` grouped by week
- Add milestone markers (small star/trophy icons via Recharts `ReferenceDot`) at weeks where the student completed their 10th and 20th session
- If no data, show placeholder with a message: "Complete your first lesson to start tracking progress"

---

## 4. Executive UI Polish on `HubDashboard.tsx`

**File:** `src/components/student/dashboards/HubDashboard.tsx`

Changes:

| Element | Current | New |
|---------|---------|-----|
| Color palette | Emerald/Teal gradients | Deep Navy (#1A2B3C) + Slate Gold (#C9A96E) accents |
| Header brand name | "The Hub" | "Executive Learning Hub" |
| Session CTA button | "Schedule a Session" | "Schedule Executive Briefing" |
| Join button | "Join Session" | "Join Executive Briefing" |
| Font weight/style | Standard semibold | Tighter tracking, uppercase section labels |
| Card borders | gray-100 | Subtle slate borders with gold accent on hover |

---

## 5. Credit Balance Prominence

**File:** `src/components/student/dashboards/HubDashboard.tsx`

- Import and render `CreditDisplay` component prominently in the right sidebar (above "Resources")
- The `CreditDisplay` component already handles:
  - Shows "Credits: 0" with destructive styling + "Buy Credits" CTA
  - Shows remaining credits with proper count
  - Low credit warning at 2 or fewer

**File:** `src/components/student/BookMyClassModal.tsx`
- Verify and ensure the "Schedule" button is disabled when credits are 0 (add explicit check if missing)

---

## 6. New Hook: `useStudentSkills`

**File to create:** `src/hooks/useStudentSkills.ts`

- Fetches `student_skills` for the current user
- If no rows found, seeds 5 rows from placement test baseline:
  - `placement_test_score` / `placement_test_total` mapped to a 0-10 scale with slight per-skill variance
- Returns `{ skills, loading, refresh }`
- Maps CEFR equivalents: 0-2 = A1, 2-4 = A2, 4-6 = B1, 6-8 = B2, 8-10 = C1

---

## 7. New Hook: `useLearningVelocity`

**File to create:** `src/hooks/useLearningVelocity.ts`

- Fetches from `student_lesson_progress` grouped by ISO week
- Calculates "Progress Points" per week: `completed_lessons_count * 10 + average_score`
- Identifies milestone weeks (10th and 20th completed lesson overall)
- Returns `{ weeklyData, milestones, totalLessons, loading }`

---

## Files Summary

| Action | File | Purpose |
|--------|------|---------|
| Migration | `student_skills` table | Persistent skill scores |
| Create | `src/hooks/useStudentSkills.ts` | Fetch/seed student skill data |
| Create | `src/hooks/useLearningVelocity.ts` | Weekly progress point aggregation |
| Modify | `src/components/student/hub/SkillsRadarChart.tsx` | Data-connected radar with tooltips |
| Modify | `src/components/student/hub/LearningVelocityChart.tsx` | Weekly progress with milestones |
| Modify | `src/components/student/dashboards/HubDashboard.tsx` | Executive palette, credit display, text changes |
| Modify | `src/components/student/BookMyClassModal.tsx` | Verify credit-gate on booking button |
