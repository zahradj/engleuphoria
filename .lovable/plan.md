

# Phase 9.5: Database Fix + Classroom Stability

## Problem

The classroom UI renders but database sync is completely broken, causing repeated 400 and 406 errors every few seconds. Confirmed two root causes:

1. **Missing columns**: 9 columns referenced in code don't exist in `classroom_sessions`: `active_canvas_tab`, `embedded_url`, `is_screen_sharing`, `star_count`, `show_star_celebration`, `is_milestone`, `timer_value`, `timer_running`, `dice_value`
2. **UUID type mismatch**: `teacher_id` is `uuid` type in the database, but the code sends `"teacher-default"` as fallback when `user` hasn't loaded yet

## Fix 1: Database Migration

Run SQL migration to add all 9 missing columns:

```sql
ALTER TABLE public.classroom_sessions
  ADD COLUMN IF NOT EXISTS active_canvas_tab text DEFAULT 'slides',
  ADD COLUMN IF NOT EXISTS embedded_url text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS is_screen_sharing boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS star_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS show_star_celebration boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_milestone boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS timer_value integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS timer_running boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS dice_value integer DEFAULT NULL;
```

## Fix 2: Demo Mode UUID Handling

**File: `src/components/teacher/classroom/TeacherClassroom.tsx`** (Modify)

Replace the two occurrences of `'teacher-default'` with a proper UUID fallback:

- **Line 108** (useClassroomSync call): Replace `user?.id || 'teacher-default'` with:
  ```typescript
  userId: user?.id || (() => {
    const stored = sessionStorage.getItem('demo-teacher-id');
    if (stored) return stored;
    const id = crypto.randomUUID();
    sessionStorage.setItem('demo-teacher-id', id);
    return id;
  })(),
  ```

- **Line 335** (CenterStage userId prop): Replace `user?.id || 'teacher-default'` with:
  ```typescript
  userId={user?.id || sessionStorage.getItem('demo-teacher-id') || crypto.randomUUID()}
  ```

No other files need changes -- the sync service and hook already handle the new columns correctly.

## File Summary

| File | Action | Description |
|------|--------|-------------|
| Migration SQL | Run | Add 9 missing columns to `classroom_sessions` |
| `src/components/teacher/classroom/TeacherClassroom.tsx` | Modify | Replace `'teacher-default'` with valid UUID fallback (2 locations) |

