# Integrate Unified Generator into the Curriculum Blueprint

Today the Curriculum Blueprint (`BlueprintEngine` → `CurriculumMap`) and the Unified Lesson Generator (`UnifiedLessonGeneratorPage`) live as two disconnected surfaces:

- **Blueprint** drafts a multi-unit curriculum and routes each lesson to the per-hub creators (`/playground-creator`, `/academy-creator`, `/success-creator`).
- **Unified Generator** is opened manually from the sidebar, with all blueprint fields typed by hand, and never persists its output to `curriculum_lessons`.

We will make the Unified Generator the single, controlled engine that produces slides for every blueprint lesson, while keeping the existing blueprint UX intact.

## 1. Blueprint → Unified handoff

In `CurriculumMap.tsx`, add a new primary action **"Generate slides (Unified)"** on every lesson row (alongside the current per-hub button, which becomes a secondary "Open in hub creator" option).

Clicking it will:

1. Build a `UnifiedLessonInput.blueprint` from the lesson + parent unit:
   - `title` ← lesson.title
   - `theme` ← unit.theme (fallback: curriculum theme_hint)
   - `grammarFocus` ← [lesson.skill_focus] (split on `/` or `,`)
   - `targetVocab` ← pulled from `plan-lesson-blueprint` (same edge function already used for prefill)
   - `communicationGoal` ← lesson.objective
   - `reviewTargets` ← previous lesson titles in the same unit
2. Stash everything in `CreatorContext.activeLessonData` plus a new `activeBlueprintContext` field (unit_id, lesson_id, cefr, hub, unit metadata).
3. Navigate to `/content-creator/unified-generator`.

## 2. Make UnifiedLessonGeneratorPage blueprint-aware

`UnifiedLessonGeneratorPage`:

- On mount, read `activeLessonData` + `activeBlueprintContext` via `useCreator()` and prefill **all** form fields (hub, CEFR, title, theme, vocab, grammar, goal, review targets).
- Show a "From blueprint" header chip with unit/lesson numbers and a **Back to blueprint** button.
- Lock `hub` and `cefr` when arriving from the blueprint (they're already constrained by the curriculum), with an "unlock" affordance for explicit overrides.
- Standalone (sidebar) entry keeps today's free-form behavior.

## 3. Persist Unified output back to `curriculum_lessons`

After a successful `generateUnifiedLesson()` whose `validation_report.verdict !== 'block'`:

- Add `saveUnifiedLessonToLibrary()` in `src/services/contentCreator/unifiedLessonGenerator.ts` that **updates** the row keyed by `(created_by, target_system, slot_cefr_level, slot_unit_number, slot_lesson_number)` (the same upsert key `CurriculumMap` already uses), writing:
  - `content` ← `{ slides: output.slides, homework_missions: [] }`
  - `ai_metadata.unified_output` ← `{ lesson_state, pronunciation_layer, phonics_layer, adaptive_layer, gamification_layer, validation_report, orchestrator_version, state_hash }`
  - `is_published` ← `verdict === 'publish'` (otherwise leave false; `repair` requires manual review)
- Surface the result in `PedagogicalHealthPanel`, which already reads `pedagogical_quality_reports` (no schema change needed).

A **Save to library** button appears once `output` is present and verdict allows it. It calls the new helper and toasts the row count.

## 4. Reuse the same engine inside per-hub creators (consolidation)

The Playground/Academy/Success creator pages keep their UI shells but route their "Generate" action through `generateUnifiedLesson()` with their hub hardcoded. This is the contract the brief requires ("All creators MUST use the same underlying lesson generation engine"). No visual changes to those pages — only the internal call site.

## 5. CreatorContext additions

Add to `CreatorContext`:

```ts
activeBlueprintContext: {
  unit_number: number;
  unit_title: string;
  unit_theme?: string;
  lesson_number: number;
  curriculum_title: string;
  hub: HubType;
  cefr_level: CEFRLevel;
  previous_lesson_titles: string[];
} | null;
setActiveBlueprintContext: (ctx) => void;
```

Set when "Generate slides (Unified)" is clicked, cleared when returning to the blueprint.

## 6. Non-goals

- No schema changes — we reuse `curriculum_lessons` and `pedagogical_quality_reports`.
- No edge-function changes — Unified Generator already proxies through `gemini-proxy`.
- The orchestrator pipeline, stabilization stage, governance, and hub configs are untouched.
- Sidebar nav, routes, and the existing per-hub creator UIs stay as-is.

## Files touched

- `src/components/creator-studio/CreatorContext.tsx` — add `activeBlueprintContext`.
- `src/components/creator-studio/steps/blueprint/CurriculumMap.tsx` — new "Generate slides (Unified)" action, prefetch vocab via existing `plan-lesson-blueprint`.
- `src/pages/content-creator/UnifiedLessonGeneratorPage.tsx` — read blueprint context, prefill + lock fields, add "Back to blueprint" and "Save to library" buttons.
- `src/services/contentCreator/unifiedLessonGenerator.ts` — add `saveUnifiedLessonToLibrary()`.
- `src/pages/PlaygroundCreator.tsx`, `src/pages/AcademyCreator.tsx`, `src/pages/SuccessCreator.tsx` — route their internal generate action through `generateUnifiedLesson()` (preserving their UI).

## Acceptance

1. From the blueprint, clicking a lesson's **Generate slides (Unified)** opens the unified page with hub, CEFR, title, theme, vocab, grammar, goal, and review targets all prefilled.
2. Generating produces a `UnifiedLessonOutput` whose slides + validation report are visible.
3. **Save to library** updates the matching `curriculum_lessons` row with slides and `ai_metadata.unified_output`, with no duplicates (relies on the existing unique slot index).
4. Returning to the blueprint shows the lesson as saved.
5. The Playground/Academy/Success creators produce slides via the same `generateUnifiedLesson()` path.
