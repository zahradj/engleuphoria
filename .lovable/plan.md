## Storybook Slide + Auto-Comprehension + Media Analyzer

Three connected upgrades that share one backend pattern (AI generates a content block + automatically appends scaled comprehension quiz slides) and one frontend pattern (a new sidebar template button + a new center-canvas renderer).

---

### 1. Storybook Slide Type

**Schema (shared)** — extend the slide union in `PlaygroundCreator.tsx`, `AcademyCreator.tsx`, `SuccessCreator.tsx`:
```ts
{
  type: 'storybook',
  title: string,
  topic: string,
  pages: [{ page_number: 1, text: '', image_url: '', audio_url: '' }, ...]
}
```

**Add Slide menu** — append `{ type: 'storybook', label: '📖 Storybook', emoji: '📖' }` to `SLIDE_TYPES` in all three creators. `makeSlide('storybook')` returns an empty 1-page skeleton.

**Right Sidebar — Mini Story Generator** (new component `src/components/creator-studio/shared/StorybookEditor.tsx`):
- "Story Prompt / Topic" textarea
- Read-only preview of target vocab pulled from lesson metadata
- "✨ AI Generate Story Sequence" button → calls new edge function `generate-storybook`
- Per-page editor list (text, image, audio) with regenerate buttons reusing existing `<ImageGenerator />` and `<AudioGenerator />`

When the active slide is `storybook`, the existing inspector swaps to this editor.

**Center Canvas Renderer** — new `src/components/creator-studio/shared/StorybookRenderer.tsx`:
- Self-contained carousel with internal page index state
- Hub variants via prop:
  - `playground`: full-bleed picture-book, large round arrow buttons, oversized text
  - `academy`: graphic-novel split layout (image left, text right), thin chrome
  - `success`: case-study card with "Page X of Y" header and serif body
- Exposes `onComplete()` when last page reached

**Lesson navigation gating** — in all three Demo/Renderer pages (`PlaygroundDemo.tsx`, `AcademyDemo.tsx`, `SuccessDemo.tsx`):
- Track `storybookCompleted[slideIndex]` in state
- Disable the global "Next Slide" button while on a storybook slide until its `onComplete()` fires

---

### 2. Auto-Comprehension Scaling (Edge Function)

New edge function `supabase/functions/generate-storybook/index.ts`:

**Input:** `{ prompt, target_vocab, cefr_level, hub_type }`

**System prompt rules:**
- Output strict JSON via tool-calling: `{ pages: [...], quiz_slides: [...] }`
- 3–5 pages, each 1–3 sentences, embedding target vocab naturally
- Quiz scaling:
  - `playground` / Pre-A1–A1 → 2 slides (`multiple` or `match` with images)
  - `academy` / A1–B2 → 3–4 slides (`truefalse` + `fill`)
  - `success` / B2–C2 → 4–5 slides (`multiple` analytical + open-ended `discussion`)
- Answers must be derivable from story text (anti-hallucination guard)

**Frontend handler** (in each creator):
1. Insert the storybook slide
2. Append returned `quiz_slides` immediately after it
3. Fire-and-forget batch image/audio generation per page using existing `ai-image-generation` and ElevenLabs flow (calls live in `useEffect` queue, results patched back into the page objects)

---

### 3. Media Analyzer (Listening Comprehension)

**Left Panel template button** (added to template list in each creator): `🎧 Add Listening Exercise` opens a new modal `src/components/creator-studio/shared/MediaAnalyzerModal.tsx`.

**Modal fields:**
- Media URL (YouTube or direct audio/video file)
- Optional pasted transcript
- "Generate Comprehension" button

**Flow:**
1. Insert a new slide `{ type: 'media_player', media_url, media_kind: 'youtube'|'audio'|'video', transcript }` — renderer uses existing video/audio player components, with a YouTube embed iframe for `youtube.com`/`youtu.be` URLs
2. Call new edge function `supabase/functions/analyze-media/index.ts` with `{ transcript, cefr_level, hub_type }`
3. If no transcript provided, the edge function returns 400 with "transcript required" (YouTube transcript fetching is out of scope for this iteration — clear toast shown)
4. Same scaling matrix as Storybook (2 / 3–4 / 4–5 quiz slides) appended directly after the media player slide

**Schema additions:** `media_player` added to `SLIDE_TYPES` and renderer switch in all three demos.

---

### Technical Details

**Files created:**
- `src/components/creator-studio/shared/StorybookEditor.tsx`
- `src/components/creator-studio/shared/StorybookRenderer.tsx`
- `src/components/creator-studio/shared/MediaAnalyzerModal.tsx`
- `src/components/creator-studio/shared/MediaPlayerRenderer.tsx`
- `supabase/functions/generate-storybook/index.ts`
- `supabase/functions/analyze-media/index.ts`

**Files edited:**
- `src/pages/PlaygroundCreator.tsx`, `AcademyCreator.tsx`, `SuccessCreator.tsx` — add slide types, makeSlide cases, sidebar inspector branching, template buttons, modal mounting
- `src/pages/PlaygroundDemo.tsx`, `AcademyDemo.tsx`, `SuccessDemo.tsx` — add render cases for `storybook` and `media_player`, gate next-slide control on storybook completion
- `supabase/config.toml` — register the two new functions (verify_jwt = false, public — auth checked in code via JWT pattern already used elsewhere)

**AI Gateway:** both new edge functions use Lovable AI Gateway (`google/gemini-3-flash-preview`) via tool-calling for structured output (pages + quiz_slides arrays). Image/audio enrichment runs from the client through the existing `ai-image-generation` function and ElevenLabs audio flow already in `SlideMediaPanel`.

**Hub-aware quiz mapping:** the `quiz_slides` returned by the edge function already conform to existing slide types (`multiple`, `truefalse`, `fill`, `match`, `discussion`) — no new renderers needed for quiz items, only for `storybook` and `media_player`.

**Auto-Summary preservation:** new appended slides are inserted *before* the trailing `lesson_summary` slide so the locked auto-summary remains the final slide.
