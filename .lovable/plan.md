
# Live Session Badge + NextLessonCard Real Data + End-to-End Verification

## What Exists (Full Audit)

### Teacher Side
- `NextLessonCard.tsx` — **already wired to real data** via `get_teacher_upcoming_lessons` RPC. The "Replace mock data" task from the previous plan was already completed. The card properly shows the next upcoming lesson with student name, time, and countdown. The "Enter Classroom" button navigates to `/classroom/{room_id}`.
- `NovakidDashboard.tsx` — renders `<NextLessonCard />` in the teacher dashboard's main column.

### Student Side
- `PlaygroundDashboard.tsx` — uses `EnterClassroomCTA` (bouncy button) wired to `get_student_upcoming_lessons` RPC and a `BookMyClassModal`. Real data is already being fetched.
- `AcademyDashboard.tsx` — has `BookMyClassModal` with `bookingOpen` state. Has a mock schedule. No live "Join" button beyond the modal.
- `HubDashboard.tsx` — has `BookMyClassModal` with `bookingOpen` state. No live "Join" button either.

### Classroom Sessions
- `classroom_sessions` table has: `room_id`, `session_status` (`waiting | started | active | ended`), `teacher_id`, `started_at`, `ended_at`
- `classroomSyncService.ts` writes to this table when teacher enters and sets `session_status = 'active'`
- **No existing LIVE badge/indicator** on any dashboard — this is the main gap

### Booking Flow (already complete)
- `BookMyClassModal.tsx` — fully functional: fetches slots, atomic booking, confetti on success, shows `meeting_link`
- `SessionPrivacyGuard.tsx` — wraps both `StudentClassroomPage` and `TeacherClassroomPage`
- `class_bookings` trigger — auto-generates `session_id` and `meeting_link`

### What Needs to Be Built
1. **`useLiveClassroomStatus` hook** — queries `classroom_sessions` table and subscribes to real-time updates to detect any `session_status = 'active'` session involving the current user (as teacher or student). Returns the active `room_id` when live.
2. **`LiveSessionBadge` component** — a green pulsing `● LIVE` badge displayed in both teacher and student dashboards when a session is active.
3. **`NextLessonCard`** — add the LIVE badge to the card header when `room_id` of the lesson matches an active session.
4. **`AcademyDashboard`** — add a "Join Live Lesson" floating button that appears when an active session is detected for this student.
5. **`HubDashboard`** — same floating "Join Live Lesson" button.
6. **`PlaygroundDashboard`** — already has `EnterClassroomCTA`, but needs to also detect active sessions (not just upcoming ones) and change the button text/style to "🔴 Join LIVE" when a session is active.

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/hooks/useLiveClassroomStatus.ts` | Polls + subscribes to `classroom_sessions` in real time to detect active sessions for the current user |
| `src/components/shared/LiveSessionBadge.tsx` | Reusable green pulsing LIVE badge + "Join Now" button |

## Files to Modify

| File | Change |
|------|---------|
| `src/components/teacher/dashboard/NextLessonCard.tsx` | Import `useLiveClassroomStatus`; add green LIVE badge in card header when `room_id` matches an active session; change button to "Join LIVE Class Now" with red pulse |
| `src/components/student/dashboards/PlaygroundDashboard.tsx` | Import `useLiveClassroomStatus`; when active session detected, override `EnterClassroomCTA` with live session link to `/student-classroom/{room_id}` |
| `src/components/student/dashboards/AcademyDashboard.tsx` | Import `useLiveClassroomStatus`; render `LiveSessionBadge` floating bar at the top of main content area when session is active |
| `src/components/student/dashboards/HubDashboard.tsx` | Same as Academy — import hook and render floating `LiveSessionBadge` |

---

## Technical Implementation

### `useLiveClassroomStatus` Hook

```
Query: classroom_sessions
  WHERE session_status = 'active'
  AND (teacher_id = auth.uid() OR student_id ... )
