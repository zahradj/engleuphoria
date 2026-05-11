## Goal

Embed the full **Slide Studio** experience (Blueprint planner + Slide Builder + Library access) inside each of the three Hub Creators (Playground / Academy / Success), and remove the top-level **Slide Studio** (and shared **Blueprint**) entries from the Content Creator dashboard sidebar so authoring always happens inside a hub-branded workspace.

## Current state

- `CreatorStudioShell` switches the right pane based on `currentStep`: `blueprint`, `slide-builder`, `playground-creator`, `academy-creator`, `success-creator`, `trial`, `story`, `library`.
- `StudioSidebar` + `StudioMobileNav` expose all 8 entries.
- `BlueprintEngine` (curriculum planner) and `SlideStudio` (slide builder with `BlueprintReview`, `SlideCanvas`, `TeacherControlsPanel`, `mediaGeneration`, hub-override preview) are used from those top-level entries.
- `PlaygroundCreator` / `AcademyCreator` / `SuccessCreator` are big standalone pages with their own slide editor UIs — they currently do NOT host the Blueprint planner nor reuse `SlideStudio`.
- The `CreatorContext` already carries `hub: HubType`, `curriculumData`, `activeLessonData`, etc. — so all three hubs share one state container.

## Plan

### 1. New shared component: `HubCreatorWorkspace`

Path: `src/components/creator-studio/HubCreatorWorkspace.tsx`

A hub-aware wrapper that renders an internal **tabbed workspace** with the full Slide Studio toolchain:

- **Tabs** (using existing `Tabs` from `@/components/ui/tabs`):
  1. `Blueprint` → renders `BlueprintEngine`
  2. `Slide Studio` → renders `SlideStudio` (the existing `slide-studio/SlideStudio.tsx`)
  3. `Library` → renders `LibraryManager` filtered by hub
- Accepts `hub: 'playground' | 'academy' | 'success'` prop.
- On mount, calls `setHub(hub)` on `CreatorContext` so every downstream component (BlueprintEngine, SlideStudio, AI prompts, hub theme) is locked to the correct hub.
- Applies the hub theme wrapper (same `useHubTheme` pattern SlideStudio already uses) so the workspace gets Playground orange / Academy purple / Success emerald branding.
- Auto-switches active tab from `Blueprint` → `Slide Studio` when the user clicks "Build Slides" on a blueprint lesson (uses existing `setCurrentStep('slide-builder')` logic by hooking into context changes).
- Defaults to the `Blueprint` tab.

### 2. Wire each hub route to the new workspace

Replace the body of these three pages with `<HubCreatorWorkspace hub="..." />`:

- `src/pages/PlaygroundCreator.tsx` → `hub="playground"`
- `src/pages/AcademyCreator.tsx` → `hub="academy"`
- `src/pages/SuccessCreator.tsx` → `hub="success"`

The legacy custom slide-editor JSX in those files is replaced because all of its functionality (and more) is now provided by the embedded `SlideStudio`. Per the user's confirmation, this is the desired consolidation.

> **Note for review:** the existing hub creator pages contain ~1.1–1.4k lines of bespoke editor code. Some hub-specific helpers (e.g. `generateOnePlaygroundImage`, hub-flavoured slide templates) will be migrated into shared studio modules where they're not already there, then those pages become thin shells.

### 3. Remove top-level Blueprint & Slide Studio entries

In `StudioSidebar.tsx` and `StudioMobileNav.tsx`:

- Remove the `blueprint` and `slide-builder` entries from the `NAV` array.
- Keep: Playground Creator, Academy Creator, Success Creator, Trial, Story, Library.
- Change the default `currentStep` in `CreatorContext` from `'blueprint'` to `'playground-creator'` (or a small landing page if preferred — see open question).

In `CreatorStudioShell.tsx`:

- Drop the `path.endsWith('/blueprint')` and `/slide-builder` route mappings.
- Drop the `BlueprintEngine` and `SlideStudio` switch arms (they're now only reachable through a hub).
- Add redirects: hitting `/content-creator/blueprint` or `/content-creator/slide-builder` → `/content-creator/playground-creator` (or last-used hub from localStorage) so old links don't 404.

### 4. Cross-hub navigation inside the workspace

Inside `HubCreatorWorkspace`, show a small hub-switcher pill (Playground / Academy / Success) at the top so a creator can hop between hubs without going back to the sidebar. Clicking a pill `navigate('/content-creator/<hub>-creator')`.

### 5. Verification

- Manual smoke test all 3 routes: `/content-creator/playground-creator`, `/academy-creator`, `/success-creator`.
- Confirm: Blueprint tab loads, generating a blueprint persists into context, clicking "Build Slides" jumps to the Slide Studio tab with the correct hub theme applied, AI prompts include the right hub/CEFR context, Library tab lists hub-filtered lessons.
- Confirm sidebar no longer shows Blueprint / Slide Studio.
- Confirm `/content-creator/blueprint` and `/content-creator/slide-builder` redirect cleanly.

## Technical notes

- No DB / edge-function changes.
- `CreatorContext` already supports per-hub state; only the default `currentStep` and a `setHub()` call inside the workspace are needed.
- `SlideStudio` already reads `activeLessonData.hub` and themes itself via `useHubTheme`, so embedding it under a hub-locked context is enough — no fork required.
- `BlueprintEngine` already accepts `previous_topics` and respects the hub via context — same applies.
- Keep `Trial Creator` and `Story Creator` as top-level entries (out of scope for this request).

## Open question

When a creator first opens `/content-creator` (no specific hub yet), should they land on:
- (a) The Playground hub workspace by default, or
- (b) A small "Pick a hub" chooser screen?

I'll default to (a) unless you say otherwise.
