## Goal

Restructure the three creators (Playground, Academy, Success) into a professional 3-column workspace, fix the AI image not appearing on slides, and add a "Back" escape hatch.

## Findings

- All three creator pages share the same shell pattern: a sticky header with toolbar + a `max-w-7xl grid grid-cols-12` body split 3/5/4 (Slide list / Editor / Live preview). This caps width at ~1280px with `p-4` padding, making the editor feel cramped on 1076px viewports and below.
- The image binding flow is already correct: `SlideMediaPanel.generateImage()` calls `onPatch({ image_url, image_prompt })`, and parent `update()` in each creator does `setSlides(prev => prev.map((s, i) => i === selected ? {...s, ...patch} : s))`. **However** Playground's `SlideRenderer` for several slide types (`intro`, `multiple`, `truefalse`, `fill`) does not actually read `slide.image_url`, so the generated image is saved to state but never rendered — that's the "image doesn't appear on screen" symptom.
- There is no global "Back" button anywhere in the creator headers — once a teacher enters `/playground-creator`, `/academy-creator`, `/success-creator`, or `/classroom/:id` there is no nav out except the browser back button.

## Plan

### 1. Layout — true 3-column grid (all 3 creators)

Replace the current `max-w-7xl grid-cols-12` body with a full-width CSS grid:

```text
┌──────────────────────────────────────────────────────────────┐
│  Header (sticky, full width, Back · Title · Toolbar)         │
├────────────┬────────────────────────────────┬────────────────┤
│  260px     │   1fr (editor — flex column)   │   420px        │
│  Slides    │   Tabs: Basic / Media / Cmts   │   Live Preview │
│  + Add     │   Scrollable inner area        │   Sticky       │
└────────────┴────────────────────────────────┴────────────────┘
```

- Wrapper: `grid grid-cols-[260px_1fr_420px] gap-4 p-4 h-[calc(100vh-72px)]` (no max-w cap).
- Each column: `min-h-0 overflow-y-auto` so internal scrolling works independently.
- Mobile fallback: `lg:grid-cols-[260px_1fr_420px] grid-cols-1` — collapses to stacked single column under `lg`.
- Slide list column: drop `max-h-[55vh]` (now bounded by column height); keep "Add Slide" pinned at bottom with `mt-auto`.
- Live preview column: remove `sticky top-24`, the column itself owns its scroll.

### 2. Header — add Back button + restructure toolbar

In each creator's `<header>`:

- Add at the very left, before the icon badge: a `← Back` button that calls `navigate(-1)` (or `navigate('/content-creator')` if `window.history.length <= 1`). Hub-themed (orange / purple / emerald outline).
- Same change in `FullPreview` deck modal (already has a Back button for slide nav — leave it; add a separate `× Close` already present via `X` button).
- Add Back button to `/classroom/:id` route headers as well (Academy, Success, Demo classrooms) — top-left fixed, white pill with backdrop-blur, navigates to teacher dashboard.

### 3. Image binding — make `image_url` actually render

In `src/pages/PlaygroundDemo.tsx` `SlideRenderer`, for each slide type that doesn't currently render media, prepend:

```tsx
{slide.image_url && (
  <img src={slide.image_url} alt="" className="rounded-2xl max-h-48 mx-auto mb-3 object-contain" />
)}
```

Apply to: `intro`, `multiple`, `truefalse`, `fill`, `draw` (drag/match already use images via their own fields).

Verify Academy/Success demos (`AcademyDemo.tsx`, `SuccessDemo.tsx`) — if their `SlideRenderer` ignores `image_url` on text-heavy slide types, add the same conditional render so the AI-generated image shows through in the live preview pane.

### 4. Scoped polish

- Slide list cards: tighten padding to `p-2.5` so 260px fits the action icons without wrapping.
- Editor column: wrap `<Tabs>` content in a `flex-1 overflow-y-auto` so long forms scroll without pushing the page.
- Toolbar: on viewports <1280px, group secondary buttons (JSON / Export / Code / History) inside a single "More" popover to prevent overflow at the new full-width header.

## Files to edit

- `src/pages/PlaygroundCreator.tsx` — layout grid, Back button, More popover.
- `src/pages/AcademyCreator.tsx` — same.
- `src/pages/SuccessCreator.tsx` — same.
- `src/pages/PlaygroundDemo.tsx` — render `image_url` in `SlideRenderer`.
- `src/pages/AcademyDemo.tsx`, `src/pages/SuccessDemo.tsx` — same conditional image render where missing.
- Classroom pages (`AcademyClassroom.tsx` and `/classroom/:id` wrapper) — fixed top-left Back button.

## Out of scope

- No DB migrations.
- No new shared layout component (kept inline per-creator since each has hub-specific theming, refactor can come later).
- No changes to AI generation logic — only the render path.
