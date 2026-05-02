
## Diagnosis

The Story/Comic/Webtoon pipeline has 3 real gaps (verified by reading the code, not assumed):

1. **Panels render their prompt text because per-panel images are never generated.**
   `StoryBookViewer.tsx` *does* render `<img object-cover>` correctly when a panel has `image_url` — the prompt text is only the fallback. The bug is upstream: `generate-all-media` only generates **one image per slide** (using `slide.image_generation_prompt`) and stores it as `custom_image_url`. Then `storyPageUtils.normalizeSlidesToStoryPages` only hydrates **panel[0]** with that one image. Panels 2..N never receive a URL → they show their raw `image_prompt` text. Comic/manga pages have 3–5 panels and webtoons 6–10, so most of the page is text.

2. **Story brain is too generic.**
   `handleGenerateStory` in `supabase/functions/ai-core/index.ts` uses a short prompt that doesn't enforce hook → rising action → climax → resolution, doesn't ban robotic "This is X" sentences, and gives weak guidance for image_prompts.

3. **No explicit "Save to Library" affordance.**
   There is autosave via `CreatorContext` + `persistLesson`, but no user-visible button on the Story Studio top bar. Users don't know their work is saved and can't force a save.

## Plan

### 1. Per-panel image generation (the real renderer fix)

**`supabase/functions/generate-all-media/index.ts`**
- Extend `SlideJob` to include optional `panels: Array<{ image_prompt?: string; image_url?: string }>`.
- For paneled story slides: if `slide.panels` exists, fan out one `generate-slide-image` call per panel (skip panels that already have `image_url` unless `overwrite`). Use a deterministic per-panel `slideId` like `${slide.id}__p${i}` so storage paths don't collide.
- Return panels with their generated URLs in the result: `{ slideId, panels: [{ index, image_url }] }`.
- Keep existing single-image behaviour for non-paneled slides.

**`src/components/creator-studio/steps/slide-studio/mediaGeneration.ts`**
- Extend `AllMediaSlideResult` with `panels?: Array<{ index: number; image_url: string }>`.

**`src/components/creator-studio/steps/slide-studio/StoryStudioCanvas.tsx`**
- After `generateAllMedia`, when a result has `panels`, build a patch that updates `interactive_data.panels[i].image_url` on the slide via `updateSlide`.
- Update `slidesNeedingArt` to also include slides whose `interactive_data.panels` has any panel missing `image_url` (currently only checks the slide-level prompt, so paneled slides look "done" after panel[0] gets art).

**`src/components/student/story-viewer/storyPageUtils.ts`**
- Already passes panels through. No change needed.

### 2. Upgrade the Story AI Brain

**`supabase/functions/ai-core/index.ts` → `handleGenerateStory`**

Rewrite the system prompt to:
- "You are a master storyteller for English learners at CEFR ${level}."
- Forbid robotic intros ("This is Leo.", "Leo is a boy.").
- Require dramatic 4-beat structure across the pages: **Hook (page 1), Rising Action, Climax, Resolution**. For webtoons, the same arc across stacked panels.
- Require dialogue with personality — speakers named, emotions implied, max ~14 words per line.
- For `image_prompt`: require the format "subject + action + setting + mood + camera angle + lighting" so Nano Banana / DALL-E gets a film-grade prompt instead of a 3-word stub.
- Keep CEFR vocabulary/grammar discipline.
- Keep JSON-only output and the existing schema (no breaking change to consumers).

Bump temperature slightly (0.85 → 0.9) for narrative variety, and keep `gemini-2.5-flash` with failover.

### 3. Save to Library button

**`src/components/creator-studio/steps/slide-studio/StoryStudioCanvas.tsx`**
- Add a prominent "💾 Save to Library" button in the top bar (next to "Preview Reader").
- onClick: call `persistLesson(activeLessonData, slides, true /*publish*/, 'story', { visual_style, story_layout, ... })` directly so it writes the full JSON (title, panels, dialogue, image URLs) to `curriculum_lessons` (the canonical lessons table per project memory).
- On success: `toast.success('📚 Saved to Library')`, then refresh the local `lesson_id` so the "Preview Reader" button activates.
- On failure: `toast.error(...)` with the real error message.
- Keep the existing autosave indicator so users see live state plus the explicit save action.

### Out of scope / explicitly NOT changing

- DB schema (curriculum_lessons already stores slide JSON via `persistLesson`).
- The student `StoryBookViewer` rendering — already correct.
- Voiceover/music generation pipeline.

## Files to edit

1. `supabase/functions/ai-core/index.ts` — upgrade story system+user prompt.
2. `supabase/functions/generate-all-media/index.ts` — per-panel image fan-out.
3. `src/components/creator-studio/steps/slide-studio/mediaGeneration.ts` — extend result type.
4. `src/components/creator-studio/steps/slide-studio/StoryStudioCanvas.tsx` — apply per-panel results, add Save to Library button, broaden `slidesNeedingArt`.

No DB migrations required.
