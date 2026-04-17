

# Plan: Real Names in Video, Working WebRTC Video Tiles, Clickable "Book a Lesson"

## Root Causes

### 1. Wrong names in the video call
`UnifiedClassroomPage` currently passes `user.user_metadata.full_name` as **both** `teacherName` (to `TeacherClassroom`) and `studentName` (to `StudentClassroom`). It never queries the booking's *other* participant. So:
- The teacher sees `studentName="Emma"` (the hard-coded default in `TeacherClassroom`).
- The student sees `teacherName="Teacher"` (a hard-coded literal in `StudentClassroom` line 276).
- Neither side shows the **booker's** real name (the student who booked the lesson, fetched from `users.full_name` via `class_bookings.student_id`).

### 2. Can't see each other on video
WebRTC peer-to-peer **is** connecting (console confirms `Successfully connected to <peer>` and `Remote stream received`). The bug is purely UI: neither sidebar wires the streams into a `<video>` element.

| Sidebar | Local stream | Remote stream |
|---------|--------------|---------------|
| Teacher's `CommunicationZone` | Wired to small "You" tile (line 107-114) ✓ | **Not wired** — the big "Student" tile (line 91-102) only shows a placeholder `<User>` icon |
| Student's `StudentCommunicationSidebar` | **Not wired** — placeholder icon (line 60-62) | **Not wired** — placeholder emoji (line 45-47) |

Result: both users see static avatar placeholders despite a healthy peer connection.

### 3. "Book a Lesson" button not clickable
In `JoinLessonHero.tsx` (the prominent CTA shown on Academy/Playground/Hub dashboards when the student has no upcoming lessons), the **"Book a Lesson"** Button (line 163-172) has **no `onClick` handler**. That's the button the user is clicking.

Bonus: harmless duplicate session-create error in console (`duplicate key value violates unique constraint "classroom_sessions_room_id_key"`) — a race when both peers create the row. Already handled gracefully but we'll patch it to upsert silently.

## Solution

### A. Fetch booking participant names in `UnifiedClassroomPage`
Extend the existing `class_bookings` query to also return the counterparty's `users.full_name`/`email`:
```
SELECT cb.*, t:users!teacher_id(full_name, email), s:users!student_id(full_name, email)
```
Pass both `teacherName` and `studentName` (resolved to the booker's real full name) into `TeacherClassroom` and `StudentClassroom`.

### B. Wire WebRTC streams into both sidebars
Pass `participants[0]?.stream` (remote) and `media.stream` (local) from `TeacherClassroom` / `StudentClassroom` down to their sidebars, then render `<video autoPlay playsInline>` elements.

**`CommunicationZone` (teacher):**
- Accept new props: `remoteStream` (student's video), keep `localStream` for "You" tile.
- Replace the placeholder `<User>` icon in the big student tile with `<video srcObject={remoteStream}>`.
- Show "Camera off" fallback when stream exists but track is disabled.

**`StudentCommunicationSidebar` (student):**
- Accept new props: `localStream`, `remoteStream`.
- Replace teacher emoji with `<video srcObject={remoteStream}>`.
- Replace student placeholder with `<video srcObject={localStream} muted>` (mirrored).

### C. Fix "Book a Lesson" CTA in `JoinLessonHero`
Add `onClick` to the empty-state Button: `navigate(\`/find-teacher?hub=${hubId}\`)`. Same on the lesson-active variant if there's a duplicate.

### D. Silence duplicate-session race
In `classroomSyncService.createOrUpdateSession`, replace the SELECT-then-INSERT with `.upsert({...}, { onConflict: 'room_id' })` so a parallel teacher/student insert does not throw the 23505.

## Files to Modify
| File | Change |
|------|--------|
| `src/pages/UnifiedClassroomPage.tsx` | Join `users` for both participants, pass real names |
| `src/components/student/JoinLessonHero.tsx` | Add `onClick` → `/find-teacher?hub={hubId}` on Book a Lesson button |
| `src/components/teacher/classroom/TeacherClassroom.tsx` | Pass `participants[0]?.stream` and `media.stream` to `CommunicationZone` |
| `src/components/teacher/classroom/CommunicationZone.tsx` | Render `<video>` for remote student + local teacher |
| `src/components/student/classroom/StudentClassroom.tsx` | Pass `media.stream` and `participants[0]?.stream` to sidebar; also pass real teacher name |
| `src/components/student/classroom/StudentCommunicationSidebar.tsx` | Render `<video>` for remote teacher + local student |
| `src/services/classroomSyncService.ts` | Use `upsert(..., onConflict: 'room_id')` to avoid 23505 race |

## Expected Result
- Teacher sidebar shows the **student's live video feed** with the **student's real full name** below it.
- Student sidebar shows the **teacher's live video feed** with the teacher's real full name, plus the student's own self-view (mirrored).
- "Book a Lesson" button on every empty-state hub dashboard navigates to `/find-teacher?hub=<student's hub>`.
- No more `duplicate key` error spam in the console.

