## Diagnosis

The classroom is still purple because the active bookings in `class_bookings` are saved with `hub_type = 'academy'`, and the classroom falls back to Academy whenever it cannot infer a hub from the actual lesson. The live stage also still contains hardcoded purple styles in the teacher dock.

The lessons are not reliably visible in the classroom because bookings point to `class_bookings.lesson_id -> public.lessons`, while the real Master Library lives in `public.curriculum_lessons`. The classroom seeds a placeholder lesson (`Magic Forest: Lesson 1`) and only loads Master Library content after the teacher manually opens the Library drawer. Also, the drawer only reads `is_published = true`, so draft creator lessons such as the currently open Playground lesson are hidden.

## Plan

1. Create one classroom lesson resolver
   - Add a shared resolver that accepts a booking and returns:
     - canonical hub: `playground | academy | professional`
     - lesson title
     - raw slide array from `curriculum_lessons.content.slides`
     - lesson id when available
   - Resolution order:
     1. `classroom_sessions.lesson_id` if it points to a Master Library row
     2. `lessons.curriculum_lesson_id`
     3. best matching `curriculum_lessons` by hub/title when no direct link exists
     4. booking hub only as fallback

2. Auto-link the Master Library into `/classroom/:bookingId`
   - Update `UnifiedClassroomPage` to fetch the linked Master Library lesson together with the booking.
   - Pass `lessonId`, `lessonTitle`, `lessonSlides`, and resolved `hubType` into `TeacherClassroom` and `StudentClassroom`.
   - Stop relying on the placeholder `Magic Forest` lesson when real library slides exist.

3. Fix classroom sync so real lesson content persists
   - Extend `useClassroomSync` / `classroomSyncService` to store `lesson_id` when seeding a session.
   - Only preserve existing session slides if they belong to the same lesson; otherwise replace stale placeholder slides with the current Master Library lesson.
   - When the teacher loads a lesson from the Library drawer, persist both `lesson_id` and raw slides.

4. Make the Library drawer show the real Master Library
   - Change `LibraryDrawer` to support classroom mode where teachers can see published lessons plus their own draft/creator lessons when allowed by RLS.
   - Add hub filtering from the active classroom hub but keep an “All hubs” option/search so lessons do not appear missing.
   - Return the selected lesson id along with slides and title.

5. Remove the purple frame and hardcoded purple controls
   - Replace Academy fallback styling in `TeacherClassroom`, `StudentClassroom`, `StageContent`, and `TeacherControlDock` with hub-aware semantic tokens.
   - Playground uses orange/yellow, Academy uses purple only when the lesson really is Academy, Success uses emerald/mint.
   - Remove hardcoded `bg-[#6B21A8]`, `border-purple-*`, and purple classroom background defaults from the shared classroom shell.

6. Validate from the root
   - Query live booking/session/library rows after changes to confirm session rows carry `lesson_id` and non-placeholder slides.
   - Open the classroom route and verify:
     - no purple frame for Playground/Success lessons
     - the slide count/title matches `curriculum_lessons`
     - Library opens inside the classroom and lists Master Library lessons
     - selecting a lesson changes the live stage and sync payload

## Technical notes

- No new lesson table will be introduced. `curriculum_lessons` remains the canonical Master Library.
- I will not write curriculum content into `public.lessons`; that table is only used for booked session scheduling/back-compat links.
- If a DB schema link is required, I will add it via a migration rather than asking you to run SQL manually.