# Diagnosis

I scanned the classroom flow and found two distinct, confirmed problems.

## Problem 1 — "Something went wrong" when entering the classroom

Runtime error from the preview:

```
Error: Rendered more hooks than during the previous render.
  at UnifiedClassroomPage (src/pages/UnifiedClassroomPage.tsx)
```

Root cause: `src/pages/UnifiedClassroomPage.tsx` calls a **second** `useQuery` (the lesson resolver, line 164) **after** six conditional `return` statements (lines 63, 74, 78, 82, 95, 132). On the first render `booking` is `undefined`, the component returns early at line 82 (`bookingLoading`), and the second `useQuery` is never reached. On the next render `booking` is defined, the early return is skipped, and React suddenly sees an extra hook — which violates the Rules of Hooks and crashes the page. The error boundary then shows the generic "Something went wrong" screen until the user clicks "Try again".

## Problem 2 — Booked lessons don't appear automatically on the teacher's "Next lesson" tab

`src/components/teacher/dashboard/LessonsListCard.tsx` queries `class_bookings` with React Query but does **not** subscribe to Supabase Realtime. The card only refetches on mount or manual refresh, so newly booked lessons stay invisible until the teacher reloads the page.

---

# Fix

## 1. `src/pages/UnifiedClassroomPage.tsx`

Move the second `useQuery` (the `resolveBookingLesson` call) up next to the first one, before any conditional `return`. Gate it with `enabled: !!booking?.id` so it stays idle until the booking is loaded, and guard `booking.id` access with optional chaining. This keeps the hook count identical on every render and removes the crash.

No behavioral change for the user beyond the page actually loading.

## 2. `src/components/teacher/dashboard/LessonsListCard.tsx`

Add a Supabase Realtime subscription on the `class_bookings` table inside a `useEffect`. On any `INSERT` / `UPDATE` / `DELETE` event whose `teacher_id` matches the current teacher, invalidate the React Query cache for this card so the next lesson appears within ~1 second of being booked. Clean up the channel on unmount.

No UI changes — only the data freshness behavior.

---

# Out of scope

- No database/RLS migrations needed; the existing `class_bookings` policies already allow the teacher to read their own rows, and Realtime is enabled on this table elsewhere in the app.
- No changes to `StudentClassroomPage` or `TeacherClassroomPage` — those don't show the runtime error and use a single, top-level `useQuery`.
