

## Issues Identified

### 1. Lesson gets stuck after activity slides (no way to advance)
**Root cause**: In `LessonPlayerContainer.tsx`, the `PopBubble` activity calls `onCorrect()` on **every single bubble pop** (line 56), which triggers the feedback overlay each time. The feedback overlay blocks the UI and requires clicking "Continue" for each bubble. But worse — the `handleCorrectAnswer` sets `answerSelected = true` and shows the feedback overlay, but this happens per-bubble. The user expects to pop all bubbles, then move on. The core problem: **activities that involve multiple interactions (pop bubbles, drag-drop) call onCorrect/onIncorrect per item**, which triggers the feedback overlay prematurely. After the first pop, the feedback covers the remaining bubbles.

Additionally, the `score` state inside `PlaygroundPopBubble` is a local state that doesn't communicate back to the parent's XP counter. The parent only gets `onCorrect()` calls which each add 10 XP and trigger a feedback overlay.

### 2. Score shows 0 even after correct matches
The score displayed inside `PlaygroundPopBubble` at line 26 (`const [score, setScore] = useState(0)`) is local. The `handlePop` callback has `onCorrect` in its dependency array (line 60), which causes the callback to be recreated when the parent's `handleCorrectAnswer` changes state. Since `handleCorrectAnswer` triggers `setAnswerSelected(true)` and shows the feedback overlay, the pop bubbles get covered and the local score may not visually update.

### 3. No vocabulary pronunciation audio
The `SlideVocabulary.tsx` Volume2 button (line 77) has an empty `onClick` — it only calls `e.stopPropagation()` with no TTS call.

### 4. No song/music audio playback on warm-up song slides
The warm-up song slide renders as a `SlideHook` (since `slideType: 'warmup'`) which just shows text — no audio player.

---

## Plan

### Step 1: Fix activity slide completion flow
**Files**: `PlaygroundPopBubble.tsx`, `PlaygroundDragDrop.tsx`, `LessonPlayerContainer.tsx`

- **Change the contract**: Activities with multiple items should NOT call `onCorrect/onIncorrect` per individual item. Instead, they should manage their own internal scoring and call a single `onCorrect()` only when the activity is **complete** (all bubbles popped or all items placed).
- **PlaygroundPopBubble**: Remove the per-bubble `onCorrect()` call. Track internal score. When all target bubbles are popped, call `onCorrect()` once. If the user pops a wrong bubble, show local feedback (shake/flash) without calling `onIncorrect()` to the parent.
- **PlaygroundDragDrop**: Same pattern — call `onCorrect()` only when `allPlaced === true`. Remove per-item `onCorrect()` call.
- **LessonPlayerContainer**: No changes needed to the container itself; the fix is in the activity components.

### Step 2: Add TTS pronunciation to vocabulary flashcards
**File**: `SlideVocabulary.tsx`

- Import `useTextToSpeech` hook (already exists, uses ElevenLabs via `elevenlabs-tts` edge function).
- Add a voice selector toggle (boy/girl) using two different ElevenLabs voice IDs:
  - Girl voice: Use a young-sounding voice ID (e.g., Lily `pFZP5JQG7iQjIQuC4Bku`)
  - Boy voice: Use a young-sounding voice ID (e.g., Charlie `IKne3meq5aSn9XLyUdCD`)
- Wire the Volume2 button `onClick` to call `speakWord(word)` with the selected voice.
- Add a small boy/girl toggle beside the speaker icon.
- Show loading spinner while TTS generates.

### Step 3: Add audio playback for warm-up song slides
**Files**: `SlideHook.tsx` or new `SlideSong.tsx`, `DynamicSlideRenderer.tsx`

- Detect when `slide.slideType === 'warmup'` and `slide.keywords?.includes('song')` — render a dedicated song slide UI.
- Add a prominent "Play Song" button that uses the `elevenlabs-tts` edge function to read the song lyrics aloud with an expressive, kid-friendly voice.
- Display the song lyrics in a large, formatted text block with a musical theme.
- The user chose "Play button only" — no auto-play.

### Step 4: Add song audio to the song/chant slide in the presentation phase
**File**: `DynamicSlideRenderer.tsx`, `SlideHook.tsx`

- For slides with `slideType === 'core_concept'` and `keywords?.includes('song')`, also show the play button.
- Reuse the same TTS pattern from Step 3.

---

## Technical Details

### Voice IDs for kid pronunciation
- Girl: Lily (`pFZP5JQG7iQjIQuC4Bku`) — clear, young-sounding
- Boy: Charlie (`IKne3meq5aSn9XLyUdCD`) — clear, young-sounding
- Both use `elevenlabs-tts` edge function already deployed with `ELEVENLABS_API_KEY_1`

### Activity completion pattern
```text
BEFORE: Pop bubble → onCorrect() → feedback overlay → blocked
AFTER:  Pop bubble → internal score++ → all done? → onCorrect() once → feedback → continue
```

### Files Modified
1. `src/components/lesson-player/activities/PlaygroundPopBubble.tsx` — Single completion callback
2. `src/components/lesson-player/activities/PlaygroundDragDrop.tsx` — Single completion callback
3. `src/components/lesson-player/slides/SlideVocabulary.tsx` — Add TTS with voice toggle
4. `src/components/lesson-player/slides/SlideHook.tsx` — Add song play button for song slides
5. `src/components/lesson-player/DynamicSlideRenderer.tsx` — Route song slides to enhanced component

