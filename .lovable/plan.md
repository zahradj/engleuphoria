## Goal

Replace the current sprawling `AdminLessonEditor` used in Step 2 of the Content Creator Dashboard with a focused **Integrated Slide Studio** that is the natural continuation of the Blueprint flow: AI does the heavy lifting, the creator polishes in a Canva-style canvas, then publishes to the Library in one click.

## What you will see

### Step 2 — "Slide Studio" (new screen, replaces Slide Builder)

```text
┌──────────────────────────────────────────────────────────────────────┐
│ ← Back to Blueprint    Slide Studio          [💾 Publish to Library] │
├──────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ FROM BLUEPRINT  ·  Focus: Speaking                               │ │
│ │ Lesson: "Ordering Coffee in a Café"                              │ │
│ │ Unit: Travel Adventures   🎯 Real-world café conversations       │ │
│ │ 🎓 SWBAT order a drink politely using "Could I have…"            │ │
│ │                                                                  │ │
│ │      ┌───────────────────────────────────────┐                   │ │
│ │      │ ✨ Auto-Generate PPP Slides with AI  │                   │ │
│ │      └───────────────────────────────────────┘                   │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│ ┌─── Filmstrip ───┐  ┌──────── Slide Preview & Editor ─────────┐   │
│ │ ▶ 1 Warm-Up     │  │                                          │   │
│ │   2 Video Song  │  │  [HD Unsplash image, swap-able]          │   │
│ │   3 Vocab       │  │                                          │   │
│ │   4 Grammar     │  │  Title:  [editable]                      │   │
│ │   5 Quiz        │  │  Body:   [editable textarea]             │   │
│ │   6 Roleplay    │  │  Teacher tips: [editable textarea]       │   │
│ │   7 Production  │  │  Visual keyword: [input → re-fetch img]  │   │
│ │   8 Review      │  │  Or paste a custom image URL: [input]    │   │
│ │ + Blank Slide   │  │                                          │   │
│ │ + Game Slide    │  │  Interactive options: [chip editor]      │   │
│ └─────────────────┘  └──────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

### Step 3 — "Library" (existing `LessonLibraryHub`)

After publishing, the user is automatically routed here and the new lesson appears at the top with a brief "✓ Just published" highlight.

## Key Behaviours

1. **Blueprint context banner** — When the user lands here from "Build Slides" on the Blueprint, the banner shows lesson title, skill focus chip, unit title, theme, and learning objective. The big primary button is enabled and labelled "Auto-Generate PPP Slides with AI". When there is no Blueprint context, the banner is hidden and the button reads "Generate Master PPP Lesson" — the user enters a topic in a small inline form.

2. **Auto-generation** — Clicking the button calls the existing `generate-lesson-plan` edge function with `mode: full_deck`, the resolved `hub`, `cefr_level`, `topic` (lesson title), and the `skill_focus` injected into `lessonPrompt` so the AI prioritises that strand. Slides arrive in PPP order: Warm-up → Presentation → Practice → Production → Review.

3. **Filmstrip (left, ~220px)**
   - PowerPoint-style vertical list. Each thumbnail shows phase color stripe, slide number, title, and a 64px Unsplash preview.
   - Click selects; drag-to-reorder; right-click (or kebab) → Duplicate / Delete / Move up / Move down.
   - Two "Add" buttons at the bottom: **+ Blank Slide** (empty editable slide) and **+ Activity Slide** (preset for a quick game/worksheet — adds a slide with `slide_type: activity` and an empty `interactive_options` array).

4. **Center editor** — Renders the selected slide as a large preview with inline-editable fields:
   - **Image area** with an "Swap image" overlay button. Two ways to change: (a) edit `visual_keyword` → automatic Unsplash re-fetch; (b) paste a direct image URL into the "Custom image URL" field, which overrides Unsplash.
   - **Title**, **Body/Content**, **Teacher Instructions**, **Phase** (select), **Interactive options** (chip list with add/remove).
   - All edits are kept in local component state, no autosave noise.

5. **Publish to Library** (top-right, gradient emerald button)
   - Validates: at least 1 slide and a non-empty lesson title.
   - Saves to `curriculum_lessons` with: `title`, `description = target_goal`, `content = { structuredData: { lesson_title, target_goal, target_grammar, target_vocabulary, roadmap, slides }, hub, cefr_level, blueprint_context }`, `target_system`, `difficulty_level`, `duration_minutes`, `skills_focus`, `is_published: true`, `created_by`.
   - Toast: "✅ Published to Library!" → router pushes Step 3, and the lesson list refreshes so the new card sits at the top.

6. **No data loss safeguards** — If the user clicks Back / Step nav while the deck has unsaved AI-generated slides, prompt with a confirm dialog ("You have unsaved slides — leave anyway?").

## Files to add

- `src/components/content-creator/slide-studio/SlideStudio.tsx` — orchestrator (state, generate, save, navigation).
- `src/components/content-creator/slide-studio/SlideFilmstrip.tsx` — left vertical list with reordering and add buttons.
- `src/components/content-creator/slide-studio/SlideEditor.tsx` — center editor (image swap, fields, interactive options chip editor).
- `src/components/content-creator/slide-studio/BlueprintContextBanner.tsx` — top banner + Generate button + manual-topic fallback.
- `src/components/content-creator/slide-studio/types.ts` — shared `StudioSlide`, `StudioLesson`, `BlueprintHandoff` types (re-using the PPP shape from `MasterPPPWizard`).

## Files to modify

- `src/pages/ContentCreatorDashboard.tsx`
  - Replace Step 2 render from `<AdminLessonEditor …/>` to `<SlideStudio onPublished={() => setCurrentStep(3)} curriculumContext={curriculumContext} />`.
  - Keep the existing Blueprint banner and stepper untouched; remove `isFullBleed` since the Studio manages its own layout inside the dashboard frame (Step 2 will render in the standard `<main>` shell, not full-bleed).
  - Pass the route `location.state` Blueprint handoff into `<SlideStudio>` so the banner appears even when the user lands directly on Step 2 from the Blueprint's "Build Slides" button (we keep `/content-creator/master-wizard` route for the standalone Master Wizard, but Step 2 inside the dashboard becomes the Studio).
- `src/components/content-creator/BlueprintBuilderPage.tsx`
  - Change `buildSlides` navigation target from `/content-creator/master-wizard` to `/content-creator` with the same `state`, then auto-jump to Step 2 via a small `useEffect` in the dashboard that reads `location.state.fromBlueprint`.

## Files to retire (kept on disk, no longer wired into the dashboard)

- `AdminLessonEditor` and the heavy `lesson-builder/*` editor remain in the codebase (still referenced from admin pages elsewhere). Step 2 no longer mounts them.
- The standalone `/content-creator/master-wizard` route stays for power users — it now coexists with the integrated Studio.

## Edge function

No new edge function. Reuse the existing `generate-lesson-plan` (full_deck mode) with this body:

```ts
{
  hub,                     // resolved from age group / handoff
  cefr_level,              // from handoff or input
  topic: lesson_title,
  mode: 'full_deck',
  lessonPrompt: `Skill focus: ${skill_focus}. Learning objective: ${learning_objective}. Unit theme: ${unit_theme}.`
}
```

## Database

No schema changes. We write to the existing `curriculum_lessons` table (matches the current `MasterPPPWizard.handleSave` payload). The `is_published` flag is set to `true` on publish so the Library tab shows it immediately.

## Out of scope (intentionally)

- Drag-and-drop visual canvas like Canva (heavy lift, not requested). The "Slide Preview & Editor" is a polished form-style editor on top of a large image preview — fast to ship, easy to use.
- Real-time multi-user editing.
- Re-running generation per slide (the existing single-slide regeneration in `MasterPPPWizard` can be ported later if needed).

## Acceptance criteria

- Clicking "Build Slides" on a Blueprint lesson lands on Step 2 with the context banner pre-filled and the big AI button visible.
- Clicking the AI button produces 8–10 PPP slides in the filmstrip in under ~15 seconds.
- Selecting a filmstrip thumbnail loads it in the center editor with all fields editable.
- "+ Blank Slide" and "+ Activity Slide" both insert a new slide that can be edited and reordered.
- Editing `visual_keyword` swaps the Unsplash image; pasting a custom URL overrides it.
- "Publish to Library" writes a row to `curriculum_lessons`, fires a success toast, and routes to Step 3 where the new lesson appears at the top.
- Refreshing the page on Step 2 does not crash; without a Blueprint handoff, the user can still type a topic and generate manually.
