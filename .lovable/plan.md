## Web Content "Independent Play" Toggle — Plan

Give the teacher a switch to hand the student local control of an embedded web page. While unlocked, the student can scroll/click inside the iframe; the annotation overlay steps aside so clicks reach the page.

---

### 1. New synced state: `iframeUnlocked`

Broadcast on the existing `classroom_${roomId}` Realtime channel (no new connections).

| State | Default | Direction | Event |
|---|---|---|---|
| `iframeUnlocked` | `false` | teacher → student | `iframe_lock_state` |

### 2. Service layer — `src/services/whiteboardService.ts`

Mirror the existing `sendDrawingEnabled` / `subscribeToDrawingEnabled` pattern:
- Add `IframeLockListener` type + `iframeLockListeners` set on `RoomChannel`.
- Register `.on('broadcast', { event: 'iframe_lock_state' }, …)` inside `getRoom`.
- Add `sendIframeLockState(roomId, isUnlocked, senderId)`.
- Add `subscribeToIframeLockState(roomId, cb)` with ref-counted release (extend `release()` cleanup check).

### 3. Hook — `src/hooks/useClassroomSync.ts`

- Add local state `iframeUnlocked`.
- `setIframeUnlocked(unlocked)` — broadcasts when role === teacher.
- `applyRemoteIframeUnlocked(unlocked)` — used by the centralized listener in `StudentClassroom`.
- Auto-reset to `false` when `stageMode` changes away from `'web'`.
- Expose all three in the return value.

### 4. Teacher UI — `src/components/classroom/stage/TeacherControlDock.tsx`

Add a shadcn `<Switch>` inside the dock, **only when `mode === 'web'`**, between the URL input and the tools group, labeled "Unlock Student Interaction".

New props:
- `iframeUnlocked: boolean`
- `onToggleIframeUnlock: (unlocked: boolean) => void`

### 5. Student-side rendering

**`ScrollSyncedIframe.tsx`**
- New prop `interactive?: boolean` (default `false`).
- Iframe `pointer-events`: `interactive ? 'auto' : 'none'` (replaces the current `role === 'student' ? 'none' : 'auto'`).
- When student is interactive, skip applying remote scroll % so they can scroll locally.
- Teacher iframe is always interactive.

**`StageContent.tsx`** — thread new `iframeUnlocked` prop down to `ScrollSyncedIframe`.

**`MainStage.tsx`** — accept `iframeUnlocked`, forward to `StageContent` and `TransparentCanvas`.

**`TransparentCanvas.tsx`** — extend `passThrough`:
```text
passThrough = !drawingEnabled || activeTool === 'pointer'
            || (mode === 'web' && iframeUnlocked && role === 'student')
```
Requires passing `mode` + `iframeUnlocked` props in.

### 6. Wiring

**`StudentClassroom.tsx`** — in the existing broadcast-listener `useEffect`, add:
```text
whiteboardService.subscribeToIframeLockState(roomId, ({ isUnlocked }) => {
  applyRemoteIframeUnlocked(isUnlocked);
  if (isUnlocked) toast("You can now interact with the web page!", { duration: 2500 });
});
```
Toast fires only on rising edge.

**`TeacherClassroom.tsx`** — pass `iframeUnlocked` + `setIframeUnlocked` into `TeacherControlDock`; pass `iframeUnlocked` into `MainStage`.

**`StudentMainStage.tsx`** — accept and forward `iframeUnlocked` into `MainStage`.

### 7. Files touched

- `src/services/whiteboardService.ts`
- `src/hooks/useClassroomSync.ts`
- `src/components/classroom/stage/TeacherControlDock.tsx`
- `src/components/classroom/stage/MainStage.tsx`
- `src/components/classroom/stage/StageContent.tsx`
- `src/components/classroom/stage/ScrollSyncedIframe.tsx`
- `src/components/classroom/stage/TransparentCanvas.tsx`
- `src/components/teacher/classroom/TeacherClassroom.tsx`
- `src/components/student/classroom/StudentClassroom.tsx`
- `src/components/student/classroom/StudentMainStage.tsx`

### 8. UX summary

- Teacher sees the switch only in Web mode; flipping it instantly hands or revokes local iframe control.
- Student sees a one-time toast on unlock; their overlay & iframe step aside so clicks land on the page.
- Locking again restores teacher-driven scroll sync and the drawing overlay.
- Switching out of Web mode auto-locks (defensive reset).
