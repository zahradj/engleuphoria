## Goal

Merge the rich lesson-architecture from the standalone Slide Studio (`steps/slide-studio/*`) into the three Hub Creators (Playground / Academy / Success) **without changing any of their visual layout, CSS, or component arrangement**. Once the Hub Creators own the advanced sequencing engine, retire the `/content-creator/slide-builder` route and its files.

---

## Phase 1 — Merge the Blueprint Schemas

**Current state**
- Hub Creators use a thin local `LessonBlueprint` shape: `{ vocabulary[5], grammar, target_phonics, interests, specific_needs }`.
- Slide Studio's canonical schema (`steps/slide-studio/blueprintTypes.ts`) is much richer: `pedagogical_framework`, `framework_rationale`, `phases[]` (ordered `LessonPhase` sequence), `video_strategy`, `final_speaking_mission`, etc.
- The edge function `generate-ppp-slides` already understands `phases[]` and `LESSON_PHASES`, but the Hub Creators never send them.

**Changes**
1. Promote `steps/slide-studio/blueprintTypes.ts` to a shared module (e.g. `src/components/creator-studio/shared/blueprintTypes.ts`) and re-export from the old path so Slide Studio keeps working.
2. Extend the Hub Creator local `LessonBlueprint` to a **superset** that includes the Slide Studio fields (`pedagogical_framework`, `framework_rationale`, `phases`, `video_strategy`, `final_speaking_mission`, `reading_passage_summary`, etc.) while preserving the existing fields (`vocabulary`, `grammar`, `target_phonics`, `interests`, `specific_needs`) so the existing sidebar inputs keep binding to the same keys.
3. Update `plan-lesson-blueprint` (edge function) so its JSON output contract additionally returns `pedagogical_framework`, `framework_rationale`, and a `lesson_structure` (= ordered `phases[]` plus per-phase slide-type hints derived from Slide Studio's `FRAMEWORK_DEFAULTS` and `SLIDE_TYPES`). Per-hub defaults:
   - Playground → `Immersion` framework, kid-safe slide types.
   - Academy → AI-chosen framework, teen slide types.
   - Success → `TaskBased` framework, professional slide types.
4. In each Hub Creator (`PlaygroundCreator.tsx`, `AcademyCreator.tsx`, `SuccessCreator.tsx`), capture the new fields into state when `plan-lesson-blueprint` returns. **No JSX/CSS changes** — only the in-memory blueprint shape grows.
5. Hydration from `location.state` (post Curriculum Blueprint hand-off) and from `ai_metadata.lesson_blueprint` is updated to read/write the new fields.

**Backwards compatibility**
- All new fields are optional; old lessons hydrate fine.
- `isBlueprintReady` updated to accept the merged shape.

---

## Phase 2 — Upgrade the "Generate Slides" Engine in the Hubs

**Current state**
- `generateWithAI()` in each Hub Creator calls `plan-lesson-blueprint` → `generate-ppp-slides`, but does not forward `phases`, `pedagogical_framework`, or `lesson_structure`. The edge function falls back to a hardcoded sequence.

**Changes**
1. Update each Hub Creator's `generateWithAI()` to forward the merged blueprint into `generate-ppp-slides` body:
   ```
   blueprint: { ...bp, phases, pedagogical_framework, video_strategy, lesson_structure }
   ```
2. Update `generate-ppp-slides` to:
   - Treat `blueprint.lesson_structure` (or `phases[]`) as the **authoritative** slide sequence.
   - For each entry, emit a slide whose `lesson_phase` and `type` come from the structure, but whose **rendering shape** still matches the existing per-hub Slide schema already consumed by Playground/Academy/Success (i.e. the same `Slide` union types each hub already renders today). No new slide components are introduced.
3. After receiving the response, the existing `setSlides(...)` flow stays identical; the existing styled components (`SlideCanvas`, mascot, drag-and-drop, flashcards, etc.) render the new sequence with the Hub's existing theme.
4. Verify via `supabase--curl_edge_functions` for one sample of each hub that the returned slides:
   - Honor the requested `phases[]` order.
   - Use slide `type`s already supported by that hub's renderer.

**Explicitly NOT changing**
- No edits to JSX structure, Tailwind classes, layout grids, sidebar arrangement, modals, or styling tokens in `PlaygroundCreator.tsx`, `AcademyCreator.tsx`, `SuccessCreator.tsx`.

---

## Phase 3 — Retire the Standalone Slide Studio

**Dependencies to migrate first** (currently route to `/content-creator/slide-builder`):
- `steps/TrialCreator.tsx` — on success, navigates to `slide-builder`.
- `steps/StoryCreator.tsx` — same.
- `steps/LibraryManager.tsx` — `handleCreateNew('all')` and `handleEdit` for non-hub lessons fall back to `slide-builder`.

**Migration**
1. Route those flows to the matching Hub Creator using the existing `detectLessonHub` / `creatorPathFor` helpers (default `academy` when unknown), passing `?lessonId=` so the hub hydrates from DB.
2. Remove `slide-builder` from:
   - `CreatorContext.tsx` `CreatorStep` union.
   - `CreatorStudioShell.tsx` route mapping and component switch.
   - `StudioSidebar.tsx`, `StudioMobileNav.tsx`, `StudioHeader.tsx` nav entries and labels.
   - `ContentCreatorSidebar.tsx` step union.

**Deletions** (after the above compiles cleanly)
- `src/components/creator-studio/steps/SlideStudio.tsx` (1-line re-export).
- `src/components/creator-studio/steps/slide-studio/` entire directory **except** `blueprintTypes.ts` (already moved in Phase 1) and any utility still imported by hubs (`phaseTheme.ts`, `mediaGeneration.ts`, `uploadSlideAsset.ts`, `PhaseTracker`-related helpers — audit first; move to `shared/` if reused).

**Route cleanup**
- Remove the in-shell `/content-creator/slide-builder` (handled by `CreatorStudioShell`'s path matching). No `App.tsx` route to delete (none exists today for `slide-builder` directly).

---

## Verification Checklist

- [ ] Visual diff of Playground/Academy/Success Creator pages: pixel-identical to before.
- [ ] `plan-lesson-blueprint` returns merged schema including `phases` and `pedagogical_framework`.
- [ ] `generate-ppp-slides` honors `blueprint.lesson_structure` order.
- [ ] Trial, Story, Library "create new" all land in a Hub Creator with the lesson hydrated.
- [ ] No remaining import of `steps/slide-studio/SlideStudio` anywhere in `src/`.
- [ ] Build passes; `rg "slide-builder" src` returns zero matches.

---

## Technical Notes

- Shared types live under `src/components/creator-studio/shared/` to keep import paths short.
- Edge-function changes are additive (new optional fields in request body, richer JSON response). Old callers continue to work.
- Slide rendering components in each Hub are untouched; only the **data feeding them** is enriched, satisfying the "do not change UI" constraint.
