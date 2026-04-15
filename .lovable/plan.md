

# Fix Remaining Dark Colors in Classroom — Full Light Mode

## Problem
The outer containers (headers, main wrapper) were updated to light mode, but the **inner components** still use dark backgrounds extensively:

### Dark elements found:

**CSS Global:**
- `.glass-panel` in `src/index.css` uses `rgba(17, 24, 39, 0.75)` (near-black)

**Teacher Side:**
- `CenterStage.tsx` — `bg-gray-950` main background, `bg-gray-800` tabs, dark toolbar, dark nav arrows
- `CommunicationZone.tsx` — `glass-panel` sidebar, `bg-gray-800` video containers, `bg-gray-800` chat inputs, `border-gray-800` dividers
- `SlideNavigator.tsx` — `glass-panel` sidebar, `bg-gray-800` slide thumbnails, `text-white` text, `border-gray-800`
- `TeacherClassroom.tsx` — Timer dialog: `bg-gray-900`, `border-gray-800`, `bg-gray-800` inputs

**Student Side:**
- `StudentMainStage.tsx` — `bg-gray-950` main background, `bg-gray-800` tabs, dark bottom indicator bar
- `StudentCommunicationSidebar.tsx` — `glass-panel` sidebar, `bg-gray-800` video cards, dark chat styling

**Shared:**
- `ZenModeOverlay.tsx` — `glass-panel`, `bg-gray-700` dividers, dark text colors
- `FloatingCoPilot.tsx` — likely uses glass-panel too

## Plan

### Step 1: Update `.glass-panel` CSS to Light Mode
**File:** `src/index.css`
- Change from `rgba(17, 24, 39, 0.75)` to `rgba(255, 255, 255, 0.85)` with white backdrop
- Update border from `white/10` to `gray-200`

### Step 2: Convert CenterStage to Light
**File:** `src/components/teacher/classroom/CenterStage.tsx`
- `bg-gray-950` → `bg-white/40`
- Tabs: `bg-gray-800` → `bg-white`, `text-white` → `text-gray-900`, `border-purple-500` kept
- Inactive tabs: `text-gray-500 hover:text-gray-300 hover:bg-gray-800/50` → `text-gray-400 hover:text-gray-700 hover:bg-gray-100`
- Nav arrows: `bg-gray-800/80 hover:bg-gray-700 text-white` → `bg-white/80 hover:bg-gray-100 text-gray-700 shadow-md`
- Floating toolbar: `glass-panel` already fixed, update tool button colors from `text-gray-400 hover:text-white hover:bg-gray-700` → `text-gray-500 hover:text-gray-900 hover:bg-gray-100`
- Color popover: `bg-gray-800 border-gray-700` → `bg-white border-gray-200`

### Step 3: Convert CommunicationZone to Light
**File:** `src/components/teacher/classroom/CommunicationZone.tsx`
- Video containers: `bg-gray-800` → `bg-gray-100`, borders to light
- Labels: `bg-black/60 text-white` → `bg-white/80 text-gray-700 shadow-sm`
- Avatar circles: `bg-gray-700` → `bg-gray-200`
- Chat: `border-gray-800` → `border-gray-200`, `bg-gray-800` messages → `bg-gray-100`, input `bg-gray-800` → `bg-gray-50`
- Chat header: `text-gray-400` → `text-gray-500`

### Step 4: Convert SlideNavigator to Light
**File:** `src/components/teacher/classroom/SlideNavigator.tsx`
- Sidebar: glass-panel already fixed
- Header: `border-gray-800` → `border-gray-200`, `text-white` → `text-gray-900`
- Thumbnails: `bg-gray-800` → `bg-gray-100`, `text-gray-600` → `text-gray-400`
- Ring offset: `ring-offset-gray-900` → `ring-offset-white`
- Collapsed: `text-gray-400 hover:text-white` → `text-gray-500 hover:text-gray-900`

### Step 5: Convert StudentMainStage to Light
**File:** `src/components/student/classroom/StudentMainStage.tsx`
- `bg-gray-950` → `bg-white/40`
- Same tab styling fixes as CenterStage
- Screen share placeholder: `bg-gray-900` → `bg-gray-50`
- Bottom indicator: `bg-gray-800/90 text-gray-400` → `bg-white/90 text-gray-600 shadow-sm border border-gray-200`

### Step 6: Convert StudentCommunicationSidebar to Light
**File:** `src/components/student/classroom/StudentCommunicationSidebar.tsx`
- Same pattern as CommunicationZone: light video cards, light chat, light borders

### Step 7: Convert Timer Dialog in TeacherClassroom
**File:** `src/components/teacher/classroom/TeacherClassroom.tsx`
- Timer dialog: `bg-gray-900 border-gray-800 text-white` → `bg-white border-gray-200 text-gray-900`
- Timer input: `bg-gray-800 border-gray-700` → `bg-gray-50 border-gray-200`
- Timer text: `text-gray-400` → `text-gray-500`

### Step 8: Convert ZenModeOverlay to Light
**File:** `src/components/classroom/ZenModeOverlay.tsx`
- Dividers: `bg-gray-700` → `bg-gray-300`
- Text: `text-gray-300/400` → `text-gray-600/500`
- Uses glass-panel (already fixed)

### Step 9: Timer/Dice overlays in StudentClassroom
**File:** `src/components/student/classroom/StudentClassroom.tsx`
- Timer overlay: `bg-gray-900/95 border-blue-500/50` → `bg-white/95 border-blue-300 shadow-lg`
- Timer text: `text-blue-400` → `text-blue-600`

## Files to Modify (9 files)
1. `src/index.css` — glass-panel to light
2. `src/components/teacher/classroom/CenterStage.tsx`
3. `src/components/teacher/classroom/CommunicationZone.tsx`
4. `src/components/teacher/classroom/SlideNavigator.tsx`
5. `src/components/teacher/classroom/TeacherClassroom.tsx` (timer dialog only)
6. `src/components/student/classroom/StudentMainStage.tsx`
7. `src/components/student/classroom/StudentCommunicationSidebar.tsx`
8. `src/components/student/classroom/StudentClassroom.tsx` (overlays only)
9. `src/components/classroom/ZenModeOverlay.tsx`

All changes are purely visual (CSS classes). No layout or functionality changes.

