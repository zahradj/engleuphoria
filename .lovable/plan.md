# Playground Engine — Mini Demo App

A self-contained, content-driven Playground-branded slide engine showcasing 7 interactive game types. Lives at `/playground-demo` so it doesn't interfere with the real app. Strictly inline-styled, no dependencies, fully editable JSON content.

## Files

### 1. `src/pages/PlaygroundDemo.tsx` (new, ~450 lines)
Single-file mini-app containing:
- **Fixed design tokens** (orange `#FE6A2F`, yellow `#FFB703`, cream `#FEFBDD`, pill nav, rounded white card with deep orange shadow) — matches Playground brand from project memory.
- **Dynamic `SLIDES` array** at the top of the file — only thing creators need to edit to change a lesson.
- **`<SlideRenderer>`** switch dispatching on `slide.type`.
- **Game components** (typed via discriminated union):
  1. `Intro` — title + subtitle
  2. `MultipleChoice` — pick option, correct/wrong feedback colors
  3. `TrueFalse` — green/dark buttons + emoji feedback
  4. `FillBlank` — text input, live validation (case-insensitive)
  5. `DragDrop` — HTML5 drag word onto target image
  6. `MatchGame` — two-column tap-to-select matching with shuffled right side
  7. `MemoryGame` — flip-card pair finder with auto-reveal/reset
  8. `DrawGame` — HTML5 canvas with mouse + touch drawing and clear button
- **Nav controls** — pill with prev/next buttons and `n / N` indicator.

### 2. `src/App.tsx` (single-line addition)
Add a public route inside the existing `<Routes>` block:
```tsx
<Route path="/playground-demo" element={<PlaygroundDemo />} />
```
With matching `lazy` import alongside the other lazy page imports. No protection wrapper — it's a demo.

## Design notes

- All inline styles (per your spec). No Tailwind utilities, no shadcn dependencies — keeps the mini-app fully portable.
- Discriminated union typing on `Slide` so each game gets autocompleted props.
- Memory and Match games shuffle on mount via `useState` initializer (stable across renders).
- Drawing canvas supports both mouse and touch.

## How to extend later

1. Add a new variant to the `Slide` union at the top of `PlaygroundDemo.tsx`.
2. Build a `<YourGame slide={slide} />` component below.
3. Add a `case 'your_type':` to `SlideRenderer`.
4. Drop a new entry into the `SLIDES` array.

## Out of scope

- No persistence / backend / scoring — pure demo.
- No integration with real Playground hub auth or curriculum tables.
- No animations library — uses CSS transitions only.
