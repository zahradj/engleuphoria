

## Plan: Fix Email Delivery — Domain Verification + Queue Recovery

### Diagnosis Summary

The entire email pipeline is built correctly — Edge Functions, queue worker, cron job, templates, and database infrastructure are all in place. The **single blocker** is that the Lovable platform still reports `notify.engleuphoria.com` as **Pending**, even though DNS records are green on dnschecker.org.

Here is what happened to all your emails:
- **8 emails** failed early (before the queue fix) with "Failed to enqueue email"
- **7 emails** were enqueued successfully but rejected by the Lovable Email API with **403 domain_not_verified** and moved to the dead-letter queue
- **Queue is now empty** — all messages have either failed or been moved to DLQ
- The cron job is running fine every minute, but there's nothing left to process

### Steps

**1. Trigger domain verification via the scaffold tool**
- Call the `scaffold_transactional_email` tool which will trigger a domain re-verification on Lovable's backend. This is the programmatic way to force the platform to re-check DNS — since NS records are already propagated, this should flip the status to Active.

**2. Re-scaffold auth email templates**
- Call the auth email scaffold tool to ensure the auth hook is properly registered and the domain verification is triggered from that side as well.

**3. Re-deploy all email Edge Functions**
- Deploy `send-transactional-email`, `auth-email-hook`, `process-email-queue`, `handle-email-unsubscribe`, `handle-email-suppression` to ensure they are running the latest code.

**4. Send a test email to verify delivery**
- Invoke `send-transactional-email` directly with a test to confirm the pipeline works end-to-end now that the domain should be verified.

**5. Advise on retrying failed emails**
- The 7 DLQ emails and 8 failed emails need to be manually re-triggered (e.g., by resending the interview invitation from the admin dashboard). The queue system correctly moved them to DLQ — they won't auto-retry.

### Technical Details

- **Domain**: `notify.engleuphoria.com` — NS records point to `ns3.lovable.cloud` / `ns4.lovable.cloud`
- **Sender**: `support@engleuphoria.com` (FROM_DOMAIN = `engleuphoria.com`, SENDER_DOMAIN = `notify.engleuphoria.com`)
- **Queue infrastructure**: `enqueue_email` RPC exists, cron job active, queue tables present
- **All 7 DLQ errors**: `403 domain_not_verified` — confirming the only issue is verification status

### Result

Once the domain status flips to Active, all new emails will flow through automatically. Previously failed emails will need to be resent from the admin UI.

