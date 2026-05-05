## Goal

Refactor the three Creator pages (Playground, Academy, Success) into a consistent professional 3-column workspace, replace the flashcard grid with a Solo Visual Flashcard, theme each hub's canvas, and add per-field AI rewrite buttons.

## 1. 3-Column Layout (shared shell)

Create `src/components/creator-studio/shared/CreatorLayout.tsx` — a reusable 3-column grid:

```text
┌──────────────┬───────────────────────────┬──────────────┐
│ NAVIGATOR    │        HERO CANVAS        │  INSPECTOR   │
│ (260px)      │      (flex, centered)     │   (360px)    │
│              │                           │              │
│ Blueprint    │  ┌───────────────────┐    │  [Content]   │
│  (sticky)    │  │  16:9 slide       │    │  [Media]     │
│ ───────────  │  │  drop-shadow      │    │  [AI Tools]  │
│ Slide 1      │  └───────────────────┘    │              │
│ Slide 2 ●    │   ◀  3 / 12  ▶            │  fields…     │
│ Slide 3      │                           │              │
└──────────────┴───────────────────────────┴──────────────┘
```

Behavior:
- Left column: collapsible Blueprint at top (uses existing `LessonBlueprintPanel`), then a vertical thumbnail list driven by `slides[]`. Active item highlighted with hub accent.
- Center: a 16:9 aspect-ratio frame (`aspect-video max-w-[920px] mx-auto rounded-2xl shadow-2xl`) hosting `PlayablePreviewPane` + `UniversalMediaShell`. Prev / index / Next controls below.
- Right: tab bar `[Content] [Media] [AI Tools]`. Content = current `SlideEditor` / specialised editors. Media = existing `SlideMediaPanel`. AI Tools = `DifficultyTunerDialog` trigger, "Sync to Blueprint", "Regenerate slide" buttons.

The three page files (`PlaygroundCreator.tsx`, `AcademyCreator.tsx`, `SuccessCreator.tsx`) get their middle/right markup replaced by `<CreatorLayout hub={…}>`. Existing state (slides, selected, blueprint, update, generation handlers) is passed as props — no business-logic changes.

## 2. Solo Visual Flashcard

Already scaffolded `SoloVocabCard.tsx` — upgrade to true 50/50 split:
- Left: full-bleed `image_url` (16:9 inside the canvas, but card is square-ish via `aspect-square md:aspect-auto`).
- Right: word in massive type (`text-7xl md:text-8xl font-extrabold`), optional definition, large rounded `🔊 Play Audio` pill bound to `card.audio_url` (TTS fallback to `voice.text`).
- Hub-themed palette already wired.

Slide engine changes:
- Add new slide type `'vocab_solo'` with `{ word, definition?, image_url?, audio_url?, voice? }`.
- `SlideRenderer` in all three Demo files routes `vocab_solo` → `SoloVocabCard`.
- `SlideMediaPanel` flashcard tab: when `slide.type === 'vocab_solo'`, hide the multi-card list and show a single editor (Word, Definition, Generate Image, Generate Audio).
- Migration helper: when an old multi-flashcard slide is opened, offer "Split into Solo cards" (one new slide per card). The previously added Playground "first-card" preview (UniversalMediaShell branch) stays as a transitional render.

## 3. Hub-Specific Canvas Styling

Add a `hubTheme` map consumed by `CreatorLayout` + `PlayablePreviewPane`:

| Hub        | Canvas bg                        | Font (canvas)         | Accent   | Corners |
|------------|----------------------------------|-----------------------|----------|---------|
| Playground | warm gradient orange→yellow      | rounded display (Fredoka / Baloo) | orange   | rounded-3xl |
| Academy    | subtle off-white grid            | Inter                 | indigo   | rounded-xl |
| Success    | dark navy (`#0B1220`) + serif    | Playfair / Lora head, Inter body | gold-on-navy | rounded-lg |

Implemented via Tailwind classes (semantic tokens) and a single `font-*` class injected on the canvas root. No new global font files unless missing — rely on the existing Inter/Fredoka/Playfair imports in `index.css` (verify and add via `@import` if absent).

## 4. Magic-Wand Field Rewrites

New tiny component `WandFieldButton.tsx`:

```tsx
<WandFieldButton field="title" slide={slide} blueprint={blueprint}
                 onResult={(text) => update({ title: text })} />
```

It calls a new edge function `rewrite-slide-field` with `{ field, current_value, slide_type, blueprint, hub, cefr_level }` returning `{ value: string }`. Function uses Lovable AI Gateway (Gemini Flash) with a tight prompt: "Rewrite ONLY the {field} for a {hub} slide aligned to vocabulary={…} and grammar={…}. Return JSON {value}."

Mounted next to each text Input/Textarea inside `SlideEditor` and the Solo Vocab editor (Title, Question, Statement, Word, Definition, Instruction, Prompt). Loader spinner on the wand icon while running; toast on success/failure.

## 5. Slide Transitions (answering your last question — recommended ON)

Yes — adding subtle motion massively lifts perceived quality.

- Wrap the active slide inside `PlayablePreviewPane` with `<AnimatePresence mode="wait">` + `motion.div key={playIndex}`.
- Variants:
  - `initial: { opacity: 0, x: 40 }`
  - `animate: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } }`
  - `exit:    { opacity: 0, x: -40, transition: { duration: 0.18, ease: 'easeIn' } }`
- Direction-aware: store last navigation direction so Prev slides in from the left.
- Respect `prefers-reduced-motion` (skip transform, keep fade).

## Technical Details

- New files
  - `src/components/creator-studio/shared/CreatorLayout.tsx`
  - `src/components/creator-studio/shared/WandFieldButton.tsx`
  - `src/components/creator-studio/shared/hubTheme.ts`
  - `supabase/functions/rewrite-slide-field/index.ts` (+ `supabase/config.toml` entry, `verify_jwt = false`)
- Edited files
  - `src/pages/PlaygroundCreator.tsx`, `AcademyCreator.tsx`, `SuccessCreator.tsx` — swap middle/right markup for `CreatorLayout`, pass props.
  - `src/components/creator-studio/shared/PlayablePreviewPane.tsx` — 16:9 frame, AnimatePresence transitions, hub theming.
  - `src/components/creator-studio/shared/SoloVocabCard.tsx` — strict 50/50 layout, larger type, audio pill.
  - `src/components/creator-studio/shared/SlideMediaPanel.tsx` — vocab_solo single-card editor branch.
  - `src/pages/PlaygroundDemo.tsx`, `AcademyDemo.tsx`, `SuccessDemo.tsx` — register `vocab_solo` slide type in `Slide` union and `SlideRenderer` switch.
  - `src/components/creator-studio/shared/SlideTemplatesDialog.tsx` (or equivalent) — add "Solo Vocab Card" template.
  - `index.css` / `tailwind.config.ts` — register Fredoka + Playfair font families if not already imported, add `font-display-rounded`, `font-serif-premium` semantic tokens.

- Backwards compatibility: old `match` / multi-flashcard slides keep working; vocab_solo is additive.

- Edge function call uses `supabase.functions.invoke('rewrite-slide-field', { body })`; response shape `{ value }`. Failure → keep existing field, toast error.

## Out of Scope

- Drag-to-reorder thumbnails (existing chevron buttons remain).
- Storing per-hub font preferences in DB (theme is hard-coded by hub).
- Real-time collaboration cursors.
