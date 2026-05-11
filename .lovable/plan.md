## Diagnosis

The teacher you logged in as (`djaanine.zahra@gmail.com`) is correctly in the "Pending Approval" state in the database:

- `profile_complete = true`
- `profile_approved_by_admin = false`
- `hub_role = playground_specialist`

So the teacher dashboard is right to show "Profile under review."

The admin queue **does exist** and **does contain this teacher** — it lives under the **"Profile Review"** sidebar tab in the Admin Dashboard (`TeacherProfileReviewQueue` component). A live DB query confirms 1 pending profile is waiting there right now.

The problem is **discoverability**: the admin dashboard has three overlapping teacher tabs ("Teachers", "Teacher Applications", "Profile Review") and nothing tells the super admin that a teacher is waiting in the Profile Review bucket. The Overview / Super Admin Control Center never surfaces this count, and the sidebar item has no badge — so it looks like "there is no pending teacher" when in fact there is one, just one click away.

## Plan

### 1. Add a live "pending count" badge to the sidebar
- In `src/components/admin/AdminSidebar.tsx`, fetch the count of `teacher_profiles` where `profile_complete = true AND profile_approved_by_admin = false` (and the parallel count for `teacher_applications` pending interview, so both pipelines are visible).
- Render a small red pill next to "Profile Review" and "Teacher Applications" when the count > 0.
- Re-fetch on tab change and every 60s.

### 2. Add an "Action Required" card to the Admin Overview
- In `AdminOverview` (and mirror in `SuperAdminControlCenter`), add a card at the top that lists:
  - N teacher profiles awaiting approval → button jumps to `profile-review` tab
  - N teacher applications awaiting interview decision → jumps to `teacher-applications`
- The card only renders when at least one count > 0, so it disappears on a clean queue.

### 3. Clarify the labels so the three tabs stop colliding
Rename in `AdminSidebar.tsx`:
- "Teacher Applications" → **"Applications & Interviews"** (hiring pipeline before they're hired)
- "Profile Review" → **"Profile Approvals"** with subtitle "Review bio + intro video" (post-hire activation gate)
- "Teachers" → **"Active Teachers"** (already-approved roster)

### 4. Wire the teacher-side message to the right tab
Update the `PendingReviewBanner` shown to the teacher to say *"An admin is reviewing your bio and intro video — usually within 24h"* so the wording matches what the admin actually sees in **Profile Approvals**.

## Out of scope
- No DB schema changes; no RLS changes; the data and approval action already work.
- No change to teacher onboarding flow or to `useTeacherStatus` logic.

## Verification
- Reload `/dashboard` as super admin → red "1" badge on **Profile Approvals**, Action Required card on Overview links to it.
- Open the tab → existing queue lists `djaanine.zahra@gmail.com`, the existing Approve button activates her.
- After approval, badge and card disappear; teacher dashboard flips from "under review" to the full Novakid dashboard on next refresh.
