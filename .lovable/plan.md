

## Plan: Pip Mascot + Interactive Canvas Lesson Player

### Overview
Two major additions: (1) Add Pip as a placeable mascot character element in the Slide Builder with preset animations. (2) Build a new Canvas Lesson Player that renders slides created in the builder as interactive, game-like scenes with click-to-answer, drag-and-drop, feedback animations, sound effects, and progression tracking.

### Part 1: Pip Mascot in the Slide Builder

**Copy the uploaded image** into `src/assets/pip-mascot.png` and make it available as a new canvas element type.

- **`types.ts`** — Add `'character'` to `CanvasElementType`
- **`ElementToolbar.tsx`** — Add a "Character" button (using a bird/mascot icon) that places Pip on the canvas
- **`CanvasEditor.tsx`** — Add default size for `character` type (250x300), default content `{ name: 'pip', animation: 'wave', src: '/pip-mascot.png' }`
- **`CanvasElement.tsx`** — Render `character` type: shows the Pip image with a CSS animation class (wave = rotate bounce, jump = translateY bounce, idle = subtle float)
- **`PropertiesPanel.tsx`** — Character section: select animation preset (idle, wave, jump, shake), optional speech bubble text field

### Part 2: Interactive Canvas Lesson Player

A new full-screen student-facing component that takes the slides created in the builder and renders them as interactive scenes.

**New file: `src/components/student/CanvasLessonPlayer.tsx`**

This player:
- Renders each slide at 1920x1080 scaled to viewport (reusing the same scaling logic)
- Shows a progress bar at the top
- Renders canvas elements but makes interactive ones (quiz, matching, drag-drop, fill-blank, sorting, sentence-builder) actually playable
- Plays audio elements automatically or on click
- Shows Pip character with animations
- Provides immediate feedback (correct = confetti + sound + Pip jumps, wrong = shake + sound + Pip shakes)
- Blocks "Next" until the interactive activity on the slide is completed
- Tracks score across slides
- Shows celebration screen at the end with stars based on score

**Rendering logic per element type:**

| Element | Behavior in Player |
|---|---|
| text, image, shape, video | Static display (same as preview) |
| character | Animated Pip with selected animation |
| audio | Auto-play or tap-to-play with speaker icon |
| quiz | Clickable options, green/red feedback, blocks progression until correct |
| matching | Tap left item then tap right item to match, lines drawn between matched pairs |
| drag-drop | Draggable items into drop zones |
| fill-blank | Text input field in the blank, validate on submit |
| sorting | Drag items to reorder, check button validates order |
| sentence-builder | Tap words to build sentence in order, tap to remove |

**New file: `src/components/student/CanvasLessonPlayerModal.tsx`**
- Wraps the player in a full-screen modal with close button
- Accepts slides array + lesson metadata
- Calls `onComplete` with score when finished

**Integration:**
- Update `LessonPlayerModal.tsx` (kids) to detect canvas-based lessons (those with `canvasElements`) and route to the new `CanvasLessonPlayer` instead of the current simple renderers
- Update `LessonPlayer.tsx` similarly for teens/adults

### Technical Details

| File | Change |
|---|---|
| `src/assets/pip-mascot.png` | Copy uploaded Pip image |
| `types.ts` | Add `'character'` to `CanvasElementType` |
| `ElementToolbar.tsx` | Add Character button |
| `CanvasEditor.tsx` | Default size + content for character |
| `CanvasElement.tsx` | Character renderer with CSS animations |
| `PropertiesPanel.tsx` | Animation selector + speech bubble for character |
| `CanvasLessonPlayer.tsx` (new) | Full interactive player rendering canvas elements as playable activities |
| `CanvasLessonPlayerModal.tsx` (new) | Modal wrapper with progress, score, celebration |
| `LessonPlayerModal.tsx` | Route canvas-based lessons to new player |
| `LessonPlayer.tsx` | Route canvas-based lessons to new player |

### Animation CSS
Add keyframes to `index.css` for character animations:
- `@keyframes pip-wave` — gentle arm wave (rotate)
- `@keyframes pip-jump` — bounce up and down
- `@keyframes pip-idle` — subtle floating
- `@keyframes pip-shake` — horizontal shake (wrong answer)

