

# Trial Lesson Visibility Fix

## Root Causes Found

**1. `bookTrialLesson` in `useTeacherMatchmaker.ts` is broken:**
- It only inserts into `class_bookings` with `status: 'pending'` (line 113)
- It does NOT create a record in the `lessons` table at all
- The dashboards query the `lessons` table via `get_student_upcoming_lessons` RPC, so these bookings are invisible

**2. The existing test data is already past:**
- The one lesson in the database (`fe68f2d9...`) has `scheduled_at: 2026-04-14 17:30 UTC` and `status: completed`
- Current time is `2026-04-14 18:43 UTC` — the lesson is in the past
- The RPC function filters `scheduled_at >= NOW()` and `status IN ('scheduled', 'confirmed')`, so it correctly excludes this

**3. Two separate booking paths exist:**
- `lessonService.createTrialLesson()` — does it right (creates `lessons` row with 'scheduled' + `class_bookings` row with 'confirmed')
- `useTeacherMatchmaker.bookTrialLesson()` — does it wrong (only creates `class_bookings` with 'pending', no `lessons` row)

## Fix Plan

### 1. Fix `useTeacherMatchmaker.ts` — Use the correct booking path
Replace the inline `class_bookings` insert with a call to `lessonService.createTrialLesson()`. This ensures:
- A `lessons` record is created with status `'scheduled'`
- A `class_bookings` record is created with status `'confirmed'`
- A `room_id` and `room_link` are generated so the Join Classroom button works
- Teacher notification email fires

### 2. Update `PlaygroundDashboard.tsx` — Also query `class_bookings` as fallback
Add a secondary query for confirmed `class_bookings` so that even if the RPC returns nothing (e.g., lessons created through other paths), the dashboard still shows upcoming sessions.

### 3. Update `ClassesSection.tsx` — Show real bookings instead of demo data
Replace the hardcoded demo classes array with actual data from `class_bookings` or the `get_student_upcoming_lessons` RPC, so confirmed trial lessons appear as real glassmorphic cards.

## Technical Details

**Files to modify:**
- `src/hooks/useTeacherMatchmaker.ts` — replace `bookTrialLesson` to call `lessonService.createTrialLesson()`
- `src/components/student/dashboards/PlaygroundDashboard.tsx` — add `class_bookings` fallback query
- `src/components/dashboard/ClassesSection.tsx` — fetch real data instead of demo array

**No database changes needed.** The RPC functions and table schema are correct. The bug is purely in the client-side booking logic.

