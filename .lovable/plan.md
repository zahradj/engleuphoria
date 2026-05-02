# Front Page in Slide Studio + Cleaner Look

## Goal

1. The auto-prepended branded front page (logo, hub badge, CEFR level, unit/lesson title, cover image) must live inside Slide Studio so the content creator can edit copy, generate the cover image, and preview it like any other slide — instead of only appearing at classroom runtime.
2. Redesign `FrontPageSlide` to match the lighter, simpler look in the reference screenshot: large centered illustration, bold serif title underneath, supporting subtitle, small logo top-left, level/hub chips top-right — no heavy cinematic dark overlay.

## Changes

### 1. Auto-insert an editable Front Page when a lesson is created/loaded in Slide Studio

`src/components/creator-studio/steps/slide-studio/StoryStudioCanvas.tsx` (and the regular Slide Studio canvas mount path):

- On first mount, if `activeLessonData.slides[0]?.slide_type !== 'front_page'`, prepend a real slide:
  ```ts
  {
    id: 'front-page',
    slide_type: 'front_page',
    title: activeLessonData.lesson_title,
    topic: activeLessonData.topic,
    subtitle: activeLessonData.subtitle ?? '',
    level: activeLessonData.cefr_level ?? activeLessonData.level,
    hub: activeLessonData.hub,
    unit_number: activeLessonData.unit_number,
    unit_title: activeLessonData.unit_title,
    image_generation_prompt: '<auto-built from title + topic>',
    custom_image_url: undefined,
  }
  ```
- Mark dirty so it persists with `persistLesson`. Once saved, `TeacherClassroom` will see `slide_type === 'front_page'` and skip auto-prepending — no duplicates.
- Show it in the page tabs as `T` (Title) instead of `P1`.

### 2. Front Page editor in TeacherControlsPanel

`src/components/creator-studio/steps/slide-studio/TeacherControlsPanel.tsx`:

- When `slide.slide_type === 'front_page'`, replace the generic Content tab with a focused FrontPageEditor:
  - **Title** (lesson_title)
  - **Subtitle** (one-line tagline shown under title)
  - **Topic** (small caption above title)
  - **CEFR Level** (A1–C2 select)
  - **Unit number / Unit title**
- Visuals tab works as-is — the existing per-slide "Generate Image (AI)" button writes to `custom_image_url`, which `FrontPageSlide` already consumes as `coverImageUrl`. The default image prompt is pre-filled with something like `"Editorial cover illustration for an English lesson titled '<title>' — <topic> — flat vector, soft pastel palette, friendly characters, no text, 16:9."`

### 3. Redesign `FrontPageSlide` to match the screenshot

`src/components/lesson-player/editorial/FrontPageSlide.tsx`:

- Light themed background (hub-tinted soft gradient, no cover image as background).
- Layout = vertical stack:
  - Top bar: Engleuphoria logo (left), CEFR badge + Hub label chip (right) — both small and subtle.
  - **Cover illustration** (`custom_image_url`) centered, ~55% of slide height, rounded with soft hub-tinted glow. Falls back to a hub-tinted placeholder card with mascot.
  - **Title** centered below image, large bold serif (`text-4xl md:text-6xl`), dark slate text — not white-on-dark.
  - **Subtitle** centered, muted slate, `max-w-3xl`, italic-light.
  - Tiny hub accent bar at the bottom.
- Drop the `bg-gradient-to-b from-black/55 ...` overlay — it was making the slide look heavy/cinematic.
- Keep `coverImageUrl` consumption identical so existing data still renders.

### 4. Stop double-prepending in TeacherClassroom

`src/components/teacher/classroom/TeacherClassroom.tsx`:

- Already guarded by `hasFront`. Confirm this guard plus rely on the new persisted slide. No regression for legacy lessons (still gets auto-injected on the fly).

### 5. Consistency

`src/hooks/useBookendSlides.ts` continues to inject a `front_page` only when missing — same guard works.

## Files touched

- `src/components/lesson-player/editorial/FrontPageSlide.tsx` — visual redesign.
- `src/components/creator-studio/steps/slide-studio/StoryStudioCanvas.tsx` — auto-prepend editable front_page.
- `src/components/creator-studio/steps/slide-studio/SlideStudioCanvas` mount path (if separate) — same auto-prepend.
- `src/components/creator-studio/steps/slide-studio/TeacherControlsPanel.tsx` — `FrontPageEditor` block + default image prompt for `front_page` slides.

## Out of scope

- Migrating existing saved lessons to embed a `front_page` (legacy lessons keep using the runtime auto-prepend).
- Changing the celebration/closing slide design (kept identical for now).
