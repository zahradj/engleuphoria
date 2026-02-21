

# Booking Engine Audit + "Glass Calendar" Visual Upgrade

## Assessment of Existing System

Your booking engine is **already fully functional** with a robust architecture:

- **`class_bookings` table** exists with `student_id`, `teacher_id`, `session_id`, `meeting_link`, `scheduled_at`, `status`, etc.
- **RLS policies** are in place (students can insert their own bookings, participants can view their own, admins can manage all)
- **`BookMyClassModal.tsx`** already implements:
  - Atomic slot locking (`UPDATE ... WHERE is_booked = false`)
  - Credit consumption via `consume_credit` RPC
  - No-credits warning with a destructive alert
  - Confetti celebration on success
  - Slot-taken error toast with auto-refresh
  - Auto-generated `session_id` and `meeting_link` via database trigger

**There is no need** to create a separate `bookings` table -- `class_bookings` already does everything the suggested SQL would do, and more.

## What This Plan Actually Does

Since the booking logic is solid, the real value is in **upgrading the booking visual experience** to match the cinematic V6 aesthetic: a glass calendar, glowing "Time Pills," and polished transitions.

---

## 1. Glass Calendar + Time Pills

### Modify: `src/components/student/StudentBookingCalendar.tsx`

**Current state:** Standard shadcn Calendar + plain Card list for time slots.

**Upgrade to:**

- **Glass Calendar Card**: Replace the plain Card wrapper with a `backdrop-blur-xl bg-white/5 border-white/10` glassmorphism container (dark) or `bg-white/70 border-gray-200/50` (light). Import `useThemeMode` for dual-mood.

- **"Time Pills" replacing the slot list**: Instead of full Card rows per slot, render each time slot as a pill-shaped button:
  - Default state: `bg-slate-700/40 text-slate-300 border-slate-600` (dark) / `bg-slate-100 text-slate-700 border-slate-200` (light)
  - Selected/hover state: `bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]` -- the "Electric Indigo" glow
  - Booked/disabled state: `opacity-40 cursor-not-allowed`
  - Shape: `rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200`
  - Display: `{formatTime(slot.startTime)}` with teacher name as a small label below

- **Layout change**: Time pills arranged in a flowing `flex flex-wrap gap-2` grid instead of a vertical stack

- **Selected slot detail panel**: When a pill is clicked, show a confirmation panel below with teacher name, duration badge, and the "Book Now" button -- rather than booking immediately on click

### Modify: `src/components/student/BookMyClassModal.tsx`

- **Glass modal header**: Add `backdrop-blur-md` to the gradient header
- **Film grain overlay**: Add the same SVG noise filter used in the hero section, at very low opacity (0.02)
- **No-credits state**: Upgrade from plain destructive box to a glass-styled warning panel with a "Purchase Credits" CTA button that navigates to the pricing page
- **Success state**: Add a subtle radial gradient glow behind the CheckCircle icon, matching the Euphoria Ring aesthetic

---

## 2. Credit Check Enhancement

### Modify: `src/components/student/BookMyClassModal.tsx`

The credit check already exists and works. Two small improvements:

- When `hasCredits` is false, add a **"Get Credits"** Button that navigates to `/student?tab=packages` so the student can purchase immediately without closing the modal
- Show the **remaining credit count** as a badge in the modal header: `{totalCredits} credits remaining`

---

## 3. Error Toast Wording Update

### Modify: `src/components/student/BookMyClassModal.tsx`

Update the slot-taken toast to match the requested copy:
- Current: "Someone just booked this slot. Please choose another time."
- New: "Oops! This slot was just taken. Please try another time."

---

## Files Summary

| Action | File | Purpose |
|--------|------|---------|
| Modify | `src/components/student/StudentBookingCalendar.tsx` | Glass calendar + Time Pills UI |
| Modify | `src/components/student/BookMyClassModal.tsx` | Glass modal, credit badge, Get Credits CTA, toast wording |

## What Is NOT Needed

- **No new `bookings` table** -- `class_bookings` already handles everything
- **No new RLS policies** -- already properly configured
- **No booking logic changes** -- atomic slot locking, credit consumption, confetti, and error handling are all already implemented and working
- **No new database migrations**

## Technical Notes

- The glass effect uses `backdrop-filter: blur()` which is GPU-accelerated and supported in all modern browsers
- Time Pills use CSS transitions only (no framer-motion overhead for hover states)
- The `useThemeMode` hook is imported for dual-mood styling, consistent with all other V6 sections
- No new dependencies required

