## Final Architecture Sync — Plan

Work is grouped by area. Each item lists files + behavior.

### 1. Student Interests / Specific Needs (Creative Anchor)

- Extend `LessonBlueprint` with optional `interests: string` and `specific_needs: string`.
  - File: `src/components/creator-studio/shared/LessonBlueprintPanel.tsx`
  - Add two new textarea-style inputs under Grammar Focus: "Student Interests" (e.g. "football, Pokemon") and "Specific Needs" (e.g. "shy speaker, dyslexic, exam prep").
  - Persisted via existing `onChange(blueprint)` → already saved to `lesson_metadata` through `useCreatorLesson.saveDraft`.

- Plumb `interests` + `specific_needs` into all generation/rewrite functions:
  - `supabase/functions/plan-lesson-blueprint/index.ts` — accept `interests`, return blueprint biased toward those topics.
  - `supabase/functions/sync-slides-to-blueprint/index.ts` — accept and inject as a "Creative Anchor" instruction in the system prompt.
  - `supabase/functions/rewrite-slide-field/index.ts` — same.
  - `supabase/functions/generate-canvas-game/index.ts` — same.
  - Frontend: update `WandFieldButton` props to forward `interests`/`needs` from the blueprint (already passed) — no API change.
  - In `PlaygroundCreator`, `AcademyCreator`, `SuccessCreator` `generateWithAI`, include `interests` and `specific_needs` in the `ai-lesson-content-generator` payload (creative anchor field).

### 2. Smart Sidebar Logic

- File: each `*Creator.tsx` left column ("Slide Navigator").
- Blueprint pinned to top (already true). Below it, redesign the slide list:
  - Add a `slideIcon(type)` helper in a new `src/components/creator-studio/shared/slideIcons.tsx`:
    - storybook → `BookOpenText`, canvas_game/living_canvas → `Gamepad2`, vocab/vocab_solo → `Sparkles`, scaffolded_media → `Film`, multiple/truefalse/fill → `CheckSquare`, intro/lesson_summary → `Flag`, default → `Square`.
  - Render the icon inline before the slide title in each thumbnail row.
- Add an "insert between" affordance:
  - New component `src/components/creator-studio/shared/InsertSlideButton.tsx` — a thin `+` chip that appears on hover between two slides; opens a small popover (Storybook, Media Analyzer, Canvas Game, Blank).
  - Wire to the existing `makeSlide(type)` helpers in each creator and `setSlides((p) => insertAt(p, index, newSlide))`.

### 3. Component Polish

- **Solo Vocab default**: in each creator's `addSlide` and `makeSlide`, when the user picks `vocab` for Playground default to `vocab_solo`. For Academy/Success, expose `vocab_solo` in the `SLIDE_TYPES` picker (Playground already does) and migrate any legacy `vocab` slide rendering to `SoloVocabCard` via the existing `UniversalMediaShell` wrapper in `*Demo.tsx`.

- **Success "Executive" styling**:
  - `src/components/creator-studio/shared/hubTheme.ts` — confirm Success uses dark navy background + serif heading (already configured); verify `PlayablePreviewPane` and `SoloVocabCard` consume `HUB_THEME.success`.
  - In `SuccessCreator` left/right rails, switch labels and chips from emerald-only to navy + amber accent for the "executive" feel.
  - **Time Buffer slots**: in `SuccessCreator` after `generateWithAI` and after `publish`, ensure final slide is a `time_buffer` block (3 min wrap-up). Add a `time_buffer` slide type to `SuccessDemo.tsx` slides + renderer if missing.

- **Takeaway / Recap slide**: ensure every generated lesson ends with `lesson_summary` (Academy/Success) or a celebratory `cool_off` slide (Playground).
  - In each creator's post-generate normalization step (after AI returns slides), if last slide isn't `lesson_summary`/`cool_off`, append one auto-built from blueprint vocabulary + grammar.

### 4. Media Error Handling — Retry button

- File: `src/components/creator-studio/shared/UniversalMediaShell.tsx`.
  - Track `image_error?: string` and `audio_error?: string` on the slide via `onPatch`.
  - On image/audio generation failure (caught in `SlideMediaPanel`), set the error flag.
  - In the preview overlay, when `image_error` or `audio_error` exists, render a "⚠ Generation failed — Retry" button that re-invokes the same generator with the same args.
- File: `src/components/creator-studio/shared/SlideMediaPanel.tsx` — expose a `retry()` function via a small registry stored on `window.__creatorRetry[slideId]` OR (cleaner) accept a `retryRef` prop and forward it to the shell. We'll go with a `useRetryRegistry` hook in `shared/useRetryRegistry.ts`.

### 5. Navigation & Save Verification

- "Back to Dashboard" already exists in all three creators (`ArrowLeft` button at top-left → `/content-creator`). Audit each creator for visibility on small viewports; make button always visible by adding `flex-shrink-0`.
- Save Draft already pushes `{ slides, metadata: { title, level, blueprint } }` via `useCreatorLesson.saveDraft`. Extend `useCreatorLesson` to also persist `interests` + `specific_needs` (already covered when blueprint contains them — no extra work).
- Add a smoke test: after Save Draft, re-fetch the lesson and assert `metadata.lesson_blueprint.interests === entered value`. Done via a one-shot `console.assert` in dev mode in `useCreatorLesson` (gated by `import.meta.env.DEV`).

## Technical Notes

- **No DB migration required** — `lessons.content`/`metadata` are JSONB; new fields piggy-back on existing columns.
- **Edge functions affected**: `plan-lesson-blueprint`, `sync-slides-to-blueprint`, `rewrite-slide-field`, `generate-canvas-game`, `ai-lesson-content-generator` — all updated to accept and forward the Creative Anchor (`interests`, `specific_needs`).
- **No hardcoded prompts on the client** — all AI prompt assembly stays in the edge functions.
- **Backwards compatible**: missing `interests`/`specific_needs` falls back to current behavior.

## Files To Create

- `src/components/creator-studio/shared/slideIcons.tsx`
- `src/components/creator-studio/shared/InsertSlideButton.tsx`
- `src/components/creator-studio/shared/useRetryRegistry.ts`

## Files To Edit

- `src/components/creator-studio/shared/LessonBlueprintPanel.tsx`
- `src/components/creator-studio/shared/UniversalMediaShell.tsx`
- `src/components/creator-studio/shared/SlideMediaPanel.tsx`
- `src/components/creator-studio/shared/hubTheme.ts`
- `src/pages/PlaygroundCreator.tsx`, `AcademyCreator.tsx`, `SuccessCreator.tsx`
- `src/pages/SuccessDemo.tsx` (add `time_buffer` if missing)
- `src/hooks/useCreatorLesson.ts` (DEV-only assertion)
- `supabase/functions/plan-lesson-blueprint/index.ts`
- `supabase/functions/sync-slides-to-blueprint/index.ts`
- `supabase/functions/rewrite-slide-field/index.ts`
- `supabase/functions/generate-canvas-game/index.ts`
- `supabase/functions/ai-lesson-content-generator/index.ts` (if it accepts blueprint, add interests passthrough)

## Out Of Scope

- No new tables or RLS changes.
- No changes to student-facing players (only the Creator Studio + edge functions).
