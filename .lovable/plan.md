

# Phase 9: "Clean Classroom" -- Glassmorphism, Dynamic Overlay, Smart Summary, and Full-Screen Video

## Summary

This upgrade transforms the classroom from a "boxed layout" into a modern, overlaid interface. All panels get glassmorphism styling, video feeds become the visual anchor with transparent overlays for lesson context, and a "Smart Summary" sparkle provides instant AI tips. The goal: maximize face-to-face visual space for language learning.

---

## Part 1: Glassmorphism Foundation

### What Changes

Replace all opaque `bg-gray-900` panel backgrounds across the classroom with frosted glass effects. This creates visual depth and a sense of openness.

### Shared Utility Class

**File: `src/index.css`** (Modify)

Add a reusable `.glass-panel` utility class:

```css
.glass-panel {
  background: rgba(17, 24, 39, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

### Files Affected

| File | Change |
|------|--------|
| `ClassroomTopBar.tsx` | Replace `bg-gray-900 border-b border-gray-800` with `glass-panel` |
| `StudentClassroomHeader.tsx` | Same glassmorphism swap |
| `CommunicationZone.tsx` | Replace `bg-gray-900 border-r border-gray-800` with `glass-panel border-r border-white/5` |
| `StudentCommunicationSidebar.tsx` | Same glassmorphism swap |
| `SlideNavigator.tsx` | Replace `bg-gray-900 border-l border-gray-800` with `glass-panel border-l border-white/5` |
| `FloatingCoPilot.tsx` | Replace `bg-gray-900/95 backdrop-blur-md border border-gray-700` with `glass-panel` (already close, refine to match) |
| `ZenModeOverlay.tsx` | Replace `bg-gray-900/90 backdrop-blur-md` with `glass-panel` |
| `CenterStage.tsx` | Apply glass effect to the floating toolbar |

---

## Part 2: Dynamic Target Words Overlay

### What Changes

Instead of burying "Target Vocabulary" inside the floating co-pilot, display the 3 current target words as a subtle transparent overlay directly on the main stage (over the slide/whiteboard area). This keeps the learning objectives visible at all times without taking extra screen space.

### New File: `src/components/classroom/TargetWordsOverlay.tsx`

- A transparent overlay positioned at the top-left corner of the center stage
- Shows 3 target words from the session context (vocabulary items from the mission)
- Uses `Inter` or the project's primary font with `text-shadow: 0 1px 4px rgba(0,0,0,0.6)` for readability over any background
- Fades in/out with the idle opacity hook (visible for 5 seconds, then fades to near-invisible, reappears on mouse movement)
- Glass pill styling: `bg-black/30 backdrop-blur-sm rounded-full px-3 py-1`
- Each word shown as a small pill, stacked vertically with spacing
- Teacher can click a word to mark it as "covered" (strikethrough effect)

### Integration

**File: `CenterStage.tsx`** (Modify)
- Render `<TargetWordsOverlay>` as an absolute-positioned element inside the stage container
- Pass current vocabulary from `sessionContext` or the mission items

**File: `StudentMainStage.tsx`** (Modify)
- Same overlay rendered read-only (no click to mark)

---

## Part 3: Smart Summary Sparkle Button

### What Changes

Add a small sparkle icon that, when clicked, shows a 1-sentence AI-generated tip personalized to the student's level and recent mistakes. This is a lightweight, non-intrusive interaction.

### New File: `src/components/classroom/SmartSummaryTip.tsx`

- A small floating button (36x36, sparkle icon) positioned bottom-left of the center stage
- On click, shows a tooltip-style popup with a single AI-generated sentence:
  - For Playground level: "Try saying 'I have a cat' instead of 'I have cat'!"
  - For Academy level: "Pro Tip: Use transition words like 'Furthermore' or 'However'"
  - For Professional level: "Try structuring your answer with 'Firstly... Secondly... In conclusion'"
- Tips are generated from templates based on `sessionContext.level` and `sessionContext.lastMistake`
- Popup auto-dismisses after 6 seconds or on click-away
- Uses `AnimatePresence` for smooth fade in/out
- Glass styling for the popup: `glass-panel rounded-xl shadow-2xl`

### Integration

**File: `CenterStage.tsx`** (Modify)
- Render `<SmartSummaryTip>` inside the stage, positioned `absolute bottom-6 left-6`
- Pass `sessionContext` from teacher props

**File: `StudentMainStage.tsx`** (Modify)
- Same component rendered for the student view
- Pass `sessionContext` received from the classroom sync

### Props needed in StudentMainStage

**File: `StudentClassroom.tsx`** (Modify)
- Pass `sessionContext` to `<StudentMainStage>`

**File: `StudentMainStage.tsx`** (Modify)
- Accept new `sessionContext` prop

---

## Part 4: Full-Screen Video Toggle

### What Changes

Add a "Full Screen" button on the teacher's video container (in the student view) and on the student's video container (in the teacher view), allowing either party to temporarily make the remote participant's video fill the entire stage area for pronunciation practice.

### Implementation in `CommunicationZone.tsx` (Modify)

- Add a small `Maximize2` icon button on the student video container
- When clicked, the video expands to fill the center stage area (using a state variable `isVideoFullscreen`)
- A floating "Exit Full Screen" button appears to return to normal view
- The center stage content is temporarily hidden (not unmounted) while video is fullscreen

### Implementation in `StudentCommunicationSidebar.tsx` (Modify)

- Same fullscreen toggle on the teacher video container
- Uses same expand/collapse pattern

### State Management

**File: `TeacherClassroom.tsx`** (Modify)
- Add `isVideoFullscreen` state
- When true, render the student video as a full-stage element overlaying the CenterStage
- Pass `onToggleFullscreen` and `isFullscreen` props to CommunicationZone

**File: `StudentClassroom.tsx`** (Modify)
- Add `isVideoFullscreen` state
- When true, render the teacher video as a full-stage element overlaying StudentMainStage
- Pass props to StudentCommunicationSidebar

---

## Part 5: Enhanced Auto-Hide for Sidebars

### What Changes

Currently the `useIdleOpacity` hook only applies to the top bar. Extend it to make both sidebars (Communication + SlideNavigator) also auto-fade on idle, but with a gentler approach: they shrink to a narrow strip on idle rather than just fading.

### File: `TeacherClassroom.tsx` (Modify)

- Add a `sidebarIdle` instance of `useIdleOpacity` with `idleTimeout: 4000, idleOpacity: 0.3`
- Wrap both `CommunicationZone` and `SlideNavigator` with the idle style
- On idle, sidebars fade to 30% opacity; on mouse hover over them, they immediately restore to 100%

### File: `StudentClassroom.tsx` (Modify)

- Same pattern for `StudentCommunicationSidebar`

---

## File Summary

| File | Action | Description |
|------|--------|-------------|
| `src/index.css` | Modify | Add `.glass-panel` utility class |
| `src/components/classroom/TargetWordsOverlay.tsx` | Create | Transparent target words overlay for center stage |
| `src/components/classroom/SmartSummaryTip.tsx` | Create | Sparkle button with AI-generated 1-sentence tips |
| `src/components/teacher/classroom/ClassroomTopBar.tsx` | Modify | Glassmorphism styling |
| `src/components/student/classroom/StudentClassroomHeader.tsx` | Modify | Glassmorphism styling |
| `src/components/teacher/classroom/CommunicationZone.tsx` | Modify | Glassmorphism + fullscreen video toggle |
| `src/components/student/classroom/StudentCommunicationSidebar.tsx` | Modify | Glassmorphism + fullscreen video toggle |
| `src/components/teacher/classroom/SlideNavigator.tsx` | Modify | Glassmorphism styling |
| `src/components/teacher/classroom/CenterStage.tsx` | Modify | Glassmorphism toolbar + TargetWordsOverlay + SmartSummaryTip |
| `src/components/student/classroom/StudentMainStage.tsx` | Modify | TargetWordsOverlay + SmartSummaryTip + sessionContext prop |
| `src/components/classroom/FloatingCoPilot.tsx` | Modify | Refined glassmorphism consistency |
| `src/components/classroom/ZenModeOverlay.tsx` | Modify | Glassmorphism consistency |
| `src/components/teacher/classroom/TeacherClassroom.tsx` | Modify | Video fullscreen state + sidebar auto-hide |
| `src/components/student/classroom/StudentClassroom.tsx` | Modify | Video fullscreen state + sidebar auto-hide + pass sessionContext |

