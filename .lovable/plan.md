# Security Hardening Migration File

I'll create a new SQL migration file in `supabase/migrations/` that applies the three approved fixes. The file will be saved but **not executed** — you'll apply it via the migration tool when ready.

## File to create

`supabase/migrations/<timestamp>_security_hardening_phase_2.sql`

## Contents

### 1. Realtime Privacy — Remove `lesson_payments` from realtime
```sql
ALTER PUBLICATION supabase_realtime DROP TABLE public.lesson_payments;
```
Stops financial events from being broadcast to any subscribed client.

### 2. Data Normalization — Drop denormalized email columns
```sql
ALTER TABLE public.parent_teacher_messages
  DROP COLUMN IF EXISTS parent_email,
  DROP COLUMN IF EXISTS teacher_email;
```
Verified earlier that `ParentMessages.tsx` reads emails via profile joins — no app code depends on these columns.

### 3. Function Hardening — Lock down 47 trigger-only SECURITY DEFINER functions
For each trigger function, revoke `EXECUTE` from `anon`, `authenticated`, and `PUBLIC` so they can only run via the database trigger that owns them, not via PostgREST RPC.

Functions covered (trigger-only, never called as RPC):
`handle_new_user`, `handle_new_user_role`, `notify_admin_new_user`, `notify_admin_new_student`, `notify_admin_teacher_ready_for_review`, `notify_admin_low_rating`, `notify_teacher_lesson_booked`, `auto_grade_question`, `update_submission_score`, `generate_certificate_number`, `auto_schedule_reminders`, `trigger_security_audit`, `enhanced_security_audit`, `check_future_booking`, `generate_booking_session`, `mark_slot_booked_on_appointment`, `free_slot_on_appointment_cancel`, `update_availability_on_lesson_booking`, `free_availability_on_lesson_cancel`, `release_cancelled_lesson_slot`, `book_teacher_slot`, `add_credits_on_purchase`, `auto_generate_referral_code`, `record_learning_analytics`, `update_phonics_on_lesson_complete`, `update_vocabulary_on_lesson_complete`, `set_email_send_state_updated_at`, `update_lesson_progress_updated_at`, `update_lesson_progress_timestamp`, `update_iron_updated_at`, and the remaining trigger-only helpers identified in the audit.

Pattern (one block per function):
```sql
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
```

Functions intentionally **left callable** (used as RPC by app code):
`has_role`, `get_user_role`, `get_current_user_role`, `get_admin_dashboard_stats`, `get_approved_teachers`, `get_teacher_profile_with_payment`, `get_teacher_upcoming_lessons`, `get_student_upcoming_lessons`, `get_pending_reminders`, `get_global_skill_averages`, `get_student_progress_for_parent`, `get_organization_analytics`, `consume_credit`, `refund_credit`, `complete_referral`, `ensure_user_role`, `can_access_lesson`, `can_access_booking_session`, `resolve_classroom_id`, `check_achievements`, `enqueue_email`, `read_email_batch`, `delete_email`, `move_to_dlq`, `log_security_event`, `cleanup_stale_classroom_sessions`, `reset_monthly_class_usage`, `generate_adaptive_learning_path`, `generate_room_id`, `jsonb_array_append`.

## Deliverable

After approval, I'll:
1. Write the migration file to `supabase/migrations/`
2. Tell you the filename
3. Wait for you to run it via the migration tool — I won't auto-execute

No application code changes are needed (verified earlier that the dropped email columns are unused).
