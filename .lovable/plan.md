## Root Cause (confirmed via pg_policies audit)

The "Slot no longer available" error is a hard RLS deadlock, not a race condition:

- `teacher_availability` has an UPDATE policy `Booking owner can mark slot booked` that requires a matching row in `class_bookings` to **already exist** before the slot can be marked booked.
- The frontend in `BookMyClassModal.handleBookSlot` does the opposite order: it UPDATEs `teacher_availability` first, then inserts the lesson and the `class_bookings` row.
- Result: every UPDATE returns 0 rows / RLS denial → the code falls into the "slot was just taken" branch and rolls back. No student can ever book.

Secondary issues found in the same handler:
- The error toast hardcodes "Slot no longer available" and never surfaces the actual `updateError.message`.
- `hasCredits` blocks the call before we even check `trialAvailable` properly — it currently allows trials (because `hasCredits = totalCredits > 0 || trialAvailable`), but the credit gate UX still fires for any edge case where `usePackageValidation` hasn't loaded. We'll harden it.
- The handler writes to 4 tables from the client (`teacher_availability`, `lessons`, `class_bookings`, `appointments`) — fragile and racy.

## Fix Strategy

### 1. New SECURITY DEFINER RPC: `book_class_slot`

Single atomic function that:
1. Validates the caller is `auth.uid()` and the slot is currently `is_available = true AND is_booked = false AND start_time > now()`.
2. Inserts the `lessons` row.
3. Inserts the `class_bookings` row (triggers `generate_booking_session` for `session_id` + `meeting_link` + `classroom_id`).
4. Marks `teacher_availability.is_booked = true`, sets `student_id`, `lesson_id`, `lesson_title`.
5. Inserts the `appointments` row (existing `mark_slot_booked_on_appointment` trigger is already idempotent).
6. If `is_trial = false`, calls `consume_credit`.
7. Returns `{ booking_id, classroom_id, session_id, meeting_link, lesson_id }`.

Uses a row-level lock (`SELECT ... FOR UPDATE`) on the slot to prevent races. Raises a clean exception with a specific message on each failure mode (slot taken, no credits, invalid hub, etc.) so the client can surface it.

### 2. RLS cleanup

Keep the existing `Booking owner can mark slot booked` policy as a fallback safety net but it is no longer the primary path — the RPC bypasses RLS via SECURITY DEFINER. No destructive policy changes needed.

### 3. Client refactor in `src/components/student/BookMyClassModal.tsx`

Replace the entire multi-step block in `handleBookSlot` (lines ~209–333) with a single `supabase.rpc('book_class_slot', { ... })` call.

```ts
const { data, error } = await supabase.rpc('book_class_slot', {
  p_slot_ids: slotIds,
  p_teacher_id: slot.teacherId,
  p_scheduled_at: slot.startTime.toISOString(),
  p_duration: slotDuration,
  p_hub_type: hubTypeMap[selectedHub] || 'academy',
  p_lesson_title: lessonTitle,
  p_is_trial: trialAvailable,
});

if (error) {
  console.error('Booking Error Detail:', error, { slotIds, teacherId: slot.teacherId, studentId: user.id });
  toast({
    title: 'Booking failed',
    description: error.message || 'Failed to book slot',
    variant: 'destructive',
  });
  await fetchSlots();
  return;
}
```

Also:
- Remove the hardcoded "Slot no longer available" toast.
- Add payload validation: bail early with a clear toast if `slot.id` is falsy or `user.id` is missing.
- Allow trial bookings even when `totalCredits === 0` (already true via `hasCredits`, but make it explicit by checking `trialAvailable` first and skipping the credit prompt).

### 4. Diagnostics

Keep `console.log('[BookMyClassModal] booking payload', ...)` immediately before the RPC call so future failures are debuggable from the browser console.

## Files Touched

- **New migration**: create `public.book_class_slot(...)` SECURITY DEFINER function with `GRANT EXECUTE ... TO authenticated`.
- **Edit**: `src/components/student/BookMyClassModal.tsx` — replace `handleBookSlot` body with RPC call, fix error surfacing, harden trial path.

No edge functions, no schema changes to existing tables, no destructive RLS edits.
