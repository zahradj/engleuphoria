
# Classroom UI Polish — Round 2

Four tightly-scoped UI refinements across teacher + student classrooms. No business-logic, RLS, or data changes.

## 1. Align teacher video frames with student frames

In `src/components/teacher/classroom/CommunicationZone.tsx` (expanded view, lines ~167–260) the **student** tile is `aspect-[4/3]` full-width but the **teacher (You)** tile uses `w-2/3`, so the two frames are mismatched.

Change:
- Make both video tiles share an identical wrapper: full-width, `aspect-[4/3]`, same rounded card chrome (`Card` + `CardContent` like the student sidebar uses), same border treatment, same label/indicator placement.
- Keep teacher remote-control buttons over the student tile.
- Collapsed-rail circles (lines 108–139) stay the same — they're already symmetric.

Result: teacher view shows two equal stacked frames (Student on top, You below), mirroring the student view.

## 2. Make lesson slides visible

Teacher already passes resolved Master Library slides to `TeacherClassroom` (`initialSlides`) and pushes them to the student via `useClassroomSync`. The student renders them through `StudentMainStage`. When `lessonSlides` is empty, the student currently shows a single placeholder `"Waiting for teacher..."`.

Changes:
- **Teacher side**: the `SlideNavigator` is imported but only mounted in some flows. Ensure the slide thumbnail strip / current slide preview is visible in the main stage area so the teacher can see and step through `slides` from the moment they enter (not gated behind a tab switch).
- **Student side**: when `lessonSlides.length === 0`, render a friendlier "Lesson loading…" state instead of a stubbed slide, and re-render automatically once the teacher's broadcast arrives (already wired via `useClassroomSync`, just remove the stub array fallback so the real slide list shows up the moment it lands).
- Verify `resolveBookingLesson` actually returns slides for the current booking; if it returns empty, fall back to the lesson's `curriculum_lessons.content.slides` (read-only query — no schema change).

## 3. Replace the "Realtime + Force Sync" tab with an icon-only button

Both `TeacherClassroom.tsx` (lines 537–543) and `StudentClassroom.tsx` (lines 299–302) render a pill in the top-right with a status dot, the word "Realtime", and (teacher only) a red "Force Sync" button.

Change to:
- A single small circular icon button in the same top-right slot.
- Teacher: `RefreshCw` icon, hub-themed background, runs `handleForceSync` on click. Tooltip: "Force sync".
- Student: same circular slot but icon-only status (no button, no label, no "Realtime" text) — just a small dot/pulse showing connection state.
- Drop the word "Realtime" entirely. Keep `ConnectionDebugPanel` for `?debug` URLs only.

## 4. Enhance the stars — remove the numbers

Two components show numeric labels alongside stars:

- **`src/components/classroom/StarRewardsLine.tsx`** (lines 71–75, 91–94): each milestone star renders the milestone number under it, and the bottom shows `points` + "points". Remove the milestone number captions, remove the bottom "points" text, and keep only the stars themselves. Add a subtle scale + glow on earned stars to compensate for the lost label.
- **`src/components/classroom/engagement/XPStreakIndicator.tsx`**: the streak section currently shows `<Flame /> {streak}`. Drop the numeric streak count — keep just the flame icon (animated when streak ≥ 2). Keep the `XP` count itself since that's the indicator's purpose; only the streak number goes.

Star celebration overlay (`StarCelebration`) is unchanged — it's a brief animation, not a persistent counter.

## Files touched

- `src/components/teacher/classroom/CommunicationZone.tsx` — symmetric video frames
- `src/components/teacher/classroom/TeacherClassroom.tsx` — top-right icon button, ensure slide nav visible
- `src/components/student/classroom/StudentClassroom.tsx` — top-right status dot only, slide-loading state
- `src/components/student/classroom/StudentMainStage.tsx` — empty-slides fallback (if needed)
- `src/services/classroomLessonResolver.ts` — verify slide fallback (read-only check, edit only if empty)
- `src/components/classroom/StarRewardsLine.tsx` — drop numbers
- `src/components/classroom/engagement/XPStreakIndicator.tsx` — drop streak number

## Out of scope

- No DB / RLS / migration work.
- No changes to WebRTC, sync engine, or scoring logic.
- No new features; this is purely a visual/UX cleanup pass on what already exists.
