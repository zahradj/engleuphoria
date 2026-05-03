## Goal

Make the **Slide Studio (builder)** look identical to the classroom: same hub-branded PPT shell (logo + metadata + radial-glow gradient + progress bar), same `SlideShell` wrapper used at runtime, same hub colors flowing into every interactive component. Single source of truth for slide visuals across builder and player.

## Strategy

Rather than fork the design, **reuse the existing `SlideShell`** (already used by `DynamicSlideRenderer` in the classroom). Wrap the studio's `SlideCanvas` content inside it. Map the studio hub (`playground | academy | success`) onto the player's `HubType` (`playground | academy | professional`) so colors stay aligned.

CSS-variable theming already exists via `useHubTheme()` (`hub-surface`, `theme.themeClass`); we keep using it for the side panels and add SlideShell for the slide rectangle.

## File changes

### 1. `src/components/creator-studio/steps/slide-studio/SlideCanvas.tsx`
- Add imports: `SlideShell`, `HubType` from the player.
- Add a `toShellHub()` helper mapping `success → professional`.
- Extend `Props` with optional `slideIndex`, `totalSlides`, `level`, `unitNumber`, `lessonNumber` (used purely for the branded top-bar / progress).
- In `SlideCanvas` render:
  - Keep the small top toolbar (phase chip + Student/Teacher toggle + slide_type label) above the slide rectangle.
  - Replace the inline `<div className="...bg-slate-900...">` slide rectangle with `<SlideShell hub={shellHub} level=… unit=… lesson=… slideIndex=… totalSlides=…>` and put the existing inner content (FrontPageSlide branch and the editor card branch) inside it as children.
  - For the editor card branch: drop the manual radial-gradient inline style and the `bg-white/[0.04]` glass card — `SlideShell` already provides the dark gradient + glass content card. Inside the shell, render `<SlideMedia>`, `<TitleField>`, `<InteractiveBlock>`, audio button, mascot — wrapped in `space-y-4` only.
  - For the front-page branch: pass `fullBleed` to `SlideShell` and render `FrontPageSlide` directly so the title-slide bleed-image-right layout still fills the frame. Teleprompter overlay stays absolutely-positioned on top.
- Keep `TitleField` text white (already correct against the shell gradient).
- No change to MCQ/Flashcard/DragMatch/FillGaps internals — they already match the new look; once placed inside SlideShell's white content card they read on a high-contrast surface (the previous plain white look the user complained about was the *outer* frame, not the inner activity cards).

### 2. `src/components/creator-studio/steps/slide-studio/SlideStudio.tsx`
- Compute `activeIndex` (already exists) and pass `slideIndex={activeIndex}` and `totalSlides={slides.length}` to `<SlideCanvas>`.
- Pass `level={activeLessonData.cefr_level}`, `unitNumber={activeLessonData.source_lesson?.unit_number}`, `lessonNumber={activeLessonData.source_lesson?.lesson_number ?? activeLessonData.source_lesson?.position}`.
- Remove the now-redundant outer `bg-white/80 dark:bg-slate-900/80` look from the small lesson header strip — keep it functional but slim, no design overhaul there (the user's complaint is the slide preview, not the chrome).
- No other behavior changes (auto-injection, prefetch, autogen pipeline untouched).

## Out of scope

- No changes to `SlideShell` itself — colors and gradients there already match the spec (Academy = purple/indigo radial on `#1E1B4B` base, Playground = orange/amber, Professional = emerald). Editing it would risk drifting the classroom look.
- No new CSS variable layer — `SlideShell`'s inline gradient + the existing `hub-surface` class already deliver the requested theming. Adding a third system would fragment things.
- No refactor of `MCQBlock` / `FlashcardBlock` / `DragMatchPreview` / `FillGapsPreview` visuals. The flip-card and high-density layouts already exist; dropping them inside `SlideShell` is what the user is actually asking for ("interactive previews live inside the branded frame").

## Acceptance

- Opening `/content-creator/slide-builder` shows every slide rendered inside the dark Academy-purple radial-glow shell with the EnglEuphoria logo + "Academy · A2 · Unit 3 · Lesson 2" pill in the top-left and a thin purple progress bar across the bottom.
- Switching to a Playground or Success Hub lesson recolors the shell to orange or emerald automatically.
- The classroom view (`StageContent` / `DynamicSlideRenderer`) is visually identical to the builder for the same slide because both go through `SlideShell`.
- No `bg-white` or `bg-slate-900` plain rectangle is rendered around the slide preview anymore.
