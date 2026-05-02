I found the immediate root cause from the screenshot: the new `book_class_slot` RPC uses this pattern:

```sql
SELECT COUNT(*) ...
FROM public.teacher_availability
...
FOR UPDATE;
```

Postgres does not allow `FOR UPDATE` on an aggregate query like `COUNT(*)`, so the RPC fails before it can create the lesson/booking/appointment. That is exactly the toast shown: `FOR UPDATE is not allowed with aggregate functions`.

I also found the next failure that would happen after that is fixed: the RPC passes lowercase hub values (`academy`, `playground`, `professional`) into `appointments.hub_type`, but that column has a check constraint requiring title-case values (`Academy`, `Playground`, `Professional`). So the root fix needs to harden the whole transaction, not just remove the aggregate error.

## Plan

1. Replace `public.book_class_slot` with a corrected atomic transaction
   - Use a lockable subquery/CTE to lock the actual `teacher_availability` rows first:
     ```sql
     WITH locked_slots AS (
       SELECT id
       FROM public.teacher_availability
       WHERE ...
       FOR UPDATE
     )
     SELECT COUNT(*) INTO v_slot_count FROM locked_slots;
     ```
   - This preserves race protection without using `FOR UPDATE` on `COUNT(*)`.
   - Keep it `SECURITY DEFINER` and `GRANT EXECUTE ... TO authenticated` so booking bypasses the fragile frontend/RLS multi-step deadlock.

2. Normalize hub values inside the RPC
   - Convert input slug values to both formats:
     - `class_bookings.hub_type`: keep app slug format (`playground`, `academy`, `professional`) because most app code expects lowercase slugs.
     - `appointments.hub_type`: use constraint-safe title case (`Playground`, `Academy`, `Professional`).
   - Map `success`/`professional` safely to `professional` + `Professional` for the Success Hub.

3. Harden the lesson and booking inserts
   - Insert both `lessons.duration` and `lessons.duration_minutes` using `p_duration` so 30-minute Playground lessons are stored consistently.
   - Keep generating `classroom_id`, `session_id`, and `meeting_link` through the existing `class_bookings` trigger.
   - Return `booking_id`, `classroom_id`, `session_id`, `meeting_link`, and `lesson_id` as before.

4. Improve credit/trial handling inside the RPC
   - Continue skipping credit consumption when `p_is_trial = true`.
   - For paid bookings, validate available credits before writes.
   - After calling `consume_credit`, verify it returned `true`; if not, raise a clear error so the whole transaction rolls back.

5. Keep the student UI on the RPC path, with better refresh behavior
   - `BookMyClassModal.tsx` already calls `supabase.rpc('book_class_slot', ...)` and surfaces `error.message`; I will keep that.
   - Add/keep clear diagnostics around the payload and error.
   - After successful booking, trigger availability refetch and package/credit refresh so the UI does not show stale trial/credit state.

6. Verify the database state after the migration
   - Re-read the live function definition to confirm the broken aggregate lock is gone.
   - Check constraints/policies remain intact.
   - No broad RLS relaxation is needed; this is safer than adding permissive student `UPDATE` policies on `teacher_availability`.

## Files/areas to change after approval

- New Supabase migration replacing `public.book_class_slot(...)`.
- Small update to `src/components/student/BookMyClassModal.tsx` only if needed for credit refresh/diagnostic polish.
- I will not manually edit `src/integrations/supabase/types.ts`; it should reflect Supabase schema generation rather than hand changes.