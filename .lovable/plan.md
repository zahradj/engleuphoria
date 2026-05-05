# Coordinate Canvas + Scaffolded Media — Engine Upgrade

Bring Talk-Cloud–style spatial games and stop-and-go media to Playground / Academy / Success. Three new slide types, one shared engine, three hub creators wired up.

---

## 1. New shared engine — `LivingCanvas`

File: `src/components/creator-studio/shared/LivingCanvas.tsx`

A 16:9 `aspect-[16/9]` container, `position: relative`, `overflow-hidden`. Every child is absolutely positioned with `top/left` in **percent** so it scales identically on phone, iPad and 4K monitor.

Renders an array of `CanvasElement`:

```ts
type CanvasElement = {
  id: string;
  type: 'image' | 'text' | 'target';
  src?: string;            // image url (or text content)
  text?: string;
  x: number; y: number;    // 0–100 percent
  width: number;           // percent
  z_index?: number;
  rotation?: number;
  animation_in?: 'fade' | 'pop' | 'slide-up' | 'none';

  // Interaction
  interaction?: 'none' | 'draggable' | 'reveal';

  // Drag-and-drop
  target_x?: number; target_y?: number;   // snap point (% within canvas)
  snap_tolerance?: number;                // default 10 (percent)
  success_sfx?: string;                   // url or short phrase for TTS
  fail_sfx?: string;

  // Click-to-reveal
  reveal_sfx?: string;                    // tts text or audio url
  reveal_anim?: 'fade' | 'lift' | 'shrink' | 'fly';
};
```

Behaviors:
- **`draggable`** wraps the element in `motion.div` with `drag`. On drag end, if the centre is within `snap_tolerance` of `target_x/target_y`, snap (animate to target), play `success_sfx`, mark element as locked, fire `onElementSolved`. Otherwise spring back to original `x/y` (Framer Motion `dragSnapToOrigin`).
- **`reveal`** elements have `onClick` → animate exit (`opacity: 0` + `scale: 0` / `y: -100%`) and play `reveal_sfx`. Lower-`z_index` elements behind become visible.
- **Slide-level**: `instruction_audio` autoplays on mount via existing `elevenlabs-tts` edge function.
- **Reset button** (bottom-right, `🔄`): restores all elements to original coordinates and re-mounts revealed elements.
- Optional `onAllSolved` → fires confetti and unlocks the slide's "Next" button (so the demo only advances when the game is actually completed).

Helper hook `useCanvasGameState` keeps original positions, solved set, revealed set.

---

## 2. New slide types

Append to the union in **all three** `*Demo.tsx` files (`Playground/Academy/Success`):

```ts
| {
    type: 'canvas_game';            // drag-and-drop / sorting
    title?: string;
    instruction?: string;
    instruction_audio?: string;
    background_image?: string;
    elements: CanvasElement[];
    voice?: SlideVoice;
  }
| {
    type: 'living_canvas';          // layered click-to-reveal + drag mix
    title?: string;
    instruction?: string;
    instruction_audio?: string;
    background_image?: string;
    elements: CanvasElement[];      // each may use 'reveal' or 'draggable'
    voice?: SlideVoice;
  }
| {
    type: 'scaffolded_media';       // smart video/audio with mid-playback questions
    title?: string;
    media_url: string;
    media_kind: 'youtube' | 'audio' | 'video';
    transcript?: string;
    segments: {
      start_time: number;           // seconds
      end_time: number;
      question: {
        prompt: string;
        options: string[];
        answer: string;
        replay_hint?: string;
      };
    }[];
    voice?: SlideVoice;
  };
```

`SlideRenderer` in each demo gets three new cases that delegate to `LivingCanvas` and `ScaffoldedPlayer`.

---

## 3. `ScaffoldedPlayer`

File: `src/components/creator-studio/shared/ScaffoldedPlayer.tsx`

- Wraps a `<video>` / `<audio>` element (or a YouTube iframe through the YT IFrame API for time tracking).
- A `requestAnimationFrame` loop watches `currentTime`. When it crosses a segment's `end_time` and that segment isn't already passed, the player **auto-pauses** and overlays the segment's question.
- The "Resume" button is **disabled** until the student answers correctly. Wrong answer → shake + show explanation.
- A small **"🔂 Replay last 30s"** button sets `currentTime = max(0, end_time - 30)` and resumes briefly, then re-pauses at `end_time`.
- A timeline strip below the player shows segment markers (filled = passed, empty = upcoming).
- For YouTube, embed via the YT IFrame API and listen to `onStateChange` + a poll for `getCurrentTime()`.

---

## 4. AI generators (Edge Functions)

### 4a. `generate-canvas-game` (new)

Input: `{ topic, hub, target_vocab?, mode: 'drag'|'reveal'|'mixed' }`.

System prompt extracts:

