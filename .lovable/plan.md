

# Phase 9.5d: Stale Session Cleanup + End-to-End Verification

## Current State

The duplicate key fix (Phase 9.5c) is already applied in `classroomSyncService.ts`. The `createOrUpdateSession` method correctly looks up ANY existing session by `room_id` and reactivates it instead of inserting a duplicate.

## 1. Add Stale Session Cleanup

### Approach: Database Function + Client-Side Trigger

Since `pg_cron` requires manual setup in the Supabase dashboard, the most reliable approach is:

1. **Create a database function** `cleanup_stale_classroom_sessions()` that marks sessions older than 24 hours as `'ended'`.
2. **Call it from the sync service** at session creation time (lightweight -- runs once per teacher entering a room).

### Database Migration

```sql
CREATE OR REPLACE FUNCTION public.cleanup_stale_classroom_sessions()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  cleaned_count integer;
BEGIN
  UPDATE public.classroom_sessions
  SET session_status = 'ended',
      ended_at = now(),
      updated_at = now()
  WHERE session_status = 'active'
    AND updated_at < now() - interval '24 hours';
  
  GET DIAGNOSTICS cleaned_count = ROW_COUNT;
  RETURN cleaned_count;
END;
$$;
```

### Code Change: `src/services/classroomSyncService.ts`

Add a `cleanupStaleSessions()` method to the `ClassroomSyncService` class that calls the database function via `supabase.rpc('cleanup_stale_classroom_sessions')`. Call it at the start of `createOrUpdateSession` so stale sessions are cleaned up before any room lookup.

```typescript
async cleanupStaleSessions(): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('cleanup_stale_classroom_sessions');
    if (error) throw error;
    const count = data || 0;
    if (count > 0) {
      console.log(`Cleaned up ${count} stale session(s)`);
    }
    return count;
  } catch (error) {
    console.error('Failed to cleanup stale sessions:', error);
    return 0;
  }
}
```

Then add one line at the top of `createOrUpdateSession`:

```typescript
await this.cleanupStaleSessions();
```

## 2. End-to-End Verification

After applying, navigate to `/demo-classroom/test-room` and verify:
- No 400 or 406 errors in console
- Session creates/reactivates successfully
- Teacher slide changes sync to student view
- Interactive tools (timer, dice, stars) update in real time

## File Summary

| File | Action | Description |
|------|--------|-------------|
| Database migration | Create | Add `cleanup_stale_classroom_sessions()` function |
| `src/services/classroomSyncService.ts` | Modify | Add `cleanupStaleSessions()` method; call it in `createOrUpdateSession` |

