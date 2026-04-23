

# Plan: Multimedia AI Slide Architect — Integrated Generator + Injection System

## Summary

Overhaul the Content Creator Slide Builder into a unified AI-powered workspace. The AI Lesson Architect moves from Step 1 into the Slide Builder itself as a left sidebar panel. The edge function evolves to output structured JSON slide arrays with multimedia fields. New "Insert AI Slide" buttons between thumbnails enable context-aware single-slide injection with one-click presets.

## 1. Edge Function Overhaul: `generate-lesson-plan`

**File:** `supabase/functions/generate-lesson-plan/index.ts`

Add a new `mode` parameter to support two generation modes:

- **`mode: "full_deck"`** (default): Returns a JSON array of 7-10 slide objects following the new schema:
  ```json
  {
    "slides": [
      {
        "slide_type": "title | video_song | vocabulary_image | grammar_presentation | interactive_practice",
        "headline": "string",
        "body_text": "string",
        "video_url": "string | null",
        "visual_search_keyword": "string (1-2 words for image fetch)",
        "teacher_notes": "string (CCQs, step-up/step-down scaffolding)"
      }
    ],
    "lesson_title": "string",
    "target_grammar": "string",
    "target_vocabulary": "string"
  }
  ```
- **`mode: "single_slide"`**: Accepts `previousSlideContent`, `prompt`, and `hub`. Returns a single slide object. Used by the injection system.

The system prompt enforces PPP pedagogy, hub-specific duration/tone, video channel suggestions, and mandatory scaffolding. Gemini returns `responseMimeType: "application/json"`.

## 2. New Component: `AISlideGeneratorPanel`

**File:** `src/components/admin/lesson-builder/AISlideGeneratorPanel.tsx`

A collapsible left sidebar panel (Glassmorphism styled) inside the Slide Builder containing:

- Hub dropdown (Playground/Academy/Success) with hub-colored badges
- Topic input, Student Age/Level input
- "Generate Magic Deck" button with pulsing gradient animation
- Skeleton loader state that shows on the canvas while generating
- On response: converts the JSON slide array into `Slide[]` using a new converter, populating `canvasElements` with text elements for headline/body, video embeds, and image placeholders using `visual_search_keyword`

## 3. Image Integration via `visual_search_keyword`

**File:** `src/components/admin/lesson-builder/utils/fetchSlideImage.ts`

A utility that takes a `visual_search_keyword` and returns an image URL:

- Primary: Uses the existing `ai-image-generation` edge function (Gemini image gen) with the keyword as prompt, styled as "flat 2D educational illustration"
- Fallback: Constructs an Unsplash source URL: `https://source.unsplash.com/1920x1080/?{keyword}`
- Images are placed as canvas elements on the slide

## 4. Slide Conversion: AI JSON to Canvas Slides

**File:** `src/components/admin/lesson-builder/utils/convertAISlideSchema.ts`

Maps the new Gemini slide schema into the existing `Slide` + `CanvasElementData[]` format:

- `headline` → Text element (large, centered top)
- `body_text` → Text element (medium, below headline)
- `video_url` → Video canvas element (YouTube iframe embed)
- `visual_search_keyword` → Image element (fetched async, placeholder initially)
- `slide_type` → Maps to existing `SlideType` and sets phase labels
- `teacher_notes` → Stored in `Slide.teacherNotes`

## 5. Insert AI Slide System

**File:** `src/components/admin/lesson-builder/InsertAISlideButton.tsx`

A small `+AI` button rendered between every two thumbnails in `SlideFilmstrip.tsx`:

- Click opens a Glassmorphism popover with:
  - Free-text prompt field ("What kind of slide should I build here?")
  - Four preset buttons in a row:
    - **Quick Quiz**: "Create a 3-question MCQ based on the previous slide"
    - **Speaking Prompt**: "Create a discussion question with key vocabulary hints"
    - **Video Break**: "Find and embed a 2-3 min YouTube video for this topic"
    - **Concept Check**: "Create a True/False or Fill-in-the-blanks check"
  - Each preset sends a hardcoded instruction + previous slide content + hub context to the edge function with `mode: "single_slide"`
- On response: splice the new slide into `slides[]` at the clicked index
- Animate with `animate-fade-in` and auto-select the new slide
- Hub color scheme auto-applied to the new slide styling

## 6. Integration into AdminLessonEditor

**File:** `src/components/admin/lesson-builder/AdminLessonEditor.tsx`

- Add `AISlideGeneratorPanel` as a toggleable left panel (replaces the current AI Wizard dialog for full-deck generation)
- Wire "Generate Magic Deck" to call the edge function, convert results, and populate `slides` state
- Pass `slides`, `selectedSlideId`, and `hub` to `SlideFilmstrip` for the insert buttons
- Add "Publish Curriculum" button in the top-right action bar
- Show skeleton loader on the canvas during generation

## 7. SlideFilmstrip Update

**File:** `src/components/admin/lesson-builder/SlideFilmstrip.tsx`

- Render `InsertAISlideButton` between each thumbnail (and at the end)
- Only shown when `canEdit` is true
- Pass `onInsertSlide(index, slide)` callback to splice into the array

## 8. Canvas Enhancements for Video Embeds

**File:** `src/components/admin/lesson-builder/canvas/CanvasEditor.tsx`

- When a slide has a video canvas element, render a YouTube iframe embed (using `youtube-nocookie.com` for privacy)
- Editable: clicking the video element shows a URL input to swap the video
- Read-only: plays inline

## Files Affected

| Action | File |
|--------|------|
| Modify | `supabase/functions/generate-lesson-plan/index.ts` |
| Create | `src/components/admin/lesson-builder/AISlideGeneratorPanel.tsx` |
| Create | `src/components/admin/lesson-builder/InsertAISlideButton.tsx` |
| Create | `src/components/admin/lesson-builder/utils/convertAISlideSchema.ts` |
| Create | `src/components/admin/lesson-builder/utils/fetchSlideImage.ts` |
| Modify | `src/components/admin/lesson-builder/AdminLessonEditor.tsx` |
| Modify | `src/components/admin/lesson-builder/SlideFilmstrip.tsx` |
| Modify | `src/components/admin/lesson-builder/canvas/CanvasEditor.tsx` |
| Modify | `src/pages/ContentCreatorDashboard.tsx` (minor — remove standalone AILessonArchitect from Step 1) |

## No Database Changes Required

The existing `curriculum_lessons` table and `Slide`/`CanvasElementData` types already support all required fields. Video URLs are stored in canvas element content. The `video_url` column added earlier remains for lesson-level video references.

