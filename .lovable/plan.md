# Classroom Sync + Branded Front Page

## Root cause #1 — Student sees "Waiting for teacher" forever

The teacher creates the row in `classroom_sessions` with `room_id = booking.id` (the `class_bookings` primary key), because `UnifiedClassroomPage` passes `classId={booking.id}` and `TeacherClassroom` uses that verbatim as `roomName`.

But the student-side RLS policy on `classroom_sessions` only matches:
- `cb.classroom_id::text = room_id`, OR
- `cb.session_id = sessions.id::text`

Neither column equals `booking.id`, so `getActiveSession()` returns `null`, the slide-index polling query also returns nothing, and the student stays stuck on the placeholder slide. Slide changes never sync because the student can never read the row.

### Fix — DB migration

Replace the student SELECT policy on `public.classroom_sessions` with one that ALSO accepts `cb.id::text = room_id`:

```sql
DROP POLICY IF EXISTS "Students with bookings can view their classroom sessions"
  ON public.classroom_sessions;

CREATE POLICY "Students with bookings can view their classroom sessions"
ON public.classroom_sessions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.class_bookings cb
    WHERE cb.student_id = auth.uid()
      AND (
        cb.id::text = classroom_sessions.room_id           -- NEW: matches booking.id
        OR cb.classroom_id::text = classroom_sessions.room_id
        OR cb.session_id = classroom_sessions.id::text
      )
      AND cb.status <> ALL (ARRAY['cancelled','refunded'])
  )
);
```

(Teacher/admin policies are already correct and unchanged.)

## Root cause #2 — Slide 1 has no Engleuphoria branding

`LibraryDrawer.onSelectLesson` only forwards `(slides, title)`. The teacher's first slide is just the AI's vocab intro ("New Words for New Friends!") with no logo, hub badge, level chip, unit number, or lesson number.

### Fix — Auto-prepend a `front_page` slide in `TeacherClassroom.tsx`

Inside the existing `<LibraryDrawer onSelectLesson={...}>` handler (around line 739), if the loaded deck doesn't already start with a `front_page` / `title_page` slide, prepend a synthetic one built from the booking's `hubType` + lesson title + (when present) `level` / `unit_number` / `unit_title` / `subtitle` / first-slide cover image:

```ts
const first = mapped[0];
const meta = (selectedSlides as any)?.[0] || {};
const hasFront = first?.slide_type === 'front_page'
              || first?.slide_type === 'title_page'
              || first?.type === 'front_page';

const liveSlides = hasFront ? mapped : [
  {
    id: 'front-page',
    slide_type: 'front_page',
    type: 'front_page',
    title,
    topic: meta.topic,
    subtitle: meta.subtitle,
    level: meta.level || meta.cefr_level || meta.difficulty_level,
    hub: hubType,
    unitNumber: meta.unit_number ?? meta.unitNumber,
    unitTitle: meta.unit_title ?? meta.unitTitle,
    coverImageUrl: first?.imageUrl,
  },
  ...mapped,
];
```

The renderer (`DynamicSlideRenderer` → `FrontPageSlide`) already handles every one of those fields: full-bleed cover, dark cinematic overlay, Engleuphoria logo top-left, hub label + CEFR badge top-right, centered hero title with unit/lesson line and accent bar. No renderer changes needed.

After the patch, `currentSlide` indices stay in sync because the prepended slide is part of `lesson_slides`, which is broadcast to the student via `updateSharedDisplay` exactly like the rest of the deck.

## Files touched

- `supabase/migrations/<new>_fix_student_classroom_session_rls.sql` — the policy replacement above
- `src/components/teacher/classroom/TeacherClassroom.tsx` — front-page prepend in the LibraryDrawer handler

## Verification

1. Student joins an in-progress booking → classroom_sessions row is now visible to them, "Waiting for teacher…" disappears immediately.
2. Teacher hits Next → student's `current_slide_index` updates within ~1s (Realtime + 3s polling fallback).
3. Slide 1 of any newly-loaded lesson shows: Engleuphoria logo, hub badge ("Academy"), CEFR chip, "Unit X: …" line, big lesson title, accent bar — the cinematic FrontPageSlide.
