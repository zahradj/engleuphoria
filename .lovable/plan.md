# Classroom Slide UI Density + AI Schema Hardening

## Part 1 — UI density refactor

### 1. `EditorialVocabList.tsx` → 3D Flip-Card Grid
Replace the current "pill list" with a responsive 2/3-column grid of CSS 3D flip cards.

- Normalize each entry from any shape the AI emits: `{word|term, definition|meaning, example_sentence|sentence, image_url|imageUrl|thumbnail_url}`.
- Card sizing: `h-56`, `[perspective:1200px]`. Inner wrapper uses `[transform-style:preserve-3d]` and flips on `group-hover` (desktop) + `peer-checked` from a hidden checkbox label (touch/click).
- **Front**: `image_url` (top, `h-32 object-cover`) + bold target word centered. Fallback gradient + `BookOpen` icon when no image.
- **Back**: definition (semibold) + italic example sentence on a hub-tinted gradient, with `[transform:rotateY(180deg)] [backface-visibility:hidden]`.
- Surface a small "Tap to flip" hint and an empty-state when the array is missing.

### 2. `EditorialFillBlanks.tsx` — denser vertical list
Already supports `sentences[]`; tighten visual density so 4–5 questions fit:

- Outer padding `py-12` → `py-6`, gap `gap-8` → `gap-4`.
- Each row `p-6` → `px-4 py-3`, font `text-lg` → `text-base`.
- Input width `w-44` → `w-32`, height `h-9`, font `text-sm`.
- Numbered chip moves inline with the sentence (single row instead of stacked).
- Hint/feedback text drops to `text-[11px]`.
- "Check All Answers" button: `px-6 py-2 text-sm`.

### 3. `EditorialMatchHalves.tsx` — denser pair grid
Layout for 5–6 pairs without scroll:

- Outer `py-12 gap-8` → `py-6 gap-4`.
- Two-column grid keeps existing structure but row gap `gap-y-4` → `gap-y-2`.
- Each button `px-5 py-4 text-base` → `px-3 py-2 text-sm`, secondary "→ match" line `text-[10px]`.
- Removes title margin to free vertical space.

## Part 2 — AI brain & data fixes

### 4a. UI fallback for missing interactive_data
In `DynamicSlideRenderer.tsx`, before routing any interactive `directorType` (`fill_in_blanks`, `match_halves`, `quiz_mcq`, `sorting_game`, `sentence_builder`, `true_false`, `drag_and_match`, `drag_and_drop`, `fill_in_the_gaps`), check that `slide.interactive_data` exists AND contains the expected key (sentences/pairs/options/items/etc.). If missing, render a friendly fallback panel instead of the empty activity shell:

> "Oops! The activity data is missing. Let's discuss this topic instead!"
> Followed by `slide.title`, `slide.teacher_script` if present, and a "Continue" button.

This replaces the silent "Choose the Correct Form!" empty shell screen the user reported.

### 4b. Edge-function schema enforcement (`generate-ppp-slides/index.ts`)
Add a new **RULE 6C — INTERACTIVE_DATA IS REQUIRED** block to the system prompt:

> "For ANY slide whose slide_type is one of `quiz_mcq`, `multiple_choice`, `reading_quiz`, `listening_comprehension`, `fill_in_blanks`, `fill_in_the_gaps`, `match_halves`, `match_words`, `image_match`, `sorting_game`, `sentence_builder`, `true_false`, `drag_and_match`, or `drag_and_drop`, the `interactive_data` field is STRICTLY REQUIRED and MUST contain all keys listed in RULE 6/6B. Slides emitted without complete `interactive_data` will be rejected."

Add a server-side validator after JSON parse: any slide with one of those types and a missing/empty `interactive_data` is dropped from the deck and logged with `console.warn('[ppp] dropped malformed slide', slide.id, slide.slide_type)` so we never ship a broken activity to the classroom.

### 5. Strict Lesson Blueprint (no duplicates)
Augment the system prompt in `generate-ppp-slides` with **RULE 0 — STRICT BLUEPRINT**:

> "Unless the caller-supplied `blueprint.phases` overrides it, you MUST emit EXACTLY this 7-slide skeleton in this order: 1× `front_page` (Title) → 1× `mascot_speech` (Intro) → 1× `grammar_explanation` (Rule) → 1× `vocab_list` (4 words, flip-grid) → 1× `match_halves` (5 pairs) → 1× `fill_in_blanks` (4 sentences) → 1× `real_world_task` (Final Speaking Roleplay). NEVER emit duplicate speaking exercises, two consecutive activities of the same skill, or filler reviews."

Also add a deduplication pass after JSON parse: walk the slides and drop any second occurrence of `real_world_task`, `role_play`, or `shadowing_drill`, plus any back-to-back duplicate `slide_type` (re-using the existing RULE 5 spirit but enforced server-side).

## Files touched

- `src/components/lesson-player/editorial/EditorialVocabList.tsx` — full rewrite to flip-card grid
- `src/components/lesson-player/editorial/EditorialFillBlanks.tsx` — density tweaks
- `src/components/lesson-player/editorial/EditorialMatchHalves.tsx` — density tweaks
- `src/components/lesson-player/DynamicSlideRenderer.tsx` — pre-route validation + fallback component
- `supabase/functions/generate-ppp-slides/index.ts` — Rule 0 (blueprint), Rule 6C (required interactive_data), server-side validator + dedup pass

## Verification

1. Lesson with vocab phase shows a flippable grid; each card flips on hover/tap and exposes word + definition + example.
2. A fill-in-the-blanks slide with 4 sentences shows all 4 in one viewport (no scroll on 1148×761).
3. A match-halves slide with 5 pairs shows both columns without scroll.
4. Slide with missing `interactive_data` for an interactive type renders the friendly fallback, not the empty quiz shell.
5. Newly generated lessons follow the 7-slide skeleton exactly with no duplicate roleplays/shadowings.
