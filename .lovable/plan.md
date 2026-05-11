## Goal
Add four new gamified interactive slide types — `drag_and_drop_sorting`, `matching_lines`, `tracing_canvas`, `spinner_wheel` — end-to-end: AI blueprint schema → slide generator → renderer → blueprint preview badges.

## Phase 1 — AI Schema (edge functions)

**`supabase/functions/plan-lesson-blueprint/index.ts`**
- Extend the allowed `slide_type` whitelist (lines 102–103 and 134) to include the four new types.
- Add a `GAMIFIED ACTIVITY CATALOG` block to the system prompt with required `activity_data` shapes:
  - `drag_and_drop_sorting` → `{ categories: string[], draggable_items: { text, category }[] }`
  - `matching_lines` → `{ left_column: string[], right_column: string[], pairs: [li, ri][] }`
  - `tracing_canvas` → `{ target_letters: string[], font_style?: 'print'|'cursive' }` (Pre-A1 / Playground)
  - `spinner_wheel` → `{ wheel_segments: string[], prompt_template?: string }`
- Tier hint: tracing/spinner default Pre-A1/A1; sorting/matching bias A2+.
- Add: "REQUIRED — every practice phase must use one of the gamified types when appropriate."

**`supabase/functions/generate-ppp-slides/index.ts`**
- Mirror the four `slide_type` values in the slide-generation prompt with example payloads to lock the JSON shape.

## Phase 2 — UI components & renderer mapping

Create under `src/components/lesson-player/activities/`:
- `DragAndDropSlide.tsx` — categories + draggable items, scores correct/incorrect.
- `MatchingLinesSlide.tsx` — two columns, SVG line connectors.
- `TracingSlide.tsx` — `<canvas>` with faded target letter, stroke-coverage tracking, Playground-styled.
- `SpinnerWheelSlide.tsx` — animated wheel; on stop hands off the chosen word to existing `SpeakingPractice`.

All four components: signature `{ slide, hub, onCorrect, onIncorrect, onComplete }` matching `EditorialSortingGame` / `DragAndMatch`. Read payload from `slide.activity_data ?? slide.interactive_data`.

**`src/components/lesson-player/DynamicSlideRenderer.tsx`**
- Add the four keys to `INTERACTIVE_REQUIRED_KEYS`:
  - `drag_and_drop_sorting: ['categories', 'draggable_items']`
  - `matching_lines: ['left_column', 'right_column']`
  - `tracing_canvas: ['target_letters']`
  - `spinner_wheel: ['wheel_segments']`
- Add four new branches to the `directorType` switch (~line 408) rendering the new components.

## Phase 3 — Blueprint preview badges

In `src/components/creator-studio/shared/LessonBlueprintPanel.tsx` (and any inline preview in `BlueprintEngine` / `CurriculumMap`):
- Add a `SLIDE_TYPE_META` lookup `{ icon, label, color }` per slide_type using lucide icons: `MousePointerClick` (sorting), `GitCompareArrows` (matching), `Pencil` (tracing), `Disc3` (spinner) plus existing types.
- Render icon + colored badge next to each `lesson_structure` row.
- Use hub theme tokens — no raw colors — so badges respect Playground/Academy/Success palettes.

## Verification
- Call `plan-lesson-blueprint` Pre-A1 Playground → returns `lesson_structure` containing `tracing_canvas` and `spinner_wheel`.
- Call `generate-ppp-slides` from that blueprint → resulting slides contain matching `activity_data` keys.
- Open the lesson in the player → each component renders, scores, advances.
- Regenerate a blueprint in Creator Studio → preview shows new colored badges.

## Out of scope
- No DB schema changes (`slide_type` is free text).
- No edits to existing `EditorialSortingGame` / `DragAndMatch` components.
- No new audio wiring; spinner reuses existing `SpeakingPractice` flow.
