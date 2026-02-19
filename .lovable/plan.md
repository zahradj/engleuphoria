
# Phase 8: Smart Minimalist Classroom -- Floating AI Co-Pilot, Zen Mode, Unified Canvas, and Auto-Hide Controls

## Summary

This upgrade declutters the classroom by converting the fixed "Today's Mission" sidebar into a draggable floating bubble, upgrading the existing Focus Mode into a true "Zen Mode" that shows only video + content, making call controls auto-hide on idle, and combining the whiteboard + embedded content into a single tabbed canvas area.

---

## Part 1: Floating AI Co-Pilot Bubble

### What Changes

Replace the fixed `TodaysMissionSidebar` (currently a permanent 288px-wide right panel) with a small draggable floating bubble that expands into a compact overlay when clicked.

### New File: `src/components/classroom/FloatingCoPilot.tsx`

- **Collapsed state**: A small circular button (48x48) positioned bottom-right with a sparkle icon + subtle pulse animation
- **Expanded state**: A 360px-wide floating card (using `react-rnd` for drag + resize) containing:
  - Mission checklist (same 3 checkboxes from TodaysMissionSidebar)
  - Shared Notes textarea (same SharedNotesPanel)
  - "AI Suggest" button (same logic)
  - Context banner (student level + last mistake)
- The bubble can be dragged anywhere on screen and remembers its position in local state
- A close button collapses it back to the bubble
- Props are identical to `TodaysMissionSidebar` so it is a drop-in replacement

### File: `src/components/teacher/classroom/TeacherClassroom.tsx` (Modify)

- Remove `<TodaysMissionSidebar>` from the 3-column layout
- Add `<FloatingCoPilot>` as a positioned overlay inside the main container
- Pass the same props: `lessonTitle`, `isTeacher`, `sharedNotes`, `sessionContext`, `onNotesChange`

### File: `src/components/student/classroom/StudentClassroom.tsx` (Modify)

- Same replacement: remove `<TodaysMissionSidebar>`, add `<FloatingCoPilot>` with `isTeacher={false}`

**Screen space saved**: ~288px of permanent sidebar width reclaimed for the main stage.

---

## Part 2: True Zen Mode (Deep Focus)

### What Changes

The existing Focus Mode hides the sidebars but keeps the full top bar. True Zen Mode goes further: it hides everything except the video feeds and the current slide/content, with all controls fading away until mouse movement.

### File: `src/components/teacher/classroom/TeacherClassroom.tsx` (Modify)

- Rename `isFocusMode` to `isZenMode` (and update all references)
- When `isZenMode` is true:
  - Hide the `ClassroomTopBar` entirely (not just parts of it)
  - Hide the `CommunicationZone` sidebar
  - Hide the `SlideNavigator` sidebar
  - Hide the `FloatingCoPilot` bubble
  - Show a minimal floating overlay at top-center: just the LIVE dot + elapsed time + "Exit Zen" button
  - This overlay auto-hides after 3 seconds of no mouse movement (use `onMouseMove` with a timeout)
  - The video feeds move to a small picture-in-picture corner (top-left, 200x150, draggable)

### File: `src/components/student/classroom/StudentClassroom.tsx` (Modify)

- Same Zen Mode logic: hide header, sidebar, and co-pilot
- Show minimal overlay with LIVE dot + "Exit Zen" button
- Teacher video appears as PiP corner

### New File: `src/components/classroom/ZenModeOverlay.tsx`

- A thin, semi-transparent bar (auto-hides on idle) containing:
  - Pulsing red LIVE dot
  - Elapsed time (font-mono)
  - Mute/Camera toggle buttons (compact)
  - "Exit Zen" button
- Uses `opacity-0` + `transition-opacity` + `group-hover:opacity-100` pattern or a `mousemove` timer
- Appears at the top of the screen, fades in on hover/movement

### New File: `src/components/classroom/PictureInPicture.tsx`

- A small draggable video container (using `react-rnd`) for showing the remote participant's video feed during Zen Mode
- Default position: top-left corner, 200x150
- Shows a minimal name label and connection dot
- Can be dragged anywhere on screen

### File: `src/components/teacher/classroom/ClassroomTopBar.tsx` (Modify)

- Rename `isFocusMode` prop to `isZenMode`
- Update the toggle button icon/label

### File: `src/components/student/classroom/StudentClassroomHeader.tsx` (Modify)

- Rename `isFocusMode` prop to `isZenMode`
- Update the toggle button

---

## Part 3: Unified Tabbed Canvas

### What Changes

Currently the whiteboard (CenterStage with CollaborativeCanvas) and the embedded content viewer (EmbeddedContentViewer) are separate overlapping components. Combine them into a single tabbed area.

