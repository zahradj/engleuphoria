## Plan — 4 fixes/features for the Live Classroom

### 1. Star celebration on teacher = 1s (match student)

`src/components/teacher/classroom/StarCelebration.tsx` currently auto-hides at 1200 ms (regular) and uses long milestone timings.

- Change auto-hide `setTimeout(..., 1200)` → `1000` ms so the teacher overlay disappears in 1s like the student's.
- Reduce confetti `duration` from 1200 → 800 ms and the milestone interval-based confetti loop from `Date.now() + 1200` → `Date.now() + 800` so the burst doesn't outlive the overlay.
- Lower the staggered "side" confetti delays (`100/380` ms) so all confetti fires within ~700 ms.
- Star icon repeat counts (`repeat: 4` on milestone) trimmed so the spring animation finishes inside 1s.

No API change — only timing constants tweaked.

### 2. Sticker pack: more reactions (Clap, Thumbs Up, Heart, Fire, etc.)

Today `handleSendSticker` in `TeacherClassroom.tsx` always sends `'😊'`, and `InteractionToolsGrid.tsx` exposes a single "Sticker" button.

Changes:
- **`InteractionToolsGrid.tsx`** — replace the single Sticker button with a `Popover` ("Reactions"). The popover shows a 4×2 grid of emoji buttons:
  `👏 Clap · 👍 Thumbs Up · ❤️ Heart · 🔥 Fire · 🎉 Party · 🌟 Star · 💯 Hundred · 😂 Laugh`
  Clicking an emoji calls `onSendSticker(emoji)`.
- **`CommunicationZone.tsx`** — update prop signature `onSendSticker: (emoji: string) => void` and forward through.
- **`TeacherClassroom.tsx`** — `handleSendSticker(emoji: string)` passes the chosen emoji into `whiteboardService.sendReward({ rewardType: 'sticker', sticker: emoji, ... })`. Toast shows the emoji actually sent.
- **`StudentClassroom.tsx`** — already renders `payload.sticker` via `liveSticker.emoji`, so it just receives the new emojis automatically. Tweak the overlay timeout to 1500 ms (already set) and add a tiny bounce + fade-out so heart/fire feel distinct.
- Optionally render the same overlay on the teacher side so the teacher sees the sticker they sent (mirror of student behavior). Add a `liveSticker` overlay block in `TeacherClassroom.tsx` listening to its own `sendReward` (or set local state directly in `handleSendSticker`).

### 3. Camera selection actually works

Today `useMediaDevices.ts` stores `selectedCameraId/selectedMicId` in `localStorage`, but `useMediaAccess.ts` (the hook that actually opens the stream in the classroom) calls `getUserMedia({ video: { facingMode: 'user' } })` and **ignores the saved deviceId**. Result: changing the dropdown does nothing.

Fixes in `src/hooks/enhanced-classroom/useMediaAccess.ts`:

1. Read the saved IDs (`localStorage.getItem('preferredCameraId' | 'preferredMicId')`) when building constraints:
   ```ts
   const camId = localStorage.getItem('preferredCameraId');
   const micId = localStorage.getItem('preferredMicId');
   const constraints = {
     video: camId ? { deviceId: { exact: camId }, width: {...}, height: {...} } : { facingMode: 'user', ... },
     audio: micId ? { deviceId: { exact: micId }, echoCancellation: true, ... } : { echoCancellation: true, ... },
   };
   ```
2. Add a new method `switchCamera(deviceId: string)` that:
   - Stops the current video track,
   - Calls `getUserMedia({ video: { deviceId: { exact: deviceId } } })`,
   - Replaces the video track in `localStream` (`removeTrack`/`addTrack`) so React refs keep working,
   - Persists `localStorage.setItem('preferredCameraId', deviceId)`,
   - Returns the new stream.
3. Add equivalent `switchMicrophone(deviceId)`.
4. Export `switchCamera` / `switchMicrophone` from the hook return.

