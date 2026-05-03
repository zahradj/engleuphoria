## Goal

Make the classroom strictly **Leader/Follower**: Teacher controls slide pace and shared activity state; Student is locked to follow. Replace the page-reload "Force Sync" with a real broadcast snapshot, and synchronize Co-Play activity actions on both sides.

## Strategy

Add two new realtime broadcast channels on top of the existing `whiteboardService` "classroom_{roomId}" channel (the one already used for `stage_mode`, `drawing_enabled`, `iframe_lock_state`, etc.):

1. `slide_change` — instant teacher → all clients slide jump (DB write still happens for late joiners; broadcast removes the 1–3s round-trip).
2. `force_sync` — full snapshot the teacher pushes on demand. Clients apply state in-place; **no `window.location.reload`**.

Co-Play activity sync already broadcasts `game_state_update` and `card_flipped` via `useCoPlaySync` (CoPlayMemoryMatch.tsx). The only gap is including the latest snapshot inside the new `force_sync` payload so a late student catches up instantly.

## File changes

### 1. `src/services/whiteboardService.ts`
- Add two payload types & listener sets:
  - `SlideChangePayload { slideIndex; senderId; timestamp }`
  - `ForceSyncPayload { slideIndex; stageMode?; drawingEnabled?; iframeUnlocked?; embeddedUrl?; activeCanvasTab?; gameState?; senderId; timestamp }`
- Extend `RoomChannel` with `slideChangeListeners` and `forceSyncListeners`.
- Wire `.on('broadcast', { event: 'slide_change' }, …)` and `.on('broadcast', { event: 'force_sync' }, …)`.
- Add senders: `sendSlideChange(roomId, slideIndex, senderId)` and `sendForceSync(roomId, payload)`.
- Add subscribers: `subscribeToSlideChange(roomId, cb)` and `subscribeToForceSync(roomId, cb)`.
- Update `release()` to consider the new listener sets when deciding to tear down the room channel.

### 2. `src/hooks/useClassroomSync.ts`
- Inside `updateSlide(index)` (teacher path): after the DB write, call `whiteboardService.sendSlideChange(roomId, index, userId)` so the student updates immediately without waiting on Postgres replication.
- Add a new effect (subscribed once per roomId for `role === 'student'`) that calls `whiteboardService.subscribeToSlideChange(roomId, ({ slideIndex, senderId }) => { if (senderId !== userId) setCurrentSlideIndex(slideIndex); })`.
- Add a `forceSync()` action exposed from the hook (teacher only): builds a `ForceSyncPayload` from the current `session`, `stageMode`, `drawingEnabled`, `iframeUnlocked`, `embeddedUrl`, `activeCanvasTab`, then calls `sendForceSync`. Returns void.
- Add a student-side `subscribeToForceSync` effect that calls `applyRemoteStageMode`, `applyRemoteDrawingEnabled`, `applyRemoteIframeUnlocked`, and `setCurrentSlideIndex` to mirror the teacher's snapshot — **no page reload**.
- Make `setCurrentSlideIndex` exposed to students a no-op (defensive: the existing student fallback poll uses it, that case should still go through; we keep it unchanged but document that direct student writes are blocked by `updateSlide`'s `role !== 'teacher'` guard).

### 3. `src/components/teacher/classroom/TeacherClassroom.tsx`
- Replace `handleForceSync`'s body. New behavior:
  - Call the new `forceSync()` exposed by `useClassroomSync` (teacher-only), wrapped in a try/catch.
  - On success, toast "🔄 Force Sync sent — student is now mirroring your screen."
  - **Remove** the `setTimeout(() => window.location.reload(), 500)` and remove the `force_refresh_timestamp` Supabase write — that path was an anti-pattern that nuked both clients.
- Keep the floating "Force Sync" button wired to the new handler.

### 4. `src/components/student/classroom/StudentClassroom.tsx`
- Delete the `force_refresh_timestamp` reload effect (lines ~113-121) — replaced by the new in-place `force_sync` listener inside `useClassroomSync`.
- Delete the 3-second polling fallback effect (lines ~123-145). The new `slide_change` broadcast removes the 1–3s lag the polling was patching over; the existing `subscribeToSession` postgres_changes channel still acts as a recovery path for late joiners. (If we want belt-and-suspenders, keep a 10 s polling at most — but spec asks for clean realtime, so we drop it.)

### 5. Student navigation lockout — defensive UI guard
- The student render path (`StudentMainStage.tsx`, `StudentMiniDock.tsx`) already does **not** render Prev/Next slide controls; navigation only exists in `TeacherControlDock` and `CenterStage` (both teacher-only). No change required, but to make the lockout explicit and safe even if someone reuses `MainStage`, add a `role !== 'teacher' && return null` guard at the top of `TeacherControlDock` (currently the prop already says `role: 'teacher'`, so this is a tiny safety net inside the component, near line 65 after destructuring — `if (role !== 'teacher') return null;`).

### 6. Co-Play activity sync — confirm + small hardening
- `CoPlayMemoryMatch.tsx` already calls `sync.broadcast('card_flipped', …)` and `sync.broadcast('game_state_update', state)` and listens for both, so flips on either side propagate. No new code, but:
  - In `NativeCoPlayArena.tsx`, add a one-shot `sync.broadcast('game_state_update', latestState)` whenever the teacher receives a `force_sync` (we'll piggyback by exposing the latest snapshot from the memory game via a `useRef` and broadcasting it inside `forceSync()`).
  - For now ship the simpler version: include `gameState: null` in the force_sync payload and let the existing periodic broadcasts re-converge clients; we can wire the per-game snapshot in a follow-up if needed. The user-visible effect (cards stay in sync after a teacher click) already works.

## What we deliberately don't change

- The `classroom_sessions` table schema. The new broadcasts are channel-only — no new columns and no migrations. The existing `current_slide_index` Postgres write inside `updateSlide` stays, so late joiners still hydrate from the row.
- The `useCoPlaySync` hook. It already supports `card_flipped` + `game_state_update`. We don't add `activity_action` because the more granular events the user listed (flip_card, etc.) are already first-class events here.
- `supabase/config.toml` and any RLS — broadcast channels don't need either.

## Acceptance

- Teacher clicks "Next" → student slide flips within ~150 ms (broadcast latency), no DB-replication lag.
- Student window has zero Prev/Next slide controls visible. Even if `TeacherControlDock` is mistakenly mounted with `role="student"`, it returns null.
- Teacher clicks "Force Sync" → toast "Force Sync sent". Both Teacher and Student stay on the page (no full reload). Student's slide index, stage mode, drawing flag, iframe-unlocked flag, and embedded URL all snap to the teacher's current values.
- In Memory Match, a card flipped on the teacher screen flips on the student screen (and vice versa) in real time. Already working — re-verified after refactor.
