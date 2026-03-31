

## Plan: Audio Recording + AI Voice, Bigger Canvas, Images in Activities

### Three Requests

1. **Audio element with mic recording + AI voice enhancement** — Add a "Record" button (microphone) to the audio element. The creator records a word/phrase, it gets sent to an AI voice changer (using existing ElevenLabs TTS edge function), and the cleaned audio is saved to the slide.

2. **Bigger slide canvas viewer** — The current layout squeezes the canvas between 4 panels (curriculum browser 224px + slide organizer 224px + properties panel 256px + blueprint panel 288px = ~992px taken). Collapse the properties panel into a floating popover that appears when an element is selected, and make the curriculum browser + blueprint panel collapsible. This gives the canvas the majority of the viewport.

3. **Image support in game activities** — Add image upload fields to matching pairs (left/right can be text OR image), drag-and-drop items, and quiz options so creators can use picture-based activities.

### Changes

**1. Audio element — mic + AI voice**

- **`ElementToolbar.tsx`** — Change audio icon to `Mic` (from lucide)
- **`PropertiesPanel.tsx`** — Audio section: add "Record" button that uses `MediaRecorder` API to capture audio, a "Generate AI Voice" button that takes a text input + sends to existing `elevenlabs-tts` edge function, stores result in Supabase `lesson-slides` bucket, and sets `content.src`
- **`CanvasElement.tsx`** — Audio renderer: show mic icon + label + audio player when src exists

**2. Bigger canvas**

- **`AdminLessonEditor.tsx`** — Make curriculum browser and right panel (blueprint/guide) collapsible with toggle buttons. Default: collapsed. This frees ~500px for the canvas.
- **`CanvasEditor.tsx`** — Remove the `PropertiesPanel` from the side layout. Instead, render it as a floating card (absolute positioned, right side of canvas viewport) that only appears when an element is selected. This eliminates the permanent 256px panel.
- **`PropertiesPanel.tsx`** — Add a close button and make it a floating card with shadow/border

**3. Images in game activities**

- **`PropertiesPanel.tsx`** — For matching pairs: each pair gets an optional image upload (left image, right image) stored in `lesson-slides` bucket. For drag-drop items: each item can have an optional image. For quiz options: each option can have an optional image.
- **`CanvasElement.tsx`** — Update matching, drag-drop, and quiz renderers to show images when present alongside text
- **`types.ts`** — No changes needed; `content` is already `Record<string, any>`

### Technical Details

| Area | Implementation |
|---|---|
| Mic recording | `navigator.mediaDevices.getUserMedia({ audio: true })` → `MediaRecorder` → blob → upload to `lesson-slides` bucket |
| AI voice | Text input → call existing `elevenlabs-tts` edge function → get audio blob → upload to bucket → set `content.src` |
| Collapsible panels | State booleans `showBrowser` / `showRightPanel` with toggle icons in a mini toolbar |
| Floating properties | `position: absolute; right: 16px; top: 16px` inside the canvas viewport container, with `z-50` |
| Activity images | Matching pair becomes `{ left: string, right: string, leftImage?: string, rightImage?: string }` — upload reuses existing `handleImageUpload` pattern |

### Files to modify

- `src/components/admin/lesson-builder/canvas/ElementToolbar.tsx` — Mic icon for audio
- `src/components/admin/lesson-builder/canvas/PropertiesPanel.tsx` — Mic recording, AI voice, activity image uploads, floating card style
- `src/components/admin/lesson-builder/canvas/CanvasElement.tsx` — Audio renderer with mic icon, activity image rendering
- `src/components/admin/lesson-builder/canvas/CanvasEditor.tsx` — Floating properties panel
- `src/components/admin/lesson-builder/AdminLessonEditor.tsx` — Collapsible side panels

