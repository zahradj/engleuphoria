

# Fix WebRTC Signaling: Replace Stateless Edge Function with Supabase Realtime Broadcast

## Root Cause (Confirmed by Logs)

The `webrtc-signaling` edge function uses an in-memory `Map` to track room participants:
```
const rooms = new Map<string, Map<string, WebSocket>>();
```

Supabase Edge Functions are **stateless** — each HTTP/WebSocket connection can land on a different isolate. The logs prove this:
- Teacher joins room `engleuphoria-9c5fb88c...` → "Total participants: 1"
- Student joins the **same room** → "Total participants: 1" (different isolate, fresh Map)

They never see each other's signaling messages (offers/answers/ICE candidates), so WebRTC never connects.

## Solution

Replace the WebSocket edge function signaling with **Supabase Realtime Broadcast** channels. Both users subscribe to the same Supabase Realtime channel (which is managed by Supabase infrastructure, not ephemeral isolates) and exchange WebRTC signaling messages through broadcast events.

The old `webRTCService.ts` already had this pattern using Supabase broadcast — we just need to apply it to the full peer connection flow.

## Implementation

### Step 1: Rewrite `webrtcVideoService.ts` — Replace WebSocket with Supabase Realtime

Replace the `connectToSignalingServer()` WebSocket logic with:
- `supabase.channel(\`webrtc-\${roomId}\`)` 
- Broadcast events: `offer`, `answer`, `ice-candidate`, `join`, `leave`
- Each message includes `fromUserId` and `targetUserId`
- On receiving `join` from another user, the existing user initiates the WebRTC offer
- No edge function needed at all

### Step 2: Update `useWebRTCConnection.ts` — Singleton Fix

The hook currently uses a **singleton** `realTimeVideoService`. Both teacher and student import the same instance. This is fine for a single browser tab, but the `onParticipantsChange` callback gets overwritten on re-renders. Add proper cleanup.

### Step 3: Remove WebSocket Edge Function Dependency

The `webrtc-signaling` edge function can remain deployed (demo use) but will no longer be called by live classrooms.

### Step 4: Hub Type Pass-Through

The `UnifiedClassroomPage` currently hardcodes `hubType="academy"`. Fix it to query the booking's hub type and pass it through, so Playground bookings render with orange branding.

## Files to Modify

| File | Change |
|------|--------|
| `src/services/video/webrtcVideoService.ts` | Replace WebSocket signaling with Supabase Realtime Broadcast |
| `src/hooks/useWebRTCConnection.ts` | Minor cleanup for callback lifecycle |
| `src/pages/UnifiedClassroomPage.tsx` | Query hub type from booking and pass to classroom components |

## Expected Result

1. Both users subscribe to the same Supabase Realtime channel
2. When the second user joins, broadcast triggers WebRTC offer/answer exchange
3. ICE candidates flow through the same channel
4. Peer-to-peer video/audio connects successfully
5. Hub branding matches the booked hub (Playground = orange)

