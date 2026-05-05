## Playground Hub Refactor — Pre-A1, Visual Flashcards, Ordered Flow

### 1. Pre-A1 / B2 Level Selector
**File:** `src/pages/PlaygroundCreator.tsx` (line 833)
- Replace `['A1','A2','B1']` with `['Pre-A1','A1','A2','B1','B2']` in the AI Wizard CEFR `<select>`.
- Default `aiLevel` stays `'A1'`. Persisted `level` field on save/publish currently hardcoded to `'A1'` — switch it to use `aiLevel` so Pre-A1 lessons round-trip correctly.

### 2. Pre-A1 AI Mode (Listen & Choose Bias)
**File:** `supabase/functions/generate-ppp-slides/index.ts` (Playground branch, ~line 79)
- Add a `isPreA1 = cefr_level === 'Pre-A1'` flag. When true, append a strict directive to `playgroundSystem`:
  - "Pre-A1 students cannot read. Minimize on-screen text. EVERY slide must include audio via the `voice` object. Bias the deck toward `multiple` and `match` where the prompt is delivered by audio and the choices are images. Use `image_url` placeholders heavily; avoid `fill` slides entirely."
- Force `voice.autoPlay = true` server-side on every Playground slide regardless of level (post-process loop near line 188).

### 3. Dedicated VisualFlashcard Component (No Duplicate Images)
**New file:** `src/components/creator-studio/shared/VisualFlashcard.tsx`
- Strict 50/50 grid: left = full-bleed AI image, right = single huge word in primary-school typography (Fredoka/Poppins ExtraBold), plus a large 🔊 Play button.
- This is essentially a hardened wrapper around the existing `SoloVocabCard` but **owns its own image** — no outer media shell renders an image alongside it.

**Integration:**
- `PlaygroundCreator.tsx` preview renderer (line 665–684): when `slide.type === 'vocab_solo'`, render `<VisualFlashcard …/>` directly, **without** the outer `UniversalMediaShell`'s hero strip. Already passes `suppressImage`, but legacy logic also reads `slide.flashcards[0]` — switch to reading the slide's own `word`/`image_url` fields so a single source of truth exists.
- `PlaygroundDemo.tsx` `case 'vocab_solo'` (line 560): replace `SoloVocabCard` with `VisualFlashcard`.
- `makeSlide('vocab_solo')` (line 96) already produces a single-image shape — confirm the editor in `PlaygroundCreator` (line 1126) does NOT render a second `ImageField`. Currently it renders one image — keep it; remove any duplicate hero image rendering in the preview path.

### 4. Kid-Friendly Lesson Sequence (AI Flow Order)
**File:** `supabase/functions/generate-ppp-slides/index.ts` Playground branch
- Rewrite the `playgroundSystem` "RULES" section to enforce a 4-stage arc:
  1. **Presentation:** 5–8 `vocab_solo` slides (one per target word).
  2. **Practice:** 2–3 `match` and `drag` slides (image↔word).
  3. **Grammar Stimulation:** 1–2 `fill` or `multiple` slides using a simple frame ("I see a ____").
  4. **Production:** 1 `storybook` or `canvas_game` recycling all words.
  5. End with `lesson_summary`.
- Add `vocab_solo`, `storybook`, `canvas_game` to the `allowed` set (line 100).
- Post-generation: validate the order; if missing a stage, log and continue (don't fail).

### 5. Audio-Visual Synchronization (Auto-Play)
- Already supported by `UniversalMediaShell` (`autoPlay = voice.autoPlay ?? (hub === 'playground')`).
- Server-side: ensure every generated slide carries `voice.autoPlay = true` (post-process loop, see #2).
- `VisualFlashcard`: auto-play `audio_url` (or TTS fallback) on mount via `useEffect`.

### 6. UI Cleanup — Image-First Editor
**File:** `src/pages/PlaygroundCreator.tsx` SlideEditor (lines ~1090–1145)
- For interactive types `multiple`, `truefalse`, `drag`, `match`, `fill`: hide the "Title"/"Subtitle" fields when present; keep only the pedagogically essential fields (question/instruction + image + answer + voice).
- The `intro` and `lesson_summary` slides keep their titles.

### 7. Pre-A1 Feedback Loop (Pro Tip)
**Files:** existing answer handlers in `PlaygroundDemo.tsx` interactive renderers
- On correct: trigger existing confetti + play a short "star" SFX (`/sounds/star.mp3` placeholder asset path; user adds file later).
- On wrong: play a soft "boing" SFX and visually spring back the dragged element (CSS `transition` + `transform: scale(0.95)` flash). Implement only if file references exist; otherwise stub the asset paths and document.

---

### Files Created
- `src/components/creator-studio/shared/VisualFlashcard.tsx`

### Files Edited
- `src/pages/PlaygroundCreator.tsx` — level options, persist `aiLevel`, swap to `VisualFlashcard`, hide title fields on interactive editors
- `src/pages/PlaygroundDemo.tsx` — render `VisualFlashcard` for `vocab_solo`, add SFX hooks
- `supabase/functions/generate-ppp-slides/index.ts` — Pre-A1 directive, force `autoPlay`, allow vocab_solo/storybook/canvas_game, ordered 4-stage arc
- `supabase/functions/plan-lesson-blueprint/index.ts` — accept `Pre-A1` and `B2` levels (currently just passes through; verify no whitelist exists)

### Out of Scope
- Adding new SFX audio files to the repo (will reference paths only).
- Rewriting `SoloVocabCard` — kept as legacy alias re-exporting `VisualFlashcard` to avoid breaking other hubs.
