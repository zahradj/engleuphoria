## Lesson Testing & Validation System

Build a **continuous lesson testing harness** that runs synthetic + real lessons through the existing QA + Stabilization engines across every hub × CEFR combination, surfaces failures in a Content Creator dashboard, and persists regression history for trend analysis.

This layer does **not** replace `runQualityControl()` or `runStabilization()` — it orchestrates them at scale, adds 8 new error-pattern detectors, and gives the team a UI to inspect and act on results.

---

### 1. New module: `src/testing/`

```text
src/testing/
  index.ts                       // runLessonTestSuite() entry
  types.ts                       // TestCase, TestRun, TestVerdict, FailureCategory
  testMatrix.ts                  // Hub × CEFR × LessonKind matrix generator
  syntheticLessons.ts            // Generates test fixtures via orchestrator
  runner.ts                      // Executes batch, parallel-safe
  detectors/
    repetitivePattern.ts         // Activity sequence n-gram detection
    duplicateVocab.ts            // Cross-slide vocab repetition >threshold
    disconnectedContext.ts       // Theme/topic cosine drift
    grammarOverload.ts           // >1 new structure per lesson
    weakSpeakingTask.ts          // Speaking ratio + bravery score
    poorScaffolding.ts           // GRR slide arc violations
    unrealisticDialogue.ts       // AI judge on dialogue plausibility
    roboticFlow.ts               // Transition variance + tone heuristic
  aggregator.ts                  // Rolls detector + QA + stab verdicts
  reportBuilder.ts               // Per-run + per-matrix-cell reports
```

**Pipeline per test case:**
1. Build `LessonBlueprint` from matrix cell (hub, CEFR, kind)
2. `runLessonGeneration()` → lesson JSON
3. `runQualityControl()` — collect 10 existing validators
4. `runStabilization()` — collect 6 existing validators
5. Run 8 new error detectors
6. Aggregate → `TestVerdict { pass | warn | fail, categories[], evidence[] }`

---

### 2. Database (single migration)

```sql
create table public.lesson_test_runs (
  id uuid primary key default gen_random_uuid(),
  run_label text,                       -- e.g. 'nightly-2026-05-18'
  hub text not null,
  cefr_level text not null,
  lesson_kind text not null,
  blueprint_hash text,
  lesson_id uuid references curriculum_lessons(id),
  qa_verdict text,                      -- publish | repair | block
  stab_verdict text,
  detector_failures jsonb default '[]',
  overall_verdict text not null,        -- pass | warn | fail
  duration_ms int,
  created_at timestamptz default now()
);

create table public.lesson_test_failures (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references lesson_test_runs(id) on delete cascade,
  category text not null,               -- one of FailureCategory
  severity text not null,               -- info | warn | error
  detector text not null,
  evidence jsonb,
  slide_index int,
  created_at timestamptz default now()
);
```

RLS: admin + content_creator read; service role write (runner is privileged).

---

### 3. Edge function: `supabase/functions/lesson-test-runner/`

- POST `{ scope: 'matrix' | 'single' | 'regression', filters?: {...} }`
- Runs test suite server-side, writes rows, returns `runId`
- Triggered manually from UI **and** by `pg_cron` nightly (separate migration for the schedule)
- Calls Gemini direct via `aiFetch` for AI-judge detectors (dialogue plausibility) — never Lovable Gateway

---

### 4. Content Creator UI: `/content-creator/lesson-tests`

```text
src/pages/content-creator/LessonTestingPage.tsx
src/components/content-creator/testing/
  TestMatrixHeatmap.tsx          // Hub × CEFR grid, cell color = pass rate
  TestRunHistoryTable.tsx        // Sortable, filterable
  FailureDetailDrawer.tsx        // Per-failure evidence + slide ref
  DetectorBreakdownChart.tsx     // Failure category distribution
  RunNewTestDialog.tsx           // Scope picker + Run button
```

- Heatmap cells link to filtered run list
- Drawer shows offending slide JSON + detector evidence + jump-to `/content-creator/unified-generator?lessonId=…`
- Real-time updates via Supabase subscription on `lesson_test_runs`

---

### 5. Integration with existing systems

- `runLessonGeneration()` gains an optional `testMode: true` flag → skips publish, returns full diagnostic bundle
- `useBlueprintLessonStatuses` extended with `lastTestVerdict` per slot, shown as a third badge on `CurriculumMap`
- No changes to pedagogical engines or `masterCurriculum.ts`

---

### 6. Out of scope

- No changes to `runQualityControl`, `runStabilization`, planner, governance, adaptive, gamification, pronunciation engines
- No new pedagogical rules — detectors only **observe**
- No student-facing UI

---

### Files created
- `src/testing/**` (12 files)
- `supabase/functions/lesson-test-runner/index.ts`
- `src/pages/content-creator/LessonTestingPage.tsx`
- `src/components/content-creator/testing/**` (5 files)
- 2 SQL migrations (tables + cron)

### Files edited
- `src/orchestrator/index.ts` — add `testMode` flag
- `src/components/creator-studio/steps/blueprint/useBlueprintLessonStatuses.ts` — expose test verdict
- `src/components/creator-studio/steps/blueprint/LessonStatusBadge.tsx` — add test pill
- `src/App.tsx` — register `/content-creator/lesson-tests` route
