
Goal: eliminate the infinite “Verifying your access…” loop by making student routing metadata-first, timeout-safe, and self-healing.

1. Replace DB-first hub routing with a shared resolver
- Add a small shared utility used by auth/routing code to resolve the student hub from:
  1) `user.user_metadata.hub_type`
  2) `user.user_metadata.preferred_hub`
  3) `student_profiles.student_level`
  4) fallback `'playground'`
- Normalize everything with lowercase and alias mapping:
  - `academy` -> `academy`
  - `professional` / `success` -> `professional`
  - anything else / null -> `playground`
- Keep existing route mapping already used in this app:
  - `playground` -> `/dashboard/playground`
  - `academy` -> `/dashboard/academy`
  - `professional` -> `/dashboard/hub`

2. Make `useStudentLevel` metadata-first and non-blocking
- Update `src/hooks/useStudentLevel.ts` so it:
  - seeds `studentLevel` immediately from auth metadata if available
  - queries `student_profiles` in the background only to confirm/sync
  - logs Supabase fetch errors with `console.error`
  - never leaves `loading=true` indefinitely
- If the DB query fails because of RLS or missing row, the hook should still return the metadata-resolved level and finish loading.

3. Harden the spinner/redirect path in all entry points
- Update:
  - `src/components/auth/ImprovedProtectedRoute.tsx`
  - `src/components/auth/HomeGate.tsx`
  - `src/pages/Dashboard.tsx`
  - `src/pages/AuthCallback.tsx`
  - `src/pages/Login.tsx`
- Use the shared hub resolver so these screens do not depend on `student_profiles` before routing.
- Add a timeout escape hatch:
  - if auth/session is present but hub resolution is still pending after ~3–5 seconds, route to the resolved metadata hub or `/dashboard/playground`
  - show a toast like: “We couldn’t verify your hub from the database. Redirecting to your default dashboard.”
- Remove any route path assumptions from the old prompt that do not match this project (`/dashboard/success` is not correct here; this app uses `/dashboard/hub`).

4. Keep the database in sync silently after redirect
- After the user is routed, run a background upsert to `student_profiles` when needed:
  - `user_id`
  - normalized `student_level`
  - preserve `onboarding_completed` when possible
- This preserves fast UX while healing missing rows created by failed triggers or blocked reads.

5. Verify and, if needed, clean up RLS for `student_profiles`
- Audit existing policies instead of creating a new `profiles` table, because this codebase uses `student_profiles`, not `profiles.preferred_hub`.
- If policy coverage is inconsistent, update migrations so authenticated users can:
  - `SELECT` their own row with `auth.uid() = user_id`
  - `INSERT` their own row with `auth.uid() = user_id`
  - `UPDATE` their own row with `auth.uid() = user_id`
- Keep role checks on `user_roles` server-safe and do not move roles onto `users` or client storage.

6. Preserve onboarding behavior
- Ensure the new routing still respects:
  - `onboarding_completed === false` -> `/hub-confirmation` for students when appropriate
- Only use metadata to resolve hub/system, not to bypass onboarding gates.

7. Add clearer diagnostics for future debugging
- Improve console messages around:
  - student profile fetch failure
  - metadata hub used as fallback
  - self-heal upsert success/failure
- Keep `ProfileDebugPanel` aligned so it clearly shows:
  - resolved role
  - metadata hub
  - DB student level
  - whether fallback routing was used

Technical details
- Actual codebase findings:
  - the app does not use `profiles.preferred_hub`; it uses `student_profiles.student_level`
  - signup already writes `hub_type` metadata and auto-creates `student_profiles`
  - routing currently mixes metadata fallback and DB reads across several files, which creates race conditions and repeated spinners
- Files likely involved:
  - `src/hooks/useStudentLevel.ts`
  - `src/components/auth/ImprovedProtectedRoute.tsx`
  - `src/components/auth/HomeGate.tsx`
  - `src/pages/Dashboard.tsx`
  - `src/pages/AuthCallback.tsx`
  - `src/pages/Login.tsx`
  - possibly a migration if `student_profiles` RLS needs cleanup

Expected result
- A newly registered or returning student is routed instantly from session metadata.
- Missing or unreadable `student_profiles` rows no longer trap the user on a spinner.
- The database is repaired in the background.
- All student hub matching is case-insensitive and null-safe.
