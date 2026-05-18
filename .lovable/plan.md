# Update Curriculum Blueprint with Orchestrator + Stabilization signals

The blueprint UI (`BlueprintEngine` + `CurriculumMap`) currently shows only the AI-drafted unit/lesson scaffold. It has no awareness that, since the last cycle, every generated lesson:

- flows through `runLessonGeneration()` (orchestrator pipeline)
- passes through `runStabilization()` (stage 9.5)
- emits a `validation_report` (verdict `publish` | `repair` | `block`) stored on `curriculum_lessons.ai_metadata.unified_output`
- contributes longitudinal signals into `curriculum_stabilization_signals`

This update wires those signals back into the blueprint so creators can see, at a glance, the orchestrator/stabilization status of every lesson slot and act on it.

## 1. Per-lesson status badges (CurriculumMap)

For every lesson row, fetch the matching `curriculum_lessons` row by `(created_by, target_system, slot_cefr_level, slot_unit_number, slot_lesson_number)` and render:

- **Verdict pill** — `PUBLISH` (emerald) / `REPAIR` (amber) / `BLOCK` (rose) / `NOT GENERATED` (slate).
- **Stabilization chip** — `stab: pass` / `stab: repair (N applied)` / `stab: block` derived from `ai_metadata.unified_output.validation_report.stabilization`.
- **Slide count** — `12 slides` from `content.slides.length`.
- **State hash + generated-at** — small monospace caption.

Primary CTA flips:
- not generated → **Generate slides** (current behaviour)
- generated → **Re-generate** + **Open in player** + collapsible **Pedagogical health** (`PedagogicalHealthPanel` for that `lesson_id`)

## 2. Unit-level rollup

Each accordion header gains an inline rollup: `✅ 3 publish · ⚠ 1 repair · 🚫 0 block · ◻ 2 pending`. Computed from the unit's lesson statuses.

A unit-level button **Generate all lessons (Unified)** runs `generateUnifiedLesson()` sequentially for the unit's pending lessons, with a progress toast. Stops on a `block` verdict.

## 3. Curriculum header — orchestrator + stabilization health

Above the unit list, show a compact health bar:

- **Orchestrator version** (from any generated lesson's `unified_output.orchestrator_version`).
- **Publish gate** — `N / total lessons published`.
- **Stabilization signals** — count of unconsumed rows in `curriculum_stabilization_signals` for this `(hub, cefr_level)`, with a popover listing kind + severity (skill_imbalance, activity_fatigue, learner_fatigue, hub_drift). Read-only — these feed the next generation automatically at tier 6.

## 4. Data fetch hook

New `useBlueprintLessonStatuses(curriculum)` hook in `src/components/creator-studio/steps/blueprint/useBlueprintLessonStatuses.ts`:

- One query: `select id, content, ai_metadata, is_published, slot_unit_number, slot_lesson_number from curriculum_lessons where created_by = uid and target_system = X and slot_cefr_level = Y and (unit_number, lesson_number) in (...)`.
- Returns a `Map<string, LessonStatus>` keyed by `${unit_number}-${lesson_number}` with `{ lessonId, verdict, stabVerdict, repairsApplied, slideCount, stateHash, generatedAt, isPublished }`.
- Re-fetches after a unified generation completes (event bus or React Query invalidation — use a simple `refresh` callback exposed by the hook).
- One query for `curriculum_stabilization_signals` filtered by `hub + cefr_level + consumed_at IS NULL`.

## 5. No business-logic changes

- The orchestrator/stabilization pipeline itself is **untouched**.
- The unique slot key, save path, and `saveUnifiedLessonToLibrary()` already added are reused.
- No schema changes — both `pedagogical_quality_reports` and `curriculum_stabilization_signals` already exist.
- The Blueprint Engine's edge-function call (`generate-curriculum-blueprint`) stays as-is.

## Files touched

- `src/components/creator-studio/steps/blueprint/useBlueprintLessonStatuses.ts` — **new** hook.
- `src/components/creator-studio/steps/blueprint/CurriculumMap.tsx` — render statuses, rollups, header health bar, re-generate / open-in-player CTAs, inline `PedagogicalHealthPanel`.
- `src/components/creator-studio/steps/blueprint/LessonStatusBadge.tsx` — **new** small presentation component (verdict + stab pills).
- `src/components/creator-studio/steps/blueprint/CurriculumHealthBar.tsx` — **new** curriculum-level health summary.
- `src/components/creator-studio/steps/blueprint/UnitRollup.tsx` — **new** unit-level counters + "Generate all" action.
- `src/pages/content-creator/UnifiedLessonGeneratorPage.tsx` — emit a `window.dispatchEvent('unified-lesson-saved', ...)` after successful save so the blueprint can refresh on return.

## Acceptance

1. Opening the blueprint after generating lessons shows verdict + stab + slide-count pills on each row, with no extra clicks.
2. Each unit accordion header shows live rollups.
3. The curriculum header shows orchestrator version, publish gate (`x/y`), and unconsumed stabilization signal count with a hover popover.
4. **Re-generate** appears for already-generated lessons; clicking it reopens the unified generator prefilled with the same blueprint context.
5. **Generate all lessons (Unified)** at the unit level runs sequentially and updates row pills in real time.
6. No regressions to the existing Blueprint generation, save, or per-hub creator flow.
