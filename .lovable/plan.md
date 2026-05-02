## Root Cause Diagnosis

I queried the live `classroom_sessions` row for your active lesson ("First Day at the Academy", 20 slides). Two real bugs are stacking on top of each other.

### Bug 1 — Slide 8 (and several others) crash the renderer

The lesson uses these `slide_type` values that **`DynamicSlideRenderer` does not recognize**:

- `flashcard` (slides 1–6)
- `mascot_speech` (slides 8, 9, 18) ← what you're seeing on page 8
- `text_image` (slide 13)
- `drawing_canvas` (slide 19)

When `directorType` doesn't match any of the editorial / director branches, the renderer falls through to `renderActivity()`. With no `activityType` set, the academy branch returns `<AcademyQuiz>` (or `<PlaygroundDragDrop>` for kids) with empty data. That component throws, the `SlideErrorBoundary` catches it, and you see:

> "Slide Data Error — The AI generated incomplete data for this activity. Please skip to the next slide."

Slide 8 is a `mascot_speech` slide carrying a `youtube_embed_url` and a dialogue script — it should render as a video + dialogue card, not as a quiz.

### Bug 2 — Student stage shows the same crash on every slide that uses premium types

`StudentMainStage` calls `MainStage` **without passing `rawSlides` or `hubType`**. The teacher version passes both. On the student side `StageContent` still pulls from `slides[currentSlideIndex]`, but `hubType` defaults to `'academy'` and many premium pieces (e.g. `EditorialVocabList`, hub colors) silently misroute. More importantly, the student renderer uses the same `DynamicSlideRenderer` and hits the same crash path → the student sees the error overlay (or a blank stage when the boundary triggers above the slide content).

## Fix (at the root)

### 1. Add missing `slide_type` handlers in `DynamicSlideRenderer`

In `src/components/lesson-player/DynamicSlideRenderer.tsx`, before the activity-routing fallback, route the four unhandled types to existing renderers:

- `flashcard` → if `interactive_data.words/vocabulary` exists use `EditorialVocabList`; otherwise `LiveHeroMediaSlide` (title + image + content text).
- `mascot_speech` → if `youtube_embed_url` / `youtube_video_id` is present, render `<VideoSlide>` with the dialogue script shown beneath; otherwise render a dialogue card (`SlideConcept`-style) using `interactive_data.speech`.
- `text_image` → `LiveHeroMediaSlide` (already handles title + media + body).
- `drawing_canvas` → simple writing-prompt card (title + instructions + a placeholder canvas note for live class — we don't need a full whiteboard here since the universal `TransparentCanvas` already overlays).

Also alias `mascot_speech` without media → `SlideConcept` (existing dialogue layout) so kids/teen hubs render correctly.

### 2. Make the error boundary degrade gracefully

Change `SlideErrorBoundary` (inside `DynamicSlideRenderer`) so when a slide crashes it renders the slide's `title` + `content` text + image (via `LiveHeroMediaSlide`) instead of the scary "Slide Data Error" message. This guarantees students always see something useful even if a future slide_type appears.

### 3. Pass `rawSlides` and `hubType` to the student stage

- `src/components/student/classroom/StudentMainStage.tsx`: accept `rawSlides?: any[]` and `hubType?: HubType` props and forward them to `<MainStage>`.
- `src/components/student/classroom/StudentClassroom.tsx`: pass `rawSlides={lessonSlides}` and `hubType={hubType}` (already on the component) to `StudentMainStage`. Since `lessonSlides` already carries the full premium payload via `useClassroomSync`, students will now render the exact same premium slide the teacher sees.

### 4. Strengthen `normalizeLiveSlide` in `StageContent`

Add aliasing for the four new types so `slideType` and `type` always resolve to a renderable branch (e.g. `mascot_speech` → `slideType: 'core_concept'`, `flashcard` → `slideType: 'vocabulary'`, `text_image` → `slideType: 'hook'`, `drawing_canvas` → `slideType: 'core_concept'`). This belt-and-braces approach guarantees the new handlers are always reached.

## Files to edit

- `src/components/lesson-player/DynamicSlideRenderer.tsx` — add 4 director-type handlers + soften the error boundary fallback.
- `src/components/classroom/stage/StageContent.tsx` — extend `normalizeLiveSlide` aliasing.
- `src/components/student/classroom/StudentMainStage.tsx` — accept + forward `rawSlides` and `hubType`.
- `src/components/student/classroom/StudentClassroom.tsx` — pass `rawSlides` and `hubType` into `StudentMainStage`.

## Why this fixes it from the root

The crash isn't a one-off "bad data on slide 8" — it's the renderer missing four legitimate, AI-generated slide types that the Director / lesson generator emits. Once those four types render natively, slide 8 (and the other 9 affected slides in this single lesson alone) display correctly, the student sees identical content to the teacher, and any future unmapped type degrades to a readable hero-card instead of a blocking error.

No DB migration, no edge function deploy required.