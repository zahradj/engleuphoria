## Goal

Fix the under-utilized classroom frame, make slide text legible, scale up the lesson image, add the missing "Academy Vocabulary Card" branding, and standardize bottom-dock buttons to the branded purple.

## Files to change

1. `src/components/teacher/classroom/TeacherClassroom.tsx`
2. `src/components/teacher/classroom/CommunicationZone.tsx`
3. `src/components/classroom/stage/MainStage.tsx`
4. `src/components/lesson-player/slides/SlideHook.tsx` (the slide rendering "Free Time Fun!")
5. `src/components/lesson-player/slides/SlideVocabulary.tsx`
6. `src/components/classroom/stage/TeacherControlDock.tsx` (button consistency)
7. Same treatment mirrored in `src/components/student/classroom/StudentMainStage.tsx` so students see the identical refactor.

## 1. Structural classroom refactor

`MainStage.tsx`
- Drop the floating-card look on the stage container. Replace `bg-white rounded-lg shadow-xl border border-border` + `p-1 sm:p-2` outer padding with a flush surface that fills the area (`p-0`, no shadow, no rounded card). Keep border-radius minimal (`rounded-md`) so it merges with the hub-tinted background.
- Remove the always-visible "Slide" mode badge in the top-left of the stage (it's redundant with the lesson title in the top bar) — keep only the "Teacher is presenting" pill for students.

`TeacherClassroom.tsx`
- The left `CommunicationZone` should be collapsible. Add a `commsCollapsed` state (default `true` so chat starts minimized) and pass `collapsed` + `onToggleCollapsed` props into `CommunicationZone`. When collapsed, render a thin 56px rail with avatar + a chevron toggle so the center stage gains ~260px of width.

`CommunicationZone.tsx`
- Accept new `collapsed` and `onToggleCollapsed` props. When `collapsed`, render only the two video tiles stacked, no chat panel, width `w-16`.
- Default chat to a minimized state (collapsed by default per the user's "minimized/collapsible" requirement).
- Remove the `glass-panel` extra gap; tighten the right border so the sidebar feels integrated with the stage.

## 2. Content & typography refactor (legibility)

`SlideHook.tsx` (this is the slide showing "Your Free Time Fun!" + "What do you love to do…"):
- Remove the small `maxHeight: 300` cap on the image and remove `max-w-lg`. New container: `w-full max-w-3xl` with `maxHeight: 520`. Add `object-contain` so the painting reads as a focal point (~150–200% larger).
- Title (`<motion.h1>`): bump to `text-5xl md:text-6xl font-extrabold tracking-tight uppercase`, keep hub primary color.
- Body prompt (`<motion.p>`): replace `style={{ color: config.colorPalette.text }}` (which is the illegible light grey) with an explicit high-contrast color: `text-slate-800 dark:text-slate-100` and bump from `text-lg` → `text-2xl md:text-3xl font-medium`. Keep `max-w-3xl`.

## 3. Pedagogy: branded vocab card

`SlideVocabulary.tsx`
- Replace the current "NEW VOCABULARY" eyebrow with a branded header row containing:
  - A pill badge `Academy Vocabulary Card` (or `Topic Card` for non-academy hubs) using the hub primary as background and white text, rounded-full.
  - The Engleuphoria wordmark (`<Logo size="small" />` from `src/components/Logo.tsx`) on the right side of the same row.
- Add a large `TARGET WORD` header above the flashcard (`text-3xl uppercase font-extrabold`, hub primary color) — sourced from `slide.title` so the active topic word is immediately prominent.
- The same branded header strip is added at the top of `SlideHook.tsx` (since the screenshot is a Hook slide) so every classroom slide carries the brand badge + logo.

I'll factor the strip into a small shared component:
- New file: `src/components/lesson-player/slides/SlideBrandHeader.tsx`
  - Props: `hub: HubType`, `label: string` (e.g. "Academy Vocabulary Card", "Academy Topic Card").
  - Renders a left-aligned pill badge using the hub's primary color + a right-aligned `<Logo size="small" />`.
- Imported and rendered at the top of `SlideHook.tsx` and `SlideVocabulary.tsx`.

## 4. Consistent controls

`TeacherControlDock.tsx`
- Audit button sizing: standardize all icon buttons to `h-9 w-9` and labeled buttons to `h-9 px-3 text-sm`.
- Replace ad-hoc colors with the branded purple (`bg-[#6B21A8] hover:bg-[#581C87] text-white`) for primary actions (Give Star, Send Sticker, Library, Embed). Secondary actions stay outline/ghost with `border-purple-200 text-purple-800`.
- Same purple accent applied to the Send button in `CommunicationZone.tsx` chat input.

## Out of scope

- No changes to slide-data schema, AI generation, or routing.
- No changes to mobile layout (`MobileClassroomLayout`) beyond what already trickles through the shared slide components.

## Technical notes

- `HUB_CONFIGS[hub].colorPalette.text` is what's currently producing the illegible light grey on the hook slide — we override with explicit Tailwind classes instead of touching the global hub config (which other slide types depend on).
- `Logo` reads the active theme; on the white/cream slide background it will render the black wordmark automatically, so contrast is preserved.
- The `commsCollapsed` default of `true` matches the requirement "Set the chat to a minimized/collapsible state by default" while still letting the teacher expand on demand.

```text
┌──────────────────────────────────────────────────────────────┐
│ Top Bar (lesson title • timer • end class)                   │
├──┬───────────────────────────────────────────────────────────┤
│V │   [Academy Vocabulary Card]              [engleuphoria]   │
│i │                                                           │
│d │              FREE TIME FUN                                │
│e │       ┌──────────────────────────┐                        │
│o │       │   large painting (150%+) │                        │
│  │       └──────────────────────────┘                        │
│r │   What do you love to do when you're not studying?        │
│a │   (text-2xl, slate-800, high contrast)                    │
│i │                                                           │
│l ├───────────────────────────────────────────────────────────┤
│  │ Bottom dock: ◀ ▶  ✏  ⭐  ⏱  🎲  💬   (purple, h-9)        │
└──┴───────────────────────────────────────────────────────────┘
```
