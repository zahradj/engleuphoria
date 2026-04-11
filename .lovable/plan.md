

## Plan: Refactor Automated Email System — Clean Architecture with Notification Logging

The existing email infrastructure (Lovable's queue-based `send-transactional-email` Edge Function, the `unit-mastery-report` template, and the verified `notify.engleuphoria.com` domain) is already solid and production-ready. This refactor cleans up the trigger logic, adds a `notification_logs` tracking table, and ensures the mastery report fires reliably from a single, well-defined trigger point.

---

### What Already Works (No Changes Needed)

- **Email delivery**: The `send-transactional-email` Edge Function handles rendering, suppression checks, queuing, retries, and dead-letter routing via `process-email-queue`
- **Email template**: `unit-mastery-report.tsx` is a professional, branded template with skill breakdowns, phonics, and vocabulary sections
- **Sender identity**: Emails send from `support@engleuphoria.com` via verified `notify.engleuphoria.com`

---

### Step 1 — Create `notification_logs` Table

**Migration**: Add a tracking table so teachers can see email status in the Professional Hub.

```text
notification_logs (
  id UUID PK,
  student_id UUID NOT NULL,
  unit_id UUID,
  recipient_email TEXT NOT NULL,
  template_name TEXT NOT NULL,
  status TEXT CHECK ('sent', 'failed', 'pending'),
  error_message TEXT,
  email_sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

RLS: Teachers can read logs for their students. Students can read their own.

---

### Step 2 — Rewrite `sendMasteryReport.ts`

**Modify**: `src/utils/sendMasteryReport.ts`

Clean rewrite with proper error handling and `notification_logs` integration:

1. Accept `studentId`, `unitId`, `milestoneResultId`
2. Fetch profile, unit, milestone data, vocabulary, and phonics progress (same as current)
3. Gate on score >= 80% (not just `passed`)
4. Call `send-transactional-email` with the `unit-mastery-report` template
5. **Insert into `notification_logs`** with status `sent` or `failed`
6. On failure: retry once, then log `failed` with `error_message`
7. Return structured result for the caller

---

### Step 3 — Wire Trigger in UnitRoadmap

**Modify**: `src/components/student/curriculum/UnitRoadmap.tsx`

Ensure `sendMasteryReport` is called when a milestone result is recorded with score >= 80%. Currently the function exists but is never imported or called anywhere. Add the call at the point where milestone completion is confirmed.

---

### Step 4 — Teacher Notification Log View

**Modify**: `src/components/teacher/professional/CommandCenter.tsx`

Add a "Notification Log" section showing recent email sends:
- Table with columns: Student, Template, Recipient, Status, Sent At, Error
- Filter by status (Sent/Failed)
- Data source: `notification_logs` table
- Failed emails highlighted in soft red (`#EF5350`)

---

### Summary

| Area | Action |
|------|--------|
| Migration | Create `notification_logs` table with RLS |
| `sendMasteryReport.ts` | Rewrite with retry logic + notification logging |
| UnitRoadmap | Wire the trigger on score >= 80% |
| CommandCenter | Add notification log view for teachers |

### Files to Create
- Database migration for `notification_logs`

### Files to Modify
- `src/utils/sendMasteryReport.ts`
- `src/components/student/curriculum/UnitRoadmap.tsx`
- `src/components/teacher/professional/CommandCenter.tsx`

