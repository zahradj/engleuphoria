

# Enhanced Green Room + Calendar Visibility Fix + Test Credit Bypass

## What's Changing

### 1. Enhanced Green Room (PreFlightCheck)
The current Green Room is functional but basic. Enhancements:
- **Auto-start checks**: Camera and mic tests begin automatically on mount instead of requiring manual clicks
- **Animated progress ring**: Visual progress indicator showing 0/3 → 3/3 checks completed
- **Hub-branded video frame**: Ring around camera preview matches hub color
- **Participant waiting status**: Show "Your teacher/student is connecting..." text based on role
- **Success Hub intention input**: For `professional` hub, show a "Set your intention for today" text input
- **Smoother transitions**: Animate check items as they pass with subtle scale/fade effects
- **Better layout**: Larger video preview, cleaner grouping of device selectors

### 2. Calendar Slot Visibility Fix (Student Side)
**Problem**: The `BookMyClassModal` gates booking behind `hasCredits` check at line 84 (`totalCredits > 0 || trialAvailable`). When a student has 0 credits, `handleBookSlot` returns early at line 157.

**Fix**: 
- **Show all available slots regardless of credit balance** — students should always *see* the calendar
- Move the credit check from the fetch/display phase to the **confirm booking** step only
- When a student with 0 credits clicks "Book", show a prompt: "You need credits to book. Purchase now?" with a link to `/pricing`
- Trial lessons remain always bookable (already handled)

### 3. Hub-Colored Open Slots on Teacher Calendar
**Current**: All open slots show green (`text-success`, `border-success`).
**Fix**: Color open slots by hub type:
- Orange for Playground (30-min slots)
- Blue for Academy (60-min slots or default)  
- Green for Success Hub
- Since teacher_availability doesn't store hub type, use **duration as proxy**: 30m → Orange (Playground), 60m → Blue (Academy default)
- Add a small hub badge on each open slot showing the duration context

### 4. Admin "Add Test Credits" Button
Add a quick action in the admin dashboard to grant test credits to any user:
- New component in `src/components/admin/TestCreditButton.tsx`
- Simple button that inserts/updates `student_credits` for the current admin user (or a specified test email)
- Grants 100 test credits per click
- Only visible to admin role users

### 5. Real-Time Booking Sync (Already Implemented)
The `useTeacherAvailability` hook already has Supabase Realtime subscription on `teacher_availability` (lines 122-143). When a booking occurs, the slot update triggers a refetch. This is already working — no changes needed.

---

## Technical Details

### Files to Modify

**`src/components/classroom/PreFlightCheck.tsx`**
- Auto-trigger `runCameraCheck()` and `runMicCheck()` on mount via `useEffect`
- Add animated progress ring (3 checks: camera, mic, speaker)
- Add hub-colored ring around video preview
- Add role-based waiting message
- Add intention input for Success Hub (`professional` type)
- Improve spacing and visual hierarchy

**`src/hooks/usePreFlightCheck.ts`**
- Add `autoStart` flag that triggers camera + mic checks automatically
- No major logic changes needed

**`src/components/student/BookMyClassModal.tsx`**
- Remove `hasCredits` guard from `handleBookSlot` early return (line 157)
- Instead, when `!hasCredits`, show a credit purchase prompt dialog before proceeding
- Keep slot display independent of credit balance
- Trial bookings bypass credit check (already works)

**`src/components/teacher/calendar/modern/CalendarCore.tsx`**
- Color open slots by duration: 30m → orange gradient, 60m → blue gradient (instead of all-green)
- Add small duration/hub badge on open slot cards

**`src/components/admin/TestCreditButton.tsx`** (new file)
- Button component: "Add 100 Test Credits"
- Calls `supabase.from('student_credits').upsert(...)` for the admin's own user ID
- Shows toast on success

**`src/pages/AdminDashboard.tsx`** (or equivalent admin layout)
- Import and render `TestCreditButton` in the admin tools section

### No Database Changes Needed
- `student_credits` table already exists with `total_credits` column
- The `consume_credit` RPC already handles balance checks
- Real-time subscriptions are already active

