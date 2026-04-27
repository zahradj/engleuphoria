## Goal

The AI now emits `drag_and_match` and `fill_in_the_gaps` slides, and the **student lesson player** already renders them (via `DynamicSlideRenderer`). But three problems remain:

1. **Creator Studio editor is blind to the new types** — `SlideType` enum, `TYPE_OPTIONS`, `SlideCanvas` switch and `TeacherControlsPanel` editor list don't include them, so the right sidebar shows blank "Slide Type"/"Layout" and the canvas falls through to a plain text/image preview.
2. **A giant hero image is forced on every slide**, squishing interactive games on tablets.
3. **No per-item thumbnails** — drag/match cards can't show small icons next to words.

This plan fixes all three in one pass.

---

## 1. Teach the Studio about the new slide types

**`src/components/creator-studio/CreatorContext.tsx`**
- Extend `SlideType` union with `'drag_and_match' | 'fill_in_the_gaps'`.
- Add interfaces:
  - `DragAndMatchPair { left_item: string; left_thumbnail_keyword?: string; left_thumbnail_url?: string; right_item: string; right_thumbnail_keyword?: string; right_thumbnail_url?: string; }`
  - `DragAndMatchData { instruction: string; pairs: DragAndMatchPair[]; }`
  - `FillInTheGapsData { instruction: string; sentence_parts: [string, string]; missing_word: string; distractors: string[]; }`
- Add to `InteractiveData` union.

**`src/components/creator-studio/steps/slide-studio/TeacherControlsPanel.tsx`**
- Add `DEFAULT_DRAG_MATCH` (3 pairs of empty strings) and `DEFAULT_FILL_GAPS`.
- Add to `TYPE_OPTIONS`:
  - `{ value: 'drag_and_match', label: 'Drag & Match Game', Icon: Layers }`
  - `{ value: 'fill_in_the_gaps', label: 'Fill in the Gaps', Icon: Type }`
- Extend `handleTypeChange` with branches that seed the new defaults.
- Build two new editor sub-components:
  - `DragAndMatchEditor` — instruction textarea + 3 rows of `(left_item, left_thumbnail_keyword, right_item, right_thumbnail_keyword)` inputs, plus add/remove pair (cap 3). Show small thumbnail circles when a `*_thumbnail_url` is already present.
  - `FillInTheGapsEditor` — instruction textarea + sentence_parts[0]/[1] inputs + missing_word input + distractors list (2–3 items).
- Wire into the type-aware editor switch (line ~292).
- **Robustness**: `<Select value={...}>` already shows the raw string when not in the list, but to also render a label gracefully, fall back to `slide.slide_type ?? 'text_image'` and let the unknown string render as the SelectValue text.

**`src/components/creator-studio/steps/slide-studio/SlideCanvas.tsx`**
- Add cases to `InteractiveBlock` switch (line 322):
  - `'drag_and_match'` → new `DragMatchPreview` component (read-only canvas preview rendering the two columns of pills with thumbnails).
  - `'fill_in_the_gaps'` → new `FillGapsPreview` component (sentence with `___` and pill row).
- Both preview components reuse the existing bouncy-pill styling for consistency with student view.
- In Teacher View (`mode === 'teacher'`), highlight the correct `right_item` / `missing_word` with a green ring (matches MCQ pattern).

---

## 2. Conditional layout — drop the hero image for full-screen games

**`SlideCanvas.tsx` — `SlideMedia` component (line 35)**
- Treat `slide_type ∈ {'drag_and_match','fill_in_the_gaps','drag_and_drop','drawing_canvas'}` as **game types**.
- For game types, render `<SafeSlideImage>` ONLY if `slide.custom_image_url` is explicitly set (teacher override). Otherwise return `null` — no hero image, the game expands to fill the card.
- Update the hint text in the type-aware editor to say "Image hidden for this layout — toggle override in Visuals tab to force one."

**`TeacherControlsPanel.tsx` — Visuals tab**
- Add a small `Switch` labeled "Show hero image for this game" (default off for game types). Wired to a new `slide.force_hero_image?: boolean` flag (added to `PPPSlide`).
- When the slide is a game type AND `force_hero_image` is false AND `custom_image_url` is empty, show a muted message: "🎮 Full-screen game mode — no hero image."

