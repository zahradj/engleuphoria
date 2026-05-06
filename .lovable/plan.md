## Goals
1. Login: empty red error box → always show a meaningful message; lock down post-login routing behind a "Verifying role…" gate.
2. Postgres 17 upgrade timeout: diagnose pg_cron / long-running queries and provide safe SQL to let the upgrade complete.

---

## 1. Login UI + Routing fix

**Where the bug lives**

- `src/contexts/AuthContext.tsx` (`signIn`) calls `setError(error.message)`. Looking at the recent auth logs, Supabase is returning 500 / 504 with empty `error.message` (`"context deadline exceeded"`, no body), so the inline red alert in `src/components/auth/SimpleAuthForm.tsx` (line 340-348) renders `<p>{error}</p>` with `error === ''`.
- `signIn` also redirects via `window.location.href = redirectPath` *immediately* after resolving the role, but `Login.tsx` has a parallel `useEffect` that redirects on `user` presence with a 3 s metadata fallback. On a slow role fetch the metadata fallback can fire first and send a creator/admin to `/playground`.

**Changes**

1. `src/contexts/AuthContext.tsx` → `signIn`:
   - When the SDK returns an error, build a non-empty message:
     `const msg = error.message?.trim() || (error.status >= 500 ? 'Authentication service is temporarily unavailable. Please try again in a moment.' : 'Invalid email or password.');`
     Pass `msg` to `setError` and `toast.error`, and return `{ data: null, error: { ...error, message: msg } }`.
   - Same treatment in the `catch` branch (currently hardcoded `'Sign in failed'`) — surface `e.message` when present.

2. `src/components/auth/SimpleAuthForm.tsx`:
   - In the login submit branch, after `signIn` returns, if `error` exists set a local `formError` state and render it inside the existing red alert box (in addition to the global `error` from context, so the alert never goes blank when context clears).
   - Show "Verifying your account…" inside the submit button while `loading` from context is true *and* `data?.user` was returned but role hasn't resolved yet (track via a `verifyingRole` boolean toggled around the `signIn` call).

3. `src/pages/Login.tsx`:
   - Replace the 3-second metadata fallback with a hard role gate: while `user && !user.role` show a centered "Verifying role…" screen (already partially there). Only the role-based branch in the `useEffect` may navigate. If after 8 s the role is still missing, show an inline "We couldn't verify your role. Please refresh or contact support." message instead of silently routing to a default hub.
   - Routing table to enforce:
     - `admin` → `/super-admin`
     - `content_creator` → `/content-creator` (the master library lives here)
     - `teacher` → `/teacher`
     - `parent` → `/parent`
     - `student` → resolved hub (`/playground` | `/academy` | `/hub`)
   - Remove the metadata-based silent fallback so users never land on the wrong hub.

4. Light defensive cleanup: `signIn` should not call `window.location.href` when the calling component has already mounted React Router — switch to `navigate(redirectPath, { replace: true })` via a callback the form passes in. (Optional refactor; if too invasive, keep `location.href` but only fire once `resolvedRole` is non-null.)

**No DB changes for the login fix.**

---

## 2. Postgres 17 upgrade hang on pg_cron

The upgrade pre-flight check runs `SELECT … FROM pg_extension WHERE extname='pg_cron'` and waits for the cron background worker to drain. When you have many cron jobs (or a long-running job holding a lock), the check times out.

### Step A — diagnose (SELECT only, safe to run anytime)

```sql
-- 1. Is pg_cron installed and which version
select extname, extversion from pg_extension where extname = 'pg_cron';

-- 2. Currently running cron jobs / long queries
select pid, usename, application_name, state,
       now() - xact_start  as xact_age,
       now() - query_start as query_age,
       wait_event_type, wait_event, left(query, 200) as query
  from pg_stat_activity
 where state <> 'idle'
   and (application_name ilike '%cron%' or query ilike '%cron%' or now() - query_start > interval '30 seconds')
 order by query_age desc nulls last;

-- 3. Active locks held by anything cron-related
select l.pid, l.locktype, l.mode, l.granted, a.application_name, left(a.query, 200) as query
  from pg_locks l
  join pg_stat_activity a on a.pid = l.pid
 where a.application_name ilike '%cron%' or a.query ilike '%cron%';

-- 4. Recently scheduled jobs and their last status
select jobid, schedule, command, active, jobname
  from cron.job order by jobid;

select jobid, runid, status, return_message, start_time, end_time
  from cron.job_run_details
 order by start_time desc
 limit 20;
```

### Step B — give the upgrade check more time

```sql
-- Session-scoped (preferred — auto-resets when session ends):
set statement_timeout = '5min';
set lock_timeout      = '30s';
set idle_in_transaction_session_timeout = '2min';

-- If you need it for the whole DB during the upgrade window:
alter database postgres set statement_timeout = '5min';
-- After the upgrade finishes, restore the default:
alter database postgres reset statement_timeout;
```

### Step C — kill any stuck pg_cron worker / long queries

```sql
-- Cancel (soft) anything cron-related that has been running too long
select pg_cancel_backend(pid)
  from pg_stat_activity
 where (application_name ilike '%cron%' or query ilike '%cron%')
   and state <> 'idle'
   and now() - query_start > interval '2 minutes';

-- If cancel doesn't release it after ~30s, terminate (hard):
select pg_terminate_backend(pid)
  from pg_stat_activity
 where (application_name ilike '%cron%' or query ilike '%cron%')
   and state <> 'idle'
   and now() - query_start > interval '5 minutes';
```

### Step D — last-resort temporary toggle of pg_cron

Only do this if Steps A–C don't unblock the upgrade. Save the job list first so nothing is lost.

```sql
-- 1. Snapshot scheduled jobs so we can recreate them after re-enabling pg_cron
create table if not exists public._pg_cron_backup as
  select * from cron.job;

-- 2. Pause every job (does NOT delete them; re-runnable)
update cron.job set active = false;

-- 3. If still blocked, drop and re-create the extension during the maintenance window
drop extension if exists pg_cron;
-- ... run the Supabase Postgres 17.6.1.113 upgrade now ...
create extension pg_cron;

-- 4. Restore jobs from the backup
insert into cron.job (schedule, command, nodename, nodeport, database, username, active, jobname)
  select schedule, command, nodename, nodeport, database, username, active, jobname
    from public._pg_cron_backup
  on conflict do nothing;

drop table public._pg_cron_backup;
```

I would only run Step D inside a maintenance window — dropping the extension cancels all in-flight jobs.

### How I'll execute this

- All SELECTs in Step A I can run via the read-only DB tool to give you a real picture before you touch anything.
- The `alter database` / `pg_cancel_backend` / `pg_terminate_backend` / `drop extension` calls require a migration. I'll create one only after you confirm which step you want me to run, because Step D especially is destructive.

---

## What I'll do after you approve

1. Edit `AuthContext.tsx`, `SimpleAuthForm.tsx`, `Login.tsx` for the login + routing fix (no schema changes).
2. Run the Step A diagnostics against your DB and report what's stuck.
3. Stop and ask which of Step B / C / D you want me to apply via a migration.