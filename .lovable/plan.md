

## Plan: Fix Teen Dashboard Routing + Set Up Branded Verification Email

### Issue 1: Teen Student Gets Wrong Dashboard

**Root cause**: The `StudentDashboard` component (line 35) defaults `systemId` to `'kids'` and only overrides it if `users.current_system` is set in the DB. But the canonical student level lives in `student_profiles.student_level` (used by `useStudentLevel` for routing). If `users.current_system` is not populated for a teen, they land on `/academy` (correct route) but see the **Playground (kids) dashboard content**.

**Fix**: Use `useStudentLevel()` inside `StudentDashboard` as the primary source for `systemId`, with `users.current_system` as a fallback. Map `student_level` values to `SystemId`:
- `'academy'` -> `'teen'`
- `'playground'` -> `'kids'`
- `'professional'` -> `'adult'`

| File | Change |
|---|---|
| `src/pages/StudentDashboard.tsx` | Import `useStudentLevel`, use `studentLevel` to set `systemId` instead of only relying on `users.current_system` |

### Issue 2: Verification Email in Spam + No Branding

**Root cause**: No email domain is configured for this project. Emails are sent from default Supabase/Lovable infrastructure without custom branding, which makes spam filters flag them.

**Fix**: Set up a custom email domain for `engleuphoria.com`, then scaffold branded auth email templates with the EnglEuphoria logo and brand colors (orange/amber primary from the landing page).

**Steps**:
1. Open the email domain setup dialog so the user can configure `engleuphoria.com`
2. Once domain is configured, scaffold auth email templates with brand styling
3. Upload the logo (`src/assets/logo-black.png`) to a storage bucket for use in email templates
4. Apply EnglEuphoria brand colors (amber/orange primary `#F59E0B`, dark text) to all 6 auth templates
5. Deploy the `auth-email-hook` edge function

**Note**: The domain setup must be completed by the user first (DNS configuration). After that, the branded templates will ensure emails are properly authenticated and less likely to hit spam.

### Files

| File | Action |
|---|---|
| `src/pages/StudentDashboard.tsx` | **Modify** -- use `useStudentLevel` as primary `systemId` source |
| `supabase/functions/_shared/email-templates/*.tsx` | **Create** (via scaffold tool) -- branded auth email templates |
| `supabase/functions/auth-email-hook/index.ts` | **Create** (via scaffold tool) -- auth email hook |

