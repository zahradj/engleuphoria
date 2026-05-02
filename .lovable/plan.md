I took the screenshot of `/content-creator/slide-builder` and did a code/data trace. The premium `StoryBookViewer` code exists, but it is not what the user is seeing in Slide Studio. The generated story is still being opened as normal PPP lesson slides, so the UI naturally looks like lesson pages.

Diagnosis found three root causes:

1. Wrong rendering surface
- `StoryBookViewer` is only mounted in `src/pages/student/LessonReaderPage.tsx` for `/lesson/:id`.
- The current screen is `/content-creator/slide-builder`, which renders `SlideStudio` -> `SlideCanvas`.
- `SlideCanvas` has no branch for story lessons, so story pages are rendered as ordinary `text_image` lesson slides.

2. Story metadata is lost after editing/publishing
- Initial story creation persists with `kind: 'story'`, `visual_style`, and `story_layout`.
- But `StudioHeader` save/publish calls `persistLesson(activeLessonData, slides, ...)` without passing `kind: 'story'` or the story metadata.
- `LibraryManager.handleEdit` also does not hydrate story metadata back into `activeLessonData`.
- Result: after saving/publishing a story from Slide Studio, it can become `kind: 'standard'`, so `/lesson/:id` will bypass `StoryBookViewer` and use the normal `LessonPlayerContainer`.

3. Comic panel images are not wired back to panels
- Generated comic/webtoon/manga stories store panels inside `interactive_data.panels` with only `image_prompt`.
- The auto media pipeline generates one `custom_image_url` per slide, not per panel.
- The comic spread renderer expects each panel to have `image_url`/`imageUrl`. Without that, it shows placeholders or falls back poorly.

Planned fix:

1. Preserve story metadata end-to-end
- Extend `ActiveLessonData` with optional fields for `kind`, `visual_style`, `story_layout`, and linked story metadata.
- Update `StoryCreator` to set these fields on `activeLessonData` immediately after generation.
- Update `LibraryManager.handleEdit` to hydrate those fields from `row.ai_metadata`.
- Update `StudioHeader` save/publish and CreatorContext autosave to pass the correct `kind` and `extraMetadata` into `persistLesson`, so story lessons stay story lessons after any edit or publish.

2. Add an in-studio premium Story preview path
- Update `SlideStudio` to detect story lessons from `activeLessonData.kind === 'story'` or story metadata.
- For story lessons, render a story-aware preview canvas instead of the generic `SlideCanvas`.
- Reuse the existing `StoryBookViewer` component, normalized from the current slides, so the creator sees the same premium Picture Book / Comic Spread / Manga / Webtoon reader while editing.
- Keep teacher controls available either as a side panel for the selected underlying slide or as a clear “Edit slide details” section so the authoring workflow is not lost.

3. Normalize current slide data correctly for the story viewer
- Create or move a shared helper to convert PPP story slides into `StoryPage[]`.
- Include `custom_image_url` as the page `imageUrl`.
- For paneled styles, if panel images are missing but the slide has a generated `custom_image_url`, use it as a fallback for the page/panel so the premium layout visibly changes instead of looking like standard lessons.
- Ensure the selected `visual_style` maps as expected:
  - Playground classic/default -> `picture_book`
  - Academy classic/default -> `comic_spread`
  - Explicit `comic_western`, `manga_rtl`, `webtoon` keep their dedicated layout.

4. Fix story publication/opening behavior
- Ensure published stories remain `ai_metadata.kind = 'story'`.
- Ensure `/lesson/:id` reliably opens `StoryBookViewer` for story rows.
- Optionally add an explicit “Preview Story Reader” button in the creator studio that opens `/lesson/{lesson_id}` so the teacher can verify the student-facing reader directly.

5. Improve comic panel asset handling
- Update the media generation handoff for story slides so generated images can be assigned into `interactive_data.panels[0].image_url` when only one image is generated per slide.
- For future paneled generation, prepare the data shape so per-panel image generation can be added without changing the viewer API.

Files expected to change:
- `src/components/creator-studio/CreatorContext.tsx`
- `src/components/creator-studio/StudioHeader.tsx`
- `src/components/creator-studio/steps/StoryCreator.tsx`
- `src/components/creator-studio/steps/LibraryManager.tsx`
- `src/components/creator-studio/steps/slide-studio/SlideStudio.tsx`
- `src/pages/student/LessonReaderPage.tsx`
- Possibly a new shared helper file such as `src/components/student/story-viewer/storyPageUtils.ts`

Validation after implementation:
- Generate a new story and confirm `/content-creator/slide-builder` no longer looks like generic lesson slides.
- Confirm the current story row stays `ai_metadata.kind = 'story'` after Save Draft and Publish.
- Open `/lesson/:id` for a story and confirm `StoryBookViewer` renders.
- Verify `comic_western` uses comic panels/speech bubbles, Playground default uses Picture Book, and Academy default uses Comic Spread.