> You are a Level Designer for an ESL game canvas. Generate JSON only. The canvas is 100×100 percent. Place draggable items along the bottom edge (y between 75 and 90); place targets in the upper half (y between 20 and 50). Width should be 8–18 percent for kids, 6–12 for teens/adults. For each draggable, set a target_x/target_y matching its correct slot and snap_tolerance: 10. For reveal slides, place the "hider" at the same x/y as the hidden element with a higher z_index. Always provide instruction_audio in the lesson's target language.

Output validated with Zod against the `CanvasElement` schema; rejects elements outside 0–100, missing `target_x` for draggables, etc. — falls back to a deterministic skeleton if validation fails.

### 4b. `analyze-media` (extend the existing function)

Add to its prompt:

> You are a media curriculum designer. Identify 3–5 logical breakpoints in this transcript (every 30–60 seconds). Return `segments: [{ start_time, end_time, question: { prompt, options, answer } }]`. Each question must be answerable using ONLY the audio between start_time and end_time. Scale: Playground=2, Academy=3–4, Success=4–5 questions.

Output is folded into a single `scaffolded_media` slide rather than a chain of separate quiz slides.

### 4c. `generate-ppp-slides` (extend)

When the AI proposes a "warm-up" or "practice" slide for Playground, allow it to emit `type: 'canvas_game'` or `type: 'living_canvas'` directly using the same schema, so the AI lesson generator can mint full canvas games end-to-end.

---

## 5. Creator dashboard wiring (Playground / Academy / Success)

For each of `PlaygroundCreator.tsx`, `AcademyCreator.tsx`, `SuccessCreator.tsx`:

1. Add `canvas_game`, `living_canvas`, `scaffolded_media` to `SLIDE_TYPES` with emojis 🎯, ✨, 🎬.
2. `makeSlide()` returns sensible 2-element starters (one draggable + one target, or one hider + one reveal).
3. **Right sidebar element editor** when a canvas slide is selected:
   - List of elements with delete / duplicate / "↑ z-index" / "↓ z-index".
   - For each element: type dropdown, image picker (re-uses `AssetVaultDialog`), `x/y/width/rotation` sliders (0–100), interaction dropdown, and conditional fields (target coords for draggables, reveal_sfx for reveals).
   - "Generate with AI" button → calls `generate-canvas-game` and replaces the slide's `elements`.
4. **Scaffolded Media editor**: re-uses `MediaAnalyzerModal` but writes a `scaffolded_media` slide (single slide with `segments`) instead of appending separate quiz slides. A small "Timeline" sub-editor lets the creator drag pause markers along a 0–100% bar.
5. Live preview pane re-renders `LivingCanvas` / `ScaffoldedPlayer` exactly as the student sees it.

---

## 6. Demo / student wiring

In `PlaygroundDemo.tsx`, `AcademyDemo.tsx`, `SuccessDemo.tsx`:

- `SlideRenderer` adds the three new cases.
- The "Next" button gating already used for storybook is extended: for `canvas_game` and `scaffolded_media` the Next button is disabled until the slide's `onAllSolved` / `onAllSegmentsPassed` callback fires.

---

## 7. Files touched

```
NEW  src/components/creator-studio/shared/LivingCanvas.tsx
NEW  src/components/creator-studio/shared/ScaffoldedPlayer.tsx
NEW  src/components/creator-studio/shared/CanvasElementEditor.tsx
NEW  src/components/creator-studio/shared/canvasSchema.ts        (Zod + types)
NEW  supabase/functions/generate-canvas-game/index.ts

EDIT supabase/functions/analyze-media/index.ts                   (segments output)
EDIT supabase/functions/generate-ppp-slides/index.ts             (allow canvas types)
EDIT supabase/config.toml                                        (register new fn)

EDIT src/pages/PlaygroundDemo.tsx                                (Slide union + renderer + gating)
EDIT src/pages/AcademyDemo.tsx                                   (same)
EDIT src/pages/SuccessDemo.tsx                                   (same)

EDIT src/pages/PlaygroundCreator.tsx                             (slide types, sidebar, AI)
EDIT src/pages/AcademyCreator.tsx                                (same)
EDIT src/pages/SuccessCreator.tsx                                (same)
```

---

## 8. Hub flavor (visual only)

Same engine, hub-tinted shells:
- **Playground**: orange/amber border, springy "pop" animations, big snap radius (12%), confetti bursts.
- **Academy**: indigo/violet border, subtle slide-in, snap radius 10%.
- **Success**: emerald/teal border, minimal motion, snap radius 8%, no confetti.

---

## 9. Out of scope (suggested follow-ups)

- Multi-touch / pinch-to-zoom on canvas.
- Recording teacher-drawn "ink" overlays on top of the canvas.
- Persisting in-progress canvas state to `student_progress` between sessions.
