# Add multi-item support to Multiple Choice, True/False, Sentence Builder

## Problem

In the Academy Creator (current route `/academy-creator`), three activity slide types only allow **one** question per slide:

- `#12 multiple` — Multiple Choice (Reading Comprehension)
- `#13 truefalse` — True / False
- `#18 sentence_builder` — Sentence Builder

The user wants to add **more questions/statements/sentence-builder rounds inside the same slide**, the way `error_detection`, `correction`, and `fill_blank` already work via the `PracticeItemsEditor` (with ✨ "Generate 3 More" and ➕ "Add new item").

## Solution

Lift these three slide types to the same `items: [...]` shape as the other practice slides, with full backwards compatibility for legacy single-item lessons.

### 1. Slide type contract (`src/pages/AcademyDemo.tsx`)

Extend the three slide variants to optionally carry `items[]`:

```ts
| { type: 'truefalse'; block: Block; statement?: string; answer?: boolean;
    items?: { statement: string; answer: boolean }[] }
| { type: 'multiple';  block: Block; question?: string; options?: string[]; answer?: string;
    items?: { question: string; options: string[]; answer: string }[] }
| { type: 'sentence_builder'; block: Block; prompt: string;
    words?: string[]; answer?: string[];
    items?: { words: string[]; answer: string[] }[] }
```

The runtime renderers (`TrueFalseSlide`, `MultipleSlide`, `SentenceBuilderSlide`) get a tiny normalizer that returns `items[]` (lifts the legacy single fields into a 1-item array if `items` is absent), then renders each item in sequence inside the same slide shell (vertical stack, same theming, no layout repaint).

### 2. Normalizer helpers (`src/utils/practiceItemNormalize.ts`)

Add three small functions next to the existing ones:

- `getMultipleItems(slide)` → `{ question, options, answer }[]`
- `getTrueFalseItems(slide)` → `{ statement, answer }[]`
- `getSentenceBuilderItems(slide)` → `{ words, answer }[]`

Each follows the existing pattern (prefer `items[]`, fall back to legacy fields).

### 3. Editor (`src/pages/AcademyCreator.tsx`)

Replace the three single-field editor blocks (lines 1197–1223 and 1339–1352) with `PracticeItemsEditor` instances — same UX as `error_detection`/`correction`/`fill_blank`: per-row edit, 🗑 delete, 🔄 rewrite-with-AI, ➕ "Add new item", ✨ "Generate 3 More".

`makeBlankSlide` keeps creating a 1-item slide using the new `items` shape so new slides are consistent.

### 4. AI generation (`supabase/functions/generate-practice-items/index.ts`)

Teach this function three new `slide_type` values: `multiple`, `truefalse`, `sentence_builder`. Each gets its own schema hint so Gemini returns the right JSON shape:

- `multiple` → `{ items: [{ question, options:[...4], answer }] }`
- `truefalse` → `{ items: [{ statement, answer: boolean }] }`
- `sentence_builder` → `{ items: [{ words:[...], answer:[...] }] }`

Blueprint context (CEFR, vocabulary, grammar, hub) is already forwarded — no caller changes needed.

### 5. Player-side parity

The two consumers of these slides:

- `src/pages/AcademyDemo.tsx` renderers — updated as above.
- Any export/preview pipelines that walk slides by `.question` / `.statement` / `.words` — search and patch to iterate `items[]` when present. Specifically: `slidePreview()` in `AcademyCreator.tsx:151-152` (use first item's text as the card label) and `mapAIQuizSlides` (if it materializes these types).

### 6. Backwards compatibility

- Any existing lesson stored with `{ question, options, answer }` continues to render via the normalizer.
- Saving an old slide after edit migrates it to `items[]` and clears the legacy fields (same pattern already used for `error_detection` at line 1260).

## Out of scope

- Playground Creator and Success Creator are **not** modified in this pass (user is on `/academy-creator`). If they should match, that's a follow-up — say the word.
- No changes to auth, routing, generator pipeline, governance, or creator-studio internals.
- No visual repaint — same Flat 2.0 styling, same `inputCls`, same `PracticeItemsEditor` shell.

## Files touched

- `src/pages/AcademyDemo.tsx` — slide types + 3 renderers
- `src/pages/AcademyCreator.tsx` — 3 editor blocks + `makeBlankSlide` + `slidePreview`
- `src/utils/practiceItemNormalize.ts` — 3 new helpers
- `supabase/functions/generate-practice-items/index.ts` — 3 new slide_type branches
