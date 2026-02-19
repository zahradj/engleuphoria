

# Phase 9.5: Database Fix + Classroom Stability

## Problem

The classroom UI renders but database sync is completely broken, causing repeated 400 and 406 errors every few seconds. Two root causes:

1. **Missing columns**: 9 columns referenced in the code don't exist in the `classroom_sessions` table: `active_canvas_tab`, `embedded_url`, `is_screen_sharing`, `star_count`, `show_star_celebration`, `is_milestone`, `timer_value`, `timer_running`, `dice_value`
2. **UUID type mismatch**: The `teacher_id` column is `uuid` type, but when no user is logged in (demo mode), the code sends `"teacher-default"` which is not a valid UUID

## Fix 1: Database Migration

Add all missing columns to `classroom_sessions`:

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

**File: `src/hooks/useClassroomSync.ts`** (Modify)

The `userId` passed in demo mode is `"teacher-default"`, which fails the UUID insert. Fix by:
- Before calling `createOrUpdateSession`, check if `userId` is a valid UUID
- If not (demo mode), generate a deterministic UUID from the string using a simple fallback like `crypto.randomUUID()` stored in sessionStorage, or use a hardcoded demo UUID constant

**File: `src/components/teacher/classroom/TeacherClassroom.tsx`** (Modify)

- Where `userId` is computed (currently falls back to `"teacher-default"`), generate a proper demo UUID instead:
  ```typescript
  const userId = user?.id || sessionStorage.getItem('demo-teacher-id') || (() => {
    const id = crypto.randomUUID();
    sessionStorage.setItem('demo-teacher-id', id);
    return id;
  })();
  ```

## Fix 3: Supabase Types Update

**File: `src/integrations/supabase/types.ts`** (Modify)

Add the 9 new columns to the `classroom_sessions` Row, Insert, and Update type definitions so TypeScript is aware of them.

## File Summary

| File | Action | Description |
|------|--------|-------------|
| **Migration SQL** | Create | Add 9 missing columns to `classroom_sessions` |
| `src/components/teacher/classroom/TeacherClassroom.tsx` | Modify | Generate proper demo UUID instead of "teacher-default" |
| `src/hooks/useClassroomSync.ts` | Modify | No change needed if TeacherClassroom passes valid UUID |
| `src/integrations/supabase/types.ts` | Modify | Add new column types |

