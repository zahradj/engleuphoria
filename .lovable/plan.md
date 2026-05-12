## Goal

Three workstreams for launch week:
1. **Intro slide parity** — Academy and Success lesson covers should match Playground's 50/50 image + level/unit/lesson/topic layout.
2. **Realtime End-Classroom sync** — when teacher ends, both teacher and student are routed to a Post-Lesson Summary page within ~1s, video torn down.
3. **Launch Week Audit** — fix the highest-risk gaps in payments, classroom sync, permissions, and AI failsafes.

---

## Workstream 1 — Unified Lesson Cover Slide

**Today**
- `PlaygroundCreator.tsx` renders an `intro` slide with a 50/50 image layout + topic/level metadata.
- `AcademyCreator.tsx` and `SuccessCreator.tsx` render `intro` slides as a plain "title + subtitle" section header (`{ type: 'intro', block: 'warmup', title, subtitle }`), no image, no level/unit/lesson chip.

**Change**
- Extract Playground's intro layout into a shared component `src/components/lesson-player/LessonCoverSlide.tsx` accepting `{ hub, levelLabel, unitNumber, lessonNumber, topic, imageUrl, themeTokens }`.
- Wire it into the renderers used by Academy and Success creators (the `case 'intro':` blocks at `AcademyCreator.tsx:1023` and `SuccessCreator.tsx:917`) and the corresponding student-facing player.
- Hub coating per workspace rules: Playground orange/yellow, Academy purple/lavender, Success emerald/mint. Same 50/50 split, image left or right depending on hub for subtle differentiation (configurable, default image-left).
- Default seed slide for new Academy/Success lessons becomes a populated cover (not "New section / —").

No DB changes; metadata (level, unit#, lesson#, topic) is already on `curriculum_lessons`.

---

## Workstream 2 — Realtime End-Classroom Sync

**Phase 1 — DB**
- Verify `classroom_sessions` has a `session_status` column with values `waiting | active | ended` (already referenced in `useSessionManager.ts` and `useLiveClassroomStatus.ts`). If `ended_at` is missing on any environment, add it. Enable Realtime replication on the table (`alter publication supabase_realtime add table public.classroom_sessions;` if not already).
- Add an index on `(room_id)` if missing for fast lookup.

**Phase 2 — Teacher action**
- `ClassroomTopBar` "End Classroom" handler → call a new `endClassroom(roomId)` in `useClassroomSession` that:
  1. Updates row: `session_status='ended', ended_at=now()` where `room_id = :roomId AND teacher_id = auth.uid()`.
  2. Tears down local WebRTC tracks via `videoService.leave()`.
  3. Navigates teacher to `/classroom/:roomId/summary`.

**Phase 3 — Realtime listener (shared)**
- In `UnifiedClassroomPage` (the parent both teacher and student mount), add a `useEffect`:
  ```ts
  const ch = supabase.channel(`session:${roomId}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'classroom_sessions', filter: `room_id=eq.${roomId}` },
      ({ new: row }) => {
        if (row.session_status === 'ended') {
          videoServiceRef.current?.leave();
          navigate(`/classroom/${roomId}/summary`, { replace: true });
        }
      })
    .subscribe();
  return () => supabase.removeChannel(ch);
  ```
- Guard against double-fire and handle late joins (on mount, also fetch the row once; if already `ended`, route immediately).

**Phase 4 — Post-Lesson Summary page**
- New route `/classroom/:roomId/summary` → `src/pages/PostLessonSummary.tsx`.
- Loads: lesson title, duration, slides covered, vocab earned, mistakes logged. Different CTAs per role (teacher: "Submit observations", student: "Continue to dashboard"). Hub-themed.

---

## Workstream 3 — Launch Week Audit (prioritized fixes)

Implement in this order; each is a small, isolated PR-style change:

### A. Money pipeline
- **Timezones**: ensure availability slots are stored UTC (verify `teacherAvailabilityService`), rendered in viewer's IANA tz via `timezoneUtils.ts`. Add a "Times shown in {tz}" badge above the booking grid.
- **Credit deduction**: confirm `class_bookings` insert triggers wallet decrement (Postgres trigger or RPC). If missing, add `deduct_credit_on_booking()` trigger.
- **Cancellation refund**: enforce the 120h / 5-day rule already in workspace memory; refund credit only if `start_time - now() >= interval '120 hours'`.

### B. Classroom experience
- **Slide sync**: extend the same Realtime channel from Workstream 2 to broadcast `current_slide_index`. Teacher writes; student subscribes (read-only).
- **Permissions**: gate `nextSlide`/`prevSlide` UI behind `userRole === 'teacher'`. Student renders read-only controls.
- **Mic/cam**: pre-flight `navigator.mediaDevices.getUserMedia` call before joining the room; on `NotAllowedError` show a hub-themed dialog with browser-specific instructions.

### C. AI engine failsafes
- Apply the same retry + graceful-overload pattern already used for `generate-curriculum-blueprint` to the other Gemini-backed functions (`ai-lesson-content-generator`, `unified-lesson-agent`, etc.).
- Add a 10s client-side timeout wrapper; on timeout show the AnglEuphoria spinner + "Oops, our AI is taking a coffee break — try again" toast with Retry.

---

## Files to touch (preview)

**Workstream 1**
- new: `src/components/lesson-player/LessonCoverSlide.tsx`
- edit: `src/pages/AcademyCreator.tsx`, `src/pages/SuccessCreator.tsx`, `src/pages/PlaygroundCreator.tsx` (extract), the matching student-side renderer.

**Workstream 2**
- migration: ensure column + realtime publication on `classroom_sessions`
- new: `src/pages/PostLessonSummary.tsx`, route in `App.tsx`
- edit: `src/hooks/useClassroomSession.ts`, `src/hooks/enhanced-classroom/useSessionManager.ts`, `src/components/teacher/classroom/ClassroomTopBar.tsx`, `src/pages/UnifiedClassroomPage.tsx`

**Workstream 3**
- edit: booking grid component, `teacherAvailabilityService.ts`, `timezoneUtils.ts`
- migration: cancellation/refund + credit-deduction triggers (only if missing)
- edit: classroom slide controller, AI client wrappers, edge functions list above

---

## Out of scope for this round
- Redesign of teacher/student dashboards
- New payment provider integration
- Localization beyond what's already in `src/translations`

After approval I'll start with Workstream 2 (the launch-blocker) unless you want a different order.
