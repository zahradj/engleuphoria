

# Plan: Unify Classroom Entry, Fix Sidebar, Set Teacher Payouts

## Root Cause Analysis

### 1. "Session is private" / different classroom IDs (teacher vs student)
The platform has **three competing room ID systems** living side-by-side. Different parts of the UI navigate to different ID flavors, so teacher and student literally enter different rooms:

| Source | Navigates to | Looked up in `UnifiedClassroomPage` as |
|--------|-------------|----------------------------------------|
| Teacher `NextLessonCard` | `/classroom/{lessons.id}` | ❌ Not found in `class_bookings` |
| Student `DashboardTab` "Join Class" | `/classroom/{lessons.id}` | ❌ Not found |
| Student `BookMyClassModal` confirmation | `/classroom/{class_bookings.classroom_id}` | ✅ Found via `classroom_id` fallback |
| `useLiveClassroomStatus` (Live badge) | `/classroom/{classroom_sessions.room_id}` | ❌ Not found |

`UnifiedClassroomPage` only knows how to resolve `class_bookings.id` or `class_bookings.classroom_id`. So when you click "Join" from either dashboard, you land on a `lessons.id` URL → no booking → either "Booking Not Found" or (when a stale booking row coincidentally exists) **"This session is private"**.

### 2. "Book a Lesson" not clickable
In `StudentQuickActions`, the Book a Lesson button navigates to `/find-teacher{hubParam}`. That route works, but on the **Playground dashboard** the action is wired through `StudentWelcomeSection`/legacy routes — the button is rendered but its `onClick` is overridden by an absent handler in some hub dashboards. Also, in `StudentPackagesSection` and `QuickActions`, several "Book Lesson" buttons still navigate to `/student/book-lesson` — a legacy route that requires an active package and silently bounces when no package is found, making it appear unclickable.

### 3. Sidebar order
Current order: `Dashboard → Learning Path → Sounds → Vocab → Milestones → My Lessons → Join Classroom → Assessments → Certificates → Teachers → Classes → Homework → Progress → Referrals → Profile`. User wants **Classes immediately after Dashboard, then Homework**.

### 4. Teacher payouts not configurable per hub
Teacher payout amounts are not centrally tied to hub. Need: Academy €7, Playground €3.50, Success €7.

### 5. Student left bar visibility
Sidebar uses shadcn `<Sidebar collapsible="icon">` which already supports collapse — but there's no obvious trigger button visible to students. Need a visible toggle.

## Solution

### A. Unify the Classroom ID (Single Source of Truth)
Make `class_bookings.id` the ONE canonical room key everywhere.

**Database migration**:
- Backfill: for every existing `lessons` row that has a matching `class_bookings` row (same teacher_id + student_id + scheduled_at), make sure they are linked via `class_bookings.lesson_id`.
- Add a SECURITY DEFINER RPC `resolve_classroom_id(any_id uuid)` that, given any of `class_bookings.id`, `class_bookings.classroom_id`, or `lessons.id`, returns the canonical `class_bookings.id`. This makes the page resilient to old links.

**Frontend**:
- Update `UnifiedClassroomPage` to use `resolve_classroom_id` so it accepts ANY of the three ID flavors and resolves to the correct booking.
- Update `lessonService` and the upcoming-lessons RPCs (`get_teacher_upcoming_lessons`, `get_student_upcoming_lessons`) to also return `class_booking_id` so dashboards always navigate to the canonical key.
- Update `DashboardTab.tsx` (line 211), `NextLessonCard.tsx` (line 64), `ClassesSection.tsx`, and `CommandCenter.tsx` to navigate using `class_booking_id` (with `lesson.id` as fallback for legacy rows the resolver will still handle).

### B. Fix "Book a Lesson" Button
- In `StudentQuickActions`, keep `Book a Lesson` → `/find-teacher?hub={studentLevel}` (already correct).
- In `StudentPackagesSection` (line 157) and `QuickActions.tsx` (line 37), redirect to `/find-teacher?hub={hub}` instead of the dead `/student/book-lesson` route.
- Ensure the button in `DashboardTab` empty state (line 172) navigates with the hub param.

### C. Reorder Sidebar
Update `menuItems` in `StudentSidebar.tsx` to:
```
Dashboard → Classes → Homework → Join Classroom → My Lessons →
Learning Path → Sounds → Vocabulary Vault → Mastery Milestones →
Assessments → Certificates → Teachers → Progress → Invite Friends → Profile
```

### D. Sidebar Hide/Show
Add a visible `<SidebarTrigger />` (chevron) to the student layout header so the bar can be collapsed/expanded with one click. Persist collapsed state to `localStorage`.

### E. Teacher Payout Per Hub
Migration: add `hub_payout_eur` config table (or a `payout_amount_eur` column on a settings table) with rows:
```
playground   → 3.50
academy      → 7.00
professional → 7.00
```
- Update the booking-creation flow (`lessonPricingService.bookLessonWithPayment` and `BookMyClassModal`) to look up the hub rate and write it to `lessons.teacher_payout_amount` so existing payroll views automatically pick it up.
- Add a Super Admin UI tile in the existing TeacherManagement dashboard to edit these three values.

## Files to Modify

| File | Change |
|------|--------|
| `supabase/migrations/<new>.sql` | Add `resolve_classroom_id` RPC, update `get_teacher_upcoming_lessons` & `get_student_upcoming_lessons` to return `class_booking_id`, create `hub_payout_settings` table seeded with 3.50/7/7 |
| `src/pages/UnifiedClassroomPage.tsx` | Use `resolve_classroom_id` RPC for lookup |
| `src/services/lessonService.ts` | Add `class_booking_id` to `ScheduledLesson` interface |
| `src/components/student/DashboardTab.tsx` | Navigate to `class_booking_id` |
| `src/components/teacher/dashboard/NextLessonCard.tsx` | Navigate to `class_booking_id` |
| `src/components/dashboard/ClassesSection.tsx` | Same |
| `src/components/teacher/professional/CommandCenter.tsx` | Same |
| `src/components/student/StudentSidebar.tsx` | Reorder menu items |
| `src/components/student/dashboard/StudentPackagesSection.tsx` | Fix Book Lesson route |
| `src/components/navigation/QuickActions.tsx` | Fix Book Lesson route |
| `src/components/student/StudentPanel.tsx` (or layout) | Add visible `<SidebarTrigger />` |
| `src/services/lessonPricingService.ts` | Read hub payout from settings |
| `src/components/admin/TeacherManagement.tsx` | Add "Hub Payout Rates" editor card |

## Expected Result
- Teacher and student click "Join Class" → both land in the **same `/classroom/{class_bookings.id}`** URL → both see each other.
- "Book a Lesson" button always opens the find-teacher discovery (locked to student's hub).
- Sidebar order matches request; trigger button collapses/expands the bar.
- New bookings auto-record €3.50 / €7 / €7 payouts depending on hub; admins can edit live.

