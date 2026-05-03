## Goal

Merge the branded PPT-style frame with the interactive activity center so every slide — regardless of `slide.type` — renders inside one cohesive, hub-themed container with a consistent header, ambient background, and progress footer. Inside that frame, upgrade the interactive content (vocab flip-grid, multi-question fill-in-blanks, 6-pair matching arena), and add Generative Fallbacks so empty slides never appear.

## Scope (files touched)

1. `src/components/lesson-player/SlideShell.tsx` — NEW. Branded PPT container.
2. `src/components/lesson-player/DynamicSlideRenderer.tsx` — wrap `renderContent()` in `SlideShell`, add fallbacks, route flashcards to new `VocabFlipGrid`.
3. `src/components/lesson-player/editorial/VocabFlipGrid.tsx` — NEW. CSS 3D flip flashcards.
4. `src/components/lesson-player/editorial/EditorialFillBlanks.tsx` — restyle for high-density, charcoal-on-white, hub-accent inputs.
5. `src/components/lesson-player/editorial/EditorialMatchHalves.tsx` — extend to 6 pairs, two-column drag layout, hub accent.
6. `src/components/lesson-player/editorial/VideoSlide.tsx` — robust embed + topic-image fallback when URL invalid.
7. `src/components/lesson-player/LessonPlayerContainer.tsx` — wrap `<DynamicSlideRenderer>` in `<AnimatePresence mode="wait">` properly so horizontal transitions actually fire (currently the animation key is on the inner motion.div); also remove the duplicate left media pane when the SlideShell already renders branded media (avoids double-frame).

## 1. The Global Branded Frame — `SlideShell`

A single component wraps every slide. It receives `hub`, `lesson`, `slideIndex`, `totalSlides`, `accentHex`, plus the slide content as children.

Layout:

```text
┌──────────────────────────────────────────────────────────┐
│  [Logo]  Academy · B1 · Unit 3 · Lesson 4    [Slide 6/22]│  ← top bar (translucent)
│                                                          │
│           ── ambient gradient + soft glow ──             │
│                                                          │
│              {children — interactive content}            │
│                                                          │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░  ← progress bar       │
└──────────────────────────────────────────────────────────┘
```

- Background uses hub gradient from `HUB_TOKENS` / `HUB_CONFIGS`:
  - Playground → orange→amber mesh
  - Academy → purple→indigo mesh
  - Professional → emerald→teal mesh
- Two `radial-gradient` glows (top-left + bottom-right) at 12% opacity for the "ambient" feel.
- Top-left: `<Logo size="small" />` + metadata pills (Hub · Level · Unit/Lesson). Top-right: `Slide N/Total`.
- Bottom: thin `Progress` bar (`bg-white/40` track, fill in hub accent).
- All text on the chrome uses `text-white/90` over a `backdrop-blur-md bg-black/10` strip so it stays legible on every gradient.
- Children render inside a centered `max-w-5xl` content card with `bg-white/95 dark:bg-slate-900/90 rounded-2xl shadow-xl p-8` so interactive content always sits on a clean surface (charcoal text on white).

Source of metadata: read from `slide.lesson_meta` if present, else fall back to props passed by `LessonPlayerContainer` (it already knows `hub`, `cefr`, `unit`, `lesson`).

## 2. Injecting Interactivity

### 2a. `VocabFlipGrid` (NEW) — replaces `EditorialVocabList` for `flashcard` / `vocabulary` types
- Responsive grid: `grid-cols-2 md:grid-cols-3` capped at 6 cards.
- Each card is a CSS 3D flip (`perspective-1000`, `transform-style-preserve-3d`, `rotate-y-180` on hover/click).
- Front: image (or large emoji fallback) + word in big bold.
- Back: definition + example sentence, hub-accent border.
- Card footer: small speaker icon (re-uses existing TTS hook if present).

### 2b. `EditorialFillBlanks` upgrade — High-Density Quiz
- Render up to 5 sentences (already supports N; ensure normalizer pads/truncates to 4–5).
- Restyle: charcoal `text-slate-900` on `bg-white`, larger row spacing (`py-3`), input border uses `style={{ borderColor: accentHex }}` on focus.
- Single "Check All" CTA in hub accent.
- Per-row inline correct/incorrect feedback already exists — keep, just brighten contrast.

