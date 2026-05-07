# Smart Slides Engine

Three upgrades to the Creator Studio + slide renderer that turn single-shot activities into intensive, AI-extendable practice and make grammar visually parsable at a glance.

## Phase 1 — Array-based activity slides ("Intensive Practice")

Today, `error_detection`, `correction`, and `fill_blank` slides hold **one** sentence each. We refactor them to hold an **array of items** while staying backwards-compatible with all existing single-item lessons.

### New slide shapes (Academy + Playground + Success creators)

```ts
type ErrorDetectionItem = { sentence: string; wrongIndex: number };
type CorrectionItem     = { wrong: string; answer: string };
type FillBlankItem      = { before: string; answer: string; after: string };

// error_detection
{ type: 'error_detection', block, prompt, items: ErrorDetectionItem[] }
// correction
{ type: 'correction',      block, prompt, items: CorrectionItem[] }
// fill_blank
{ type: 'fill_blank',      block, prompt, items: FillBlankItem[] }
```

### Backwards compatibility shim

A tiny `normalizeActivityItems(slide)` helper (in `src/utils/creatorHydration.ts`) lifts legacy `{ sentence, wrongIndex }` / `{ wrong, answer }` / `{ before, answer, after }` into a single-element `items[]` at read time. Old saved lessons keep working unchanged; new ones are saved in array form.

### Editor UI (AcademyCreator → also reused in Playground/Success)

Replace the single-row editor with a `DynamicListEditor` (already exists in `src/components/creator-studio/shared/DynamicListEditor.tsx`):

- Each row = one practice item with its own inputs + a trash icon.
- Footer button **"+ Add new item"**.
- New header button: ✨ **Generate 3 More** (see below).

### "Generate 3 More" button

New edge function **`generate-practice-items`** (Lovable AI Gateway, `google/gemini-3-flash-preview`).

Request body:
```ts
{
  slide_type: 'error_detection' | 'correction' | 'fill_blank',
  count: number,                    // default 3
  existing_items: any[],            // to avoid duplicates
  blueprint: LessonBlueprint,       // vocab + grammar rule
  hub: 'playground' | 'academy' | 'success',
  cefr_level: string
}
```

Returns `{ items: T[] }` typed-via-tool-calling (structured output) so we never parse free-form JSON. The frontend appends them to `slide.items` with a toast confirmation.

### Stage / classroom rendering

`AcademyDemo.tsx` (and the other two demo renderers) gets updated `ErrorDetectionSlide` / `CorrectionSlide` / `FillBlankSlide` that:

- Iterate over `items[]`.
- Show one-at-a-time pager (Next →) **OR** a vertical stack (toggle via `slide.layout: 'pager' | 'list'`, default `'pager'` for kids, `'list'` for teens/adults).
- Score is `correct / total` and is broadcast through the existing student-action channel so the teacher's live HUD sees per-item progress.

Because `CreatorSlideRenderer` already routes these slide types into the demo renderers, the classroom inherits the upgrade automatically — no separate classroom work required.

## Phase 2 — Visual Grammar (color-coded markup)

Extend the safe-HTML pipeline already in `EditorialGrammar.tsx`.

### Authoring markup

The AI (and teachers) can wrap words with semantic tags:

```
The cat <verb>jumped</verb> over the <noun>wall</noun>.
She is <adjective>happy</adjective>.
He <target>has been working</target> all day.
```

### Parser

Add `parseGrammarMarkup(text)` in `src/components/lesson-player/RichText.tsx` (next to existing `**bold**` parser). It converts whitelisted tags to safe spans:

| Tag | Class |
|---|---|
| `<verb>…</verb>` | `font-bold text-red-600` |
| `<noun>…</noun>` | `font-bold text-blue-600` |
| `<adjective>…</adjective>` | `font-bold text-green-600` |
| `<target>…</target>` | `font-bold bg-yellow-200 text-slate-900 px-1 rounded` |

Implementation: regex tokenizer (no `dangerouslySetInnerHTML`) that emits React nodes — XSS-safe by construction. Unknown tags are stripped; `&<>` are escaped.

### Wiring

