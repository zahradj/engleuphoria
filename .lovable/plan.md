

## Email Infrastructure Setup Plan

### Current State
- **Domain `engleuphoria.com`**: Status is "initiated" — DNS setup for `notify.engleuphoria.com` is not yet verified. The setup dialog needs to be completed or re-run.
- **Edge Functions exist** but need updates:
  - `auth-email-hook` uses the **old direct-send pattern** (`@lovable.dev/email-js`) instead of the queue-based `enqueue_email` pattern. This means auth emails bypass retry safety and rate-limit handling.
  - `send-transactional-email`, `process-email-queue`, `handle-email-unsubscribe` all exist and are wired up.
  - 18 transactional email templates exist in the registry.

### What Needs to Happen

**Step 1 — Complete email domain setup**
Re-open the email domain setup dialog to finalize the `engleuphoria.com` domain configuration. The current "initiated" status means the flow wasn't fully completed.

**Step 2 — Upgrade auth-email-hook to queue-based sending**
Re-scaffold the `auth-email-hook` using the proper queue pattern (replaces `@lovable.dev/email-js` with `enqueue_email` RPC). This ensures auth emails (signup, password reset, magic link, invite) go through the durable queue with retries.

**Step 3 — Deploy all email Edge Functions**
Deploy `auth-email-hook`, `send-transactional-email`, `process-email-queue`, `handle-email-unsubscribe`, and `handle-email-suppression` to ensure all latest code is live.

**Step 4 — Verify queue infrastructure**
Confirm the pgmq queues, cron job, and vault secret exist in the database. If missing, run infrastructure setup to create them.

### Important Note
Emails will only actually deliver once DNS verification for `notify.engleuphoria.com` completes. But all code and infrastructure can be set up now — emails will start flowing automatically once DNS propagates.

### Files Changed
- `supabase/functions/auth-email-hook/index.ts` — upgraded to queue-based pattern
- Edge Function deployments (no new files)

