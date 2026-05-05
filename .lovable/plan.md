# Phonics & Phonology Layer — Integration Plan

Adds a "Target Phonics/Sound" focus to the lesson Blueprint, drives hub-specific phonics behavior in the AI generators, and introduces a new `phonics_focus` slide type rendered consistently across Creator/Demo previews.

## 1. Blueprint Upgrade (The Brain)

**Type changes** — `src/components/creator-studio/steps/slide-studio/blueprintTypes.ts`
- Add `target_phonics?: { focus: string; example_words: string[]; sound_ipa?: string }` to `LessonBlueprint`.
- Loosen `isBlueprintReady` to keep phonics optional (auto-derived if omitted).

**Sidebar UI** — `src/components/creator-studio/shared/LessonBlueprintPanel.tsx`
- New field "Target Phonics / Sound" rendered under Target Grammar.
- Free-text input (e.g., "Short /a/", "Magic e", "Th- digraph") + auto-suggest button that calls the blueprint planner.
- Pinned to top alongside other blueprint fields (no scroll changes).

**Auto-generation** — `supabase/functions/plan-lesson-blueprint/index.ts`
- Extend the `emit_blueprint` tool schema with `target_phonics: { focus, example_words[], sound_ipa }`.
- Update the system prompt: phonics focus MUST be derivable from the chosen vocabulary (Cat/Bat/Hat → Short /a/). For Academy/Success, bias toward articulation pairs (v/w, th, word stress, business intonation).
- Hub-aware prompt branch:
  - Playground → synthetic phonics (single phoneme + grapheme).
  - Academy → phonetic accuracy (problem sound for teen learners).
  - Success → "Executive Pronunciation": word stress / connected speech / business intonation.

## 2. Hub-Specific Phonics Application in PPP Generator

**File** — `supabase/functions/generate-ppp-slides/index.ts`
- Pass `blueprint.target_phonics` into the system prompt and into every slide-generation call.
- Hub branches:
  - **Playground (Intensive Phonics)** — force this insertion order:
    1. Warm-up
    2. NEW `phonics_focus` slide (isolated sound + grapheme + autoPlay audio)
    3. Vocab flashcards (existing 4-stage arc)
    4. **2 phonemic-awareness mini-games** added to Phase 2 (`multiple` "Click the words that start with /b/" + `match`/`drag` segmenting game) — counted *in addition to* the existing 3 practice slides.
    5. Existing grammar / production / summary
  - **Academy** — exactly 1 `phonics_focus` slide (pronunciation pair) + 1 `listen_repeat` interactive in Phase 2.
  - **Success** — `phonics_focus` slide reframed as "Executive Pronunciation" (word stress notation, connected-speech example) + 1 `listen_repeat` drilling business intonation.
- Server-side: every generated `phonics_focus` and `listen_repeat` slide gets `voice.autoPlay = true` and a TTS-ready `audio_url` placeholder.

## 3. New Slide Type: `phonics_focus`

**Component** — `src/components/creator-studio/shared/PhonicsFocusCard.tsx` (new)
- Layout: massive centered phoneme/grapheme (Poppins, 12rem), IPA label below, large 🔊 play button.
- Click anywhere on the phoneme replays the isolated sound.
- Below: row of up to 3 example words pulled from `blueprint.target_vocabulary` that contain the sound — each clickable to play its own audio.
- Owns its own audio (no `UniversalMediaShell` wrapper) — same no-duplicate pattern as `VisualFlashcard`.

**Wiring**
- `src/components/creator-studio/shared/slideIcons.tsx` → add `phonics_focus: Volume2` (or `Megaphone`).
- `src/pages/PlaygroundCreator.tsx`, `AcademyCreator.tsx`, `SuccessCreator.tsx` previews → render `<PhonicsFocusCard>` for `slide.type === 'phonics_focus'`.
- `src/pages/PlaygroundDemo.tsx` → add `case 'phonics_focus'` rendering the same component.
- `InsertSlideButton` → expose Phonics Focus as a manual insertion option.
- SlideEditor → expose only `phoneme`, `grapheme`, `sound_ipa`, `example_words[]`, `audio_url`.

**`listen_repeat` (Academy/Success)** — minimal addition: reuse existing speaking/voice slide shape, just guarantee a `comparison_audio_url` field. No new component required for v1.

## 4. AI Media Analyzer flags Phonics

**File** — `supabase/functions/sync-slides-to-blueprint/index.ts` (and any media-analysis call site that consumes blueprint context)
- Pass `blueprint.target_phonics.focus` into the analyzer prompt.
- Ask the model to emit `phonics_hits: [{ timestamp, word, sound }]` whenever the target sound appears in narration/video transcripts; surface those as inline highlights on the affected slide.

## 5. Persistence

- `lessons.metadata` (already JSON) stores `target_phonics` alongside existing blueprint fields — no schema migration required.
- `handleSaveDraft` / `handlePublish` in all three Creator pages already serialize the full blueprint; just include the new field.

## Files Touched

**New**
- `src/components/creator-studio/shared/PhonicsFocusCard.tsx`

**Edited**
- `src/components/creator-studio/steps/slide-studio/blueprintTypes.ts`
- `src/components/creator-studio/shared/LessonBlueprintPanel.tsx`
- `src/components/creator-studio/shared/slideIcons.tsx`
- `src/components/creator-studio/shared/InsertSlideButton.tsx`
- `src/pages/PlaygroundCreator.tsx`
- `src/pages/AcademyCreator.tsx`
- `src/pages/SuccessCreator.tsx`
- `src/pages/PlaygroundDemo.tsx`
- `supabase/functions/plan-lesson-blueprint/index.ts`
- `supabase/functions/generate-ppp-slides/index.ts`
- `supabase/functions/sync-slides-to-blueprint/index.ts`

## Out of Scope (v1)

- Tracking phoneme mastery into `student_phonics_progress` from these new slides (existing Map-of-Sounds pipeline can be wired in a follow-up).
- Real-time speech grading on `listen_repeat` (uses existing phonetic-mimic engine when student opens classroom).
