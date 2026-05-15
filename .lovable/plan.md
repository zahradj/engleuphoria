# Cycle 1 — Audit + Fill Gaps

Most of phases 1, 2, 3, and 5 already exist. Plan only touches what's actually missing or broken. **Placement Test files will not be touched.**

---

## Phase 1 — Profile audit (read-only, ~no code)

Verify each writeback exists:

| Field | Source | Target |
|---|---|---|
| `age`, `date_of_birth` | DemographicsPhase | `student_profiles.age` ✅ |
| `hub_type` | hubAssignment.ts | `student_profiles.hub_type` ✅ |
| `final_cefr_level` | placement scoring | `student_profiles.final_cefr_level` |
| `long_term_goal`, `learning_reason` | onboarding | `student_profiles.long_term_goal` ✅ |
| `placement_test_completed_at/score/total` | placement finish | `student_profiles.placement_test_*` ✅ |

Action: a single SQL read pass to confirm a representative student row has all five filled. If any column is empty for live users, surface the gap in the closing summary; do NOT edit placement code.

---

## Phase 2 — Teacher Roster Strip

Add a compact info strip under each student name in the teacher's "Upcoming Classes" card.

- **Component**: `src/components/teacher/UpcomingClassesList.tsx` (or whichever component renders bookings on `TeacherDashboard`).
- **Data**: extend the existing query joining `class_bookings` → `student_profiles` (id = `student_id`) to also select `hub_type`, `final_cefr_level`, `long_term_goal`, `age`.
- **UI**: hub-color chip (Playground/Academy/Success) + CEFR badge (e.g. `B1`) + truncated goal. Glassmorphic, semantic tokens.
- **RLS check**: confirm `student_profiles` SELECT policy lets a teacher read profiles of students who have a booking with them (likely already done; if not, add a security-definer helper `teacher_can_view_student(student_id)`).

---

## Phase 3 — Synchronized Classroom polish

Existing: `classroom_states` table + Realtime channel "1-on-1 Sync Engine" (per memory).

Add what's missing:

1. **Start Bell** — when teacher row in `classroom_states` flips status to `waiting`/`live`:
   - Both screens: `<EntryCountdown />` overlay (30s, animated ring) + 1× audio bell (`/public/sounds/bell.mp3`, generate if missing via existing TTS bucket).
   - Teacher triggers status change on entering classroom; student listens via existing Realtime subscription.
2. **End Switch** — teacher "End Lesson" button:
   - Updates `classroom_states.status = 'ended'` (add column if missing — see Technical).
   - Student's `useEffect` on that change: stop video tracks, then `navigate(/feedback/:bookingId)`.
3. No new tables — extend `classroom_states` only.

---

## Phase 4 — AI Game Generator (NEW)

### DB
New table `live_class_activities` — server pushes here; both clients subscribe via Realtime.
```text
- id, classroom_session_id (text, fk-ish to classroom_states.session_id)
- teacher_id, prompt, format ('mcq'|'roleplay'|'fill_blank')
- payload jsonb (questions / scenario)
- created_at, dismissed_at
```
RLS: only teacher of session can INSERT; teacher + booked student can SELECT.

### Edge Function `generate-class-activity`
- POST `{ session_id, prompt }` → calls Gemini direct (`gemini-2.5-flash`) with system prompt:
  > "You are an English-teaching activity designer. Given a topic, choose the BEST format among MCQ (5 questions), short roleplay (2 turns), or fill-in-blank (5 items). Return JSON: `{ format, title, items: [...] }`."
- Validates JSON, inserts into `live_class_activities`. Realtime fires automatically.

### UI
- Teacher: "Generate Activity" button in classroom toolbar → modal with prompt input + spinner.
- Student: `<LiveActivityOverlay />` listens to inserts on `live_class_activities` filtered by session_id; renders one of three sub-components (MCQ / Roleplay / FillBlank). Teacher sees same overlay + "Dismiss" which sets `dismissed_at`.

---

## Phase 5 — Feedback loop + 90-day Janitor

### Feedback (audit only)
- `post_class_feedback` (teacher → student) ✅ exists.
- `lesson_feedback_submissions` (student → teacher) ✅ exists.
- Verify both forms are reachable post-lesson. Add the missing direction's form if absent (likely the student-side one is wired via `PostLessonSummary.tsx`).

### Janitor — pg_cron
Single daily job at 03:00 UTC that runs `public.purge_stale_data()`:
```text
DELETE post_class_feedback           WHERE created_at < now() - interval '90 days';
DELETE lesson_feedback_submissions   WHERE created_at < now() - interval '90 days';
DELETE classroom_timeline_events     WHERE created_at < now() - interval '90 days';
DELETE classroom_sessions            WHERE created_at < now() - interval '90 days';
DELETE classroom_states              WHERE updated_at < now() - interval '90 days';
DELETE live_class_activities         WHERE created_at < now() - interval '90 days';
DELETE system_errors                 WHERE status='resolved' AND created_at < now() - interval '90 days';
```
- Function is `SECURITY DEFINER`, `search_path = public`.
- Schedule via `cron.schedule('purge-stale-data','0 3 * * *', $$ select public.purge_stale_data(); $$)`. (Plain SQL call — no pg_net needed since we run inside Postgres.)

---

## Out of scope / untouched

- `src/components/placement/**` — frozen, no edits.
- `generate-placement-test` edge function.
- Onboarding wizard step components.

## Technical notes

- Migrations: 3 small ones (extend `classroom_states` if needed, create `live_class_activities` + RLS, create `purge_stale_data` function + cron).
- pg_cron job is created via the **insert** (data-only) path, not migration — per project rule that user-specific schedule SQL shouldn't be replayed on remix.
- `GEMINI_API_KEY` already configured. No new secrets.
- All UI uses existing semantic tokens + glassmorphism.
- Files likely edited (not exhaustive): `TeacherClassroomPage.tsx`, `UnifiedClassroomPage.tsx`, `EnhancedUpcomingClassesTab.tsx` (or teacher-side equivalent), `PostLessonSummary.tsx`. New: `EntryCountdown.tsx`, `LiveActivityOverlay.tsx`, `GenerateActivityButton.tsx`, edge function `generate-class-activity`.