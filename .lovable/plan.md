# Master Library ↔ Creators: Two-Way Binding & Hub Tabs

## What we have today (verified)

- `curriculum_lessons` is the canonical lessons table. Hub is stored as `target_system` (`kids`/`teen`/`adult`) — there is **no** `hub_type` column. Mapping helpers (`targetSystemToHub` / `HUB_TO_TARGET_SYSTEM`) already exist in `LibraryManager.tsx`, `useCreatorLesson.ts`, and `persistLesson.ts`.
- `LibraryManager.tsx` is the Master Library. It already groups by Hub → Level → Unit, has a hub filter row (`All / Playground / Academy / Success`), bulk delete, search, and a kind filter. **Edit** today calls `setActiveLessonData()` + `setCurrentStep('slide-builder')` — it does **not** smart-route to the hub-specific creators.
- `AcademyCreator.tsx` and `PlaygroundCreator.tsx` already:
  - read `?lessonId=` from `useSearchParams`
  - call `useCreatorLesson({ hub, initialLessonId })` which fetches the row and exposes `saveDraft` / `publish` (upsert against `curriculum_lessons`)
  - inject the lesson title / level / slides into editor state
- Blueprint persistence (`persistBlueprint.ts`) already inserts lesson rows tagged with the right `target_system` per module hub.
- Routes: `/playground-creator`, `/academy-creator` (also nested under `/content-creator/*`).

## Decision: keep `target_system` as the source of truth

Adding a duplicate `hub_type` column would diverge from every existing hook, RLS policy, and query. Instead we treat **`hub_type` as a derived alias** of `target_system` everywhere the user spec mentions it (`kids→playground`, `teen→academy`, `adult→success`). No migration required.

## Part 1 — Smart routing from the Master Library

In `src/components/creator-studio/steps/LibraryManager.tsx`:

- Replace `handleEdit(row)` so it routes by hub instead of switching the inner step:
  - `playground` → `navigate('/playground-creator?lessonId=' + row.id)`
  - `academy`    → `navigate('/academy-creator?lessonId=' + row.id)`
  - `success` / other → keep the existing in-shell `slide-builder` flow (no dedicated Success creator yet) and pre-load `setActiveLessonData` as today.
- Use `react-router-dom`'s `useNavigate`. Keep the existing `setActiveLessonData` call as a fallback for the success/standard branch only.

## Part 2 — Tabbed Master Library with dynamic columns

Still in `LibraryManager.tsx`:

- Promote the current pill row to a proper **Tabs** bar directly under the page title (using existing `@/components/ui/tabs` for accessibility):
  - `All Lessons · Playground (Kids) · Academy (Teens) · Success (Adults)`
  - Active tab gets the hub accent underline (`HUB_HEADER_GRADIENT[hub]`); inactive tabs are muted.
- Drive the existing `hubFilter` state from the Tabs `value`. Persist filter selection in URL (`?hub=playground`) via `useSearchParams` so deep links work.
- **Hub-specific columns / chips on the lesson cards:**
  - Academy & Success: show the CEFR badge (`A1…C2`) — already rendered, keep as-is.
  - Playground: hide the CEFR chip on the card and the level grouping label (the lesson card stays clean — only the unit + lesson number show).
- **"Create New Lesson" smart routing**: add a primary CTA in the header bar. When clicked:
  - if `hubFilter === 'playground'` → `navigate('/playground-creator')`
  - if `hubFilter === 'academy'` → `navigate('/academy-creator')`
  - if `hubFilter === 'success'` → in-shell `slide-builder` (Success uses the standard studio)
  - if `hubFilter === 'all'` → small popover offering the three hub choices.

## Part 3 — Tighten data binding in the creators

`useCreatorLesson.ts` already does the upsert, but a few gaps to close:

- On insert, also write `ai_metadata.hub` and `ai_metadata.cefr_level` so the Library's `resolveCefr()` shows the correct CEFR (today only `difficulty_level` is set, which downgrades CEFR display).
- After `publish` / `saveDraft`, change the toast copy to `"✅ Saved to Master Library"` to match the spec.
- After insert, mirror the new `lessonId` into `?lessonId=` (already done in both creators) and also invalidate `['curriculum-lessons-library']` (already done) — no change needed.
- Standardize: when `meta.level` is a CEFR code (`A1…C2`), store it both in `difficulty_level` (mapped to enum via the same `cefrToDifficulty` used by `persistLesson.ts`) and in `ai_metadata.cefr_level`. Today the hook writes the raw CEFR string into `difficulty_level`, which violates the enum check on some rows — extracting the existing helper into a small shared util (`src/services/lessonHubMapping.ts`) and reusing it from both `persistLesson.ts` and `useCreatorLesson.ts`.

## Part 4 — Blueprint → Library guarantee

`persistBlueprint.ts` already tags each generated lesson with the module's hub via `target_system`. We'll add an `ai_metadata.hub` mirror to the insert payload so the new Library tabs filter blueprint-generated lessons correctly without relying on the enum mapping alone.

## Files touched

- `src/components/creator-studio/steps/LibraryManager.tsx` — smart routing in `handleEdit`, Tabs UI, URL-synced `hubFilter`, dynamic CEFR column, "Create New" CTA.
- `src/hooks/useCreatorLesson.ts` — write `ai_metadata.hub` + `cefr_level`, normalize `difficulty_level`, updated toast copy.
- `src/services/lessonHubMapping.ts` *(new, tiny)* — single source for `hubToTargetSystem`, `targetSystemToHub`, `cefrToDifficulty`.
- `src/components/creator-studio/persistLesson.ts` — import helpers from the new mapping module.
- `src/components/creator-studio/persistBlueprint.ts` — add `ai_metadata.hub` mirror on lesson inserts.

No DB migration. No breaking changes to existing rows; older lessons without `ai_metadata.hub` still resolve via `target_system`.

## Acceptance checks

1. Edit a `kids` lesson from the Library → lands on `/playground-creator?lessonId=…` with title, level, and slides preloaded.
2. Edit a `teen` lesson → lands on `/academy-creator?lessonId=…`.
3. Save Draft / Publish in either creator → row updates in place, toast reads "✅ Saved to Master Library", and the Library list refreshes.
4. Tabs filter correctly; CEFR column hidden on Playground tab.
5. "Create New Lesson" inside Playground tab opens `/playground-creator` with no `lessonId`.
6. Blueprint-generated lessons appear under the correct Hub tab immediately.
