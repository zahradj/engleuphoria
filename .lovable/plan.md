
# Academy Hub — Classroom Viewer, Slide Creator & 60-min Lesson

Build a teen-focused (12–17, A1–B1) lesson system mirroring the existing Playground architecture but with the mature Academy aesthetic already established at `/academy-demo`.

## What exists today
- `src/pages/AcademyDemo.tsx` — engine + 19 slide components + 36-slide demo lesson, indigo/purple theme, 7-block progress bar.
- `src/hooks/useAcademyAudio.ts` — manual-trigger ElevenLabs TTS (Sarah voice).
- `src/pages/PlaygroundCreator.tsx` — reference architecture for an authoring tool that imports the engine's `SlideRenderer`.

We will reuse the Academy engine (single source of truth) and add two new pages: a focused classroom viewer and a teacher creator.

## Deliverables

### 1. Refactor `AcademyDemo.tsx` to expose the engine
- Export the `Slide` union type and `SlideRenderer` component (currently internal).
- Export a `BLOCKS` constant + `BlockProgress` header component so the viewer/creator share it.
- No visual change to the existing demo route.

### 2. New page: `/academy-classroom` — Classroom Viewer
File: `src/pages/AcademyClassroom.tsx`

Layout:
```text
┌──────────────────────────────────────────────┐
│  ENGLEUPHORIA · ACADEMY    [12 / 40]   [⛶]  │  ← top bar
├──────────────────────────────────────────────┤
│  ●━━━●━━━●━━━○━━━○━━━○━━━○                  │  ← 7-block progress
│  Warm  Vocab Read Gram Prac Inter Speak     │
├──────────────────────────────────────────────┤
│                                              │
│         ┌────────────────────────┐           │
│         │                        │           │
│         │      SLIDE (75% w)     │           │  ← centered, large
│         │                        │           │
│         └────────────────────────┘           │
│                                              │
│   [← Prev]   🔊 Listen  🎤 Speak   [Next →] │
└──────────────────────────────────────────────┘
```

- Slide canvas fills 75–85% width, centered, soft purple gradient backdrop.
- Smooth fade/slide transitions via framer-motion.
- Conditional toolbar: 🔊 Listen button only when `slide.voice` exists; 🎤 Speak indicator only on speaking-block slides.
- Keyboard nav: ←/→/Space.
- Optional fullscreen toggle (Fullscreen API).
- Reads lesson from URL `?lesson=<id>` or falls back to the preloaded 60-min lesson.

### 3. New page: `/academy-creator` — Teacher Slide Editor
File: `src/pages/AcademyCreator.tsx`

Three-column layout (mirrors `PlaygroundCreator` but Academy-styled):
- **Left:** slide list grouped by block (Warm-up → Speaking), reorder/duplicate/delete, "Add slide" picker by type.
- **Middle:** type-aware property editor with clean form fields:
  - Common: title, block (dropdown), voice text (optional).
  - Per type: question/options/answer (quiz), statement/answer (T/F), passage (reading), pattern/rule/examples (grammar), pairs (matching), word bank + answer order (sentence builder), prompt (speaking), scale labels (debate scale), poll options + percentages, etc.
- **Right:** live mini-preview using the shared `SlideRenderer`.
- Top bar: Import JSON / Export JSON / raw JSON editor / "Open in Classroom" (jumps to viewer).
- Lesson metadata: title, level (A1/A2/B1), duration.

### 4. Preloaded 60-minute lesson — "Social Media & Daily Habits"
File: `src/data/academyLessons/socialMediaHabits.ts`

~38 slides exported as a `LessonDeck` constant, structured exactly as requested:

| Block | Slides | Content highlights |
|---|---|---|
| Warm-up | 3 | Opinion Q ("Do you use your phone every day?"), poll (hours/day), follow-up discussion |
| Vocabulary | 5 | scroll, post, spend time, check, upload — each with definition + example; +1 matching, +1 quick quiz |
| Reading + Listening | 5 | "Hi, I'm Alex…" passage, audio-enabled listening slide (ElevenLabs), 2 comprehension Qs, T/F, opinion |
| Grammar | 5 | Present Simple (he/she/it): pattern, rule, example, error detection, correction |
| Controlled Practice | 6 | Fill-blank, MCQ, sentence builder, drag-to-order, matching, quick quiz |
| Interactive | 8 | Debate scale, timed speed challenge, role-play, real-life scenario, guessing, error-correction game, 1–5 opinion scale, mini speaking |
| Speaking Output | 4 | Guided speaking, sentence frames, free speaking prompt, reflection |
| Bonus | 4–6 | Extra debate, fast quiz, group discussion, wrap-up summary |

Audio (`voice`) attached **only** to: reading passage, listening slide, pronunciation moments. Never on every slide.

### 5. Routes (in `src/App.tsx`)
```ts
const AcademyClassroom = lazy(() => import("./pages/AcademyClassroom"));
const AcademyCreator   = lazy(() => import("./pages/AcademyCreator"));
// + <Route path="/academy-classroom" .../>
// + <Route path="/academy-creator"   .../>
```

## Design system (locked)
- **Palette:** indigo-600 / purple-700 primary; slate text; soft purple-50 backgrounds; subtle shadow-md.
- **Typography:** titles 32–44px, body 18–24px, Inter/system sans.
- **No** confetti, no cartoons, no auto-play audio, ≤1 emoji per slide. Subtle framer-motion fades only.
- Slide content centered, max-width ~960px, generous whitespace.

## Technical notes
- Single source of truth: `SlideRenderer` is exported from `AcademyDemo.tsx` and used by Classroom + Creator + the existing demo. Adding a new slide type means editing one file.
- Lesson decks are typed `{ id, title, level, blocks: Slide[][] }` so the Creator can group by block and the viewer can render the progress bar without recomputation.
- ElevenLabs voice already wired via existing `elevenlabs-tts` edge function — no backend changes needed.
- Import/Export uses plain JSON download/upload; no DB persistence in this iteration (can be added later by saving lesson decks to a `curriculum_lessons` row).

## Files touched
- ✏️ `src/pages/AcademyDemo.tsx` — export `Slide`, `SlideRenderer`, `BLOCKS`, `BlockProgress`
- ➕ `src/pages/AcademyClassroom.tsx`
- ➕ `src/pages/AcademyCreator.tsx`
- ➕ `src/data/academyLessons/socialMediaHabits.ts`
- ✏️ `src/App.tsx` — register two routes

## Out of scope (this iteration)
- Saving lessons to Supabase (local JSON only).
- Speech recognition for the 🎤 Speak indicator (visual cue only; can wire to existing speech infra later).
- Multi-teacher lesson library UI.
