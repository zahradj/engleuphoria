

## Plan: Migrate All Emails to Lovable Cloud + Fix Confirmation Emails

### Problem Summary

There are **8 Edge Functions still using the old Resend SDK** (`npm:resend@2.0.0` with `RESEND_API_KEY`). These bypass Lovable's email infrastructure entirely and will fail because there's no active Resend domain. Meanwhile, the `auth-email-hook` and `send-transactional-email` functions are correctly using Lovable Cloud's queue system — but the domain (`notify.engleuphoria.com`) is still pending DNS verification.

**MX records / Google Workspace safety**: Lovable's email system uses the subdomain `notify.engleuphoria.com` (delegated via NS records to Lovable's nameservers). It does **not** touch MX records on the root `engleuphoria.com` domain, so your Google Workspace inbox is completely safe.

### Functions That Need Migration (Resend → Lovable Transactional)

| Function | Purpose | Current Sender |
|---|---|---|
| `send-welcome-email` | Welcome email after signup | `welcome@engleuphoria.com` (Resend) |
| `send-user-emails` | General user notifications | `noreply@engleuphoria.com` (Resend) |
| `send-teacher-emails` | Teacher lifecycle emails | `noreply@engleuphoria.com` (Resend) |
| `notify-admin-new-registration` | Admin alert on new signup | `notifications@engleuphoria.com` (Resend) |
| `notify-admin-new-student` | Admin alert on new student | `noreply@engleuphoria.com` (Resend) |
| `notify-teacher-booking` | Teacher gets booking alert | `noreply@engleuphoria.com` (Resend) |
| `notify-student-lesson` | Student lesson-ready alert | `noreply@engleuphoria.com` (Resend) |
| `send-lesson-reminders` | Upcoming lesson reminders | `noreply@engleuphoria.com` (Resend) |

### Functions Already Correct (No Changes)

- `auth-email-hook` — uses Lovable queue, `support@engleuphoria.com`
- `send-transactional-email` — uses Lovable queue, correct `SENDER_DOMAIN`
- `process-email-queue` — queue dispatcher
- `approve-teacher` — uses `inviteUserByEmail` which triggers `auth-email-hook`

### Implementation Steps

**Step 1 — Create missing transactional email templates**

Add new templates to `_shared/transactional-email-templates/` for:
- `welcome-student` — student welcome email
- `welcome-teacher` — teacher welcome/signup confirmation
- `admin-new-registration` — admin notification for new signups
- `admin-new-student` — admin notification for new students
- `teacher-booking` — teacher booking notification
- `student-lesson-ready` — student lesson-ready notification
- `lesson-reminder` — upcoming lesson reminder

Register all in `registry.ts`.

**Step 2 — Rewrite all 8 Resend functions → use `send-transactional-email`**

Each function will be rewritten to call `supabase.functions.invoke('send-transactional-email', ...)` instead of using the Resend SDK directly. This routes all emails through the Lovable queue with retry safety, suppression handling, and the verified sender domain.

**Step 3 — Update frontend callers**

The 7 frontend files that invoke these functions will be updated to pass the correct payload format expected by the rewritten functions.

**Step 4 — Re-scaffold auth email templates**

Use the Lovable scaffolding tool to ensure the `auth-email-hook` is using the latest queue-based pattern, then apply the existing brand styling (purple `#9b6dba`, Inter font).

**Step 5 — Deploy all modified Edge Functions**

Deploy all updated functions in a single batch.

### DNS / MX Safety Note

Lovable only manages the `notify.engleuphoria.com` subdomain via NS delegation. Your root domain MX records (pointing to Google Workspace) are untouched. Regular email to `@engleuphoria.com` addresses will continue working normally.

### Files to Create
- 7 new transactional email templates in `_shared/transactional-email-templates/`

### Files to Modify
- 8 Edge Function `index.ts` files (remove Resend, use transactional queue)
- `_shared/transactional-email-templates/registry.ts` (register new templates)
- 7 frontend files (update payloads to match new function signatures)

