## Success Creator — Plan

Build `/success-creator`: a teacher-facing slide authoring tool for the Success Hub demo, mirroring `AcademyCreator` 1:1 in capability (AI generation, autosave, library, marketplace, templates, JSON edit, classroom launch) but themed and defaulted for adult Business English.

### Files to create

1. **`src/data/successLessons/makingRequestsAtWork.ts`** — preloaded 32-slide B1 lesson exported from the Success demo (extracted from `SuccessDemo.tsx`'s `SLIDES` array) so the creator opens with content, matching how Academy uses `socialMediaHabits.ts`.

2. **`src/pages/SuccessCreator.tsx`** — full creator (1k LOC, mirrors `AcademyCreator.tsx`):
   - Imports `Slide`, `Block`, `BLOCKS`, `SlideRenderer`, `themeMap`, `ClusterActivity` from `./SuccessDemo`.
   - `SLIDE_TYPES` array adapted for Success's 18 slide types (intro, question, opinion, vocab, matching, reading_passage, listening, multiple, tone_compare, functional_pattern, rewrite, fill_blank, cluster, scenario, email_task, role_play, speaking_task, reflection).
   - `makeSlide(type)` returns sensible Business English defaults for each type.
   - `SlideEditor` switch handles every Success slide type (including the new `tone_compare`, `functional_pattern`, `rewrite`, `scenario`, `email_task`).
   - Mint/emerald palette throughout (`bg-emerald-50`, `border-emerald-500`, `text-emerald-700`, gradient `from-emerald-500 to-teal-600`) replacing Academy's indigo/purple.
   - Header label: "Success · Slide Creator". Default duration 60 min. CEFR options A2/B1/B2/C1.
   - Wires identical features used by Academy: `useCreatorLesson({ hub: 'success' })`, `useAutoSave`, `useRevisionHistory`, `SlideMediaPanel`, `PreviewModeToggle`, `PlayablePreviewPane`, `AssetVaultDialog`, `SlideTemplatesDialog`, `BulkActionsMenu`, `BulkAudioDialog`, `DifficultyTunerDialog`, `ImportFromTextDialog`, `PublishTemplateDialog`, `RevisionHistoryModal`, `SaveStatusBadge`, `SlideCommentsPanel`.
   - "Open in Classroom" → stashes deck on `window.__SUCCESS_DECK__` and navigates to `/success-demo` (no Success classroom page exists yet — re-uses the demo for now, same pattern Academy used initially).
   - AI generation calls `generate-ppp-slides` edge function with `hub: 'success'`, `target_hub: 'success'`, `hub_type: 'success'`, reads `data?.success_slides` (falls back to `academy_slides` shaped output for resilience).

### Files to modify

3. **`src/hooks/useCreatorLesson.ts`** — extend `CreatorHub` union to include `'success'`; update the description toast string to handle success ("Success Hub lesson"); leave the 60-min default since success is also 60-min.

4. **Shared component hub unions** — widen the `hub` prop type from `'playground' | 'academy'` to `'playground' | 'academy' | 'success'` in:
   - `PublishTemplateDialog.tsx`, `SlideCommentsPanel.tsx`, `PreviewModeToggle.tsx`, `PlayablePreviewPane.tsx`, `AssetVaultDialog.tsx`, `BulkActionsMenu.tsx`, `DifficultyTunerDialog.tsx`, `SlideMediaPanel.tsx`.
   - Each will only need a tiny addition (e.g. a fallback case treating `'success'` like `'academy'` for color tokens until proper Success theming is added per-component).

5. **`src/App.tsx`** — lazy-import `SuccessCreator`; add route `/success-creator`.

6. **`src/components/creator-studio/StudioSidebar.tsx`** (if it lists hub creators) — add a Success entry alongside Playground/Academy.

7. **`src/components/creator-studio/steps/LibraryManager.tsx`** — extend the smart-route `handleEdit()` so `success` lessons route to `/success-creator?lessonId=...`. Already filters by Success tab; just need the routing branch.

### Out of scope (future)

- Dedicated `SuccessClassroom.tsx` page (re-uses `/success-demo` for now).
- Per-component Success color tokens inside the shared components (they'll fall through to Academy tokens visually until a follow-up pass).
- `success_slides` server field in `generate-ppp-slides` — function will be called with the right `hub_type` flag; if it doesn't yet emit a `success_slides` key, the call will fail gracefully with a toast, which the user can then ask us to wire on the edge-function side.

### Why this design

- Mirrors the Academy creator exactly so teachers get a consistent authoring experience across hubs.
- No DB migration required — `target_system='adult'` already exists and the lesson table accepts the existing `ai_metadata.hub='success'` payload via `lessonHubMapping.ts`.
- Hub-prop widening is the minimum diff needed to reuse the entire Studio toolkit instead of duplicating it.
