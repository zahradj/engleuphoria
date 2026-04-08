

## Plan: Reinforcement Lesson Generator + Teacher Mastery Dashboard

This plan adds two features: (1) an auto-triggered Reinforcement Lesson generator that targets a student's weakest skill after a failed Mastery Milestone, and (2) a dedicated teacher dashboard view showing all students' milestone scores and vocabulary progress across units.

---

### Step 1 — Reinforcement Lesson Mode in Edge Function

**Modify**: `supabase/functions/curriculum-expert-agent/index.ts`

Add a new `reinforcement_lesson` mode:

- **System prompt**: A specialized prompt instructing the AI to generate a focused 30-minute remediation lesson targeting a single weak skill (e.g., "speaking" or "grammar"). The lesson should revisit the unit's vocabulary and phoneme but emphasize the weak skill with 80% of activities.
- **`getSystemPrompt`**: Add case for `'reinforcement_lesson'`
- **`getModelForMode`**: Use `gemini-2.5-flash` (fast, focused output)
- **`getMaxTokensForMode`**: 4000 tokens
- **`buildUserPrompt`**: Accept `weakestSkill`, `unitTitle`, `vocabularyWords`, `grammarPatterns`, `phonemeFocus` and build a targeted prompt
- **`validateOutput`**: Validate for required fields (`title`, `targetSkill`, `activities`)
- **`GenerationRequest`**: Add `weakestSkill` field

---

### Step 2 — Reinforcement Lesson UI Trigger on Student Dashboard

**Modify**: `src/components/student/curriculum/UnitRoadmap.tsx`

When a milestone result has `passed: false`:
- The existing "Let's Practice More" button now triggers a reinforcement lesson generation
- On click: call `curriculum-expert-agent` with `mode: 'reinforcement_lesson'`, passing the `weakest_skill` from the milestone result plus the unit's vocabulary/grammar data
- Show a loading state, then navigate to the generated lesson or display it inline

**New file**: `src/hooks/useReinforcementLesson.ts`

A mutation hook that:
1. Takes `unitId`, `weakestSkill`, `studentId`
2. Fetches unit vocabulary and grammar from `student_vocabulary_progress` and `curriculum_units`
3. Calls `curriculum-expert-agent` with `mode: 'reinforcement_lesson'`
4. Returns the generated lesson content

---

### Step 3 — Teacher Mastery Overview Dashboard

**New file**: `src/components/teacher/dashboard/MasteryOverview.tsx`

A comprehensive view showing all students' mastery data:

- **Summary cards**: Total milestones completed, average scores, pass rate
- **Student table**: Sortable table with columns: Student Name, Unit, Score, Pass/Fail, Weakest Skill, Date
  - Data source: `mastery_milestone_results` joined with `profiles` and `curriculum_units` for students assigned to this teacher
- **Vocabulary progress**: Expandable section per student showing word counts by unit and mastery level
  - Data source: `student_vocabulary_progress` grouped by unit
- **Filter controls**: Filter by student, unit, pass/fail status

---

### Step 4 — Integrate Mastery Overview into Teacher Dashboard

**Modify**: `src/components/teacher/dashboard/TeacherDashboardContent.tsx`

- Add a 5th tab "Mastery" (or merge into existing "Reports" tab as a sub-section alongside UnitMasteryReport)
- Decision: Add as a sub-section in the Reports tab to avoid overcrowding tabs. The Reports tab will show both the "Generate & Send Report" form and the "Mastery Overview" table below it.

---

### Step 5 — Deploy Edge Function

Deploy `curriculum-expert-agent` with the new `reinforcement_lesson` mode.

---

### Summary

| Area | Action |
|------|--------|
| Edge Function | Add `reinforcement_lesson` mode with weak-skill-targeted prompt |
| Student Hook | `useReinforcementLesson.ts` — fetch unit data + invoke agent |
| UnitRoadmap | "Let's Practice More" triggers reinforcement generation |
| Teacher UI | `MasteryOverview.tsx` — table of all students' milestone scores + vocab |
| Dashboard | Integrate into Reports tab |
| Deploy | `curriculum-expert-agent` |

### Files to Create
- `src/hooks/useReinforcementLesson.ts`
- `src/components/teacher/dashboard/MasteryOverview.tsx`

### Files to Modify
- `supabase/functions/curriculum-expert-agent/index.ts`
- `src/components/student/curriculum/UnitRoadmap.tsx`
- `src/components/teacher/dashboard/TeacherDashboardContent.tsx`

