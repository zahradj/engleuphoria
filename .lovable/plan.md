
# Fix Student Credits Not Showing + Enforce System Integrity

## What the audit found
The 100 credits were added to `public.student_credits`, but the student dashboard and booking flow do not read from that table.

Right now, the student UI still uses `usePackageValidation`, which only loads `student_package_purchases` through `lessonPricingService.getStudentPackages()`. So:

- DB credit balance exists in `student_credits`
- Dashboard credit widgets still show `0`
- Booking logic still blocks the student because it checks package-based credits only

This is why the credit addition appears “not implemented” from the student side.

## Implementation plan

### 1. Unify student credit source
Create a single student credit hook/service that reads real usable balance from `student_credits`:

- available credits = `total_credits - used_credits - expired_credits`
- use this as the source of truth for dashboard credit displays and booking eligibility
- keep package data separate if package history is still needed for purchases/history UI

### 2. Replace package-only gating in student flows
Update these student-facing areas to use the real credit balance:

- `src/hooks/usePackageValidation.ts`
- `src/components/student/CreditDisplay.tsx`
- `src/components/student/DashboardTab.tsx`
- `src/components/student/dashboards/HubDashboard.tsx`
- `src/pages/student/BookLesson.tsx`
- `src/components/student/BookMyClassModal.tsx`
- `src/components/student/dashboard/StudentPackagesSection.tsx`

Planned behavior:
- dashboard shows actual available credits from `student_credits`
- booking page shows the real balance
- booking is allowed when real available credits > 0, or when a trial is available
- if no credits, calendar can still remain visible where intended, but confirm-step blocking must use the real balance

### 3. Add refresh/realtime so newly granted credits appear immediately
The current credit UI has no subscription to `student_credits`.

Add either:
- Supabase realtime subscription on `student_credits` for the current student, or
- React Query invalidation after booking/admin credit actions

Best approach here: use realtime + query invalidation fallback so manual admin credit grants appear in the student dashboard without needing a full refresh.

### 4. Keep package support without confusing the balance
Do not remove package purchase records if they are still needed for package products/history.

Instead:
- separate “credit balance” from “package list”
- if package cards are shown, make sure they represent package inventory/history only
- the main “Available Credits” display must use `student_credits`, not package rows

### 5. Harden booking deduction path
The booking modal currently calls `consume_credit`, but the pre-check is still tied to package logic.

Update the booking flow so:
- pre-check uses real balance from `student_credits`
- `consume_credit` result is checked explicitly
- if `consume_credit` returns `false`, booking aborts cleanly with a purchase message
- avoid showing success if credit consumption failed

### 6. Preserve system integrity requirements from your prompt
During the implementation, keep these intact and verify against the existing code:

- Hub glassmorphism, mesh gradients, and hub color coding stay preserved
- 5-day cancel/reschedule policy remains active (`useCancelReschedule.ts` already contains the 120-hour rule)
- Green Room / `PreFlightCheck` remains the classroom gate for both teacher and student
- teacher route remains `/teacher` and not `/admin` (`src/App.tsx` already reflects this)
- hub teacher cards/badges in `FindTeacher.tsx` remain intact

## Expected outcome after implementation
After this fix:

- Zahra’s student account will show the credited balance in the dashboard
- booking checks will recognize those credits
- the student will be able to book lessons using the credited amount
- future admin/test credit grants will appear in the UI reliably
- previous branding/routing fixes will remain preserved, not overwritten

## Technical notes
Root cause is architectural mismatch:
```text
Admin/test grants -> public.student_credits
Student dashboard/booking UI -> student_package_purchases only
```

Needed correction:
```text
Available balance + booking eligibility -> public.student_credits
Package catalog/history -> student_package_purchases
```

No schema change is necessarily required for the core fix. This is primarily a frontend data-flow correction, plus realtime/query refresh wiring.
