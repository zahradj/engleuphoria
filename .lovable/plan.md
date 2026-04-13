

## Email System Diagnosis & Fix Plan

### Root Cause Analysis

**Two critical problems were found:**

**Problem 1 — Lovable Emails are disabled at the project level**
The `process-email-queue` function (which processes ALL queued emails) is getting a **403 "Emails are disabled for this project"** error. This means every email going through the queue — auth emails, welcome emails, notifications, lesson reminders — is failing. There are currently stuck messages in the queue that keep retrying and failing.

**Problem 2 — DNS conflict with Resend**
The `approve-teacher` and `send-interview-invite` functions were switched to send directly via Resend using the address `onboarding@notify.engleuphoria.com`. However, the `notify.engleuphoria.com` subdomain's DNS is delegated to Lovable's nameservers (NS records). This means **Resend cannot verify or send from this subdomain** — it doesn't control the DNS records. Any Resend send attempt from this address will fail.

### Affected Email Functions (13 total)

| Function | Current Method | Status |
|----------|---------------|--------|
| `process-email-queue` | Lovable Email API | ❌ 403 - disabled |
| `auth-email-hook` | Lovable queue (enqueue) | ❌ Queue blocked |
| `send-transactional-email` | Lovable queue (enqueue) | ❌ Queue blocked |
| `approve-teacher` | Resend direct | ❌ DNS conflict |
| `send-interview-invite` | Resend direct | ❌ DNS conflict |
| `send-welcome-email` | via send-transactional-email | ❌ Queue blocked |
| `send-teacher-emails` | via send-transactional-email | ❌ Queue blocked |
| `send-lesson-reminders` | via send-transactional-email | ❌ Queue blocked |
| `notify-admin-new-registration` | via send-transactional-email | ❌ Queue blocked |
| `notify-admin-new-student` | via send-transactional-email | ❌ Queue blocked |
| `notify-student-lesson` | via send-transactional-email | ❌ Queue blocked |

### The Fix

**Step 1 — Re-enable Lovable Emails**
Toggle Lovable Emails back on for this project. The domain `notify.engleuphoria.com` is already verified and active. This immediately unblocks all 9 queue-based email functions.

**Step 2 — Convert `approve-teacher` to use the Lovable queue**
Replace the direct Resend API call with enqueueing via `send-transactional-email`. The branded HTML template (navy header, gold seal, onboarding roadmap) will be preserved by registering it as a custom transactional template. Sender becomes `noreply@notify.engleuphoria.com` (or `support@engleuphoria.com` display).

**Step 3 — Convert `send-interview-invite` to use the Lovable queue**
Same approach — replace Resend direct call with the queue system, register the branded interview invitation HTML as a transactional template.

**Step 4 — Register branded templates in the transactional email registry**
Add two new templates to `registry.ts`:
- `teacher-welcome-approved` — the approval/welcome email with the onboarding roadmap
- `interview-invitation-branded` — the interview invite with meeting details

**Step 5 — Deploy all updated Edge Functions**
Deploy `approve-teacher`, `send-interview-invite`, and `send-transactional-email` to make the changes live.

**Step 6 — Clean up the Resend references**
Remove the `RESEND_API_KEY` and `RESEND_GATEWAY_URL` usage from both functions since they'll no longer be needed.

### Why Not Keep Resend?

The `notify.engleuphoria.com` subdomain is delegated to Lovable's nameservers. Resend cannot verify DNS for a domain it doesn't control. To use Resend, you would need to:
1. Remove the NS delegation (breaks all current Lovable email infrastructure)
2. Verify a different domain on Resend (e.g., root `engleuphoria.com`)
3. Rebuild all email infrastructure from scratch

The Lovable email system is already fully set up, verified, and working — it just needs to be re-enabled.

### Files Changed
- `supabase/functions/approve-teacher/index.ts` — convert from Resend to Lovable queue
- `supabase/functions/send-interview-invite/index.ts` — convert from Resend to Lovable queue
- `supabase/functions/_shared/transactional-email-templates/registry.ts` — add 2 branded templates

