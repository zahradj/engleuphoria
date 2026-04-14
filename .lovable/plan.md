

# Cancellation/Rescheduling Policy + Full Brand Unification

## Part 1: Cancellation & Rescheduling Policy (5-Day Rule)

### Current State
The codebase already has `useCancelReschedule.ts` and `LessonManagementModal.tsx` but they use **wrong thresholds**: cancel = 6 hours, reschedule = 4 hours. The Reschedule button in `UpcomingClassesTab.tsx` is not wired to anything. Trial lessons have no exemption.

### Changes

**1. Update `src/hooks/useCancelReschedule.ts`**
- Change `CANCEL_POLICY_HOURS` from 6 to 120 (5 days)
- Change `RESCHEDULE_POLICY_HOURS` from 4 to 120 (5 days)
- Add `isTrialLesson(lessonId)` check — if trial (price = 0), always allow cancel/reschedule
- Update `getRefundInfo`: > 5 days = full refund, < 5 days = no refund (full charge)
- After cancel/reschedule, re-open the teacher's availability slot (`teacher_availability.is_booked = false`)

**2. Update `src/components/student/LessonManagementModal.tsx`**
- Update policy text from "6 hours" / "4 hours" to "5 days"
- Add trial lesson bypass messaging: "Trial lessons can be freely cancelled or rescheduled"
- Hub-color code the modal header (orange/blue/green based on lesson type)

**3. Wire up `src/components/student/UpcomingClassesTab.tsx`**
- Connect the existing "Reschedule" button to open `LessonManagementModal` in reschedule mode
- Add a "Cancel" button next to it
- Both open the modal with the correct mode

**4. Add "Manage Lesson" menu to `src/components/classroom/ClassroomConnection.tsx`**
- Add a dropdown with "Reschedule" and "Cancel" options
- Color-coded by hub (detect from lesson metadata or price)
- Opens `LessonManagementModal`

---

## Part 2: Full Brand Unification Across All Pages

### Problem
The homepage and student dashboards have the new premium glassmorphic aesthetic, but the teacher dashboard, admin dashboard, content creator dashboard, profile pages, auth pages, and schedule pages still use plain unstyled defaults.

### Changes (applying consistent brand identity everywhere)

**5. Teacher Dashboard — `ProfessionalNav.tsx` + `ProfessionalHub.tsx`**
- Replace hardcoded `bg-white` / `#1A237E` with CSS variables and brand gradients
- Add Logo component visibility in nav
- Apply glassmorphic card styling to Command Center cards
- Dark mode support (currently hardcoded to light)

**6. Admin Dashboard — `AdminSidebar.tsx` + `AdminDashboard.tsx`**
- Add branded gradient header in sidebar
- Active tab: brand-blue glow effect instead of plain `variant="default"`
- Logo already present — ensure it's visible and styled consistently

**7. Content Creator Dashboard — `ContentCreatorDashboard.tsx`**
- Add Logo to the header bar
- Apply branded gradient to the stepper header
- Glassmorphic card styling for step content areas

**8. Auth Pages — `Login.tsx`, `SignUp.tsx`, `StudentSignUp.tsx`, `TeacherSignUp.tsx`**
- Ensure all use `AuthPageLayout` with brand gradient backgrounds
- Logo visible on all auth pages

**9. Profile Page — `ProfilePage.tsx`**
- Add brand header with Logo
- Glassmorphic card styling
- Hub-appropriate color accents

**10. Schedule Pages — `StudentSchedule.tsx`, `TeacherSchedule.tsx`**
- Brand header with Logo
- Hub-colored lesson cards
- Glassmorphic card treatment

**11. Other Pages — `TeachWithUsPage.tsx`, `AboutPage.tsx`, `ForTeachersPage.tsx`**
- Verify Logo is visible (TeachWithUs already uses logo images)
- Consistent nav styling

**12. Global CSS — `src/index.css`**
- Add shared utility classes: `.brand-card` (glassmorphic), `.brand-header` (gradient), `.brand-sidebar-item` (active glow)
- Ensure dark mode variants for all new classes

### Technical Details

**Files to modify (Part 1 — Policy):**
- `src/hooks/useCancelReschedule.ts`
- `src/components/student/LessonManagementModal.tsx`
- `src/components/student/UpcomingClassesTab.tsx`
- `src/components/classroom/ClassroomConnection.tsx`

**Files to modify (Part 2 — Branding):**
- `src/components/teacher/professional/ProfessionalNav.tsx`
- `src/components/teacher/professional/ProfessionalHub.tsx`
- `src/components/admin/AdminSidebar.tsx`
- `src/pages/AdminDashboard.tsx`
- `src/pages/ContentCreatorDashboard.tsx`
- `src/pages/ProfilePage.tsx`
- `src/pages/student/StudentSchedule.tsx`
- `src/pages/teacher/TeacherSchedule.tsx`
- `src/index.css`

**No database changes needed.** The lessons table already has `status`, `cancellation_reason`, `reschedule_count`, and `reschedule_history` columns.