### File: `src/components/teacher/classroom/CenterStage.tsx` (Modify)

- Add tabs at the top of the stage: **Slides** | **Whiteboard** | **Web Content**
- Use a minimal tab bar (just text tabs, no heavy UI) with an underline indicator
- **Slides tab** (default): Shows the current slide with the drawing overlay (existing behavior)
- **Whiteboard tab**: Shows a full blank canvas for freeform drawing (reuses CollaborativeCanvas at full size with white background)
- **Web Content tab**: Shows the embedded iframe viewer (currently handled by EmbeddedContentViewer)
  - When a teacher embeds a link, auto-switch to this tab
  - "Close" button returns to Slides tab
- The floating toolbar (pen, eraser, etc.) remains visible across all tabs
- Slide navigation arrows only show on the Slides tab

### File: `src/components/teacher/classroom/TeacherClassroom.tsx` (Modify)

- Remove the separate `<EmbeddedContentViewer>` render block
- Pass `embeddedUrl` and `onCloseEmbed` to `CenterStage` instead
- Add `activeCanvasTab` state and pass it to CenterStage

### File: `src/components/student/classroom/StudentMainStage.tsx` (Modify)

- Mirror the same tabbed structure (Slides | Whiteboard | Web Content)
- Student sees whichever tab the teacher has selected (synced via `classroomSync`)
- Read-only whiteboard tab unless `studentCanDraw` is true

### Service Update: `src/services/classroomSyncService.ts` (Modify)

- Add `activeCanvasTab` to the `SessionUpdate` interface
- Sync the active tab so student sees the same view as teacher

### Hook Update: `src/hooks/useClassroomSync.ts` (Modify)

- Expose `activeCanvasTab` from session state
- Add `updateCanvasTab(tab: string)` action

---

## Part 4: Auto-Hide Controls

### What Changes

Make the call controls (Mute, Camera, End Call) and the floating drawing toolbar semi-transparent when idle, fully visible on hover.

### File: `src/components/teacher/classroom/ClassroomTopBar.tsx` (Modify)

- Wrap the entire top bar in a container that uses `opacity-70 hover:opacity-100 transition-opacity duration-300`
- When the user hasn't moved their mouse for 3 seconds, reduce opacity to 0.4
- On any mouse movement over the bar, restore to full opacity
- The LIVE indicator always stays visible (exempt from fade)

### File: `src/components/teacher/classroom/CenterStage.tsx` (Modify)

- Apply the same auto-fade logic to the floating toolbar at the bottom
- Toolbar fades to `opacity-40` after 3 seconds of inactivity
- Fully visible on hover or mouse movement

### File: `src/components/student/classroom/StudentClassroomHeader.tsx` (Modify)

- Same auto-fade behavior for the student header bar

### Shared Hook: `src/hooks/useIdleOpacity.ts` (Create)

- A reusable hook that tracks mouse movement and returns an opacity class
- Parameters: `idleTimeout` (default 3000ms), `activeOpacity` (default 1), `idleOpacity` (default 0.4)
- Returns `{ opacity, onMouseMove, onMouseEnter }` for applying to containers

---

## File Summary

| File | Action | Description |
|------|--------|-------------|
| `src/components/classroom/FloatingCoPilot.tsx` | Create | Draggable floating bubble replacing the fixed mission sidebar |
| `src/components/classroom/ZenModeOverlay.tsx` | Create | Auto-hiding minimal control bar for Zen Mode |
| `src/components/classroom/PictureInPicture.tsx` | Create | Draggable PiP video container for Zen Mode |
| `src/hooks/useIdleOpacity.ts` | Create | Reusable hook for auto-fading UI on idle |
| `src/components/teacher/classroom/TeacherClassroom.tsx` | Modify | Replace sidebar with FloatingCoPilot, add Zen Mode, pass canvas tab state |
| `src/components/student/classroom/StudentClassroom.tsx` | Modify | Replace sidebar with FloatingCoPilot, add Zen Mode |
| `src/components/teacher/classroom/ClassroomTopBar.tsx` | Modify | Rename to isZenMode, add auto-fade behavior |
| `src/components/student/classroom/StudentClassroomHeader.tsx` | Modify | Rename to isZenMode, add auto-fade behavior |
| `src/components/teacher/classroom/CenterStage.tsx` | Modify | Add Slides/Whiteboard/Web tabs, merge embedded viewer, auto-fade toolbar |
| `src/components/student/classroom/StudentMainStage.tsx` | Modify | Mirror tabbed canvas from teacher view |
| `src/services/classroomSyncService.ts` | Modify | Add `activeCanvasTab` to sync interface |
| `src/hooks/useClassroomSync.ts` | Modify | Expose `activeCanvasTab` and `updateCanvasTab()` |
