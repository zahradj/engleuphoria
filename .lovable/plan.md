# Story Studio: Restore Save Button + Image Generation

## Root cause

`StoryBookViewer` (and its `PictureBookViewer`, `ComicSpreadViewer`, `WebtoonScroller` variants) all render with `className="fixed inset-0 z-50 ..."`. When the Studio mounts the viewer inside its preview pane, those `fixed` overlays escape the pane and cover the **entire screen**, hiding:

- The top action bar (💾 Save to Library, Generate Images, Regenerate, Preview Reader)
- The right-side editor sidebar
- The page-tab strip

The viewer also intercepts pointer/keyboard events globally, which is why nothing on the Studio chrome is reachable.

A secondary issue blocks images from appearing: the Studio calls `generate-all-media` with `lessonId = activeLessonData.lesson_id ?? 'draft'`. When the lesson has never been persisted (`lesson_id` is undefined), images are uploaded under a `draft/` prefix and the slide patches are kept only in client state. If the auto-trigger fires before the user has any lesson row, panels can silently end up without `image_url` because the slide objects are replaced before `updateSlide` runs.

## Fix

### 1. `src/components/student/story-viewer/StoryBookViewer.tsx`

- Add `embedded?: boolean` to `StoryBookViewerProps`, `BookViewerProps`, and the `WebtoonScroller` props.
- Replace every outer container that uses `fixed inset-0 z-50` with a helper:
  - `embedded` → `absolute inset-0` (fills its parent, no z-50)
  - default → `fixed inset-0 z-50` (current full-screen behavior preserved for the standalone reader route)
- Forward `embedded` from `StoryBookViewer` into `PictureBookViewer`, `ComicSpreadViewer`, and `WebtoonScroller`.
- Add a small floating "Exit" affordance only when **not** embedded (so the Studio doesn't show a redundant close button).

### 2. `src/components/creator-studio/steps/slide-studio/StoryStudioCanvas.tsx`

- Pass `embedded` to `<StoryBookViewer />`.
- Raise the top action bar and right sidebar to `z-[60]` so nothing the viewer renders can overlap them.
- Add a tiny progress chip next to "Generate Images": `X / Y panels illustrated` computed from `slidesNeedingArt` vs total panel count.
- Add a **🔁 Retry failed panels** button that re-runs `runGenerateAll(false)` only on slides whose panels still lack `image_url`.
- Before calling `generateAllMedia`, if `activeLessonData.lesson_id` is missing, call `persistLesson(...)` first (publish=false) so generated images are scoped to a real lesson id and survive a refresh. Update `activeLessonData.lesson_id` from the result before continuing.
- Guard the auto-generation `useEffect` so it only fires once `activeLessonData.lesson_id` exists (or after the auto-persist above resolves).

### 3. `supabase/functions/generate-all-media/index.ts`

- No schema change required; the function already forwards `lessonId` to `generate-slide-image`. Verified `generate-slide-image` falls back to a `"draft"` folder if `lessonId` is empty, so the new client-side persist step is what actually fixes durability.
- Add a defensive log when `lessonId === 'draft'` so future debugging is easier.

## Files touched

- `src/components/student/story-viewer/StoryBookViewer.tsx` — add `embedded` plumbing, swap `fixed` for `absolute` in 4 places.
- `src/components/creator-studio/steps/slide-studio/StoryStudioCanvas.tsx` — pass `embedded`, raise z-index, add progress chip + retry, persist-before-generate.
- `supabase/functions/generate-all-media/index.ts` — add a log line for the draft-id case.

## Verification

1. Open `/content-creator/slide-builder`, generate a story → top bar with **💾 Save to Library** stays visible above the viewer.
2. Auto-image pipeline runs: progress chip ticks up, panels populate. If any fail, **🔁 Retry failed panels** completes them.
3. Click **💾 Save to Library** → lesson appears in library; reopen → images persist (no `draft/` paths).
4. Standalone `/lesson/:id` reader still opens full-screen (no regression for non-embedded use).