```

Since `classroom_sessions` does not have a `student_id` column (it only stores `teacher_id` and `room_id`), the student check works differently: the hook will look up `class_bookings` for the student's confirmed bookings and cross-reference the `session_id`/`room_id` with `classroom_sessions.room_id`.

**Teacher flow**: Query `classroom_sessions WHERE teacher_id = auth.uid() AND session_status = 'active'` → gets `room_id` → navigation target is `/classroom/{room_id}`.

**Student flow**: Query student's `class_bookings` where `status = 'confirmed'` and `session_id` is set → then check if any of those `session_id` values appear in `classroom_sessions.room_id` with `session_status = 'active'` → navigation target is `/student-classroom/{session_id}`.

Both subscribe to real-time Supabase channel on `classroom_sessions` table to instantly detect state changes without polling.

### `LiveSessionBadge` Component

A floating banner / pill that renders:
- A pulsing red dot `●`
- Text: **"LIVE — Your class is in session!"**
- A green "Join Now →" button that navigates to the appropriate classroom URL
- Positioned as a sticky banner at the top of the page content for Academy/Hub dashboards
- Animate in/out using Framer Motion

### LIVE Badge in `NextLessonCard`

When `useLiveClassroomStatus` returns an active `room_id` that matches the next lesson's `room_id`:
- Show a `● LIVE` badge in the card header (green, pulsing)
- Change the "Enter Classroom" button to a bright red `🔴 Join LIVE Class` with stronger pulse animation
- The button click navigates immediately (no countdown restriction)

### Verification Checklist (Step 14)

The plan also covers the end-to-end test. Here is the sequence:

**Booking Test:**
1. Log in as a teacher → go to Schedule tab → create an availability slot starting 5 minutes from now
2. Open a second browser tab → log in as a student → go to any dashboard → click "Book a Class"
3. The `BookMyClassModal` opens → the slot appears in the calendar → click to book
4. Confetti fires → success screen shows a `meeting_link` like `/student-classroom/abc123def456`
5. The teacher's `NextLessonCard` shows the next lesson with the correct countdown (within 5 min → green "Enter Classroom" button becomes enabled)

**LIVE Test:**
6. Teacher clicks "Enter Classroom" → navigates to `/classroom/{room_id}`
7. The `classroomSyncService` inserts/updates `classroom_sessions` with `session_status = 'active'`
8. After ≤3 seconds, the student's dashboard shows the `LiveSessionBadge` banner appear automatically (via real-time subscription)
9. Student clicks "Join Now" → navigates to `/student-classroom/{session_id}`

**Security Test:**
- `SessionPrivacyGuard` on `StudentClassroomPage` calls `can_access_booking_session` RPC
- Since `session_id` in `class_bookings` matches the `room_id` used by the classroom, and the student's `student_id` is in the booking → access is granted ✓

---

## Important Note on `can_access_booking_session`

The `SessionPrivacyGuard` calls `can_access_booking_session(p_session_id, p_user_id)` which checks `class_bookings.session_id`. However, the teacher classroom is keyed by `lessons.room_id`, not `class_bookings.session_id`. The guard already handles this with a fallback to `can_access_lesson(room_uuid, user_uuid)`.

For bookings created via `BookMyClassModal`, the `class_bookings.session_id` becomes the shared room key (e.g., `abc123def456`). The classroom sync uses this as the `room_id` in `classroom_sessions`. The student's `meeting_link` is `/student-classroom/abc123def456` and the teacher's is `/classroom/abc123def456` — both valid.

---

## No Database Changes Required

All required data is already available:
- `classroom_sessions` table with `session_status` — exists ✓
- `class_bookings` with `session_id` and `meeting_link` — exists ✓
- RLS on `classroom_sessions` — already allows sessions to be read by participants ✓
- `can_access_booking_session` RPC — exists ✓

No migrations needed. This is purely a frontend/hook implementation.
