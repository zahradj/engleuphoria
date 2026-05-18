## Curriculum-to-Lesson Integration System

Bind the Curriculum Blueprint to the Unified Lesson Generator so curriculum becomes the single source of truth and the generator becomes a controlled execution engine.

### 1. Lesson Blueprint Data Model

Create `src/services/contentCreator/lessonBlueprint.ts`:

- `LessonBlueprint` TS type matching the master schema (lesson_id, unit_id, hub, cefr_level, lesson_title, communication_goal, grammar_focus, vocabulary_focus, pronunciation_focus, phonics_focus, review_targets, difficulty, adaptive_profile, story_state, game_targets, homework_targets).
- `buildLessonBlueprint(unit, lesson, hub, cefrLevel, neighbors)` — assembles blueprint from `masterCurriculum` + previous/next/review siblings.
- `LOCKED_FIELDS` / `EDITABLE_FIELDS` constants exported for the UI.
- `validateBlueprintIntegrity(bp)` — guards (CEFR vs hub matrix, vocab size cap, grammar in scope, phonics-level match).

### 2. Curriculum Binding Layer

Create `src/services/contentCreator/curriculumBinding.ts`:

- `loadLessonBlueprintFromCurriculum({ hub, cefr_level, unit_number, lesson_number, userId })` — reads `masterCurriculum`, resolves neighbors (prev/next/review), returns a fully-typed `LessonBlueprint`.
- `linkBlueprintToGenerator(blueprint)` — converts blueprint → `UnifiedGeneratorInput` consumed by `unifiedLessonGenerator`.
- `getLessonRelationships(unit, lesson)` — prev/next/review/prerequisite skills.
- Used by both the Curriculum Map actions and the generator page.

### 3. Unified Generator Refactor (controlled engine)

Edit `src/services/contentCreator/unifiedLessonGenerator.ts` and `src/pages/content-creator/UnifiedLessonGeneratorPage.tsx`:

- Generator entry now requires a `LessonBlueprint`. Manual freeform path is removed; if no blueprint context is present, page shows an empty state with "Open Curriculum Blueprint" CTA.
- Preload all blueprint fields into form state.
- Apply field-locking via `LOCKED_FIELDS` (disabled inputs with a lock icon + tooltip "Locked by curriculum"). `EDITABLE_FIELDS` remain interactive.
- New left rail "Curriculum Context" panel: lesson-state summary, curriculum alignment, prerequisite skills, review targets, adaptive configuration, prev/next lesson chips.
- Safety guard: before calling orchestrator, run `validateBlueprintIntegrity`; block on violation.

### 4. Curriculum Lesson Node Actions

Edit `src/components/creator-studio/steps/blueprint/CurriculumMap.tsx`:

Each lesson row gets a 7-action menu:
- Generate Lesson (primary) — full pipeline
- Open Generator — opens page with blueprint preloaded, no auto-run
- View Blueprint — modal showing JSON blueprint + relationships
- Generate Homework — runs homework-only stage
- Generate Games — runs gamification stage
- Generate Story — runs narrative-binder stage only
- Generate Review — generates spiral-review lesson tied to review_targets

Each action calls `loadLessonBlueprintFromCurriculum` then routes through the orchestrator with the appropriate stage filter.

### 5. Stage-Scoped Orchestrator Calls

Edit `src/orchestrator/index.ts` (or expose new wrapper `runLessonStage`):

- Accept `{ stages: 'all' | 'homework' | 'games' | 'story' | 'review' }`.
- Each stage runs the planner → governance → adaptive prefix, then only the requested generator(s), and persists into the same `curriculum_lessons` row (`content.homework_missions`, `content.slides`, `content.games`, etc.).

### 6. Lesson Pipeline Status System

Extend `useBlueprintLessonStatuses.ts` and `LessonStatusBadge.tsx`:

States: `draft | generated | validated | published | needs_review | adaptive_updated`.

Derivation rules:
- `draft` — no row in `curriculum_lessons`.
- `generated` — row exists, no validation_report.
- `validated` — verdict === 'publish' or 'repair' with stab pass.
- `published` — `is_published = true`.
- `needs_review` — verdict === 'repair' or 'block', or stab block.
- `adaptive_updated` — `ai_metadata.adaptive_layer.regenerated_at` newer than published_at.

Lesson nodes display 5 sub-status chips: generation, validation, homework, games, story, review (computed from `content.*` presence + each sub-report).

### 7. Curriculum Map UI Enhancements

In `CurriculumMap.tsx`:

- Tree view: Course → Units → Lessons → expandable Objectives / Grammar / Vocabulary / Review targets.
- Sub-status chip strip per lesson row.
- "View Blueprint" modal renders the master JSON object with locked vs editable fields visually separated.
- Unit rollup extended with homework/games/story counts.

### 8. Curriculum Safety Rules (centralized)

Add `src/services/contentCreator/curriculumSafety.ts`:

Single helper `assertCurriculumSafe(blueprint, draft)` enforces:
- grammar outside CEFR scope → block
- vocabulary overload (> cap per hub) → block
- topic switching (story theme drift vs unit theme) → warn
- lesson duplication (same blueprint hash already published) → block
- phonics mismatch (level vs hub matrix) → block
- disconnected activities (no link to communication_goal) → warn
- broken progression (prereq lesson not published) → warn

Called by both stage-scoped orchestrator runs and the generator page pre-flight.

### 9. Relationships

`getLessonRelationships` resolves prev/next/review/prerequisite from `masterCurriculum.ts`. Generator's left rail renders these as clickable chips that swap the active blueprint without leaving the page.

### Files to create
- `src/services/contentCreator/lessonBlueprint.ts`
- `src/services/contentCreator/curriculumBinding.ts`
- `src/services/contentCreator/curriculumSafety.ts`
- `src/components/creator-studio/steps/blueprint/LessonBlueprintModal.tsx`
- `src/components/creator-studio/steps/blueprint/LessonActionsMenu.tsx`
- `src/components/content-creator/CurriculumContextPanel.tsx`

### Files to edit
- `src/services/contentCreator/unifiedLessonGenerator.ts` (blueprint-only entry, stage filter)
- `src/pages/content-creator/UnifiedLessonGeneratorPage.tsx` (locking, context panel, empty state)
- `src/components/creator-studio/steps/blueprint/CurriculumMap.tsx` (new actions, tree, sub-status chips)
- `src/components/creator-studio/steps/blueprint/useBlueprintLessonStatuses.ts` (extended states + sub-statuses)
- `src/components/creator-studio/steps/blueprint/LessonStatusBadge.tsx` (new state variants)
- `src/orchestrator/index.ts` (stage-scoped runner)

### Out of scope
- No changes to `masterCurriculum.ts` data.
- No DB schema changes — reuse `curriculum_lessons.content` and `ai_metadata` JSONB.
- Pedagogical engines (planning, governance, adaptive, QA, stabilization) unchanged — only the entry surface and the binding layer change.