### 2c. `EditorialMatchHalves` — Matching Arena
- Display up to 6 pairs in two columns (`left_item` column, `right_item` column shuffled).
- Use `@dnd-kit` (already in repo per drag activities) for drag-to-match; on drop, snap with hub-accent ring.
- Reset / Check buttons in hub accent.

## 3. Data Integrity & Fallbacks

### 3a. Generative Fallback Slide
- Already partially implemented as `MissingDataFallback`. Promote it to a richer "Teacher Discussion" template:
  - Header: 💬 + "Let's Talk About: {derived topic}"
  - Body: 3 conversation prompts derived from `slide.title`, `slide.teacher_script`, or `lesson.topic` using a deterministic local template (no AI call): `["What do you already know about {topic}?", "Have you ever experienced this?", "How would you explain it to a friend?"]`.
  - Hub-accent CTA: "Start Discussion".
- Trigger conditions (extend current `hasValidInteractiveData`):
  - `slide.type === 'interactive'` with no `interactive_data`.
  - Any interactive `slide_type` in `INTERACTIVE_REQUIRED_KEYS` missing required keys.

### 3b. Video Slide hardening
- In `VideoSlide.tsx`:
  - If `extractYouTubeId` succeeds → render iframe (already present).
  - Else if `videoUrl` looks like an mp4/webm → use a native `<video controls>` element.
  - Else (no usable URL) → render `LiveHeroMediaSlide`-style "Conversation Starter": topic image (`slide.imageUrl` or hub mascot) + prompt block ("Discuss: {slide.title}") instead of the current grey "No video URL" box.

## 4. Visual Polish

- `LessonPlayerContainer.tsx`: move the `key={currentSlide.id}` to the `<motion.div>` inside `DynamicSlideRenderer` (already keyed) and ensure `<AnimatePresence mode="wait">` receives a single direct child — currently it wraps `<DynamicSlideRenderer>` directly, which works only because the inner motion.div is keyed. We'll lift the motion wrapper one level so horizontal slide-in/out transitions reliably fire on slide change.
- All buttons/inputs/badges inside interactive components read accent from `HUB_CONFIGS[hub].colorPalette.primary` (passed by `SlideShell` via React context: `SlideHubContext`) so they tint correctly per hub without prop-drilling.

## Technical notes

- New context: `SlideHubContext` exposed by `SlideShell`. Consumed by `EditorialFillBlanks`, `VocabFlipGrid`, `EditorialMatchHalves` to get accent color. Defaults to academy purple.
- Tailwind 3D utilities: add small `@layer utilities` block in `src/index.css` with `.perspective-1000`, `.preserve-3d`, `.backface-hidden`, `.rotate-y-180`.
- No DB / edge-function changes. No new dependencies (we already have framer-motion, @dnd-kit, lucide).
- `LiveVocabularyGrid` and `LiveGrammarExplanation` (currently inline in DynamicSlideRenderer) become thin wrappers around new components or are deleted in favor of the editorial set.

## Out of scope

- Slide authoring UI (Canvas Studio) — unchanged.
- AI generation pipeline — unchanged. The fallback is a deterministic UI shim, not a re-generation.
- Removing the existing left-media pane in `LessonPlayerContainer` if media is already handled inside `SlideShell` (will gate via a `showSplitPane` flag based on slide type to avoid regressing reading slides).

## Acceptance

- Every slide shows the same branded shell (logo, metadata, progress, gradient).
- Vocabulary slides render a 3D flip grid (≤6 cards).
- Fill-in-blank slides show 4–5 high-contrast questions + one Check button.
- Matching slides render up to 6 pairs in two columns with drag-and-drop.
- Empty interactive payloads render the Teacher Discussion fallback, never blank.
- Broken video URLs render a Conversation Starter, never a blank player.
- Slide changes animate horizontally (slide-in from right, slide-out to left).
