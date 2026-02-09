

# Add Star Count to Top Banner + Fix Video/Audio in Live Calls

## 1. Add Star Count Display to the Top Banner

### What changes
The `ClassroomTopBar` currently shows: LIVE indicator, participant count, lesson title, room name, timer, and media controls. The star count will be added **in the center** of the bar, between the left info section and the right controls.

### File: `src/components/teacher/classroom/ClassroomTopBar.tsx`
- Add a new `studentStars` prop (number) and optional `studentName` prop
- Render a centered star count badge with a gold star icon and the count
- Style it with a glowing gold/amber background to make it visually prominent

### File: `src/components/teacher/classroom/TeacherClassroom.tsx`
- Pass `studentStars` to the `ClassroomTopBar` component

### Visual design
The star counter will appear as a pill-shaped badge in the center of the top bar:
- Gold star icon (filled) + number display (e.g., "3 Stars")
- Subtle glow/pulse animation when the count updates
- Matches the dark theme of the classroom UI

---

## 2. Fix Video and Audio in Live Calls

### Current problem
The `CommunicationZone` (left sidebar in teacher classroom) shows **static placeholder icons** instead of actual camera feeds. The `useLocalMedia` hook exists and correctly requests `getUserMedia`, but it is **never connected** to the `TeacherClassroom` or its video containers.

### Solution
Integrate `useLocalMedia` into `TeacherClassroom` and pass the stream to `CommunicationZone` for rendering in the video containers.

### File: `src/components/teacher/classroom/TeacherClassroom.tsx`
- Import and call `useLocalMedia()` hook
- Auto-join the call when the component mounts
- Wire up `media.toggleMicrophone` and `media.toggleCamera` to the existing `isMuted`/`isCameraOff` state (replace the local state toggles with the hook's functions)
- Pass `media.stream`, `media.isConnected`, and `media.isCameraOff` to `CommunicationZone`

### File: `src/components/teacher/classroom/CommunicationZone.tsx`
- Add new props: `localStream`, `isVideoConnected`, `isLocalCameraOff`
- In the **Teacher Video Container** (currently a static `User` icon), render a `<video>` element when a stream is available
- Use a `useRef` + `useEffect` to attach `stream` to the video element's `srcObject`
- Set `autoPlay`, `muted` (to prevent feedback), and `playsInline` attributes
- Fall back to the existing avatar placeholder when no stream is available
- Apply the same pattern from the stack overflow solution: create the video element in the DOM immediately, set `playsInline` and `preload="auto"` for mobile compatibility

### File: `src/components/teacher/classroom/ClassroomTopBar.tsx`
- The existing mic/camera toggle buttons will now control the real media stream (the parent passes the correct handlers)

---

## Technical Details

### Video element best practices (from the provided solution)
```typescript
<video
  ref={videoRef}
  autoPlay
  muted        // Always mute local preview to prevent audio feedback
  playsInline  // Required for iOS Safari inline playback
  preload="auto"
  className="w-full h-full object-cover"
/>
```

### Stream attachment pattern
```typescript
const videoRef = useRef<HTMLVideoElement>(null);

useEffect(() => {
  if (videoRef.current && localStream) {
    videoRef.current.srcObject = localStream;
  }
}, [localStream]);
```

### Auto-join on mount
```typescript
useEffect(() => {
  media.join();
  return () => { media.leave(); };
}, []);
```

---

## Summary of File Changes

| File | Change |
|------|--------|
| `ClassroomTopBar.tsx` | Add `studentStars` and `studentName` props; render centered star count badge |
| `TeacherClassroom.tsx` | Integrate `useLocalMedia` hook; pass stream and star count to child components |
| `CommunicationZone.tsx` | Add `localStream`/`isVideoConnected` props; render live `<video>` element for teacher feed |

