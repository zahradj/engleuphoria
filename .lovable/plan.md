

## Fix: Interview Link Missing in Emails

### Root Cause

The `send-interview-invite` Edge Function has a broken auth verification — it calls `callerClient.auth.getClaims()` which is not a standard Supabase JS v2 method. This likely causes silent failures. Additionally, the `meetingLink` templateData prop is explicitly set to `undefined` when no external link exists (line 121: `meetingLink: interview.zoom_link || interview.meeting_link || undefined`), which overrides the fallback logic inside the template.

The client-side code (line 201) correctly saves `zoom_link` as the internal room URL, but the Edge Function's auth check may fail before it ever reaches the email-sending logic — or the interview record may not be found due to timing/query issues.

### The Fix (3 changes)

**1. Fix auth verification in `send-interview-invite/index.ts`**
Replace the broken `getClaims()` call with standard `supabase.auth.getUser()` to verify the caller's identity.

**2. Always pass the interview link explicitly — never `undefined`**
Change the templateData to always include a concrete `meetingLink` value (falling back to the internal room URL), rather than passing `undefined` and relying on the template to reconstruct it:
```
meetingLink: interview.zoom_link || interview.meeting_link || `${SITE_URL}/interview-room/${interview.application_id || interview.id}`
```

**3. Add validation — abort if link is empty**
Before calling `send-transactional-email`, verify the link is a valid URL. If not, return an error instead of sending a blank email.

### Files Changed
- `supabase/functions/send-interview-invite/index.ts` — fix auth, fix link logic, add validation
- Redeploy `send-interview-invite` Edge Function

### What This Does NOT Change
- The template file (`interview-invitation-branded.tsx`) stays the same — it already handles the `meetingLink` prop correctly
- The client-side scheduling code stays the same — it already saves the `zoom_link` correctly
- No database changes needed

