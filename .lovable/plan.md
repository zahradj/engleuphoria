

## Plan: Verify Email Domain & Configure "support@engleuphoria.com" Sender

### What's happening now

Your email domain `notify.engleuphoria.com` is set up with NS records pointing to Lovable's nameservers. The edge functions are configured but currently send from `noreply@notify.engleuphoria.com`. You want emails to come from `support@engleuphoria.com` instead.

### Steps

**1. Check domain verification status**
- Use the email domain status tool to confirm whether DNS has propagated and the domain is verified/active.

**2. Update the From address in both edge functions**
- In `send-transactional-email/index.ts`: Change `FROM_DOMAIN` from `"notify.engleuphoria.com"` to `"engleuphoria.com"` and update the from address to use `support@` instead of `noreply@`.
- In `auth-email-hook/index.ts`: Same changes — `FROM_DOMAIN` to `"engleuphoria.com"` and sender prefix to `support@`.
- `SENDER_DOMAIN` stays as `"notify.engleuphoria.com"` (this is the verified subdomain used for actual delivery — it must not change).

**3. Redeploy all email edge functions**
- Deploy `send-transactional-email`, `auth-email-hook`, `process-email-queue`, `handle-email-unsubscribe`, and `handle-email-suppression` so the changes take effect.

**4. Verify the cron job exists**
- Confirm the `process-email-queue` pg_cron job is running so queued emails actually get processed.

### Result

- All system emails (auth and transactional) will be sent from **support@engleuphoria.com**
- The actual sending infrastructure still uses the verified `notify.engleuphoria.com` subdomain behind the scenes
- No manual SMTP configuration needed in Supabase

