

# Phase 9.5c: Fix Duplicate Key Constraint Error

## Problem

The `createOrUpdateSession` method in `classroomSyncService.ts` searches for an existing session filtered by `session_status = 'active'`. When it finds none (because prior sessions are `'ended'`), it attempts an INSERT, which fails because of the `classroom_sessions_room_id_key` unique constraint on `room_id`.

This causes a rapid error loop: query returns 0 active rows, insert fails with 23505, repeat.

## Root Cause

Line 82 filters by `session_status = 'active'`, so ended sessions are invisible. But the unique constraint on `room_id` means only one row per room can ever exist.

## Solution

Change the lookup to find ANY existing session for the room (regardless of status), then UPDATE it back to `'active'` instead of trying to INSERT a duplicate.

### File: `src/services/classroomSyncService.ts`

**Modify `createOrUpdateSession` method (lines 76-124)**

Replace the existing logic with:

1. Query for ANY existing session for the `room_id` (remove the `.eq('session_status', 'active')` filter).
2. If a row exists, UPDATE it (reset status to `'active'`, update lesson data, clear ended_at).
3. If no row exists, INSERT a new one.

```typescript
async createOrUpdateSession(
  roomId: string,
  teacherId: string,
  lessonData: {
    title: string;
    slides: Array<{ id: string; title: string; imageUrl?: string }>;
  }
): Promise<ClassroomSession | null> {
  try {
    // Check for ANY existing session for this room (regardless of status)
    const { data: existing } = await supabase
      .from('classroom_sessions')
      .select('*')
      .eq('room_id', roomId)
      .maybeSingle();

    if (existing) {
      // Reactivate / update existing session
      const { data, error } = await supabase
        .from('classroom_sessions')
        .update({
          teacher_id: teacherId,
          lesson_title: lessonData.title,
          lesson_slides: lessonData.slides,
          session_status: 'active',
          ended_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return this.mapToSession(data);
    }

    // Create new session (only if no row exists for this room)
    const { data, error } = await supabase
      .from('classroom_sessions')
      .insert({ ... })
      .select()
      .single();

    if (error) throw error;
    return this.mapToSession(data);
  } catch (error) {
    console.error('Failed to create/update session:', error);
    return null;
  }
}
```

Key changes:
- Remove `.eq('session_status', 'active')` from the lookup query (line 82)
- Use `.maybeSingle()` instead of `.single()` to avoid 406 when 0 rows
- On update, also set `session_status: 'active'` and `ended_at: null` to reactivate ended sessions
- Also update `teacher_id` in case the demo UUID changed between sessions

No database migration needed. Only one file changes.

## File Summary

| File | Action | Description |
|------|--------|-------------|
| `src/services/classroomSyncService.ts` | Modify | Fix lookup to find any existing session, reactivate instead of re-inserting |

