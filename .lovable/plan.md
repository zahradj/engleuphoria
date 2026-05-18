# Master Curriculum Orchestration Engine

Unify the 7 existing engines (`planning/`, `governance/`, `adaptive/`, `pronunciation/`, `activities/`, `gamification/`, `qa/`) behind a single pipeline driven by one shared `LessonContext` object. Nothing else in the app should call these engines directly anymore — they all go through the orchestrator.

## Goals

- One entry point: `runLessonGeneration(input)` produces a fully planned, validated, gamified, QA-passed lesson.
- One shared state object: `LessonContext` (the "source of truth" already implied by `LessonState`).
- Strict priority ordering with a conflict resolver — CEFR/curriculum integrity always win over gamification/UX.
- Real-time adaptation loop + feedback-to-curriculum loop, both fed from live student signals.
- Replace ad-hoc calls in edge functions / wizard with the orchestrator.

## New module: `src/orchestrator/`

```text
src/orchestrator/
  index.ts                      # public surface
  types.ts                      # LessonContext, OrchestrationResult, StageReport
  pipeline.ts                   # runLessonGeneration() — 10-step pipeline
  contextBuilder.ts             # assemble LessonContext from inputs
  stageRunner.ts                # generic stage wrapper (timing, errors, telemetry)
  priorityMatrix.ts             # 8-tier priority table (CEFR > curriculum > … > UI)
  conflictResolver.ts           # resolves engine-level conflicts using priorityMatrix
  adaptationLoop.ts             # in-lesson real-time adaptation hooks
  feedbackLoop.ts               # post-lesson signals → curriculum/review/SRS updates
  promptChain.ts                # composes planner+governance+adaptive+pron+gamification system prompts in correct order
  telemetry.ts                  # per-stage timing + error capture
  cache.ts                      # plan/state/prompt caching by stateHash
  guards.ts                     # hard preconditions between stages
```

### 10-step pipeline (matches the brief)

```text
1. Curriculum Selection      → masterCurriculum lookup (hub, cefr, unit, lesson)
2. Blueprint Creation        → planning.buildLessonBlueprint
3. LessonState Generation    → planning.blueprintToLessonState (governance contract)
4. Pedagogical Flow Planning → planning.generateLessonPlan (+ validate, hard gate)
5. Activity Generation       → activities.generateActivities (planner+governance prompt)
6. Pronunciation Injection   → pronunciation.runPronunciation (chains prompt)
7. Adaptive Personalization  → adaptive.runAdaptation (chains prompt, adjusts plan)
8. Gamification Layering     → gamification.runGamification (mission + reward plan)
9. Quality Validation        → qa.runQualityControl (10 validators + judge)
10. Publish Gate + Delivery  → qa.publishGate → persist to curriculum_lessons
```

The prompt chain order injected into every Gemini call:
`planner → governance → adaptive → pronunciation → gamification → narrative binder → activity-type prompt`

### Shared `LessonContext` (single source of truth)

```ts
interface LessonContext {
  hub: Hub;
  cefr: Cefr;
  lessonState: LessonState;          // governance contract
  plan: LessonPlan;                  // planner output
  adaptive: AdaptationContext;       // adaptive output
  pronunciation: PronunciationRunResult;
  gamification: RunGamificationResult;
  activities: ActivitySpec[];
  qa?: QAReport;
  meta: { stateHash: string; generatedAt: string; orchestratorVersion: string };
}
```

Every engine reads/writes through this object — no engine accepts loose args anymore at orchestration boundaries.

## Priority Matrix & Conflict Resolver

`priorityMatrix.ts` codifies the 8 tiers from the brief:

```text
1. CEFR compliance       (hard, non-overridable)
2. Curriculum integrity  (hard)
3. Educational validity  (hard)
4. Age appropriateness   (hard)
5. Communication goals   (soft-hard)
6. Adaptive personalization
7. Gamification
8. Visual/UI
```

`conflictResolver.ts` takes a set of `EngineProposal`s (e.g. gamification wants difficulty +2, CEFR cap forbids it) and returns the winning decision + a rationale log persisted to telemetry.

## Real-Time Adaptation Loop (`adaptationLoop.ts`)

In-lesson hooks consumed by the lesson player:
- `onActivityComplete(signal)` → updates engagement + mastery deltas
- `onSpeakingAttempt(signal)` → feeds pronunciation + speaking bravery
- `onMistake(signal)` → patternAggregator + mistake_repository write
- Returns `LessonContextPatch` (difficulty tier, scaffolding, vocab repeat count) — applied to remaining activities without violating CEFR cap.

## Feedback-to-Curriculum Loop (`feedbackLoop.ts`)

Runs post-lesson (edge function or client batch):
- updates `student_mastery`, SRS review queue, mistake repository
- nudges curriculum progression (unlock next unit if 80% milestone hit)
- flags vocab recycling priority for the next lesson plan
- updates `student_motivation_profile` signals

## Integration & Refactor

- New edge function `supabase/functions/orchestrate-lesson/` (Gemini-direct, per the runtime-AI-Gemini-only rule) that wraps `runLessonGeneration` and persists to `curriculum_lessons`.
- Refactor `AILessonWizard` / `generatePPPLesson` to call the orchestrator instead of stitching engines manually.
- Refactor lesson player hooks to dispatch real-time signals into `adaptationLoop`.
- Add `useOrchestratedLesson()` hook for the client.

## Telemetry & Cache

- `orchestrator_runs` table: stage timings, conflicts resolved, QA verdict, prompt-chain hash.
- `cache.ts`: memoize plan + lessonState + composite system prompt by `stateHash` (same hash already used by governance).

## Database (migration)

Two new tables:

- `orchestrator_runs` — `lesson_id`, `state_hash`, `stage_timings` JSONB, `conflicts` JSONB, `qa_verdict`, `prompt_chain_hash`, `created_at`. RLS: admins + content_creators read; service role write.
- `curriculum_feedback_signals` — `student_id`, `lesson_id`, `signal_type`, `payload` JSONB, `created_at`. RLS: self insert/select; admins read all. Indexed on `(student_id, created_at DESC)`.

No changes to existing tables; the orchestrator only reads `curriculum_lessons`, `student_mastery`, `student_xp`, `mistake_repository`, `speech_attempts`, `student_motivation_profile`.

## Memory updates

Add a new Core rule to `mem://index.md`:

> **Orchestration:** Every lesson generation MUST flow through `runLessonGeneration()` (`src/orchestrator/`). Direct calls to `planning`, `governance`, `adaptive`, `pronunciation`, `activities`, `gamification`, or `qa` engines outside the orchestrator are forbidden. Prompt chain order is fixed: planner → governance → adaptive → pronunciation → gamification → narrative → activity. Conflict resolution follows the 8-tier priority matrix (CEFR wins).

Add detailed memory file `mem://architecture/master-orchestration-engine` describing pipeline, context object, priority matrix, loops.

## Out of scope (explicit)

- No new UI screens — orchestrator is backend/runtime.
- No changes to the lesson player's rendering; only its signal-emitting hooks.
- No multi-language curriculum scaffolding (the system is designed scalable, but content stays English).

## File summary

- New: ~14 files under `src/orchestrator/`, 1 edge function, 1 migration, 1 memory file.
- Edited: `AILessonWizard`/`generatePPPLesson`, lesson player signal hooks, `mem://index.md`.

Once approved I will implement in this order: types → pipeline skeleton → priority/conflict → adaptation+feedback loops → migration → edge function → wizard refactor → memory.
