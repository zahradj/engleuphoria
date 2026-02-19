

# Phase 9.5b: Fix Check Constraint + Session Status Mismatch

## Problem

The classroom sync is failing with two errors on every request cycle:

- **400 error**: `"new row violates check constraint classroom_sessions_session_status_check"` -- The database only allows `'waiting'`, `'started'`, `'ended'`, but the code sends `'active'`.
- **406 error**: `"The result contains 0 rows"` -- Since no session can be created (blocked by the 400), all subsequent queries return 0 rows, and the `.single()` call fails with 406.

These errors repeat every ~2 seconds in a loop (try to fetch, fail, try to create, fail, repeat).

## Root Cause

The `classroomSyncService.ts` (and `quizService.ts`, `pollService.ts`) use `'active'` as the session status, but the database check constraint was created with only `('waiting', 'started', 'ended')`.

## Solution: Update the Database Constraint

Add `'active'` to the allowed values in the check constraint. This is the simplest fix since 4 files already use `'active'` consistently.

### Database Migration

Drop the old constraint and create a new one that includes `'active'`:

```sql
ALTER TABLE public.classroom_sessions
  DROP CONSTRAINT IF EXISTS classroom_sessions_session_status_check;

ALTER TABLE public.classroom_sessions
  ADD CONSTRAINT classroom_sessions_session_status_check
  CHECK (session_status = ANY (ARRAY['waiting', 'started', 'active', 'ended']));
```

No code changes are needed -- the services already use the correct values. Once the constraint is updated, the inserts and queries will succeed immediately, stopping the error loop.

## File Summary

| File | Action | Description |
|------|--------|-------------|
| Migration SQL | Run | Update check constraint to allow `'active'` status |

No TypeScript files need modification. The UUID fix from the previous phase is already applied.

