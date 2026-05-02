# Dedicated StoryBookViewer

A magical, immersive viewer for `curriculum_lessons` rows whose `ai_metadata.kind === 'story'`. It bypasses the standard slide player entirely — no progress bars, no sidebar, no drag zones — and supports two visual layouts the Content Creator can pick when generating.

---

## What we're building

### 1. New component: `src/components/student/story-viewer/StoryBookViewer.tsx`

Full-screen, fixed-position overlay (`fixed inset-0 z-50`). It receives normalized `pages[]` and renders one page at a time with a smooth crossfade + horizontal slide transition (Framer Motion `AnimatePresence`).

Top chrome is intentionally minimal:
- Tiny "Story" eyebrow + title (top-left)
- Frosted close button (top-right)
- Page-dot indicator (top-center) — clickable to jump pages

Edge navigation:
- Invisible 64–96 px hit zones on the left/right edges of the screen
- Reveal a frosted `ChevronLeft` / `ChevronRight` pill on hover, with subtle slide-on-hover micro-animation
- Auto-disabled (faded out) at first/last page

Narration:
- Reuses the existing `useTextToSpeech` hook (calls the `elevenlabs-tts` edge function)
- Prominent "🔊 Play Narration" button anchored next to the page text
- Toggles to "Stop" + spinner while loading
- Auto-stops when navigating between pages

Optional comprehension MCQ:
- If a page carries `mcq`, render answer chips under the narrative
- Locks after answer; correct → emerald, wrong → rose, others fade

### 2. Two layout modes

```text
┌──────────── classic ────────────┐    ┌─────────── immersive ───────────┐
│  ┌────────┐ │                   │    │ ░░░░░░ full-bleed image ░░░░░░░ │
│  │        │ │  Page title       │    │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│  │ image  │ │                   │    │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│  │ 50%    │ │  Body text in     │    │       ┌─────────────────┐       │
│  │        │ │  Lora serif…      │    │       │ frosted card    │       │
│  │        │ │                   │    │       │ • narrative     │       │
│  │        │ │  [▶ Narration]    │    │       │ • [▶ Narration] │       │
│  └────────┘ │                   │    │       └─────────────────┘       │
└─────────────────────────────────┘    └─────────────────────────────────┘
```

- **`classic`** — 50/50 split. Image left (md+), warm cream text panel right (`#fdfbf6`), Lora serif body for editorial feel.
- **`immersive`** — Image as `bg-cover bg-center` covering the whole viewport, dark gradient overlay, narrative inside a `bg-black/45 backdrop-blur-xl` frosted card pinned to the bottom.

Layout is chosen via prop `layout: 'classic' | 'immersive'`, defaulting to `immersive`.

### 3. Wire it into the student lesson reader

Update `src/pages/student/LessonReaderPage.tsx`:
- After fetching the lesson, detect story mode: `lesson.ai_metadata?.kind === 'story'`.
- Normalize the existing slide shape (StoryCreator already produces narrative `text_image` slides + comprehension `multiple_choice` slides) into `StoryPage[]`:
  - Narrative slides → `{ title, text: content, imageUrl: slide.image_url ?? content.imageUrl }`
  - MCQ slides → attached as `mcq` to the previous narrative page (so a page with a question shows the question right under the prose), or rendered as a standalone "comprehension" page if there's no preceding narrative.
- Pull `layout` from `lesson.ai_metadata.story_layout` (default `immersive`).
- Render `<StoryBookViewer …/>` and short-circuit before the `LessonPlayerContainer` branch.

Standard lessons keep using `LessonPlayerContainer` exactly as today.

### 4. Layout chooser in StoryCreator

Update `src/components/creator-studio/steps/StoryCreator.tsx`:
- Add a small visual radio group: `Classic split` vs `Immersive cinematic` (with mini wireframe icons).
- Default = `immersive`.
- Pass the choice into `persistLesson` so it lands in `ai_metadata.story_layout`.

Update `src/components/creator-studio/persistLesson.ts`:
- Accept an optional `extraMetadata?: Record<string, unknown>` arg merged into `ai_metadata` (so `story_layout` rides along without bloating the function signature for other callers).

---

## Animation & polish

- Page transition: crossfade + 40 px horizontal slide that mirrors navigation direction (`direction: 1 | -1`), 450 ms `cubic-bezier(0.22, 1, 0.36, 1)`.
- Background image in immersive mode: gentle 1.04 → 1.00 zoom on enter (Ken Burns micro-effect), 600 ms.
- Frosted card slides up 20 px + fades in with a 150 ms delay so the background settles first.
- Edge arrow pills nudge ±2 px on hover for tactile feedback.
- Page-dot indicator animates width (1.5 px → 8 px) for the active page.

All movements use existing Framer Motion (already in the lesson player), so no new dependencies.

---

## Technical details

**Files added**
- `src/components/student/story-viewer/StoryBookViewer.tsx` — the viewer + two sub-layouts (`ClassicSplit`, `ImmersiveCard`) + shared `NarrationButton` and `McqBlock` helpers.

**Files edited**
- `src/pages/student/LessonReaderPage.tsx` — story-kind detection, slide → `StoryPage[]` normalizer, dispatch to `StoryBookViewer`.
- `src/components/creator-studio/steps/StoryCreator.tsx` — `layoutStyle` state, visual radio group, pass into `persistLesson`.
- `src/components/creator-studio/persistLesson.ts` — accept optional extra metadata merged into `ai_metadata`.

**Reused, no changes**
- `useTextToSpeech` hook → `elevenlabs-tts` edge function (already deployed, returns `audio/mpeg` blob).
- `framer-motion`, `lucide-react`, `cn`, shadcn `Button` — all already in the project.

**Data contract — `StoryPage`**
```ts
interface StoryPage {
  title?: string;
  text: string;
  imageUrl?: string;
  mcq?: { question: string; options: string[]; correct_index: number };
}
```

**Storage of layout choice**
- `curriculum_lessons.ai_metadata.story_layout: 'classic' | 'immersive'`
- No DB migration needed — `ai_metadata` is already `jsonb`.

**Routing**
- No new routes. Story lessons are still opened via the existing `/student/lesson/:id` (or wherever `LessonReaderPage` lives) — the page just picks the right renderer.

**Safety**
- If `pages` is empty, show a friendly empty state instead of crashing.
- TTS auto-stops on page change and on unmount via the hook's existing `stop()` cleanup pattern.
- MCQ answers are tracked per page index in local state — no DB writes from the viewer (consistent with the "stories are reading, not assessment" intent).
