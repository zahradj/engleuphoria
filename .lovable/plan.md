

# Fix: "Cannot Delete Users" in Supabase

## Root Cause

The error in your database logs is:

```
update or delete on table "users" violates foreign key constraint
"speaking_progress_student_id_fkey" on table "speaking_progress"
```

When you delete a user from the Supabase dashboard, PostgreSQL checks all foreign key references. Many child tables reference `public.users` with the default `NO ACTION` rule, which **blocks** the deletion if any related rows exist.

## The Fix

We need to alter all foreign key constraints that reference `public.users` to use `ON DELETE CASCADE` (automatically delete child rows when the parent user is deleted) or `ON DELETE SET NULL` (set the column to NULL instead).

### Tables to fix (all currently `NO ACTION`):

| Table | Column | New Rule |
|-------|--------|----------|
| `speaking_progress` | `student_id` | CASCADE |
| `credit_purchases` | `student_id` | CASCADE |
| `student_credits` | `student_id` | CASCADE |
| `support_tickets` | `user_id` | CASCADE |
| `referrals` | `referrer_id` | CASCADE |
| `referrals` | `friend_id` | CASCADE |
| `post_class_feedback` | `student_id` | CASCADE |
| `post_class_feedback` | `teacher_id` | CASCADE |
| `ml_predictions` | `student_id` | CASCADE |
| `ai_learning_models` | `student_id` | CASCADE |
| `ai_tutoring_sessions` | `student_id` | CASCADE |
| `personalized_learning_paths` | `student_id` | CASCADE |
| `ai_learning_events` | `student_id` | CASCADE |
| `audit_logs` | `user_id` | SET NULL |
| `analytics_events` | `user_id` | SET NULL |
| `teacher_interviews` | `interviewer_id` | SET NULL |
| `organization_members` | `invited_by` | SET NULL |
| `adaptive_content` | `created_by` | SET NULL |
| `curriculum_programs` | `created_by` | SET NULL |
| `curriculum_units` | `created_by` | SET NULL |
| `eca_assessments` | `created_by` | SET NULL |
| `learning_missions` | `created_by` | SET NULL |
| `resource_library` | `created_by` | SET NULL |
| `eca_templates` | `created_by` | SET NULL |
| `library_assets` | `created_by` | SET NULL |
| `system_transitions` | `triggered_by` | SET NULL |
| `users` | `referred_by` | SET NULL |

**Logic:**
- **CASCADE** for tables that hold *user-owned data* (their progress, credits, feedback, tickets) -- delete these rows when the user is deleted.
- **SET NULL** for tables where the column is a reference to *who created/triggered* something -- keep the record but clear the user reference.

### Implementation

A single SQL migration will:
1. Drop each old foreign key constraint
2. Re-create it with the correct `ON DELETE` rule

No code changes are needed -- this is purely a database schema fix.

### Technical Details

The migration will run statements like this for each constraint:

```text
ALTER TABLE speaking_progress
  DROP CONSTRAINT speaking_progress_student_id_fkey,
  ADD CONSTRAINT speaking_progress_student_id_fkey
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE;
```

For "SET NULL" columns, we first ensure the column is nullable, then apply:

```text
ALTER TABLE audit_logs
  ALTER COLUMN user_id DROP NOT NULL,
  DROP CONSTRAINT audit_logs_user_id_fkey,
  ADD CONSTRAINT audit_logs_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
```

### Risk Assessment

- **Zero downtime** -- ALTER CONSTRAINT is near-instant on small tables
- **No data loss** -- only changes future delete behavior
- **No code changes** -- the app queries are unaffected

