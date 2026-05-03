## Goal

Replace third-party Hyperbeam cloud-browser embedding (which is suffering WebRTC drops + bot/CORS blocks) with a **native multiplayer Co-Play arena** that runs entirely inside the classroom UI and stays in sync over Supabase Realtime broadcast channels. Teacher and student see each other's clicks, drags, card flips, and even mouse cursors with sub-100ms latency, with no external service.

## Files to create

1. `src/hooks/useCoPlaySync.ts` — NEW lean realtime hook.
2. `src/components/classroom/native-games/NativeCoPlayArena.tsx` — NEW container.
3. `src/components/classroom/native-games/CoPlayMemoryMatch.tsx` — NEW Memory Match game (multiplayer).
4. `src/components/classroom/native-games/SharedCursors.tsx` — NEW shared-cursor overlay.

## Files to edit

5. `src/components/classroom/stage/StageContent.tsx` — when `mode === 'web'` (and the URL is a Hyperbeam URL OR Hyperbeam is disabled), render `<NativeCoPlayArena>` instead of `<MultiplayerWebStage>`. The Hyperbeam path stays available behind a feature flag for backwards compatibility but is no longer the default for collaborative activities.
6. `src/services/whiteboardService.ts` — no breaking change; we add no new methods. Co-Play uses its own dedicated channel name (`co-play:{classroomId}`) so it cannot collide with whiteboard / stage events.

## 1. `useCoPlaySync` hook

Single subscription per `classroomId`. API:

```ts
const { isConnected, peers, broadcast, on } = useCoPlaySync({
  classroomId, userId, userName, role,
});
```

Channel: `co-play:{classroomId}` with `broadcast.self=false` and presence keyed by `userId`.

Supported events (typed):
- `cursor_move` → `{ x, y }` normalized 0..1 within the arena.
- `card_dragged`, `card_dropped`, `card_flipped` → `{ cardId, ... }`.
- `game_state_update` → full authoritative snapshot of the active game.
- `game_reset` → `{}`.
- `reaction` → `{ emoji }` (future use).

Every payload is wrapped in:
```ts
{ senderId, senderName, senderRole, data, ts }
```
so the receiving client can attribute the action.

Presence: `track({ userId, userName, role })` so the arena can show "2 in room" and drop stale cursors when a peer disconnects.

## 2. `NativeCoPlayArena`

Full-bleed surface that:
- Wires up `useCoPlaySync` once.
- Renders the selected game (initial release: `memory_match`).
- Mounts `<SharedCursors>` overlay (pointer-events: none).
- Shows a tiny status pill ("Live · 2 in room") in the corner.

Props:
```ts
{ classroomId, userId, userName, role,
  game?: 'memory_match',          // future: 'drag_vocab', 'flashcards'
  pairs?: MemoryPair[],            // game payload
  accent?: string                  // hub primary hex
}
```

## 3. `CoPlayMemoryMatch` game

Pure presentational component that owns its game state and pushes it through `sync.broadcast`.

State shape:
```ts
{ cards: Card[], flipped: number[], matched: number[], v: number }
```
- `v` is a monotonic version stamp. Remote updates only apply if `incoming.v >= local.v` so two clients clicking simultaneously cannot ping-pong.
- On flip: optimistic local update, broadcast `card_flipped`, then push `game_state_update` snapshot.
- On second flip: 900ms reveal; if pair matches → add to `matched`; else → unflip (broadcast new snapshot at each step).
- "Reset" broadcasts both `game_reset` and a fresh `game_state_update`.

Visuals:
- Grid (4-col default, 6-col when >12 cards).
- 3D flip using existing `.perspective-1000` / `.preserve-3d` / `.rotate-y-180` utilities (already present in `index.css`).
- Card back uses hub `accent`; matched cards switch to emerald-50 / emerald-700 with a celebration line at 100%.
- Aspect ratio `3/4`, responsive.

Pair source: `MemoryPair[] = { pair_1, pair_2 }` — same shape the existing AI worksheet generator uses (`worksheet.memory_match`), so we can drop this in without changing the generator.

## 4. `SharedCursors`

Listens to `cursor_move` and renders a single `<MousePointer2>` per remote user, color-coded by role (teacher = indigo, student = orange).

Local side:
- Attaches `mousemove` to the arena ref.
- Throttles to one broadcast every 40ms.
- Coordinates are normalized to the arena's bounding rect (0..1) so they survive different screen sizes.

Remote side:
- Stores `Record<userId, RemoteCursor>` and renders absolutely-positioned pointers with the user's name pill.
- Cursors fade out after 4s with no updates (interval sweep).

The whole overlay is `pointer-events-none` so it never intercepts game clicks.

## 5. StageContent integration

```text
mode === 'web' && classroomId
  ? <NativeCoPlayArena
       classroomId={roomId}
       userId={userId}
       role={role}
       game="memory_match"
       pairs={worksheet?.memory_match ?? []}
       accent={hubAccent}
     />
  : <ScrollSyncedIframe ... />
```

The `MultiplayerWebStage` (Hyperbeam) import is removed from this file. We keep the file in the repo so any opt-in path that still wants a cloud browser can import it directly, but the default classroom flow stops calling `createHyperbeamSession`.

## Why this works

- **No third-party RTC**: Supabase Realtime's broadcast channel runs over a single WebSocket — no SDP negotiation, no STUN/TURN, no bot detection.
- **Same data path as existing games**: We reuse `whiteboard_service`-style channel naming and the existing `worksheet.memory_match` payload, so the AI generator and teacher dashboard need zero changes.
- **Deterministic conflict resolution**: the version stamp `v` plus `broadcast.self=false` prevents echo loops even if both clients flip a card in the same frame.
- **Cursor latency** stays under 50ms over Realtime; the throttle keeps message volume well under the channel's rate limit.

## Out of scope (this turn)

- Drag-and-drop vocab game and flashcard race — same arena, future games slot into the `game` prop.
- Removing the Hyperbeam edge function (`hyperbeam-session`) — leave it deployed; we just stop calling it from the default flow.
- Persisting game results — Memory Match wins flow into existing `lesson_completion` events from `whiteboardService` if the host wires them up later.

## Acceptance

- Two browser windows joined to the same classroom see each other's cursors moving in real time.
- A card flipped on one side animates on the other within ~100ms.
- A matched pair locks on both sides; mismatches unflip on both sides.
- "Reset" wipes both boards.
- Disconnecting one client removes its cursor within 4s and decrements the "in room" counter.
- No `.hyperbeam.com` URLs are loaded for the default Co-Play flow.
