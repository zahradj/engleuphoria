

## Plan: Fix Teacher Email Flow (Application → Interview)

### Root Cause

**All transactional emails are failing.** The edge function logs show this error:

```
Could not find the function public.enqueue_email(payload, queue_name)
```

The database function is `enqueue_email(_queue_name, _payload)` (with underscore prefixes), but the `send-transactional-email` Edge Function calls it with `enqueue_email(payload, queue_name)` (no underscores). PostgREST requires exact parameter name matching, so every email — application-received, interview-invitation, welcome emails — silently fails.

Additionally, the `auth-email-hook` uses the old direct-send pattern (`@lovable.dev/email-js`) instead of the queue-based pattern, meaning auth emails (teacher invitations, password resets) may also not be delivering reliably.

### What's Affected

- "Application Received" confirmation email (sent from `SimpleTeacherForm`)
- Interview invitation email (sent from admin panel)
- All other transactional emails (welcome, booking, reminders)
- Auth emails (invite, password reset) via the old hook pattern

### Fix Steps

**Step 1 — Fix the parameter mismatch in `send-transactional-email`**

Change line 311 from:
```typescript
await supabase.rpc('enqueue_email', { queue_name: '...', payload: {...} })
```
to:
```typescript
await supabase.rpc('enqueue_email', { _queue_name: '...', _payload: {...} })
```

This single fix unblocks ALL transactional emails immediately.

**Step 2 — Re-scaffold `auth-email-hook` to use the queue**

The current hook imports `@lovable.dev/email-js` and sends directly. It needs to be upgraded to the queue-based pattern using `enqueue_email` for retry safety. Will use the scaffolding tool and apply existing brand styling.

**Step 3 — Add missing "Application Received" email to the other forms**

`SimpleTeacherForm` already sends the confirmation email, but `TeacherApplicationForm` and `EnhancedTeacherApplicationForm` do not. Add the same `send-transactional-email` call after successful submission.

**Step 4 — Deploy all updated Edge Functions**

Deploy `send-transactional-email` and `auth-email-hook` so the fixes take effect.

### Files to Modify

- `supabase/functions/send-transactional-email/index.ts` — fix RPC parameter names
- `supabase/functions/auth-email-hook/index.ts` — re-scaffold to queue pattern
- `src/components/teachers/TeacherApplicationForm.tsx` — add confirmation email
- `src/components/teacher/EnhancedTeacherApplicationForm.tsx` — add confirmation email

### DNS Note

The email domain (`notify.engleuphoria.com`) is still pending DNS verification. Once you complete the NS record setup in your domain registrar, emails will start flowing. You can monitor progress in **Cloud → Emails**. The code fixes are still necessary regardless — they ensure emails get enqueued correctly once DNS is verified.

