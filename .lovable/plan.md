

# Professional Buffer System: Smart Timer + Pricing Labels + Wrap-Up Mode

## Overview

Implement the "Professional Buffer" system: relabel session durations (25-min / 55-min), add a color-coded Smart Timer to the classroom, auto-trigger the Wrap-Up dialog, and update pricing cards. The database continues to block the full 30/60-minute window to prevent double-booking.

---

## What Already Exists

- **Database**: `teacher_availability.duration` has a CHECK constraint `(duration = ANY (ARRAY[30, 60]))` -- slots are stored as 30/60 but teaching time is 25/55
- **`availabilityInsert.ts`**: Already has `to25or55` / `to30or60` mapping with fallback logic
- **Landing page pricing**: `PricingSection.tsx` already shows "25 minutes" / "55 minutes" and EUR prices
- **Classroom timers**: `UnifiedTopBar.tsx`, `OneOnOneTopBar.tsx`, and `ClassStatusBar.tsx` all display elapsed time but have **no color-coded warnings**
- **Lesson Wrap-Up**: `LessonWrapUpDialog.tsx` exists and is wired into `TeacherClassroom.tsx` via a manual "Wrap-Up" button in the top bar

---

## Changes

### 1. Booking & Calendar Labels (UI-only, no DB change)

**Files to modify:**
- `src/components/teacher/calendar/TimeSlotActionModal.tsx` -- Change the duration selector buttons from "30 min" / "60 min" to "25-min Focused Session" / "55-min Deep Dive". The actual `duration` value sent to the DB stays 30/60 (the CHECK constraint requires it). Add a small helper text: "Includes 5-min teacher buffer."
- `src/components/student/BookMyClassModal.tsx` -- When displaying available slots, show duration as "25 min" or "55 min" (subtract 5 from the stored value). Label them "Focused Session" or "Deep Dive" based on the `duration` field.
- `src/components/student/StudentBookingCalendar.tsx` -- Same relabeling for slot cards.

### 2. Smart Timer with Color Phases

**New file:** `src/hooks/classroom/useSmartTimer.ts`

A hook that wraps the existing `useClassroomTimer` and adds phase detection:

```
Input: classTime (seconds), sessionDuration (25 | 55)
Output: { phase, phaseColor, phaseLabel, shouldPulseWrapUp }

Phases for 25-min session:
  - "normal"  (0:00 - 19:59) -> default gradient text
  - "warning" (20:00 - 22:59) -> amber/yellow
  - "urgent"  (23:00 - 24:59) -> red + pulse
  - "overtime" (25:00+)       -> red + steady glow

Phases for 55-min session:
  - "normal"  (0:00 - 44:59) -> default gradient text
  - "warning" (45:00 - 49:59) -> amber/yellow
  - "urgent"  (50:00 - 54:59) -> red + pulse
  - "overtime" (55:00+)       -> red + steady glow
```

`shouldPulseWrapUp` becomes `true` at the "urgent" phase.

**Files to modify:**

- `src/components/classroom/unified/UnifiedTopBar.tsx` -- Import `useSmartTimer`. Apply `phaseColor` to the timer text via dynamic className (replace the static gradient). When `phase === 'overtime'`, show a small "OVERTIME" badge next to the timer.

- `src/components/classroom/oneonone/OneOnOneTopBar.tsx` -- Same smart timer integration. Apply color to the `text-2xl font-mono` timer div.

- `src/components/classroom/unified/components/ClassStatusBar.tsx` -- Accept a `sessionDuration` prop (default 25). Pass the teaching duration (25 or 55) as `totalSec` (in seconds: 1500 or 3300) instead of the current hardcoded 1800. The progress bar will naturally reflect the teaching window.

### 3. Automated "Save Session Notes" Pulse

**Files to modify:**

- `src/components/teacher/classroom/ClassroomTopBar.tsx` -- The existing "Wrap-Up" button already exists. Add a `shouldPulse` prop. When true (from `useSmartTimer.shouldPulseWrapUp`), apply a pulsing animation (`animate-pulse` + ring effect) to make the button visually urgent. Change button text to "Save Session Notes" during the pulse phase.

- `src/components/teacher/classroom/TeacherClassroom.tsx` -- Pass the smart timer phase data down to `ClassroomTopBar`. When `phase === 'urgent'` or `phase === 'overtime'` and `isTeacher`, auto-open the `LessonWrapUpDialog` (only once, using a ref to prevent repeated opens). The teacher can dismiss it, but the pulsing button remains as a reminder.

### 4. Pricing Label Updates

**File to modify:** `src/components/landing/PricingSection.tsx`

Update the `pricingPlans` array:

| Current | New |
|---------|-----|
| name: "Quick Session" | name: "25-Minute Focused Quest" |
| name: "Full Lesson" | name: "55-Minute Deep Dive" |
| price: 7 | price: 7.50 |
| price: 14 | price: 15 (Academy) / 20 (Professional) |

Since pricing currently does not differentiate by student level, add a note under the 55-min card: "Academy: 15.00 EUR / Professional: 20.00 EUR". The 25-min card shows 7.50 EUR.

Update the `description` fields:
- 25-min: "A focused burst of learning -- perfect for kids and busy schedules"
- 55-min: "Our signature deep-dive session for comprehensive mastery"

Also update `pricePerMinute` calculations accordingly.

### 5. Teacher Earnings Label

**File to modify:** `src/components/dashboard/teacher/TeacherEarningsTracker.tsx`

The current text says "You earn 4 EUR for each completed 25-minute lesson." This stays consistent with the new labeling -- no change needed here as it already references 25 minutes.

---

## Files Summary

| Action | File | What Changes |
|--------|------|--------------|
| Create | `src/hooks/classroom/useSmartTimer.ts` | Phase detection hook for timer color and wrap-up pulse |
| Modify | `src/components/teacher/calendar/TimeSlotActionModal.tsx` | Relabel duration buttons to "25-min Focused" / "55-min Deep Dive" |
| Modify | `src/components/student/BookMyClassModal.tsx` | Display teaching duration (subtract 5) with session labels |
| Modify | `src/components/classroom/unified/UnifiedTopBar.tsx` | Apply smart timer colors to classroom timer |
| Modify | `src/components/classroom/oneonone/OneOnOneTopBar.tsx` | Apply smart timer colors to 1-on-1 timer |
| Modify | `src/components/classroom/unified/components/ClassStatusBar.tsx` | Accept sessionDuration prop, use teaching time as totalSec |
| Modify | `src/components/teacher/classroom/ClassroomTopBar.tsx` | Add pulsing animation to Wrap-Up button |
| Modify | `src/components/teacher/classroom/TeacherClassroom.tsx` | Wire smart timer, auto-open wrap-up at urgent phase |
| Modify | `src/components/landing/PricingSection.tsx` | Update names, prices, descriptions |

---

## No Database Changes Required

The `teacher_availability.duration` CHECK constraint stays as `(30, 60)`. The "Professional Buffer" is purely a UI/UX layer:
- Database blocks the full 30/60 minutes (no double-booking)
- UI shows 25/55 minutes as the "teaching time"
- Smart Timer alerts the teacher to wrap up before the buffer window

