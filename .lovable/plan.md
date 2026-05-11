
## Root cause

The Profile Approvals queue at `/super-admin` (tab `profile-review`) already loads the pending profile correctly. The "I can't review it" symptom comes from two issues:

1. **Wrong session.** You're logged in as the *teacher* account (`djaanine.zahra@gmail.com`). The only admin is `f.zahra.djaanine@engleuphoria.com`. While viewing `/teacher` you simply aren't an admin in that browser session.
2. **Discoverability.** Even after switching to the admin account, "Profile Approvals" is one of ~15 sidebar items. There is no jump-to-link from the teacher's "Under Review" card or from the admin landing screen.

No RLS or data fix is needed — the row is in the queue and admin policies already allow SELECT/UPDATE.

## Plan

### 1. Auto-route admins to the queue when items are pending
- In `src/pages/AdminDashboard.tsx`, when `useAdminPendingCounts` returns `profileApprovals > 0` on first load, set `activeTab` to `'profile-review'` instead of `'overview'` (only on initial mount, never override later manual nav).
- Keep the AdminActionRequiredCard as a secondary nudge on overview.

### 2. Highlight the sidebar entry while there's a queue
- In `src/components/admin/AdminSidebar.tsx`, give the "Profile Approvals" row a pulsing amber dot + bolder label when `badge > 0` so it visually wins over other tabs.

### 3. Add a deep link from the teacher's "Under Review" screen for admins
- Locate the teacher pending-review screen (`src/components/teacher/ProfileCompleteGuard.tsx` / dashboard pending state).
- If `useAuth().user.role === 'admin'` (i.e. an admin happens to land there while impersonating or testing), render a small "Open Profile Approvals →" button linking to `/super-admin` with `?tab=profile-review`.
- Update `AdminDashboard` to read `?tab=` from the URL on mount and select that tab.

### 4. One-click approve from the action card
- Extend `AdminActionRequiredCard` so the "X profile(s) awaiting approval" button additionally accepts a quick-approve flow: clicking it still navigates to `profile-review`, but the destination auto-expands the first pending teacher (set `expandedId` to `pending[0].id` in `TeacherProfileReviewQueue`) so the reviewer is one click from Approve.

### 5. Verify
- Log in as `f.zahra.djaanine@engleuphoria.com`, hit `/super-admin`, confirm:
  - Lands directly on Profile Approvals with fatima's card expanded.
  - Approve button flips `profile_approved_by_admin=true`, `can_teach=true`.
  - Teacher account on `/teacher` then loads the real dashboard instead of the "Under Review" screen.

## Files to touch

- `src/pages/AdminDashboard.tsx` — initial-tab logic + `?tab=` query param.
- `src/components/admin/AdminSidebar.tsx` — pulse styling for non-zero badges.
- `src/components/admin/TeacherProfileReviewQueue.tsx` — accept an `initialExpandedId` (or auto-expand first item when only one is pending).
- `src/components/admin/AdminActionRequiredCard.tsx` — pass intent to expand first item.
- `src/components/teacher/ProfileCompleteGuard.tsx` (and/or the "Under Review" card) — admin-only deep link.

## Out of scope

- No DB migrations (RLS already correct).
- No change to the approval action itself in `VideoReviewPanel`.
- Not changing how role assignment works.

## Important note for you

If clicking through the new flow still shows an empty queue, you're logged into the teacher account, not the admin. Sign out and sign in as `f.zahra.djaanine@engleuphoria.com`.
