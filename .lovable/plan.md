

# Unify Classroom Routing with booking_id as Universal Room Key

## Problem
Teacher and student currently navigate to different routes with potentially different IDs:
- **Teacher**: `/classroom/${session_id}` or `/classroom/${room_id}` or `/classroom/${booking.id}`
- **Student**: `/student-classroom/${session_id}` or `/student-classroom/${booking.id}`

The `session_id` field is nullable and inconsistently populated. Multiple code paths use different ID sources (`room_id`, `session_id`, `id`), so teacher and student can end up in different WebRTC/Realtime rooms.

## Solution
Use the booking's `id` (primary key UUID) as the single universal room key everywhere. It is always present, always unique, always the same for both participants.

## Changes

### 1. Unify all "Join Classroom" navigation to use `booking.id`

| File | Current | Fix |
|------|---------|-----|
| `src/components/student/JoinLessonHero.tsx` | `session_id` first, fallback `id` | Always use `lesson.id` (booking id) |
| `src/components/student/DashboardTab.tsx` | `session_id` first, fallback `meeting_link` | Always use `booking.id` |
| `src/components/teacher/dashboard/NextLessonCard.tsx` | `room_id \|\| id` | Always use `nextLesson.id` |
| `src/components/teacher/dashboard/WelcomeSection.tsx` | Queries `session_id` only | Query `id`, navigate with `id` |
| `src/components/teacher/professional/CommandCenter.tsx` | Uses `sessionId` | Use booking `id` |

### 2. Ensure classroom components use the URL param directly as roomId
Already done in the last fix — `TeacherClassroom` uses `roomName = classId` and `StudentClassroom` uses `roomId` directly. Both come from the URL `:id` param. No change needed here, but verify consistency.

### 3. Prefix the WebRTC room name consistently
In both `TeacherClassroom` and `StudentClassroom`, ensure the WebRTC `roomId` passed to `useWebRTCConnection` uses the same format:
```
const webrtcRoom = `engleuphoria-${urlParamId}`;
```
This ensures the signaling server creates one room, not two.

### 4. Add debug Room ID label
Add a small translucent "Room: {id}" chip in the bottom-left corner of both classroom components, visible only in development or when a `?debug=true` query param is present.

### 5. Validate booking access
On both classroom pages (`TeacherClassroomPage`, `StudentClassroomPage`), fetch the booking by the URL `id` and verify the current user is either the `teacher_id` or `student_id`. If not, redirect out. This replaces the current approach of blindly trusting the URL.

## Files to modify
- `src/components/student/JoinLessonHero.tsx`
- `src/components/student/DashboardTab.tsx`
- `src/components/teacher/dashboard/NextLessonCard.tsx`
- `src/components/teacher/dashboard/WelcomeSection.tsx`
- `src/components/teacher/professional/CommandCenter.tsx`
- `src/components/teacher/classroom/TeacherClassroom.tsx` — prefix WebRTC room, add debug label
- `src/components/student/classroom/StudentClassroom.tsx` — prefix WebRTC room, add debug label
- `src/pages/TeacherClassroomPage.tsx` — add booking validation
- `src/pages/StudentClassroomPage.tsx` — add booking validation

No database changes needed.

