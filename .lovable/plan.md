# Cycle 3 Plan — Homework Guard, Creator Blocks & Infinite Arcade

GATEKEEPER: No Cycle 1 onboarding/placement-test files will be touched. All work scoped to creator pages, student dashboard `/dashboard/games`, and a new `learning_games` table.

---

## Part A — Homework Generation Guard (frontend hardening)

**Files:** `src/pages/AcademyCreator.tsx`, `src/pages/PlaygroundCreator.tsx`, `src/pages/SuccessCreator.tsx` (and shared homework button if extracted).

1. Before invoking `generate-homework`, compute `vocabArray` from the lesson's blueprint / `vocabulary_list`.
2. If `vocabArray.length < 3`:
   - Block the call.
   - Toast (sonner): *"Please add at least 3 vocabulary words to this lesson before generating homework."*
   - Disable the **Generate Homework** button + tooltip explaining the minimum.
3. Wrap the invoke in `try/catch`. On any error, surface a friendly toast (parsing `INSUFFICIENT_VOCABULARY` → hint message; everything else → generic *"Couldn't generate homework. Please try again."*). No raw red overlays.

---

## Part B — Interactive Creator Blocks (Block-based slide builder)

New folder: `src/components/creator/blocks/`

1. **`SpinningWheelBlock.tsx`** — SVG/CSS wheel, 2–8 configurable segments, randomized spin via CSS `transform: rotate()` with eased transition + pointer arrow.
2. **`LogicMatrixBlock.tsx`** — Editable grid (rows × cols headers). Cells cycle: empty → ✓ → ✗.
3. **`ConjugationBlock.tsx`** — Two columns of cards; click-to-pair connector lines (no DnD needed for v1, simpler+mobile-friendly).

Each block exports a uniform interface `{ config, onChange, mode: 'edit' | 'play' }` so the slide canvas can stack them. Register them in a `blockRegistry.ts` so the canvas insert menu picks them up.

---

## Part C — Student Grammar Arcade `/dashboard/games`

### C1. Database

New migration: `learning_games` table
- `game_type` text (`sentence_builder` | `verb_trio` | `interview` | `sorting`)
- `level` text (CEFR `A1`–`C1`)
- `title`, `description`
- `content_json` jsonb (engine-specific payload)
- `created_by` uuid (teacher), `is_published` bool
- RLS: published rows readable by all authenticated students; teachers can CRUD own rows; admin bypass.

### C2. Routing & Hub
- Add `/dashboard/games` route (student-protected) → `GamesHub.tsx`.
- Hub: arcade-style card grid; queries `learning_games` filtered by the student's CEFR level (from `student_cefr_progress` / profile).
- Top section keeps curated cards (Past Simple, Present Perfect, Modals, Irregular Verbs) that filter by tag if no DB games yet.

### C3. Universal Sorting Engine
**`<GrammarSortingGame />`** using `@dnd-kit/core` (already lighter than html5 DnD on touch).
- 3–5 drop buckets, draggable word cards.
- Correct → green pulse + soft "ding" (web audio). Wrong → snap back.
- Accepts JSON prop: `{ buckets: [...], words: [{text, correctBucket}] }`.

### C4. Three Game Engines
1. **`<SentenceBuilderGame />`** — scattered word chips + horizontal drop line; success when ordered array equals `correctOrder`.
2. **`<VerbMatchingGame />`** — three columns (Present / Past / Past Participle); click two cards in different columns to link; trio completes when all three match.
3. **`<InterviewGame />`** — chat UI: avatar prompt bubble + 3 reply chips. Wrong answer shows confused reaction; correct advances script.

### C5. Universal Wrapper
**`<GamePlayer gameId={id} />`**
- Loads row from `learning_games`.
- Switches on `game_type` → mounts the right engine, passing `content_json`.
- Reports completion → calls existing `award-xp` edge function.

---

## Technical Details

- **Stack additions:** `@dnd-kit/core` + `@dnd-kit/sortable` (for sentence builder & sorting).
- **Audio:** tiny base64 `ding`/`buzz` in `src/assets/audio/` to avoid network.
- **Theming:** all blocks/games use semantic tokens; hub-aware accent colors via existing hub branding tokens.
- **XP hook:** reuse `award-xp` with `eventType: 'game_complete'`.
- **Types:** regenerate Supabase types after `learning_games` migration.

## Out of Scope (this plan)
- Teacher publishing UI for `learning_games` (will be Cycle 3.2 — current creator just gets the building blocks).
- Multiplayer / leaderboard.
- Any onboarding or placement-test changes.

## Execution Order
1. Part A guard (small, ships fast, fixes live error).
2. Migration for `learning_games` + RLS.
3. Engines + GamePlayer + GamesHub.
4. Creator blocks + registry.
