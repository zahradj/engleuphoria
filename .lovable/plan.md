## Goal

Two tightly-related changes:

**A. Single-source-of-truth blueprint inputs.** Move the three "creative" fields currently in the left `LessonBlueprintPanel` sidebar — **🔊 Target Phonics**, **🎯 Student Interests**, **🛠 Specific Needs / Goals** — into the `GenerateLessonModal` and remove them from the sidebar. The sidebar keeps only the deterministic outputs (5 vocab + grammar + Sync Slides).

**B. Pre-A1 (Ages 4-5) curriculum tier.** Add `Pre-A1` to every Playground-facing CEFR selector and teach the AI a strict phonics-only mode: no grammar, 3–4 CVC vocab, listen/look/trace slide types only.

---

## Phase 1 — Modal: absorb the three sidebar fields

`src/components/creator-studio/shared/GenerateLessonModal.tsx`

1. Add three fields **inside the existing collapsible "Blueprint Details" section**, below Target Phonics:
   - **🎯 Student Interests** (creative anchor) — placeholder `e.g. football, Pokemon, dinosaurs`.
   - **🛠 Specific Needs / Goals** — placeholder `e.g. shy speaker, exam prep, dyslexic`.
   - The existing **🔊 Target Phonics** input stays where it is, with a per-hub placeholder.
2. Extend `Props` and `GenerateLessonPayload` to carry `interests` and `specific_needs` (already had `target_phonics`). Add `defaultInterests`, `defaultNeeds`.
3. Auto-Fill prompt to `generate-gemini` is extended to also propose `interests` and `specific_needs` (skip overwriting if the teacher already typed something there).
4. `onGenerate` now returns the full payload `{ topic, level, vocabulary, grammar, target_phonics, interests, specific_needs }`.

## Phase 2 — Sidebar: strip the moved fields

`src/components/creator-studio/shared/LessonBlueprintPanel.tsx`

1. Delete the three input blocks (target_phonics, interests, specific_needs) and their labels — keep the **Target Vocabulary (5)**, **Grammar Focus**, and **Sync Slides** action.
2. Keep these fields on the `LessonBlueprint` type (they remain in state and are still passed to `sync-slides-to-blueprint` and `generate-ppp-slides`); only the sidebar UI is removed.
3. Hub Creator pages already hydrate `setBlueprint(...)` with these fields after Generate — no extra wiring needed.

## Phase 3 — Hub Creator handlers

`src/pages/PlaygroundCreator.tsx`, `AcademyCreator.tsx`, `SuccessCreator.tsx`

1. `generateWithAI(payload)` now uses `payload.interests` and `payload.specific_needs` directly (instead of reading them from the previous `blueprint`), and writes them into the hydrated blueprint so any later Sync still has them.
2. Pass `defaultInterests={blueprint?.interests}` and `defaultNeeds={blueprint?.specific_needs}` into `<GenerateLessonModal>` so re-opening the modal preserves them.

## Phase 4 — Pre-A1 across the UI

1. **`GenerateLessonModal.tsx`** — `THEME.playground.levels` becomes `['Pre-A1', 'A1', 'A2', 'B1', 'B2']`. The select renders a friendly suffix for Pre-A1 (`Pre-A1 — Ages 4-5 Phonics`).
2. **`PlaygroundCreator.tsx`** — initial `aiLevel` stays `'A1'`, but the new Pre-A1 option is offered.
3. **`src/components/creator-studio/steps/BlueprintEngine.tsx`** — add a `<SelectItem value="Pre-A1">Pre-A1 — Ages 4-5 (Phonics)</SelectItem>` above A1, gated to Playground (`hub === 'playground'`).
4. **`src/components/creator-studio/steps/blueprint/CurriculumMap.tsx`** — extend the cefr→tier map: `if (cefr === 'PRE-A1') return 'beginner'`.

## Phase 5 — AI prompts: Pre-A1 conditional rules

### 5a. Modal Auto-Fill (`generate-gemini` call inside `GenerateLessonModal.tsx`)

When `level === 'Pre-A1'`, swap the system+user prompt to:

> "Pre-A1 ages 4-5 mode: pick 3–4 phonetically decodable CVC words or ultra-basic nouns (Cat, Mat, Apple). Set `grammar` to an empty string. Phonics MUST be a single sound focus (e.g. `Short A: /æ/`, `Consonant M: /m/`). Return `{ vocabulary: string[3..4], grammar: \"\", target_phonics: string }`."

The modal's "vocab filled" gate is also relaxed for Pre-A1: only **3 vocab + phonics** required (grammar may be empty); button label stays `Generate Slides`.

### 5b. Curriculum Blueprint (`supabase/functions/plan-lesson-blueprint/index.ts`)

Inject a Pre-A1 conditional block into the system prompt (only when `cefr_level === 'Pre-A1'`):

> "PRE-A1 OVERRIDE — strict. Audience is 4–5 year-old true beginners and pre-readers. DO NOT generate grammar rules or full sentences. Output `vocabulary`: an array of EXACTLY 3 phonetically-decodable CVC words tied to one phonics focus (e.g. for `/æ/` → ['cat','mat','hat']). Output `grammar`: empty string. Output `target_phonics`: a single phoneme focus with IPA + grapheme + the 3 example words. `lesson_structure` MUST contain only `flashcard`, `multiple_choice` (Listen & Click), `drag_and_match`, and `drawing_canvas` slide types. Do not select Discovery or TaskBased frameworks — force `pedagogical_framework: 'Immersion'`."

The function still returns the same JSON shape; only contents are constrained.

### 5c. Slide generator (`supabase/functions/generate-ppp-slides/index.ts`)

The Playground branch already detects `isPreA1`. Tighten it:

- When `isPreA1 === true`:
  - Override `vocabCount` to `Math.min(targetVocab.length, 4)` (cap at 4) and skip emitting the **Phase 3 GRAMMAR** block entirely (replace with one extra `multiple` "Listen & Find the letter" slide).
  - Add the user's wording verbatim to `preA1Directive`: "DO NOT generate grammar rules or full sentences. Build the lesson solely around the target phoneme."
  - Restrict `allowed` slide set to `{ intro, phonics_focus, vocab_solo, multiple, match, drag, draw, lesson_summary }` (drop `fill`, `truefalse`, `storybook`).
  - Recompute the printed total-slide count accordingly.

## Phase 6 — Database check

Lesson creator writes to `curriculum_lessons` (column `difficulty_level` is `beginner|intermediate|advanced`, **not** CEFR). The literal CEFR string is only stored inside `content` JSONB / `ai_metadata.lesson_blueprint`. Other tables that DO check CEFR (`speaking_sessions`, `speaking_scenarios`, `student_speaking_goals`, `assessments`, `certificates`, `certificate_templates`) are not written by the creator flow, so **no migration is required**. Note in code comments that future writes of `Pre-A1` to those tables would need a CHECK update.

## Verification

- [ ] Sidebar shows only Vocab(5), Grammar, Sync Slides.
- [ ] Modal contains Topic + Level + collapsible Blueprint Details with Vocab(5), Grammar, Phonics, Interests, Needs.
- [ ] Auto-Fill populates all 5 fields (or 3 for Pre-A1, with empty grammar).
- [ ] Selecting Pre-A1 in Playground → AI returns CVC words + phonics + no grammar; generated slides contain `phonics_focus`, `vocab_solo`, `multiple`/`match`/`drag` only; no `fill`/`truefalse`; no Phase 3.
- [ ] Selecting Pre-A1 in BlueprintEngine surfaces a Pre-A1 unit and downstream functions accept it.
- [ ] Existing A1–C1 flows unchanged.
