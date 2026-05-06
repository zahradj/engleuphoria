# Postgres 17 Upgrade Prep — Prune cron bloat + pause jobs

Two-step maintenance to unblock the Supabase Postgres upgrade pre-flight check.

## Step 1 — Prune & vacuum `cron.job_run_details`

Run as a migration (so it executes with elevated privileges):

```sql
-- Clear historical run logs older than 7 days
DELETE FROM cron.job_run_details
WHERE start_time < now() - interval '7 days';

-- Reclaim disk + refresh planner stats
VACUUM (FULL, ANALYZE) cron.job_run_details;
```

Notes:
- `VACUUM FULL` takes an `ACCESS EXCLUSIVE` lock on the table. Since only the cron worker writes here, impact is limited to brief contention on cron logging.
- If the table is very large, this can take several minutes. Statement timeout will be raised for the migration.

## Step 2 — Pause all cron jobs

After Step 1 finishes successfully:

```sql
-- Snapshot current active state so we can restore precisely
CREATE TABLE IF NOT EXISTS public._cron_job_active_backup AS
SELECT jobid, active, now() AS snapshotted_at
FROM cron.job;

-- Pause everything
UPDATE cron.job SET active = false;
```

The backup table lets us re-enable exactly the jobs that were active before (some jobs may already be inactive by design and should stay that way).

## After the upgrade (you run this once the dashboard upgrade succeeds)

```sql
-- Restore active flags from snapshot
UPDATE cron.job j
SET active = b.active
FROM public._cron_job_active_backup b
WHERE j.jobid = b.jobid;

DROP TABLE public._cron_job_active_backup;
```

I'll provide this restore snippet again in chat after you confirm the upgrade is done.

## Execution order

1. Approve this plan → I run Step 1 migration.
2. Wait for confirmation that vacuum completed.
3. Run Step 2 migration (pause jobs + backup).
4. You click **Upgrade** in Supabase dashboard.
5. After upgrade, I run the restore snippet.

## Risks & mitigations

- **Vacuum timeout**: Migration runner may have its own timeout. If it fails, fallback is plain `VACUUM` (no FULL) which doesn't lock — still reduces bloat significantly after the DELETE.
- **Paused jobs during upgrade window**: Any scheduled emails, reminders, or cleanup jobs will not fire until restored. Upgrade typically completes in <10 min.
- **No data loss**: Only deleting historical run *logs*, not job definitions.
