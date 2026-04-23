

## Unified "Main Stage" Classroom — Plan

Replace the tabbed 3-panel classroom (Slides / Whiteboard / Web) with a single synchronized stage. The teacher controls *what* is shown; both teacher and student can draw on top of it; web content becomes true co-browsing.

---

### 1. New stage model

Introduce a single synced state `stage_mode` with three values:

- `slide` — current lesson slide (existing slide rendering)
- `web` — embedded URL (iframe + scroll sync)
- `blank` — empty white whiteboard surface

Plus a synced `embeddedUrl` (already exists) and a new synced `drawingEnabled` flag (controls whether the transparent canvas captures pointer events or lets clicks pass through to the iframe/slide).

These all live in the existing `useClassroomSync` hook, broadcast via the existing `classroom_${roomId}` Supabase Realtime channel (same channel already used for strokes + scroll).

---

### 2. Component architecture

```text
<MainStage>                        ← 90% of viewport, single container
  ├── <StageContent mode={...}>    ← swaps based on stage_mode
  │     • slide  → SlideRenderer (current slide image/content)
  │     • web    → ScrollSyncedIframe (wrapper + iframe, scroll synced)
  │     • blank  → plain white background
  │
  └── <TransparentCanvas>          ← absolute inset-0, z-50
        • Always mounted, on top of everything
        • pointer-events: auto when drawingEnabled, else none
        • Renders + broadcasts strokes for BOTH roles

<TeacherControlDock>               ← floating, bottom-center, teacher only
  • Mode buttons: [Slide] [Web] [Blank]
  • URL input (visible when mode = web)
  • Pen / Eraser / Color picker
  • "Drawing ON/OFF" toggle (controls drawingEnabled)
  • Slide nav arrows (when mode = slide)

<StudentMiniDock>                  ← floating, bottom-center, student only
  • Pen / Eraser / Color picker (local tool state)
  • No mode controls, no URL input
  • Drawing only enabled when teacher's drawingEnabled = true
```

Files to **add**:
- `src/components/classroom/stage/MainStage.tsx`
- `src/components/classroom/stage/StageContent.tsx`
- `src/components/classroom/stage/TransparentCanvas.tsx`
- `src/components/classroom/stage/ScrollSyncedIframe.tsx`
- `src/components/classroom/stage/TeacherControlDock.tsx`
- `src/components/classroom/stage/StudentMiniDock.tsx`

Files to **edit**:
- `src/components/teacher/classroom/TeacherClassroom.tsx` — replace center-stage + tab logic with `<MainStage role="teacher">` + `<TeacherControlDock>`
- `src/components/student/classroom/StudentMainStage.tsx` — replace tab logic with `<MainStage role="student">` + `<StudentMiniDock>`
- `src/hooks/useClassroomSync.ts` — add `stageMode`, `setStageMode`, `drawingEnabled`, `setDrawingEnabled`
- `src/services/whiteboardService.ts` — add `sendStageMode` / `subscribeToStageMode` and `sendDrawingEnabled` / `subscribeToDrawingEnabled` broadcasts (mirrors existing `sendScroll` pattern)

Files to **remove from active use** (kept on disk but no longer rendered):
- `CenterStage.tsx`, `EmbeddedContentViewer.tsx`, the per-tab `CollaborativeCanvas` mounts in `StudentMainStage`

---

### 3. The Universal Annotation Overlay

`<TransparentCanvas>` is mounted **once**, on top of the stage, regardless of mode:

```text
position: absolute; inset: 0; z-index: 50;
pointer-events: drawingEnabled ? 'auto' : 'none';
```

- Strokes are sent and received via the existing `whiteboardService` (already broadcasts on `classroom_${roomId}`).
- Both teacher and student render the same `strokes` array, so circles drawn by the teacher on a BBC article appear instantly on the student's screen overlaying the same article.
- When the teacher toggles "Drawing OFF", `drawingEnabled` syncs to both clients → canvas becomes click-through → users can actually click links inside the iframe.
- A "Clear" button in the teacher dock wipes strokes (existing `clearMyStrokes` extended to clear all).

---

### 4. Web Co-Browsing Fix

`<ScrollSyncedIframe>` reuses the existing `useWebScrollSync` hook + the `scrolling="no"` + tall iframe + scrollable wrapper pattern already implemented. Now it lives inside the unified stage, so the transparent canvas naturally sits on top — the teacher can switch pen on, circle a vocabulary word on the live BBC page, switch pen off, and click a link to navigate. URL changes broadcast through `updateSharedDisplay` (already exists).

---

### 5. Realtime sync summary

| State | Direction | Mechanism |
|---|---|---|
| `stage_mode` | teacher → student | new broadcast event `stage_mode` |
| `embeddedUrl` | teacher → student | existing `updateSharedDisplay` |
| `drawingEnabled` | teacher → student | new broadcast event `drawing_enabled` |
| Pen strokes | both ↔ both | existing `whiteboardService` |
| Scroll position (web) | teacher → student | existing `useWebScrollSync` |
| Current slide index | teacher → student | existing slide-sync |

All ride the single `classroom_${roomId}` channel — no extra connections.

---

### 6. UX details

- Stage container fills ~90% of viewport (16:9, max-h: `calc(100vh - 120px)`).
- Teacher dock: floating glass-panel, bottom-center, auto-hides cursor area, follows the platform's Premium Glassmorphism style.
- Student dock: same style, smaller, only pen/eraser/color.
- Mode-switch buttons show active state with the hub's brand color (Playground orange / Academy purple / Success green) pulled from current theme.
- A small badge top-left shows current mode + a green pulse indicator "Teacher is presenting".

---

### 7. Out of scope / known limits

- Cross-origin iframes still cannot have their **internal** scroll read; we keep the wrapper-scroll workaround.
- Some sites (YouTube embeds, sites with `X-Frame-Options: DENY`) cannot be iframed at all — we'll show a friendly "This site blocks embedding — open in new tab" fallback when the iframe fails to load.
- Strokes are not persisted across sessions (broadcast-only), matching current behavior.

