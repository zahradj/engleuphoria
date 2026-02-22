

# Fix: User Deletion Blocked by Foreign Key Constraints

## The Problem

When you try to delete a user from the Supabase dashboard, it fails with a "Database error deleting user" because many tables still reference that user with `NO ACTION` foreign keys. The error specifically mentions `speaking_progress_student_id_fkey`, but there are actually **57 constraints** that need fixing.

## The Fix

Run a single database migration that updates all 57 foreign key constraints to use either:
- **CASCADE** -- for user-owned data (progress, sessions, credits, feedback, etc.) that should be deleted with the user
- **SET NULL** -- for reference/audit columns (created_by, invited_by, graded_by, etc.) where we want to keep the record but clear the user reference

## What Gets Deleted With the User (CASCADE)

Student data: ai_learning_events, ai_learning_models, ai_tutoring_sessions, speaking_progress, speaking_sessions, speaking_classroom_sessions, speaking_group_participants, student_speaking_profiles, student_credits, student_curriculum_progress, lesson_completions, weekly_assessments, early_learners_progress, personalized_learning_paths, ml_predictions, analytics_events, credit_purchases, support_tickets, teacher_applications, teacher_absences, teacher_earnings, teacher_payouts, teacher_penalties, referrals (both sides), post_class_feedback (both sides), lesson_payments (both sides), certificates (teacher side)

## What Keeps the Record but Clears the Reference (SET NULL)

Audit/creator columns: adaptive_content.created_by, audit_logs.user_id, communities.created_by, community_challenges.created_by, community_events.organizer_id, curriculum_exports.admin_id, curriculum_materials.uploaded_by, curriculum_programs.created_by, curriculum_units.created_by, early_learners_lessons.created_by, eca_assessments.created_by, eca_templates.created_by, generated_curriculums.created_by, interactive_lessons.created_by, iron_curriculums.created_by, iron_games.created_by, learning_missions.created_by, lessons_content.created_by, library_assets.created_by, resource_library.created_by, security_audit_log.user_id, speaking_groups.created_by, system_transitions.triggered_by, teacher_interviews.interviewer_id, organization_members.invited_by, assessment_answers.graded_by, user_roles.assigned_by, users.referred_by

## Technical Details

A single SQL migration with ~57 `ALTER TABLE` statements, each:
1. Dropping the existing constraint
2. Re-adding it with the correct `ON DELETE` rule

Example pattern:
```text
ALTER TABLE speaking_progress
  DROP CONSTRAINT speaking_progress_student_id_fkey,
  ADD CONSTRAINT speaking_progress_student_id_fkey
    FOREIGN KEY (student_id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

No code changes are needed -- this is purely a database fix.

