## Real-Time Live Classroom Sync + Annotation Layer

A new `/live-classroom/:sessionId` route gives teacher and student a synchronized view of any Playground/Academy/Success lesson, with a transparent annotation canvas overlaid on the existing `SlideRenderer`. Slide navigation, drawing strokes, laser-pointer position, and reward stars all broadcast through Supabase Realtime so both sides stay in lock-step.

### 1. Database (one migration)

New table `classroom_states` (persistent state, distinct from existing `classroom_sessions`):

```text
id              uuid pk
session_id      text unique         -- the URL :sessionId (booking id or ad-hoc room)
lesson_id       uuid                -- which lesson is loaded
teacher_id      uuid
current_slide_index  int default 0
active_media_state   jsonb default '{"playing":false,"position":0}'
student_rewards      int default 0
updated_at      timestamptz
```

- RLS: teacher (auth.uid = teacher_id) can `update`; both teacher and any authenticated user with the session row can `select`. Insert restricted to teacher.
- Add table to `supabase_realtime` publication and `REPLICA IDENTITY FULL` so postgres_changes fires.
- Strokes / laser / reward bursts are **not persisted** — they go through the Realtime broadcast channel only (cheap, ephemeral).

### 2. New hook: `useLiveClassroom`

`src/hooks/useLiveClassroom.ts`

Responsibilities:
- Subscribe to channel `live-classroom:{sessionId}`.
- `postgres_changes` listener on `classroom_states` row → exposes `currentSlideIndex`, `activeMediaState`, `studentRewards`.
- `broadcast` listeners for events: `stroke`, `stroke_end`, `clear`, `laser`, `reward`.
- Presence (teacher / student) for "connected" indicator.
- Returns `{ state, peers, isTeacher, setSlideIndex(i), sendStroke(p), sendLaser(p), clearStrokes(), sendReward() }`.
- `setSlideIndex` performs an `update` on `classroom_states` (RLS blocks students automatically); other writes are broadcast-only.

### 3. New page: `/live-classroom/:sessionId`

`src/pages/LiveClassroom.tsx` registered in `src/App.tsx` under `ImprovedProtectedRoute`.

Layout:
```text
┌──────────────────────────────────────────────────────────┐
│  Header: lesson title · presence dots · ⭐ count          │
├──┬──────────────────────────────────────────────────┬────┤
│T │                                                  │ S  │
│o │   <SlideRenderer slide={slides[idx]} />          │ l  │
│o │   <AnnotationOverlay />  (absolute, full canvas) │ i  │
│l │   <LaserDot x y />                                │ d  │
│b │                                                  │ e  │
│a │                                                  │ s  │
│r │                                                  │    │
└──┴──────────────────────────────────────────────────┴────┘
```

- Loads lesson + slides via existing lesson loader (same source as `PlaygroundDemo`/`AcademyDemo`).
- Reuses `SlideRenderer` from those demo modules → no duplicated slide code.
- Teacher sees Prev/Next buttons → `setSlideIndex`. Student's Prev/Next are hidden; their view auto-snaps via the `postgres_changes` subscription.
- Right-side slide list is read-only for student, clickable for teacher.

### 4. Annotation overlay

`src/components/live-classroom/AnnotationOverlay.tsx` — wraps a transparent `<canvas>` sized to the slide container.

- Pointer events captured locally; each stroke segment broadcast as `{ event: 'stroke', x, y, prevX, prevY, color, width, role }` (throttled to ~30 fps with rAF).
- Remote strokes drawn immediately on the same canvas.
- `Clear All` broadcasts `clear`; both sides wipe canvas.
- Tool palette (`AnnotationToolbar.tsx`):
  - Teacher: Laser Pointer, Pen (color picker: black/red/blue), Eraser-style Clear All.
  - Student: Pen only (single color).
- Laser pointer: while active, mousemove broadcasts `laser` events at ~20 Hz; remote side renders an absolutely-positioned red dot that fades out 800 ms after the last update. Laser is **not** drawn into the canvas.
- We use a hand-rolled canvas (no `react-sketch-canvas` dependency) to keep bundle small and to share the same canvas for remote strokes — but if the user prefers, we can swap in `react-sketch-canvas`.

### 5. Reward star + confetti

- Teacher toolbar has a ⭐ button → `sendReward()` increments `student_rewards` (DB update for persistence + broadcast `reward` for instant FX).
- On `reward` event, both sides:
  - Trigger `canvas-confetti` burst (already a small dep — add if missing).
  - Play `/sounds/tada.mp3` (add asset; use existing audio gate utility so autoplay rules are respected).
- Star count badge in header reflects `student_rewards`.

### 6. Routing & access

- Add `/live-classroom/:sessionId` to `src/App.tsx` inside `ImprovedProtectedRoute` (allowed roles: `teacher`, `student`).
- Page detects role from `useAuth` + checks `teacher_id` on `classroom_states`. If user is the teacher → teacher tools render; otherwise student tools.

### 7. Component reuse summary

| New file | Purpose |
|---|---|
| `supabase/migrations/<ts>_classroom_states.sql` | Table, RLS, realtime publication |
| `src/hooks/useLiveClassroom.ts` | Realtime state + broadcast API |
| `src/pages/LiveClassroom.tsx` | The route |
| `src/components/live-classroom/AnnotationOverlay.tsx` | Canvas + remote stroke renderer |
| `src/components/live-classroom/AnnotationToolbar.tsx` | Tool palette (teacher vs student) |
| `src/components/live-classroom/LaserDot.tsx` | Fading laser cursor |
| `src/components/live-classroom/RewardFx.tsx` | Confetti + tada sound |
| `public/sounds/tada.mp3` | Reward sound (placeholder asset) |

Edited:
- `src/App.tsx` — route registration.
- `package.json` — add `canvas-confetti` if not present.

### 8. Out of scope (v1)

- Persisting drawings between sessions (strokes are ephemeral).
- Multi-student rooms (single student model — matches existing 1-on-1 booking design).
- Audio/video — handled by existing call infrastructure.

### 9. Manual verification (after deploy)

1. Open `/live-classroom/<sessionId>` in two browsers, sign in as teacher in one, student in the other.
2. Teacher clicks Next → student snaps forward.
3. Teacher draws → student sees strokes; student draws → teacher sees them.
4. Teacher activates Laser → student sees red dot tracking.
5. Teacher clicks ⭐ → student screen erupts with confetti + "Ta-da!", star count increments on both sides.
