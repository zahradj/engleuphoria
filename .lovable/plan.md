## Goal
Refactor the classroom slide reader so it renders the same slide formats produced by Playground Creator, Academy Creator, and Success Creator, while removing the overwhelming purple classroom/slide frame treatment.

## Root findings
- The classroom is using `DynamicSlideRenderer`, but creator slides are authored in the `CreatorContext.PPPSlide` schema (`slide_type`, `layout_style`, `interactive_data`, `custom_image_url`, `custom_video_url`, etc.). Several creator slide types are only fully supported by `SlideCanvas`, not by the classroom reader.
- Academy Creator activities can become “empty” because `multiple_choice` is treated as a generic quiz but its `interactive_data` is not normalized into the `AcademyQuiz` component’s expected payload.
- Canvas-builder slides with `canvasElements` are not rendered by the classroom reader at all, even though the editor has a read-only canvas path available.
- The purple frame comes mainly from `SlideShell` Academy tokens and from teacher/student classroom background fallbacks (`indigo/blue/violet` gradients), plus activity components with hardcoded dark indigo/purple surfaces.

## Implementation plan

### 1. Add a single classroom slide adapter
Create a shared adapter used by `StageContent` before it calls the renderer. It will normalize every saved slide shape into one renderable format:
- Preserve raw creator fields: `slide_type`, `layout_style`, `interactive_data`, `custom_image_url`, `custom_video_url`, `youtube_*`, `audio_url`, `canvasElements`.
- Map creator slide types correctly:
  - `text_image`, `mascot_speech`, `drawing_prompt`, `drawing_canvas`
  - `flashcard`
  - `multiple_choice`
  - `drag_and_match`
  - `fill_in_the_gaps`
  - legacy `drag_and_drop`, `match_halves`, `quiz_mcq`, `sorting_game`
- Normalize media URLs from all known fields into `imageUrl` without dropping original fields.
- Normalize `success` to the player’s `professional` hub when needed.

### 2. Make the classroom reader render creator layouts 1:1
Refactor `DynamicSlideRenderer` to explicitly support the Creator slide schema:
- Add a Creator-style rendering branch for `slide_type` values before the older activity fallbacks.
- Reuse the same visual logic as `SlideCanvas` for:
  - media block: image/video/YouTube/custom image
  - layout styles: `full_background`, `center_card`, `split_left`, `split_right`
  - text/image slides and mascot speech
  - flashcards
  - drawing prompt/canvas placeholder
- Add proper `multiple_choice` handling directly from `interactive_data.question`, `options`, and `correct_index` so Academy Creator MCQ slides do not render empty.
- Keep existing live interactive components for drag/match and fill-gaps, but feed them normalized data.

### 3. Support canvas-builder slides in classroom
When a slide contains `canvasElements`, render it with the existing canvas engine in read-only mode instead of falling through to generic slide components.
- Use `CanvasEditor` read-only for authored visual layouts.
- Ensure it fits the live stage without adding another card or purple frame.

### 4. Remove the purple slide frame and calm the classroom visual design
Replace the heavy Academy purple shell with a calmer, professional classroom surface:
- `SlideShell`: remove the dark purple gradient background for Academy and replace it with a flat neutral “paper/canvas” surface using subtle hub accent lines, not a full purple frame.
- Remove ambient glow blobs from the shell.
- Keep hub identity as small accents only:
  - Playground: orange/amber accent
  - Academy: restrained blue/indigo accent, not purple-dominant
  - Success: emerald/teal accent
- Teacher and student classroom backgrounds: replace `indigo/blue/violet` hub backgrounds with neutral slate/white surfaces and thin hub accents.
- Update hardcoded purple dice/overlay styling to semantic hub/accent styling where it appears in the classroom.

### 5. Fix student mirroring of loaded lessons
Ensure students receive the same normalized slides the teacher sees:
- Keep `lessonSlides` as the raw Master Library slide payload, not a stripped placeholder shape.
- When a lesson is loaded from the Library Drawer or booking resolver, push the normalized raw slides into `classroom_sessions.lesson_slides`.
- Keep slide navigation and force-sync intact.

### 6. Verify with targeted checks
After implementation:
- Check the code paths for these slide types: `multiple_choice`, `drag_and_match`, `fill_in_the_gaps`, `flashcard`, `drawing_prompt`, `text_image`, and `canvasElements`.
- Verify no classroom/stage shell still uses the overwhelming purple frame classes or the Academy fallback as the dominant surface.
- Confirm `StageContent` passes normalized slides to `DynamicSlideRenderer` for both teacher and student flows.

## Files expected to change
- `src/components/classroom/stage/StageContent.tsx`
- `src/components/lesson-player/DynamicSlideRenderer.tsx`
- `src/components/lesson-player/SlideShell.tsx`
- `src/components/teacher/classroom/TeacherClassroom.tsx`
- `src/components/student/classroom/StudentClassroom.tsx`
- likely one new adapter/helper under `src/components/classroom/stage/` or `src/components/lesson-player/`

## Result
The classroom becomes a true unified slide reader: the Master Library and all three Creator hubs feed one stage renderer, activities show instead of empty slides, custom media is preserved, canvas-authored slides render, and the purple classroom frame is replaced by a calmer hub-accented design.