- `EditorialGrammar.tsx` `examples`, `formula`, `rule_text` use the new parser instead of `sanitizeGrammarHtml`. The legacy color-span sanitizer is kept as a fallback for already-generated lessons.
- `AcademyDemo.tsx` `GrammarPatternSlide` / `ReadingPassageSlide` / `RichText` pick up the same parser so highlights show in the classroom too.
- Update `generate-ppp-slides`, `generate-blueprint`, and the new `generate-practice-items` system prompts to **emit** these tags around target structures (one-line addition: "When showing the target grammar in any example, wrap it in `<target>…</target>`. You may also wrap a verb/noun/adjective with `<verb>`, `<noun>`, `<adjective>` to highlight word class.").

### Editor preview

In the `grammar_pattern` slide editor, render a small live preview below the textarea using the same parser, so teachers see exactly what students will see.

## Phase 3 — Universal "🔄 Rewrite with AI" per block

Reuse the existing `WandFieldButton` (`src/components/creator-studio/shared/WandFieldButton.tsx`) which already calls the `rewrite-slide-field` edge function.

We extend its placement, not its logic:

1. **Every text input / textarea** in the slide editor (`title`, `prompt`, `rule`, `passage`, `question`, `statement`, `lineA/lineB`, vocab `definition` / `example`, etc.) gets a tiny `<WandFieldButton>` floated to the right of its label.
2. **Every array row** (option in MCQ, pair in matching, item in error-detection list, etc.) gets a per-row 🔄 button beside the trash icon. It calls `rewrite-slide-field` with `field: 'option' | 'pair.left' | 'item.sentence'…` and patches just that one cell.
3. The Studio passes the current `LessonBlueprint` (already in `SlideStudio` state) into every wand button so rewrites stay on-topic.

A small helper component `<FieldWithWand label value onChange field/>` wraps the common pattern so we don't repeat `<Field>` + `<input>` + `<WandFieldButton>` 60 times.

## Files to touch

**New**
- `supabase/functions/generate-practice-items/index.ts` — array generator (tool-calling for typed output).
- `src/components/creator-studio/shared/FieldWithWand.tsx` — labeled input + inline 🔄.
- `src/components/lesson-player/grammarMarkup.tsx` — `parseGrammarMarkup` React parser.

**Edited**
- `src/pages/AcademyDemo.tsx` — slide types switch to `items[]`; renderers iterate; grammar slides use new parser.
- `src/pages/AcademyCreator.tsx` — editors for `error_detection` / `correction` / `fill_blank` use `DynamicListEditor` + ✨ Generate 3 More; sprinkle 🔄 wand buttons everywhere.
- `src/pages/PlaygroundCreator.tsx`, `src/pages/SuccessCreator.tsx` — same editor treatment.
- `src/utils/creatorHydration.ts` — `normalizeActivityItems` legacy shim.
- `src/components/lesson-player/editorial/EditorialGrammar.tsx` — use new parser.
- `src/components/lesson-player/RichText.tsx` — re-export parser, keep `**bold**` behavior.
- `src/components/creator-studio/shared/slideTemplates.ts` — defaults emit `items: [...]`.
- `supabase/functions/generate-blueprint/index.ts` and `generate-ppp-slides/index.ts` — system-prompt addendum to emit `<target>` markup and array-form practice slides.

## Out of scope (this round)

- No DB schema change — slides are JSON; the new `items[]` lives inside the existing `slide_data` JSON column. Already-saved lessons keep rendering via the legacy shim.
- No change to classroom realtime sync; per-item answers ride the existing `student_action` channel.
- No change to Playground game canvases or storybook viewer.

## Acceptance checks

1. Open Academy Creator → add an `Error Detection` slide → see a list with one item → click ✨ **Generate 3 More** → 3 contextually-aligned sentences are appended (verified by checking edge function returns 4 items in network panel).
2. Click 🔄 on any single sentence/option → only that field updates; rest of slide unchanged.
3. Generate a grammar slide via AI → `<target>has been working</target>` renders highlighted yellow in both the Creator preview and the live `/classroom/:id` stage.
4. Open an existing pre-upgrade lesson (single-sentence `error_detection`) → still renders correctly (legacy shim).