In `useMediaDevices.ts`:
- After enumerate, if labels are empty (permissions not yet granted) request a one-shot `getUserMedia({ video: true, audio: true })` (then immediately stop tracks) so labels populate. Without this, the dropdown shows "Camera 1 / Camera 2" with no useful names on first visit.

Wire-up:
- Find the existing camera/mic `<Select>` in the classroom settings (search for `useMediaDevices` consumer — likely a `DeviceSettings` dialog or settings popover). Update its `onValueChange` to call `mediaAccess.switchCamera(id)` instead of only `setSelectedCameraId(id)`. If no consumer exists, add a small "Devices" dropdown to the teacher Control Dock and student Mini Dock with two Selects (Camera, Microphone).

Result: picking a different camera in the dropdown immediately swaps the live video track without rejoining the room.

### 4. AI-Powered Smart Worksheet & Native Game Generator

#### 4a. Edge function `generate-smart-worksheet`

`supabase/functions/generate-smart-worksheet/index.ts`:
- Standard CORS, validate JWT, accept `{ topic: string, level?: string, count?: number }`.
- Calls Lovable AI Gateway (`google/gemini-2.5-flash`) with **tool calling** for structured output (no "return JSON" prompts):
  ```ts
  tools: [{ type: 'function', function: {
    name: 'build_worksheet',
    parameters: {
      type: 'object',
      properties: {
        flashcards: { type: 'array', items: { type:'object',
          properties:{ word:{type:'string'}, definition:{type:'string'}, example_sentence:{type:'string'} },
          required:['word','definition','example_sentence'] } },
        memory_match: { type:'array', items:{ type:'object',
          properties:{ pair_1:{type:'string'}, pair_2:{type:'string'} }, required:['pair_1','pair_2'] } },
        sentence_builder: { type:'array', items:{ type:'object',
          properties:{ full_sentence:{type:'string'}, scrambled_words:{type:'array',items:{type:'string'}} },
          required:['full_sentence','scrambled_words'] } },
        fill_in_blanks: { type:'array', items:{ type:'object',
          properties:{ sentence_with_blank:{type:'string'}, correct_answer:{type:'string'},
                        distractors:{type:'array',items:{type:'string'}} },
          required:['sentence_with_blank','correct_answer','distractors'] } },
      }, required:['flashcards','memory_match','sentence_builder','fill_in_blanks']
    }}}],
  tool_choice: { type:'function', function:{ name:'build_worksheet' } }
  ```
- Handle 429/402 (return clear error).
- Returns `{ worksheet: <parsed args> }`.

#### 4b. Realtime sync extensions

`whiteboardService.ts` — add three broadcast events on the existing `classroom_${roomId}` channel:
- `worksheet_load` — payload `{ worksheet, gameType }`. Sent when teacher launches a game so the student instantly receives the data.
- `game_state` — payload `{ gameType, state }`. Generic state envelope for per-game state (chip order, selected blank, etc.).
- Reuse existing `stage_mode` with new modes: `'native_game_flashcards' | 'native_game_memory' | 'native_game_sentence' | 'native_game_blanks'`.

`useClassroomSync.ts` — extend `StageMode` union with the four new modes; expose `worksheet`, `gameType`, `setWorksheet`, `gameState`, `setGameState` and broadcast helpers.

#### 4c. Teacher "Game Studio" UI

- New file `src/components/classroom/games/GameStudioModal.tsx`: glassmorphic `Dialog` with a textarea ("e.g. Action Verbs, Past Tense Irregulars"), a level selector (A1–C2), Generate button. On generate calls `supabase.functions.invoke('generate-smart-worksheet', { body: { topic, level } })`.
- After result, show the **Game Launcher** menu (4 large cards): Flashcards · Memory Match · Sentence Builder · Fill-in-the-Blanks. Each card → `setStageMode('native_game_*')` + `sendWorksheet(worksheet, gameType)`.
- Add a `🪄 AI Game Generator` button to `TeacherControlDock.tsx` that opens `GameStudioModal`.

