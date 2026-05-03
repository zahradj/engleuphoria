## Academy Engine — Teen-Focused 60-Minute Lesson System

A standalone mini-app at `/academy-demo`, completely isolated from `PlaygroundDemo`. Mature visual language, indigo/purple identity, sleek interactions, restrained audio (only on listening/reading/pronunciation slides), and a top progress bar showing the 7 pedagogical blocks.

### Files to create

1. **`src/pages/AcademyDemo.tsx`** (~600 lines, single-file mini-app)
2. **`src/hooks/useAcademyAudio.ts`** (manual-trigger ElevenLabs hook — no auto-play)
3. **`src/App.tsx`** — register `/academy-demo` route with lazy import (one-line addition next to PlaygroundDemo)

No new edge function — reuses the existing `elevenlabs-tts` function (already secure with `ELEVENLABS_API_KEY`).

### Slide schema (extended for teen interactions)

Discriminated union with these `type` values:

- `intro` — block-aware title slide
- `question` — open prompt, optional response box
- `poll` — clickable bar chart with live percentages
- `opinion` — agree/disagree/neutral toggle
- `vocab` — word + definition card with "listen" button (pronunciation)
- `matching` — word ↔ meaning two-column tap-to-pair
- `reading_passage` — text passage + listen button (audio enabled)
- `listening` — audio-first (listen button prominent, then question)
- `truefalse` — sleek pill toggle
- `multiple` — A/B/C choice list (compact)
- `grammar_pattern` — side-by-side pattern card
- `error_detection` — sentence with clickable words to flag the mistake
- `correction` — input field to fix a sentence
- `fill_blank` — single input
- `sentence_builder` — drag-and-drop word tiles to reorder into correct syntax
- `debate_scale` — 1–5 rating scale for opinion prompts
- `role_play` — A/B dialogue prompt with speaking task
- `speaking_task` — prompt + optional sentence starters
- `reflection` — final wrap question

Each slide carries `block: 'warmup' | 'vocab' | 'reading' | 'grammar' | 'practice' | 'interactive' | 'speaking'` so the progress bar can highlight the active block.

### The 36-slide lesson (matches the spec)

Hardcoded `SLIDES` array implementing the exact 7-block, 36-slide flow the user provided (Phone-use lesson, A1–B1):
- Warm-up (1–3): question, poll, opinion
- Vocabulary (4–8): 3 vocab cards, matching, check
- Reading + Listening (9–13): passage, listening, comprehension Q, T/F, opinion
- Grammar (14–18): pattern, rule, example, error detection, correction
- Controlled Practice (19–24): fill blank, MCQ, sentence builder, drag-order, matching, quick quiz
- Interactive (25–32): debate, speed challenge, role play, real situation, guessing, error game, opinion scale, mini challenge
- Speaking Output (33–36): task, support, free speaking, reflection

### Design system (strict)

- **Default:** dark mode first — `bg-slate-950` base with `bg-slate-900` cards and a subtle indigo mesh gradient backdrop. Light-mode toggle button in the header.
- **Colors:** primary `bg-indigo-600` / `text-indigo-400`, accents `text-sky-400` and `text-pink-400` (used sparingly for highlights only).
- **Typography:** `font-sans` (Inter via Tailwind default). Titles `text-3xl md:text-4xl font-semibold`. Body `text-lg md:text-xl`. UI labels `text-sm uppercase tracking-wide`.
- **Buttons:** `rounded-md` sleek pills, no oversized bubble buttons. Primary: `bg-indigo-600 hover:bg-indigo-500`. Ghost: `border border-slate-700 hover:border-indigo-500`.
- **Animations:** framer-motion `opacity` + tiny `y: 4` slide on slide change ONLY. No confetti, no bounce, no scale-pop. Correct/wrong feedback uses a left-border color shift, not a shake.
- **Whitespace:** generous `py-12` slide padding, single-goal per slide.

### Restrained audio rules

- `useAcademyAudio` exposes `playVoice(text)` — never auto-plays.
- Only slides with `type` in `{ vocab, reading_passage, listening }` render the `<AudioPlayer />` button.
- Vocab slides show a small "🔊 Listen" pill next to the word (for pronunciation).
- Reading/listening slides show a prominent player with play/pause and a one-time replay counter.

### Top progress bar

Sticky header showing 7 segments labeled Warm-up · Vocab · Reading · Grammar · Practice · Interactive · Speaking. Active block: filled indigo with white label. Completed blocks: filled `indigo-900`. Upcoming: `slate-800`. A thin progress line fills inside the active segment based on current slide index within that block.

### Game components (built in-file)

- `OpinionPoll` — clickable horizontal bars; once voted, animate width to a fake distribution + show user's pick highlighted.
- `ErrorDetection` — sentence split into clickable word spans; correct word turns green, wrong turns red on click.
- `SentenceBuilder` — shuffled word tiles; click to append into answer area, click again in answer area to remove. "Check" validates order.
- `DebateScale` — 5 segmented buttons (Strongly Disagree → Strongly Agree) with selected state highlighted.
- `Matching`, `MultipleChoice`, `TrueFalse`, `FillBlank`, `Vocab`, `ReadingPassage`, `Listening`, `RolePlay`, `SpeakingTask`, `Reflection`, `GrammarPattern`, `Correction`, `Question`, `Poll`, `Opinion`, `Intro` — each minimal, mature, single-task.

### Navigation

- Compact footer bar: `← Previous`, current slide indicator (`12 / 36`), block label, `Next →`.
- Keyboard arrow support.
- No score/celebration screen — ends with the Reflection slide.

### Out of scope

- No persistence/backend writes — this is a UI/UX engine demo.
- No integration with `curriculum_lessons` or real auth.
- No shared components with `PlaygroundDemo` — strict isolation as requested.
- No new edge function — reuses `elevenlabs-tts`.

### Technical notes

- All slide content lives in a single `SLIDES: AcademySlide[]` array at the top of `AcademyDemo.tsx` so editing the lesson means editing JSON only.
- Discriminated union typing → autocompleted props in each game component.
- `framer-motion` `<AnimatePresence mode="wait">` for fade transitions.
- Tailwind only — no inline styles, no new shadcn components.
- Accessibility: focus rings on all interactive elements, aria-labels on icon buttons, sufficient contrast in both themes.
