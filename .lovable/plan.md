

## Plan: Canva-Style Content Studio Redesign

### Problem
The current slide builder is cramped. The canvas competes with a 224px slide organizer, 64px element toolbar, browser toggle panels, and AI buttons stacked in the sidebar. The 1920x1080 canvas scales down to a tiny fraction of the viewport, making editing nearly impossible.

### Solution
Rebuild the layout to follow a Canva-like paradigm: maximize the canvas, collapse the slide strip to a thin filmstrip, move element tools into a compact left sidebar, and keep properties as a floating panel only when needed.

### Layout Changes

```text
BEFORE:
[toggle|CurriculumBrowser(224px)|SlideOrganizer(224px)+AI buttons|ElementToolbar(64px)|Canvas(remaining)|toggle|RightPanel(288px)]

AFTER:
[Slim Toolbar(56px) | Slide Filmstrip(100px) | ======= FULL CANVAS ======= ]
                                                  (floating props when selected)
                                                  (top action bar for AI/save/preview)
```

**1. Compact left sidebar — merge Element Toolbar + Slide Filmstrip**
- **`AdminLessonEditor.tsx`** — Remove the separate `SlideOrganizer` (224px) and browser/right-panel toggle columns. Replace with a single slim left panel (~160px) containing:
  - A mini filmstrip of slide thumbnails (small 16:9 cards, ~120px wide) at the top with add/reorder/delete
  - The element toolbar buttons below the filmstrip (in a grid, 2 columns)
  - AI generate buttons at the very bottom (compact icons)
- Curriculum browser and blueprint/guide become overlay drawers triggered by top-bar buttons, not permanent sidebars

**2. Maximize the canvas**
- **`CanvasEditor.tsx`** — Remove the `ElementToolbar` from inside CanvasEditor (it moves to the parent layout). The canvas viewport now takes 100% of the remaining space. Remove the `max scale = 1` cap so the canvas can fill the viewport. Use absolute centering per the slides-app skill:
  ```css
  position: absolute; left: 50%; top: 50%;
  margin-left: -960px; margin-top: -540px;
  transform: scale(var(--scale));
  ```

**3. Floating properties panel — already floating, just improve**
- **`PropertiesPanel.tsx`** — Already floating. Make it draggable with a grip handle so the user can move it out of the way. Increase max-height to 80vh.

**4. Top action bar**
- **`AdminLessonEditor.tsx`** — Merge `LessonHeader` actions + AI buttons + curriculum/blueprint toggles into a single compact top bar with icon buttons:
  - Left: Lesson title (editable inline), level badge
  - Center: Curriculum browser toggle, Blueprint toggle (open as slide-over drawers)
  - Right: AI Generate, Save, Preview, Publish buttons

**5. Slide filmstrip (replaces SlideOrganizer)**
- Create a new slim `SlideFilmstrip.tsx` component (~160px wide) with:
  - Vertical scroll of mini 16:9 thumbnails (~120px wide)
  - Click to select, drag to reorder, hover to show delete
  - "+" button at bottom to add slide
  - Upload overlay on hover (same as current)

**6. Curriculum & Blueprint as overlay drawers**
- Curriculum browser opens as a left slide-over drawer (over the canvas) when toggled
- Blueprint/Guide opens as a right slide-over drawer when toggled
- Both close with X or clicking outside

### Technical Details

| File | Change |
|---|---|
| `AdminLessonEditor.tsx` | Restructure to: top action bar + left filmstrip + full canvas. Curriculum/Blueprint become overlay drawers. Move AI buttons to top bar. |
| `SlideFilmstrip.tsx` (new) | Slim vertical filmstrip with mini thumbnails, drag-reorder, upload overlay |
| `CanvasEditor.tsx` | Remove ElementToolbar render. Accept `onAddElement` via props or keep toolbar external. Remove scale cap. Use absolute centering. |
| `ElementToolbar.tsx` | Refactor to horizontal/grid layout that fits inside the left panel below the filmstrip |
| `PropertiesPanel.tsx` | Add drag handle for repositioning |
| `SlideOrganizer.tsx` | Deprecated — replaced by SlideFilmstrip |
| `CurriculumBrowser.tsx` | Wrap in a drawer/sheet component |
| `LessonBlueprint.tsx` | Wrap in a drawer/sheet component |

### Files to create
- `src/components/admin/lesson-builder/SlideFilmstrip.tsx`

### Files to modify
- `src/components/admin/lesson-builder/AdminLessonEditor.tsx`
- `src/components/admin/lesson-builder/canvas/CanvasEditor.tsx`
- `src/components/admin/lesson-builder/canvas/ElementToolbar.tsx`
- `src/components/admin/lesson-builder/canvas/PropertiesPanel.tsx`

