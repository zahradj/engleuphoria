
# Steps 12, 13 & 14: Session IDs, Classroom Security & Deployment Checklist

## Audit Summary — What Already Exists

After a deep inspection of every relevant file and the live database, here is the complete picture:

**Already Built:**
- `class_bookings` table: has `id`, `student_id`, `teacher_id`, `scheduled_at`, `status`, `duration`, but **no `session_id` or `meeting_link` columns**
- `lessons` table: has `room_id` and `room_link` columns already
- `classroom_sessions` table: tracks live sessions keyed by `room_id` (e.g. `MySchool_Class_{id}`)
- `ClassroomQuickJoin` component: detects upcoming lessons within 15 minutes and shows a floating "Join" button
- `TeacherClassroom` routes via `/classroom/:id` (teacher only, protected by `ImprovedProtectedRoute`)
- `StudentClassroom` routes via `/student-classroom/:id` (student only, protected)
- `ImprovedProtectedRoute`: properly redirects to `/login` for wrong roles — route protection is already solid
- `send-lesson-reminders` edge function: includes `room_link` in the email if present
- Teacher `NextLessonCard`: uses mock data and navigates to `/classroom/{lesson.id}` — needs wiring to real data
- `NovakidDashboard`: teacher dashboard, loads the `NextLessonCard` — needs real upcoming lesson data
- RLS: `student_profiles` and `class_bookings` already restrict to their owners; `classroom_sessions` has a "view own room" policy

**Gaps to Fill:**
1. `class_bookings` table is missing `session_id` and `meeting_link` — need a DB migration to add them
2. No database trigger to auto-generate `session_id` and `meeting_link` when a booking is created
3. `NextLessonCard` in teacher dashboard uses hardcoded mock data — needs real DB query
4. `BookMyClassModal` creates a `class_bookings` record but does not pass the resulting `meeting_link` back to the confirmation screen for the student to copy/use
5. The classroom `/student-classroom/:id` route uses the `id` param as a `roomId` — but the booking flow uses `class_bookings.id`, not a room/session ID — these need to be reconciled
6. No "classroom privacy" check at the page level: any authenticated student can currently load `/student-classroom/any-id`
7. `ImprovedProtectedRoute` redirects silently — Step 13 wants a visible toast saying "Access Denied"
8. Step 14 is a manual launch checklist — no code changes needed, just a checklist to hand to the user

---

## What Will Be Built

### Step 12A — Database Migration: `session_id` & `meeting_link` on `class_bookings`

Two new columns will be added to `class_bookings`:
- `session_id TEXT` — a unique 12-character alphanumeric string (generated via `substring(replace(gen_random_uuid()::text, '-', ''), 1, 12)`)
- `meeting_link TEXT` — automatically set to `/student-classroom/{session_id}`

A PostgreSQL trigger function `generate_booking_session` will be created and attached `BEFORE INSERT` on `class_bookings`. It will populate both columns so every new booking automatically has a private, unique URL.

The teacher needs the same URL but via the teacher-facing route. The trigger will store the student-facing URL in `meeting_link`. The teacher's classroom URL (for the same session) will be `/classroom/{session_id}`, which is the parallel teacher route.

### Step 12B — Wire Real Data into Teacher's `NextLessonCard`

