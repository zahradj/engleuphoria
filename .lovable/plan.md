## Goal

Two coordinated upgrades:

**A. AI Game Generator improvements** (per-slide game tool already lives in `ai-slide-game-generator` + `TeacherControlsPanel > GameAIGenerator`).

**B. Lesson structure & pedagogy upgrade**: Title Slides, deeper Grammar slides, and HTML color-coding of parts of speech.

---

## A. AI Game Generator Upgrades

### A1. Difficulty selector (Easy / Medium / Hard or CEFR A1–C1)
- `TeacherControlsPanel.tsx > GameAIGenerator`: add two `Select` controls — **Difficulty** (`easy | medium | hard`) and **CEFR override** (`auto | A1 | A2 | B1 | B2 | C1`). Default difficulty = `medium`, CEFR = `auto` (falls back to `activeLessonData.cefr_level`).
- Pass `difficulty` and effective `cefrLevel` to `supabase.functions.invoke('ai-slide-game-generator', { body: ... })`.
- `ai-slide-game-generator/index.ts > buildSystemPrompt`: accept `difficulty`, append calibration rules:
  - `easy` → very short sentences, 3 options max for MCQ, single-clause distractors
  - `medium` → standard
  - `hard` → multi-clause, abstract distractors, idiomatic items
- Adjust `TOOL_BY_TYPE.multiple_choice.parameters.options.maxItems` dynamically (3 for easy, 4 for medium, 5 for hard) by cloning the tool per request.

### A2. Auto-thumbnail keywords for drag-and-match
- `ai-slide-game-generator/index.ts`:
  - Make `left_thumbnail_keyword` and `right_thumbnail_keyword` **required** in the `drag_and_match` tool schema (currently optional).
  - System prompt: "For every pair, you MUST output a single concrete noun keyword for both `left_thumbnail_keyword` and `right_thumbnail_keyword`. The keyword should be the most icon-friendly noun in that card."
  - Post-process: if AI omits a keyword, derive a fallback from the card text (first noun word, lowercased).
- `TeacherControlsPanel.tsx > DragAndMatchEditor`: already shows keyword fields and thumbnail URLs — no change needed beyond ensuring keywords always populate.
- Confirm that downstream icon hydration (`mediaGeneration.ts` / `generateAllMedia`) already converts `*_thumbnail_keyword` → `*_thumbnail_url`. If missing, add a small client-side icon resolver call after generation that reuses `generateSlideImage` for each keyword (skipped if URL exists). Implementation detail confirmed during build.

### A3. Reusable game templates (topic + grammar focus)
- New UI in `GameAIGenerator`: a **"Template"** dropdown above the prompt area with built-in presets, e.g.:
  - "Vocabulary recall (any topic)"
  - "Past simple — regular verbs"
  - "Present continuous — actions"
  - "Comparatives & superlatives"
  - "Question words (Wh-)"
  - "Prepositions of place"
  - "Plus a 'Custom…' option"
- Selecting a template prefills the `userPrompt` textarea AND sends a `templateId` + `grammarFocus` field to the edge function.
- Edge function appends template-specific guardrails to the system prompt (e.g., "All MCQ stems must use past simple regular verbs ending in -ed").
- Optional convenience: a **"Apply to next N slides"** numeric input (1–5). When >1, the client loops the same generation request across the next N game slides of the same `slide_type`, awaiting each response sequentially.

---

## B. Lesson Structure: Title Slide + Deep Grammar + Color-Coding

### B1. Update AI schema in `ai-core` (`handleGenerateLesson` + `handleGenerateTrialLesson`)
- Force the **first slide** to be `slide_type: "title_page"` with shape:
  ```
  { "slide_type": "title_page", "title": "...", "subtitle": "...",
    "image_generation_prompt": "...", "phase": "warm-up" }
  ```
- Add `slide_type: "grammar_explanation"` to the schema and require these `interactive_data` fields:
  ```
  { "rule_text": "...",
    "formula": "Subject + Verb + Object",
    "explanation": "<plain-English rule>",
    "examples": ["<sentence 1>", "<sentence 2>", "<sentence 3>"],
    "common_signals": "yesterday, last week, ago" }
  ```
  Min 3 examples enforced in prompt.
- Color-coding instruction added to both system prompts:
  > When writing a `formula`, an `example` sentence, or any text inside a `grammar_explanation` slide, you MUST wrap parts of speech in HTML span tags using EXACTLY these classes:
  > - `<span class="text-blue-600 font-bold">…</span>` for Subjects/Nouns/Pronouns
  > - `<span class="text-red-600 font-bold">…</span>` for Verbs
  > - `<span class="text-green-600 font-bold">…</span>` for Adjectives
  > Output `class=` (not `className=`) — it's HTML.

### B2. Frontend renderers

**Title Page renderer** — already exists as `FrontPageSlide.tsx` and is wired in `DynamicSlideRenderer.tsx` for `directorType === 'front_page'`. Add an alias so the new AI emits `slide_type: "title_page"` and the renderer matches:
```ts
if (directorType === 'front_page' || directorType === 'title_page') { ... }
```
Pass `subtitle` through to `FrontPageSlide` (extend its props with optional `subtitle` rendered under the H1).

**Grammar renderer** — upgrade `EditorialGrammar.tsx`:
- Render `formula` in a dedicated highlighted box (mono font, slate-50, large).
- Render `examples` as a vertical stack of cards.
- Use safe HTML rendering for `formula`, each `example`, `rule_text`, and `explanation` so the colored spans appear:
  - Add a tiny inline sanitizer that allows ONLY `<span class="text-blue-600 font-bold|text-red-600 font-bold|text-green-600 font-bold">…</span>` and strips everything else, then injects via `dangerouslySetInnerHTML`.
  - No new dependency; sanitizer is ~20 lines of regex-based whitelist (faster review than adding `html-react-parser`).
- Show `common_signals` in the existing amber callout (already present).

### B3. Lesson player container
- `LessonPlayerContainer` already iterates slides and delegates to `DynamicSlideRenderer`. No changes needed beyond the alias above.

---

## Files to edit

- `supabase/functions/ai-slide-game-generator/index.ts` — difficulty, required thumbnail keywords, template/grammarFocus handling.
- `supabase/functions/ai-core/index.ts` — `handleGenerateLesson` + `handleGenerateTrialLesson` prompts: enforce title_page, deep grammar_explanation, color-coding rules.
- `src/components/creator-studio/steps/slide-studio/TeacherControlsPanel.tsx` — extend `GameAIGenerator` with Difficulty, CEFR override, Template dropdown, and "Apply to next N slides" loop.
- `src/components/lesson-player/DynamicSlideRenderer.tsx` — add `title_page` alias next to `front_page`.
- `src/components/lesson-player/editorial/FrontPageSlide.tsx` — add optional `subtitle` prop + render.
- `src/components/lesson-player/editorial/EditorialGrammar.tsx` — formula box, 3-example layout, safe HTML rendering for color-coded spans.

## Out of scope (not changing)

- Existing PPP / editorial slide types and other generators (`ai-lesson-generator`, batch orchestrators) — they keep working unchanged.
- No new npm dependencies.
