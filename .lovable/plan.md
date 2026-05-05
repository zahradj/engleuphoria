# Contextual Story & Quiz Engine

Upgrade the existing Storybook + auto-quiz pipeline (already live in Playground) to a true cross-hub engine with hub-specific layouts, vocab highlighting, scaled comprehension types, and a dedicated Story tab in every Creator.

## 1. StorybookRenderer — three real layout modes

`src/components/creator-studio/shared/StorybookRenderer.tsx`

- Extend `StorybookSlideShape` with:
  - `layout_mode?: 'classic' | 'comic' | 'case_study'` (defaults: playground=classic, academy=comic, success=case_study)
  - `theme?: 'adventure' | 'school' | 'mystery' | 'business_trip' | 'negotiation' | 'custom'`
  - `highlight_words?: string[]` (target vocab to bold inline)
- Add `<HighlightedText text words />` helper that wraps any matched target word (case-insensitive, word-boundary) in `<mark class="bg-yellow-200/70 font-extrabold rounded px-0.5">…</mark>`.
- Replace the current hub-keyed rendering with `layout_mode`-keyed rendering:
  - **Classic** (Playground default): full-bleed image top, large text bottom, page dots.
  - **Comic** (Academy default): 2-up panel grid per page (image panel + speech-bubble text panel) with rounded comic borders.
  - **Case Study** (Success default): vertical clean layout, serif body, "Scenario / Page X of Y" header, optional sidebar bullet of "Key terms" pulled from `highlight_words`.
- Keep existing `onComplete` and audio behaviour.

## 2. Edge Function — `generate-storybook` upgrade

`supabase/functions/generate-storybook/index.ts`

- Accept new fields: `theme`, `layout_mode`, `grammar_focus`.
- Inject **sentence-length rules** into the system prompt:
  - Playground: max 5–7 words per sentence, 1 sentence per page, must use 4–6 of the target vocab across the story.
  - Academy: 1–3 sentences, must use the grammar pattern at least twice.
  - Success: complex multi-clause corporate narrative, embed at least one quote and one decision point.
- Story text: instruct the model to emit each target vocab word **verbatim** so the renderer can highlight it (return them in `highlight_words`).
- **Comprehension Loop — scaled by hub** (replace today's flat quiz block):
  - Playground (Pre-A1/A1) → 3 slides: 1 visual `clickimage` ("Where is the …?"), 1 `multiple` literal, 1 `truefalse` literal.
  - Academy (A2–B1) → 4 slides: 1 literal `multiple`, 1 inference `multiple` ("Why did …?"), 1 vocabulary-in-context `fill`, 1 `truefalse`.
  - Success (B2–C2) → 5 slides: 1 literal `multiple`, 1 inference `multiple`, 1 vocab-in-context `multiple`, 1 strategic `discussion` ("How could … better?"), 1 `discussion` debate prompt.
- Tag each quiz item with `comprehension_kind: 'literal' | 'inference' | 'vocab_in_context' | 'visual' | 'strategic'` so the editor can label them.
- Return `layout_mode`, `theme`, `highlight_words` in the response so the caller can patch the storybook slide.

## 3. StorybookEditor — Story tab UI

`src/components/creator-studio/shared/StorybookEditor.tsx`

- Add two selects above the prompt:
  - **Story Theme** — Adventure, School Day, Mystery, Business Trip, Negotiation, Custom.
  - **Layout Style** — Classic / Comic / Case Study (default chosen by hub).
- Pass `theme`, `layout_mode`, `grammar_focus` (read from blueprint) into the `generate-storybook` invoke body.
- After generation, patch the storybook slide with returned `layout_mode`, `theme`, `highlight_words`, and call `onAppendQuiz` so the quiz block is inserted in the same click (already works in Playground).

## 4. Wire Story tab into Academy + Success

`src/pages/AcademyCreator.tsx`, `src/pages/SuccessCreator.tsx`

Currently both list `storybook` in the slide-type menu but render nothing for it in the right-sidebar editor. Mirror Playground's pattern:

- Import `StorybookEditor` and `StorybookRenderer`.
- Add a `📖 Story` tab in the right sidebar that mounts `StorybookEditor` when `current.type === 'storybook'`, passing `hub`, `cefrLevel`, `targetVocab`, `grammarFocus` from the blueprint, and `onAppendQuiz={(quiz) => insertAfterCurrent(mapAIQuizSlides(quiz, hub))}`.
- Render `<StorybookRenderer slide={current} hub="academy|success" />` in the central preview for `storybook` slides.
- Default `layout_mode` to `comic` for Academy and `case_study` for Success when a new storybook slide is created.

## 5. Question Editor (already mostly free)

The auto-appended comprehension slides become normal `multiple` / `truefalse` / `fill` / `discussion` / `clickimage` slides that already use the existing per-type editors — teachers can click any of them and edit the question, options, or correct answer just like any other slide. We only need to:

- Surface the `comprehension_kind` tag in `SlideEditor` as a small badge ("Literal", "Inference", "Vocabulary in Context", "Strategic", "Visual") so the teacher knows the pedagogical role of each question.

## 6. Out of scope (v1)

- Storing per-student comprehension scores into a new table.
- AI image generation styled differently per layout (comic vs case-study illustration style) — current single-style image pipeline is reused.

## Files

**Edited**
- `src/components/creator-studio/shared/StorybookRenderer.tsx`
- `src/components/creator-studio/shared/StorybookEditor.tsx`
- `src/components/creator-studio/shared/SlideEditor.tsx` (badge only)
- `src/pages/AcademyCreator.tsx`
- `src/pages/SuccessCreator.tsx`
- `supabase/functions/generate-storybook/index.ts`

**No new files, no DB migration** — `theme`, `layout_mode`, `highlight_words`, `comprehension_kind` all live inside the slide JSON already persisted in `lessons.metadata`.
