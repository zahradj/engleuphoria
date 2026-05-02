# Per-Panel Image Generation in Story Studio

## Problem

Story slides (comic / webtoon / picture-book / comic-spread layouts) are made of multiple panels stored in `slide.interactive_data.panels[]`. Each panel has its own `image_prompt`, `caption`, and `image_url`. The current Visuals editor only exposes ONE prompt field and ONE "Generate Image (AI)" button that writes to the slide-level `custom_image_url`, which only fills the first panel (via the fallback in `storyPageUtils.normalizeSlidesToStoryPages`). Result: only the top image of a multi-panel page ever gets art when generating from the editor.

The bulk "Generate Images" button in the top bar already calls `generate-all-media`, which on the server iterates panels and generates one image per panel. So the backend is fine — the UI just doesn't let the user trigger generation for an individual panel.

## Fix

Add a Per-Panel block to `VisualsPanel` in `src/components/creator-studio/steps/slide-studio/TeacherControlsPanel.tsx`. When the active slide has `interactive_data.panels.length > 0`, render one card per panel with:

- A small thumbnail of the current `image_url` (or "No image").
- "Panel N" label + caption preview.
- An editable per-panel `image_prompt` textarea (saves to `panels[i].image_prompt`).
- A "Generate" / "Regenerate" button that calls `generateSlideImage(prompt, lessonId, slideId__pN, hub)` and writes the returned URL to `panels[i].image_url` and `panels[i].imageUrl` via `onChange({ interactive_data: { ...prev, panels: nextPanels } })`.
- Independent loading state per panel so a slow generation doesn't block other panels.

The slide-level prompt + "Generate Image" button are kept as a fallback for non-paneled layouts and renamed to "Slide Hero" when panels exist.

## Why this works end-to-end

- `generateSlideImage` already returns a stored URL, so the new image renders immediately in the live `StoryBookViewer` preview on the left.
- `interactive_data.panels` is the same shape the bulk job produces, so dirty-tracking, persistence (`persistLesson`), and the student reader all work without further changes.
- `slidesNeedingArt` and the `🎨 X/Y panels` counter in `StoryStudioCanvas` already count individual panels — once a panel gets a URL, the counter ticks up.

## Files touched

- `src/components/creator-studio/steps/slide-studio/TeacherControlsPanel.tsx` — extend `VisualsPanel` only. No other components or edge functions need changes.

## Out of scope

- Click-on-panel-in-preview-to-regenerate. The `StoryBookViewer` is the student-facing reader and isn't aware of authoring; making it editable would require threading callbacks through 4 viewer variants. The Panels card in the right-hand editor delivers the same outcome with one click and zero risk to the reader. Can revisit later if the user wants the in-preview affordance too.
