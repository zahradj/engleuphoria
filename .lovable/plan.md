

## Plan: Auto-Load Lessons in Slide Builder + Maximize Canvas

### Problem
1. When the user selects a curriculum in Step 1 and moves to Step 2 (Slide Builder), the slides don't appear — the builder opens empty. The curriculum context from Step 1 is never passed to the editor.
2. The canvas is still too small because the filmstrip (140px) + element toolbar (120px) = 260px eaten from the left, plus the header and stepper take vertical space.

### Changes

**1. Pass curriculum context to the Slide Builder and auto-load the first lesson**

- **`ContentCreatorDashboard.tsx`** — Pass `curriculumContext` to `AdminLessonEditor` as a prop
- **`AdminLessonEditor.tsx`** — Accept optional `curriculumContext` prop. On mount (or when context changes), auto-query `curriculum_lessons` filtered by the selected level/system and load the first lesson's slides into the editor. Also auto-open the Curriculum Browser sheet pre-filtered to the selected system so the user can pick a different lesson.

**2. Collapse the element toolbar into the filmstrip**

Instead of a separate 120px column for element tools, merge them into the filmstrip panel:
- **`AdminLessonEditor.tsx`** — Remove the separate `ElementToolbar` column. Add element buttons as a compact row or expandable section at the bottom of the filmstrip.
- **`SlideFilmstrip.tsx`** — Add an "Add Element" expandable section at the bottom with icon buttons in a single row. Reduce filmstrip width to 120px.
- This saves 120px for the canvas.

**3. Hide the stepper when in Slide Builder (Step 2)**

- **`ContentCreatorDashboard.tsx`** — When `currentStep === 2`, hide the `ContentCreatorStepper` component entirely. The slide builder already has its own top bar with Back/Publish navigation. This saves ~48px of vertical space.

**4. Make the filmstrip collapsible**

- **`AdminLessonEditor.tsx`** — Add a toggle button to collapse/expand the filmstrip panel. When collapsed, only show a thin strip (~32px) with a small expand arrow and the slide number. This gives the canvas nearly full width.

### Technical Details

| File | Change |
|---|---|
| `ContentCreatorDashboard.tsx` | Pass `curriculumContext` to `AdminLessonEditor`, hide stepper on step 2 |
| `AdminLessonEditor.tsx` | Accept `curriculumContext` prop, auto-load first lesson on mount, merge toolbar into filmstrip, add filmstrip collapse toggle |
| `SlideFilmstrip.tsx` | Add element toolbar buttons at bottom, reduce width to 120px |

### Result
- Selecting a curriculum in Step 1 and clicking "Next" will immediately show the lesson's slides on the canvas
- The canvas gets ~170px more horizontal space and ~48px more vertical space
- Element tools are still accessible from the filmstrip panel
- The filmstrip can be collapsed for even more canvas space

