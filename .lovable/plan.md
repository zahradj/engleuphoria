

# Teacher-Student Classroom Sync + One-Click Entry + Green Room Enhancement

## Current State

The system **already has** the right infrastructure:
- `class_bookings` auto-generates `session_id` (12-char) and `meeting_link` (`/student-classroom/{session_id}`) via the `generate_booking_session()` trigger
- `SessionPrivacyGuard` validates access via `can_access_booking_session()` RPC
- `PreFlightCheck` component exists with camera + mic checks
- Routes: `/classroom/:id` (teacher), `/student-classroom/:id` (student)

The **problems** are all wiring issues — the dashboard components don't use the real booking data.

## Plan

### Step 1: Add "Join Classroom" Button to Teacher Command Center

**File:** `src/components/teacher/professional/CommandCenter.tsx`

The upcoming lessons query already fetches from `class_bookings` but doesn't select `session_id` or `meeting_link`. Fix:
- Add `session_id, meeting_link` to the query select
- Add a "Join" button on each upcoming lesson card that navigates to `/classroom/{session_id}`
- Button becomes active 15 minutes before lesson start (matching the student's 10-min window with extra teacher buffer)
- Hub-color the button: Orange (playground), Blue (academy), Green (professional/success)

### Step 2: Fix Student One-Click Entry

**Files:** `src/components/student/DashboardTab.tsx`, `src/components/student/dashboard/StudentWelcomeSection.tsx`

Currently `handleJoinClassroom` navigates to a hardcoded `unified-classroom-1`. Fix:
- Query `class_bookings` for the student's next confirmed booking with `session_id`
- Navigate directly to the `meeting_link` (e.g., `/student-classroom/5003c94ff953`)
- Remove the intermediate "Enter Room ID" step for students with active bookings

### Step 3: Enhance PreFlightCheck as Hub-Branded Green Room

**Files:** `src/components/classroom/PreFlightCheck.tsx`, `src/hooks/usePreFlightCheck.ts`

Current PreFlightCheck is functional but plain. Enhance:
- Accept `hubType` prop to apply hub-specific gradients and glassmorphism
- Add **Speaker Test**: Play a chime sound, ask "Did you hear the sound?" (Yes/No)
- Add **Connection Check**: Simple `navigator.connection` API or ping-based indicator (Good/Fair/Poor)
- Add **Device Selection** dropdowns for camera/mic using `navigator.mediaDevices.enumerateDevices()`
- Show participant status: "Your teacher is waiting" or "Your student hasn't joined yet" (via Supabase Realtime presence on the session channel)
- "Enter Classroom" button stays disabled until camera + mic confirmed
- Add "Skip check" link for returning users
- Success Hub: Add "Set your intention" text input
- Slow connection message: "Your connection is a bit sleepy today. Moving closer to the router might wake it up!"

### Step 4: Auto-Authentication in Classroom

**Files:** `src/pages/StudentClassroomPage.tsx`, `src/pages/TeacherClassroomPage.tsx`

Both pages already pull `user` from `useAuth()` and pass `studentName`/`teacherName`. Ensure:
- Name and role are auto-populated from auth context (no manual entry)
- Pass `hubType` to PreFlightCheck based on booking metadata

### Step 5: Fix Legacy Navigation References

**Files:** Multiple dashboard components

Replace all hardcoded classroom URLs:
- `src/components/dashboard/WelcomeSection.tsx` — remove `unified-classroom-1` reference
- `src/components/teacher/dashboard/WelcomeSection.tsx` — use real session_id
- `src/components/student/QuickStartRow.tsx` — use real booking data

## Files to Modify
- `src/components/teacher/professional/CommandCenter.tsx` — Add Join button with session_id
- `src/components/student/DashboardTab.tsx` — One-click entry using real booking
- `src/components/student/dashboard/StudentWelcomeSection.tsx` — Pass real meeting link
- `src/components/classroom/PreFlightCheck.tsx` — Full Green Room with hub branding, speaker test, connectivity
- `src/hooks/usePreFlightCheck.ts` — Add speaker test audio, device enumeration, connection check
- `src/pages/StudentClassroomPage.tsx` — Pass hubType to PreFlightCheck
- `src/pages/TeacherClassroomPage.tsx` — Pass hubType to PreFlightCheck
- `src/components/dashboard/WelcomeSection.tsx` — Fix hardcoded URL
- `src/components/teacher/dashboard/WelcomeSection.tsx` — Fix hardcoded URL

## No Database Changes Needed
The `class_bookings` table already has `session_id` and `meeting_link` auto-generated. The `can_access_booking_session()` function validates both teacher and student access.

