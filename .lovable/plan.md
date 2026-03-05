

# Fix "Forgot Password" Link

## Problem

The forgot password flow is broken. Looking at the auth logs:

1. The reset email **is sent successfully** (status 200 from Supabase)
2. When the user clicks the link in the email, Supabase returns **"Email link is invalid or has expired"** (403)

The root cause: The `redirectTo` URL in the reset email uses `window.location.origin`, which resolves to the **preview URL** (e.g., `https://f2c868c1-...lovableproject.com`). However, Supabase's **Site URL** and **Redirect URLs** configuration likely only allows certain domains. The auth logs show the verify request referrer is `http://localhost:3000`, confirming a URL mismatch.

Additionally, the reset link format from Supabase uses a hash fragment (`#access_token=...&type=recovery`), and the `ResetPassword` page does not parse hash parameters -- it only reads `useSearchParams()` (query params).

## Fixes Required

### Fix 1: Parse hash fragment in ResetPassword page

Supabase sends recovery links with tokens in the URL **hash** (e.g., `#access_token=...&type=recovery`). The Supabase JS client automatically picks up these tokens via `onAuthStateChange` with event `PASSWORD_RECOVERY`. The `ResetPassword` page needs to:

- Listen for `PASSWORD_RECOVERY` event from `onAuthStateChange`
- Show the password reset form only when a valid recovery session is detected
- Show an error/expired message if no valid session is found after a timeout

**File:** `src/pages/ResetPassword.tsx`
- Add `useEffect` that listens to `supabase.auth.onAuthStateChange` for `PASSWORD_RECOVERY` event
- Set a `sessionReady` state to `true` when recovery session is detected
- Show a loading state initially, then the form when ready, or an error if timed out

### Fix 2: Use published URL for redirectTo

Change the `redirectTo` in `AuthContext.tsx` to use the published domain instead of `window.location.origin` (which changes between preview/published):

**File:** `src/contexts/AuthContext.tsx` (line ~500)
- Change `redirectTo` to use `https://engleuphoria.lovable.app/reset-password` as the primary URL
- This ensures the reset link always points to a stable, allowed URL

### Fix 3: Add redirect URLs in Supabase dashboard

The user needs to add these URLs to Supabase Auth > URL Configuration > Redirect URLs:
- `https://engleuphoria.lovable.app/**`
- `https://id-preview--f2c868c1-6921-4fb3-b652-76d62600c4d5.lovable.app/**`

This is a manual step in the Supabase dashboard.

## Summary of Changes

| File | Change |
|------|--------|
| `src/pages/ResetPassword.tsx` | Add `PASSWORD_RECOVERY` event listener, loading/error states |
| `src/contexts/AuthContext.tsx` | Use stable published URL for `redirectTo` |
| Supabase Dashboard (manual) | Add redirect URLs to Auth configuration |