**Lesson player** (`DragAndMatch.tsx`, `FillInTheGaps.tsx`)
- Already render in their own container; bump tap-target sizing for tablet:
  - DragAndMatch buttons: `text-lg` → `text-xl md:text-2xl`, `py-4` → `py-5 md:py-6`, `min-h-[64px]`.
  - FillInTheGaps pills: `text-xl` → `text-2xl md:text-3xl`, `min-h-[64px]`, drop zone `min-w-[180px] min-h-[72px]`.
- Wrap the whole game in `w-full h-full` flex container so it fills the slide card when no hero image is present.

---

## 3. Item-level thumbnails for `drag_and_match`

**Edge function `supabase/functions/generate-ppp-slides/index.ts`**
- The schema currently flattens `interactive_data` to `interactive_data_json` (string). Keep that — no schema change needed, the AI is free to include `left_thumbnail_keyword` / `right_thumbnail_keyword` inside the JSON.
- Update RULE 4 doc string for `drag_and_match`:
  ```
  drag_and_match → {
    "instruction": string,
    "pairs": [{
      "left_item": string,
      "left_thumbnail_keyword": string | null,   // optional 1-3 word icon prompt
      "right_item": string,
      "right_thumbnail_keyword": string | null
    }]
  }  // EXACTLY 3 pairs.
  ```
- Add a one-line system rule: *"For drag_and_match where one column is a word and the other is a picture/icon target, fill the matching column's `*_thumbnail_keyword` with a simple 1–3 word icon prompt (e.g. 'red apple icon'). Leave both null for word-to-word matches."*

**Auto-generate media flow**
- Locate the existing batch image generator (`batch-generate-lesson-images`). After running per-slide image generation, walk `slide.interactive_data.pairs` and for any pair with `left_thumbnail_keyword`/`right_thumbnail_keyword` but no `*_thumbnail_url`, call `ai-image-generation` (Gemini nano-banana) with that keyword, upload to the existing `lesson-slides` bucket, and write the public URL back to the pair.
- Implementation lives in a small helper inside `batch-generate-lesson-images/index.ts` so it runs in the same orchestration step the user already triggers.

**Renderer `DragAndMatch.tsx`**
- For each pair, if `left_thumbnail_url` is present, render a `<img class="w-16 h-16 object-cover rounded-md mb-2 mx-auto">` above the `left_item` text inside the pill. Same for right column.
- Pills auto-grow vertically when a thumbnail is present.

**Editor (`DragAndMatchEditor`)**
- Show each row's thumbnail as a small avatar circle. Clicking it opens a tiny inline menu: "Generate from keyword" (calls `generateSlideImage` with the keyword and writes back `*_thumbnail_url`) or "Upload" (reuses `uploadSlideAsset`).

---

## 4. Fallback safety in the renderer

`DragAndMatch.tsx` and `FillInTheGaps.tsx` already show "No matching pairs available" / "Missing word data unavailable" when data is malformed. Upgrade these messages in the editor canvas preview only to read:
> ⚠️ Interactive data missing. Click "Regenerate slide" or fill the fields in the right panel.

---

## Files touched

- `src/components/creator-studio/CreatorContext.tsx` — extend `SlideType`, add new data interfaces, add `force_hero_image` field.
- `src/components/creator-studio/steps/slide-studio/TeacherControlsPanel.tsx` — new editors, type options, hero-image toggle.
- `src/components/creator-studio/steps/slide-studio/SlideCanvas.tsx` — `InteractiveBlock` cases, conditional `SlideMedia`, two new preview components.
- `src/components/lesson-player/activities/DragAndMatch.tsx` — larger tap targets, thumbnail rendering.
- `src/components/lesson-player/activities/FillInTheGaps.tsx` — larger tap targets, full-width layout.
- `supabase/functions/generate-ppp-slides/index.ts` — RULE 4 doc update for thumbnails (no schema change).
- `supabase/functions/batch-generate-lesson-images/index.ts` — generate per-pair thumbnails when keywords exist.

No DB migration needed — `interactive_data` is already a `jsonb` column.

## Out of scope

- Replacing HTML5 DnD with `dnd-kit` (current implementation is touch-friendly via tap-to-match; can revisit if testing shows issues).
- Adding thumbnails to `fill_in_the_gaps` (the game shape doesn't pedagogically need them — pills are short single words).