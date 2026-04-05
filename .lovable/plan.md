

# EnglEuphoria Email & Auth Fixes — Implementation Plan

## Current State Summary

Your project **already has** a solid foundation:
- **Branded auth email templates** exist (signup, recovery, magic-link, invite, email-change, reauthentication) with EnglEuphoria logo, purple/indigo styling, and the queue-based `auth-email-hook`
- **Email domain** is configured on `notify.engleuphoria.com` with Lovable's built-in email infrastructure
- **Auth redirect logic** has timeouts and fallback mechanisms already in place

This means we don't need to switch to Resend or Postmark — your emails already go through Lovable's managed email infrastructure with proper SPF/DKIM via the `notify.engleuphoria.com` subdomain. The plan focuses on **upgrading what exists** and **fixing real issues**.

---

## Part 1: Upgrade Email Templates to Match Your "Master" Design

The current templates use EnglEuphoria branding but can be elevated to match the premium design you shared (dark footer, hub references, stronger CTAs).

**Changes to all 6 templates** in `supabase/functions/_shared/email-templates/`:

- Add a dark footer (`#111827` background) with "© 2026 Engleuphoria. The Future of Learning."
- Update button styling to use the indigo-600 (`#4f46e5`) accent with bolder `14px 28px` padding
- Use Inter font family consistently across all templates
- Add hub-aware welcome copy to the signup template (Playground / Academy / Professional references)
- Ensure recovery template has a clear "Reset My Password" branded button
- Redeploy `auth-email-hook` after template changes

## Part 2: Fix the "Verifying Access" Infinite Loop

The issue is in `ImprovedProtectedRoute.tsx` — when a user's role isn't loaded from the database fast enough, they see "Verifying your access... Please wait a moment" indefinitely (up to 8 seconds, then forced to login).

**Root cause:** The `fetchUserRoleFromDatabase` call in `AuthContext` can fail silently or return slowly if the `user_roles` table doesn't have a row for the user yet (race condition between signup trigger and first page load).

**Fixes:**

1. **AuthContext.tsx** — Add a defensive timeout that forces `loading = false` with a fallback role if the DB fetch hangs beyond 6 seconds (the current 10s timeout exists but doesn't always resolve the role)

2. **ImprovedProtectedRoute.tsx** — When role timeout fires (8s), instead of redirecting to `/login`, fall back to the user's metadata role or default to `student` and let them proceed. Only redirect to login if there's genuinely no session.

3. **Dashboard.tsx** — The 5-second timeout already defaults to `/playground`, which is correct. Ensure it also sets the user role in state so downstream guards don't re-block.

4. **ProfileCompleteGuard.tsx** — Add a safety timeout (8s) so it never hangs forever on "Checking profile status..."

## Part 3: Add Booking Confirmation & Victory Notification Emails

Create two new **transactional email templates** for app-triggered emails:

1. **Booking Confirmation** — Sent when a student books a lesson with a teacher. Includes teacher name, lesson time, and a "Join Lesson" button. Uses the same branded wrapper.

2. **Victory Notification** — Sent when a student earns a reward/accessory in the classroom. Celebratory tone with the achievement details.

These will use Lovable's transactional email infrastructure (`send-transactional-email` Edge Function) with proper templates, suppression handling, and unsubscribe support.

**Requires:** Scaffolding transactional email infrastructure if not already present, creating template files, registering them, and wiring up the trigger points in the booking and reward flows.

## Part 4: Deliverability — SPF/DKIM Verification

Your domain `notify.engleuphoria.com` is already delegated to Lovable's nameservers, which manage SPF and DKIM records automatically. We'll verify the domain status is `active` and confirm DNS records are properly propagated. If anything is pending, we'll surface the exact steps needed.

---

## Implementation Order

1. Fix auth redirect loop (highest impact — users are getting stuck)
2. Upgrade the 6 auth email templates with premium branding
3. Deploy updated `auth-email-hook`
4. Set up transactional email infrastructure + booking & victory templates
5. Verify email domain status and deliverability