#### 4d. Native game components (synced)

New files under `src/components/classroom/games/native/`:

1. **`FlashcardsGame.tsx`** — index of current card synced via `game_state`. Teacher and student see the same card; either can flip (broadcast `flipped` boolean) and Next/Prev (teacher-only nav for clarity).
2. **`MemoryMatchGame.tsx`** — builds a shuffled grid from `memory_match` pairs. The shuffle order is computed by the **teacher only** and sent in the initial `worksheet_load` payload (`shuffleOrder` saved into `state`). Card flips broadcast `{ flippedIds: number[] }`. Match validation runs on the same data on both sides → identical UI.
3. **`SentenceBuilderGame.tsx`** — renders `scrambled_words` as draggable chips (use existing `@dnd-kit` if present, otherwise simple HTML5 drag). On drop, broadcast the new chip order. Both roles can drag. "Check" button compares the current order to `full_sentence` and broadcasts a green/red result.
4. **`FillInBlanksGame.tsx`** — clickable option buttons. On click, broadcast `{ selectedIndex }`. Both screens highlight green if `option === correct_answer`, red otherwise. Auto-advance to next item after 1.5s (teacher-controlled "Next").

Each component:
- Reads `worksheet` + `gameState` from `useClassroomSync`.
- Calls `whiteboardService.sendGameState(roomId, { gameType, state: nextState })` on every interaction.
- Subscribes once to incoming `game_state` and applies it to local React state.

#### 4e. Stage routing

`StageContent.tsx` — add a switch:
```tsx
case 'native_game_flashcards': return <FlashcardsGame .../>;
case 'native_game_memory':     return <MemoryMatchGame .../>;
case 'native_game_sentence':   return <SentenceBuilderGame .../>;
case 'native_game_blanks':     return <FillInBlanksGame .../>;
```
The `TransparentCanvas` overlay still mounts on top (so the teacher can annotate over a game), with `passThrough` automatically true while drawing is OFF.

---

### Files to add
- `supabase/functions/generate-smart-worksheet/index.ts`
- `src/components/classroom/games/GameStudioModal.tsx`
- `src/components/classroom/games/native/FlashcardsGame.tsx`
- `src/components/classroom/games/native/MemoryMatchGame.tsx`
- `src/components/classroom/games/native/SentenceBuilderGame.tsx`
- `src/components/classroom/games/native/FillInBlanksGame.tsx`

### Files to edit
- `src/components/teacher/classroom/StarCelebration.tsx` (timing)
- `src/components/teacher/classroom/InteractionToolsGrid.tsx` (sticker popover)
- `src/components/teacher/classroom/CommunicationZone.tsx` (prop signature)
- `src/components/teacher/classroom/TeacherClassroom.tsx` (sticker emoji + mirror overlay + Game Studio button wiring)
- `src/components/student/classroom/StudentClassroom.tsx` (already renders sticker, minor polish)
- `src/hooks/enhanced-classroom/useMediaAccess.ts` (use saved deviceId, add switchCamera/switchMicrophone)
- `src/hooks/useMediaDevices.ts` (one-shot permission to populate device labels)
- consumer of `useMediaDevices` (or new dropdown in TeacherControlDock + StudentMiniDock) — wire `switchCamera/switchMicrophone`
- `src/services/whiteboardService.ts` (add `worksheet_load`, `game_state` broadcast)
- `src/hooks/useClassroomSync.ts` (extend `StageMode`, add worksheet/gameState)
- `src/components/classroom/stage/StageContent.tsx` (route new modes)
- `src/components/classroom/stage/TeacherControlDock.tsx` (🪄 button)

### Out of scope
- Persisting generated worksheets in the database (broadcast-only, matches current classroom pattern).
- Adding more game types beyond the 4 specified.
- Replacing the existing `SentenceBuilderGame` in `oneonone/games/` — the new synced one lives under `classroom/games/native/`.
