
# Steps 9, 10 & 11: Email Notifications + Booking System + Booking Calendar UI

## What Already Exists (Audit)

After thoroughly reviewing the codebase:

**Already built and working:**
- `RESEND_API_KEY` is configured as a Supabase secret
- `teacher_availability` table exists with all required columns (`id`, `teacher_id`, `start_time`, `end_time`, `is_available`, `is_booked`, `duration`, `lesson_id`, etc.)
- `class_bookings` table exists (the platform uses this, not a separate `bookings` table)
- `lesson_reminders` table exists with 24h/1h/15min reminder logic
- `send-lesson-reminders` edge function already handles class reminders via `get_pending_reminders()` RPC
- `StudentBookingCalendar.tsx` component exists with real-time subscriptions and slot selection UI
- `TeacherAvailability.tsx` exists with date/time slot creation for teachers
- `ClassScheduler` is already in the teacher dashboard under the "Schedule" tab

**Missing (needs to be built):**
1. `daily_lessons` table — does not exist; needed for the "Lesson Ready" email trigger
2. `notify-student-lesson` edge function — does not exist
3. "Book My Next Class" modal integration in the three student dashboards (Playground, Academy, Hub)
4. The `daily_lessons` table needs a database trigger to call the new email edge function

---

## What Will Be Built

### Step 9: Email Notification System

#### Part A — Database: `daily_lessons` table
A new `daily_lessons` table will be created to track when AI-generated lessons become ready for students. This is the table the email trigger will watch.

**Columns:**
- `id` (UUID, primary key)
- `student_id` (UUID, references `users`)
- `student_level` (text: `playground`, `academy`, `professional`)
- `title` (text)
- `content` (jsonb — stores the vocabulary, quiz, etc.)
- `generated_at` (timestamp, default now)
- `email_sent` (boolean, default false)

RLS: students can read their own rows; only the service role can insert.

#### Part B — Edge Function: `notify-student-lesson`
A new edge function that:
- Accepts a `POST` request with `{ student_id, lesson_title, student_level, student_email, student_name }` in the body
- Sends a beautiful branded HTML email via Resend:
  > *"Hi [Name]! Your personalized AI lesson for today is ready. Log in to your [Level] dashboard to start!"*
- Uses the same purple/branded email template style already established in `send-user-emails`
- Returns success/failure JSON

This function is called from the client (or a future Postgres trigger/webhook) whenever a new lesson is saved to `daily_lessons`.

#### Part C — Integration: Call the notification when a lesson is saved
The `useDailyPersonalizedLesson.ts` hook already fetches and caches AI lessons. After successfully saving a lesson result, it will be extended to invoke `notify-student-lesson` via `supabase.functions.invoke()` if this is the first time the student is seeing today's lesson (using the `email_sent` flag on the DB row to ensure the email fires only once).

#### Part D — Class Reminder (already exists — verified)
The `send-lesson-reminders` edge function already handles 1h-before class reminders using the `lesson_reminders` table and the `get_pending_reminders()` database function. No new work is needed here — this will be documented and confirmed working.

---

### Step 10: Booking & Scheduling — No New Tables Needed

The SQL in Step 10 proposes creating `teacher_availability` and `bookings` tables. Both already exist:
- `teacher_availability` — fully featured with RLS
- `class_bookings` — serves the same purpose as the proposed `bookings` table

No database migration is required. The existing schema is more advanced than what was proposed.

---

### Step 11: Booking Calendar UI

#### Part A — `BookMyClassModal.tsx` (new component)
A dialog/modal containing the already-built `StudentBookingCalendar` component, wrapped in:
- A `Dialog` from shadcn/ui
- A hook `useAvailableSlots` that fetches from `teacher_availability` where `is_available = true AND is_booked = false AND start_time > now()`
- An `onBookSlot` handler that:
  1. Updates `is_booked = true` on the `teacher_availability` row
  2. Inserts a new record into `class_bookings`
  3. Shows a confetti/celebration animation using `canvas-confetti`
  4. Shows a success toast: "🎉 Class booked! Check your email for a reminder."
  5. Invokes `notify-teacher-booking` (already exists) to notify the teacher

#### Part B — "Book My Next Class" button in each student dashboard
- **PlaygroundDashboard** — add a friendly, colorful "Book a Class!" button in the right panel above the `VirtualPetWidget`, opening `BookMyClassModal`
- **AcademyDashboard** — add a "Book a Slot" button in the Schedule tab and as a floating action in the Home tab, opening `BookMyClassModal`
- **HubDashboard** — add a "Schedule a Session" button in the right column next to the existing "Next Session" card, opening `BookMyClassModal`

---

## Technical Details

### Files to Create

| File | Purpose |
|------|---------|
| `supabase/migrations/[timestamp]_daily_lessons.sql` | Creates `daily_lessons` table with RLS |
| `supabase/functions/notify-student-lesson/index.ts` | New edge function: sends "Lesson Ready" email via Resend |
| `src/components/student/BookMyClassModal.tsx` | Dialog wrapping `StudentBookingCalendar` with confetti on success |

### Files to Modify

| File | Change |
|------|--------|
| `src/hooks/useDailyPersonalizedLesson.ts` | After saving AI lesson, invoke `notify-student-lesson` edge function once per day per student |
| `src/components/student/dashboards/PlaygroundDashboard.tsx` | Add "Book a Class!" button + `BookMyClassModal` |
| `src/components/student/dashboards/AcademyDashboard.tsx` | Add "Book a Slot" CTA in home tab + `BookMyClassModal` |
| `src/components/student/dashboards/HubDashboard.tsx` | Add "Schedule a Session" button in right sidebar + `BookMyClassModal` |

### No New Secrets Required
`RESEND_API_KEY` is already configured.

### Email Design
The "Lesson Ready" email will match the existing purple EnglEuphoria brand template. Level-specific messaging:
- Playground: "🌟 Your adventure lesson for today is ready!"
- Academy: "🔥 Your daily challenge just dropped. Don't miss it!"  
- Professional: "📊 Your personalized business English briefing is ready."

### Booking Flow (No Double-Booking)
The atomic update on `teacher_availability` (`is_booked = true WHERE is_booked = false`) prevents race conditions where two students book the same slot simultaneously.

### Celebration Animation
`canvas-confetti` is already installed. On successful booking, a burst of confetti fires for 2 seconds before the modal closes.

### Existing Reminder System
The `send-lesson-reminders` edge function is fully functional. To activate it on a schedule, a `pg_cron` job can be set up via the Supabase SQL editor — this will be provided as an optional SQL snippet for the user to run manually in the Supabase dashboard.
