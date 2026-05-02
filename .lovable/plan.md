# Booking Modal — "No Available Slots" Fix

## What the investigation found

- **RLS is already correct.** `teacher_availability` has a permissive SELECT policy: `Authenticated users can view available slots` → `is_available = true AND is_booked = false AND start_time > now()` for role `authenticated`. No RLS change is needed.
- **The data exists.** The one active teacher (`academy_mentor`) has 89 future, unbooked 60-minute slots in the DB right now. The query the modal runs returns rows when executed server-side.
- **Two booking surfaces exist:**
  - `src/components/student/BookMyClassModal.tsx` — filters by hub: it first fetches `teacher_profiles.hub_role` matching the student's hub, then queries `teacher_availability`. If the student's hub is misclassified (e.g. resolved as `professional` when the only active teacher is `academy_mentor`), the modal silently returns zero slots.
  - `src/pages/student/BookLesson.tsx` via `teacherAvailabilityService.getAvailableSlots()` — no hub filter, should always return rows.
- **No diagnostics.** Today the modal swallows errors into `console.error('Failed to fetch availability slots')`, but there is no log of `data`, `error`, the resolved `teacherIds`, or the resolved `allowedHubRoles`. We cannot tell from the user's session whether the query returned `[]`, was blocked, or was never fired.

The most likely production cause is the **hub filter wiping out all teachers** for some students (no teacher with the matching `hub_role` exists yet), with no UI/log feedback. The empty state then implies "no slots exist anywhere", which is misleading.

## Changes

### 1. `src/components/student/BookMyClassModal.tsx` — debug + safer hub filter

In `fetchSlots`:

- Add explicit logging right after each Supabase call:
  ```ts
  console.log('[BookMyClassModal] hub:', selectedHub, 'allowedHubRoles:', allowedHubRoles);
  console.log('[BookMyClassModal] hubTeachers:', hubTeachers, 'teacherIds:', teacherIds);
  console.log('[BookMyClassModal] Fetched slots:', data, 'Fetch error:', error);
  ```
- Build the timestamp once and reuse, to make the UTC contract explicit:
  ```ts
  const nowUtcIso = new Date().toISOString(); // always UTC
  ```
- Use `.gte('start_time', nowUtcIso)` (currently `.gt`) so a slot starting exactly "now" is still bookable.
- Keep `.eq('is_available', true).eq('is_booked', false).eq('duration', slotDuration).in('teacher_id', teacherIds)`.
- **Hub-filter fallback:** if `teacherIds.length === 0` (no teachers match the student's hub yet), do a second query without the `.in('teacher_id', …)` constraint, still filtered by `duration`, `is_available`, `is_booked`, `start_time`. Log a warning so we know the fallback fired. This prevents the "no teacher in this hub" misclassification from rendering an empty modal during onboarding.

### 2. `src/services/teacherAvailabilityService.ts` — debug logging

In `getAvailableSlots()` and `getTeacherAvailableSlots()`:
- Log `console.log('[teacherAvailabilityService] Fetched slots:', data, 'Fetch error:', error)` immediately after the query, before the early return.

### 3. `src/components/student/StudentBookingCalendar.tsx` — better empty state + calendar UX

- Replace the current "No Available Slots Yet" block (lines 103–126) with a smarter empty state:
  - Title: "No Available Slots Yet"
  - Message: "We couldn't find open times for your hub. Try a different date below, or check back soon."
  - Always render the calendar (currently the calendar is hidden when slots are empty), so the user can still browse dates and see immediately that the picker works.
- When slots ARE present but the selected date has none (existing branch around lines 190–200), keep the current "Try selecting another highlighted date" message and the "View All Dates" reset button — already correct, just verify it remains.
- Auto-select the **first date that actually has slots** if `selectedDate` has none, so the modal doesn't open on today (which often has zero slots) and look broken. Logic: in a `useEffect` watching `localSlots`, if `selectedDate` has no slots and `availableDates[0]` exists, set `selectedDate = availableDates[0]`.

### 4. RLS — no migration

Verified policies; nothing to change. Note in commit message that RLS was audited and is correct.

## Out of scope

- No new tables, no schema changes, no migration.
- No change to the booking write path (already enforces `is_booked=false` with optimistic update + rollback).

## How we'll verify

1. Open the modal as a student → console shows `hub`, `allowedHubRoles`, `teacherIds`, and `Fetched slots` arrays.
2. Slots from the active `academy_mentor` teacher render in the calendar; dates with availability are highlighted; clicking a date shows time pills.
3. If a hub temporarily has no matching teacher, the fallback query returns slots and a warning is logged instead of the modal looking broken.
4. `BookLesson.tsx` page (separate pipeline) also logs slots from the service.