The `NextLessonCard` component currently uses hardcoded mock data. It will be updated to:
- Use a Supabase query from `lessons` (joining `users` for student name) filtered by `teacher_id = auth.uid()`, `status IN ('scheduled','confirmed')`, and `scheduled_at >= NOW()`
- Display the actual next lesson's title, student name, time, and `room_link`
- Show the "Enter Classroom" button that navigates to `/classroom/{room_id}` (the lesson's `room_id` is how the teacher classroom is keyed)

### Step 12C — "Join Live Lesson" Button in Student Dashboards (Classroom Quick Join)

The existing `ClassroomQuickJoin` component already handles the 15-minute window detection and displays a floating "Join" button. However, it currently routes to `/classroom/{lesson.id}` — the **teacher** route — for all users.

It will be updated to route students to `/student-classroom/{room_id}` instead of `/classroom/{...}`.

The `BookMyClassModal`'s success screen will also show the meeting link immediately after booking, so the student doesn't need to wait for email.

### Step 12D — Update Reminder Email to Include `meeting_link`

The `send-lesson-reminders` edge function already handles `room_link`. The gap is that `class_bookings` records (created via `BookMyClassModal`) don't create an entry in the `lessons` table or `lesson_reminders` table — so they never appear in reminder emails.

To bridge this: after inserting into `class_bookings`, the `BookMyClassModal` will also insert a corresponding record into `lesson_reminders` using the booking's `session_id` as the room reference, with `1h_before` reminder type. This ensures the existing reminder system picks it up automatically.

### Step 13A — Route Protection: "Access Denied" Toast

The `ImprovedProtectedRoute` currently redirects silently to `/login` when role doesn't match. It will be updated to pass a query parameter `?reason=access_denied` when redirecting due to role mismatch (not when simply unauthenticated).

The `Login` page will read this query param and display a Sonner toast: *"Access Denied — You don't have permission to access that page."*

This gives the user clear feedback without revealing any sensitive information.

### Step 13B — Classroom Privacy Guard (New Component: `SessionPrivacyGuard`)

A new lightweight wrapper component `SessionPrivacyGuard` will be created at `src/components/classroom/SessionPrivacyGuard.tsx`. It will:
1. Accept `sessionId` (the room ID / `session_id`) and `userRole` as props
2. Query the database: for students, check `class_bookings` where `session_id = ? AND student_id = auth.uid()`; for teachers, check `lessons` where `room_id = ? AND teacher_id = auth.uid()`
3. If the check passes, render the classroom children
4. If it fails, show a full-screen "This session is private" message with a "Go back" button — no redirect, just an in-page block

This component will be used in both `StudentClassroomPage` and `TeacherClassroomPage`.

### Step 13C — RLS Audit (Database)

A migration will clean up redundant/conflicting RLS policies on `teacher_availability` and `classroom_sessions`. The current state has multiple overlapping SELECT policies on `teacher_availability` which could confuse access control. The migration will:
- Drop the redundant overlapping policies on `teacher_availability` (keeping only `secure_availability_teacher` and `secure_availability_student`)
- Add an explicit INSERT policy on `class_bookings` for authenticated students (`student_id = auth.uid()`)
- Verify `classroom_sessions` student SELECT policy uses the lessons join (already exists)

No changes to `student_profiles` or `user_roles` — those are already correctly configured.

---

## Technical Details

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/classroom/SessionPrivacyGuard.tsx` | Wraps classroom pages; blocks access if user is not the booked student/teacher |

### Files to Modify

| File | Change |
|------|---------|
| `supabase/migrations/[timestamp]_booking_session_id.sql` | Add `session_id` + `meeting_link` to `class_bookings`; create `generate_booking_session` trigger; clean up redundant RLS on `teacher_availability` |
| `src/components/teacher/dashboard/NextLessonCard.tsx` | Replace mock data with real Supabase query using `get_teacher_upcoming_lessons` RPC |
| `src/components/student/ClassroomQuickJoin.tsx` | Fix navigation to use `/student-classroom/{room_id}` instead of teacher route |
| `src/components/student/BookMyClassModal.tsx` | After successful booking, show `meeting_link` in success screen; insert a `lesson_reminders` row |
| `src/pages/StudentClassroomPage.tsx` | Wrap `StudentClassroom` in `SessionPrivacyGuard` |
| `src/pages/TeacherClassroomPage.tsx` | Wrap `TeacherClassroom` in `SessionPrivacyGuard` |
| `src/components/auth/ImprovedProtectedRoute.tsx` | Pass `?reason=access_denied` on role-mismatch redirect |
| `src/pages/Login.tsx` | Read `?reason=access_denied` param; show Sonner toast on load |

### Step 14 — Deployment Checklist (No Code Changes)

This is a manual testing checklist to hand to the user. No code changes. All items below can be verified by the user directly:

**[ ] The Login Test**
Log in as `f.zahra.djaanine@engleuphoria.com`. Confirm you land on `/super-admin`. Log out. Log in as a teacher account. Confirm you land on `/admin`. Log in as a student. Confirm you land on `/playground`, `/academy`, or `/hub` depending on their level.

**[ ] The Booking Test**
As a teacher: go to the Schedule tab → create an availability slot 15 minutes from now. As a student: open any dashboard → click "Book a Class" → select the slot → confirm confetti fires and the success screen shows a meeting link.

**[ ] The Sync Test**
Open two browser tabs. Log in as teacher in one → navigate to a classroom. Log in as student in another → join the same room. Change the slide in the teacher tab and confirm the student tab updates within 1–2 seconds.

**[ ] The Email Test**
When the AI generates a daily lesson (via the Academy or Hub dashboard), the `notify-student-lesson` edge function sends a "Lesson Ready" email. Confirm it arrives at the student's registered email. Check the Supabase Edge Function logs at the link below if it doesn't arrive.

---

## Architecture Note: Two Classroom Routes

The platform has a clear separation:
- Teacher enters via `/classroom/:id` → renders `TeacherClassroom`
- Student enters via `/student-classroom/:id` → renders `StudentClassroom`

Both use the same `roomId` (the `classroom_sessions.room_id` column) to connect to the same Supabase Realtime channel. The `session_id` generated in `class_bookings` will serve as this shared `roomId`. The trigger sets `meeting_link = '/student-classroom/' || session_id` and the teacher navigates to `/classroom/` + the same `session_id`.
