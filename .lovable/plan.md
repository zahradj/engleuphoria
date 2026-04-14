

# Teacher Dashboard: Deep Diagnosis & Fix

## Root Causes Found

### Problem 1: Teacher Schedule Shows Nothing (Critical)
The `ProfessionalHub` schedule tab renders `ClassScheduler`, which uses `useAvailabilityManager` — a **local-state-only** hook. It never fetches existing slots from Supabase. So all saved availability and booked lessons are invisible.

Meanwhile, `EnhancedCalendarTab` (which correctly fetches from DB via `useTeacherAvailability`) exists but is **not used** in the teacher dashboard.

### Problem 2: Booked Trial Lesson Not Visible to Teacher
The booked slot at `2026-04-15 13:00` has `is_booked=true` and `student_id` set, but `lesson_id` is NULL. The booking flow didn't link the lesson record (`73faad7d`) to the availability slot. This means even with the correct calendar, the lesson details won't display fully.

### Problem 3: Orphaned Data
There's a stale `is_booked=true` slot at `2026-04-14 17:30` with no student — needs cleanup.

### Problem 4: CommandCenter Has No Upcoming Lessons
The Command Center shows metrics and alerts but has **no "Upcoming Lessons" widget** — the teacher can't see what's coming up today/this week.

---

## Plan

### Step 1: Replace ClassScheduler with EnhancedCalendarTab
In `ProfessionalHub.tsx`, swap the schedule tab from `ClassScheduler` to `EnhancedCalendarTab`. This immediately makes all DB-stored availability and booked slots visible with the modern glassmorphic UI.

### Step 2: Add Upcoming Lessons Widget to CommandCenter
Add a new card to `CommandCenter.tsx` that queries `lessons` + `class_bookings` for the teacher's upcoming scheduled/confirmed lessons. Show student name, time, hub color, and lesson type (trial badge).

### Step 3: Fix lesson_id Linking in Availability
Update the booking flow in `useTeacherMatchmaker.ts` to also update `teacher_availability.lesson_id` when a lesson is created, so the calendar can display full lesson details.

### Step 4: Database Data Fix
- Link the existing lesson (`73faad7d`) to the availability slot (`60881059`) by setting `lesson_id`
- Clean up the orphaned booked slot at `2026-04-14 17:30`

### Step 5: Teacher Dashboard Visual Enhancement
- Apply brand gradients to `CommandCenter` status cards (replace hardcoded `#1A237E`)
- Add glassmorphic card styling consistent with student dashboards
- Add a "Today's Schedule" quick-glance strip at the top of Command Center

## Files to Modify
- `src/components/teacher/professional/ProfessionalHub.tsx` — swap ClassScheduler → EnhancedCalendarTab
- `src/components/teacher/professional/CommandCenter.tsx` — add Upcoming Lessons widget, enhance visuals
- `src/hooks/useTeacherMatchmaker.ts` — add `lesson_id` update to `teacher_availability` after booking
- Database: data fix migration for linking lesson + cleanup orphan

