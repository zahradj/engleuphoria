

# Live Video/Audio Connection & Room Synchronization Fix

## The Problem (Three Broken Links)

### 1. Room ID Mismatch — "The Two-Room Problem"
- **Teacher** classroom uses `roomId = "MySchool_Class_${classId}"` for `useClassroomSync`
- **Student** classroom uses the raw URL param (the booking's `session_id`) as `roomId`
- Result: They join different Supabase Realtime channels and different WebRTC signaling rooms — they can never see each other

### 2. Video/Audio Never Connected
- `useLocalMedia` captures the camera/mic stream in the teacher classroom, but it's **never passed** to `PictureInPicture` or to any WebRTC hook
- The `PictureInPicture` component renders a static avatar icon — no actual video
- Student classroom doesn't even call `useLocalMedia` — no stream is captured at all

### 3. WebRTC Hook Exists But Is Not Used
- `useWebRTCConnection` and the `webrtc-signaling` edge function are fully built and functional
- Neither classroom component imports or calls them
- The signaling server is deployed but receives zero connections

---

## Implementation Plan

### Step 1: Unify the Room ID
Both classrooms must derive `roomId` from the same source: the booking's `session_id`, which is already in the URL param.

- **TeacherClassroom**: Change `roomName` from `"MySchool_Class_${classId}"` to just `classId` (which is already the session_id from the URL)
- **StudentClassroom**: Already uses `roomId` directly — no change needed
- This ensures both sides join the same Supabase Realtime channel AND the same WebRTC signaling room

### Step 2: Wire Up Local Media in Both Classrooms
- **StudentClassroom**: Add `useLocalMedia()` hook (already used in TeacherClassroom)
- Call `media.join()` automatically after component mounts (post-PreFlightCheck, so permissions are already granted)
- Pass `media.stream` to `PictureInPicture` for local video preview

### Step 3: Connect WebRTC for Peer-to-Peer Video
Add `useWebRTCConnection` to both classrooms:

```
const { participants, isConnected: rtcConnected } = useWebRTCConnection({
  roomId: sessionId,
  userId: user.id,
  localStream: media.stream,
  enabled: media.isConnected
});
```

- Teacher sees student's remote stream in the PiP window
- Student sees teacher's remote stream in the PiP window
- Both auto-connect after PreFlightCheck grants media permissions

### Step 4: Pass Remote Streams to PictureInPicture
Update both classrooms:
- **Teacher PiP** → shows the student's remote stream (from `participants[0]?.stream`)
- **Student PiP** → shows the teacher's remote stream (from `participants[0]?.stream`)
- The existing `PictureInPicture` component already accepts a `stream` prop and renders `<video>` when provided

### Step 5: Add "User Joined" Notification
When `participants` array length changes, show a toast:
- "Student joined the classroom" (teacher side)
- "Teacher joined the classroom" (student side)

### Step 6: Add Reconnect Button
Add a reconnect button to `ClassroomTopBar` and `StudentClassroomHeader`:
- Calls `disconnect()` then `connect()` from the WebRTC hook
- Shows when `rtcConnected` is false after initial connection

### Step 7: Media Permission Overlay
If `media.error` is set (permission denied), show a full-screen overlay with:
- "Camera & Microphone access required"
- A "Retry" button that calls `media.join()` again
- This replaces the current silent failure

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/teacher/classroom/TeacherClassroom.tsx` | Fix roomId, add `useWebRTCConnection`, pass streams to PiP |
| `src/components/student/classroom/StudentClassroom.tsx` | Add `useLocalMedia`, add `useWebRTCConnection`, pass streams to PiP |
| `src/components/classroom/PictureInPicture.tsx` | Add connection status indicator styling |
| `src/components/teacher/classroom/ClassroomTopBar.tsx` | Add reconnect button |
| `src/components/student/classroom/StudentClassroomHeader.tsx` | Add reconnect button |

No database changes needed. No new edge functions. The `webrtc-signaling` edge function is already deployed and functional.

---

## Expected Result After Implementation

1. Teacher and student land in the **same room** (same session_id)
2. After PreFlightCheck, camera/mic auto-activate
3. WebRTC connects via the existing signaling server
4. Teacher sees student video in PiP, student sees teacher video in PiP
5. "User Joined" toast appears when the other participant connects
6. Reconnect button available if connection drops

