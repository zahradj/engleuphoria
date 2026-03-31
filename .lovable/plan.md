

## Plan: Enhanced Slide Builder — Full Lesson Factory

### What You Described
You want the slide builder to be a complete lesson production environment where you can:
1. Upload pre-made slides (e.g., from Canva)
2. Embed videos via URL
3. Create vocabulary slides with AI-generated content
4. Add interactive activities (drag-and-drop, matching, quizzes, sorting)
5. Add audio/sounds and phonics
6. Ask AI to generate content per-slide (quiz, activity, images)
7. Save lessons to the library, organized by system (Playground, Academy, Professional Hub)
8. Curriculum browser filters by system so you work on one system at a time

### Current State
Most of the infrastructure already exists: canvas editor, element toolbar (text, image, shape, audio, quiz, matching, fill-blank, drag-drop), AI activity generator, curriculum browser, save-to-DB, and preview dialog. Key gaps to fill:

### Changes

**1. Curriculum Browser — Add system filter (Playground / Academy / Hub)**
- **File**: `CurriculumBrowser.tsx`
- Add a segmented control or dropdown at the top: "Playground", "Academy", "Professional Hub"
- Filter units by `age_group` (kids ages → Playground, teen ages → Academy, adult ages → Hub)
- This ensures each library is separate and organized

**2. Video embed support**
- **File**: `types.ts` — add `'video'` to `CanvasElementType`
- **File**: `ElementToolbar.tsx` — add Video button to toolbar
- **File**: `CanvasElement.tsx` — render embedded video (YouTube/Vimeo iframe) in the video element
- **File**: `PropertiesPanel.tsx` — add video URL input field for video elements
- **File**: `CanvasEditor.tsx` — add default size for video elements

**3. Sorting & Sentence Builder element renderers**
- **File**: `CanvasElement.tsx` — add render cases for `sorting`, `sentence-builder`, `drag-drop` (currently missing renderers)
- **File**: `PropertiesPanel.tsx` — add property editors for sorting (items list), sentence-builder (words), drag-drop (items + zones)
- **File**: `ElementToolbar.tsx` — add Sorting and Sentence Builder buttons (sorting exists in types but not in toolbar)

**4. Image upload for canvas image elements**
- **File**: `PropertiesPanel.tsx` — for `image` elements, add an "Upload Image" button that uploads to `lesson-slides` bucket and sets the `src` content property (currently only accepts a URL input)

**5. AI per-slide generation**
- **File**: `AdminLessonEditor.tsx` — add a "Generate for this slide" context action that passes the current slide context to AI and populates the selected slide with generated elements
- Reuse existing `AIActivityGenerator` but scope it to the active slide

**6. Preview dialog — render canvas elements**
- **File**: `LessonPreviewDialog.tsx` — currently only shows `imageUrl` or title. Update to render `canvasElements` on the 1920x1080 viewport using the same rendering logic as `CanvasElement` (read-only mode, no drag/resize handles)

**7. Save to library flow**
- **File**: `AdminLessonEditor.tsx` — the "Finish & Save to Library" button should mark the lesson as `is_published = true` in `curriculum_lessons` and show a success state

### Technical Details

| File | Change |
|---|---|
| `CurriculumBrowser.tsx` | Add system filter (Playground/Academy/Hub) mapped to age_group ranges |
| `types.ts` | Add `'video'` to `CanvasElementType` |
| `ElementToolbar.tsx` | Add Video, Sorting, Sentence Builder buttons |
| `CanvasEditor.tsx` | Add default sizes for new element types |
| `CanvasElement.tsx` | Add renderers for video (iframe), sorting, sentence-builder, drag-drop |
| `PropertiesPanel.tsx` | Add editors for video URL, sorting items, sentence-builder words, drag-drop zones; add image upload button |
| `LessonPreviewDialog.tsx` | Render canvasElements in read-only mode on scaled viewport |
| `AdminLessonEditor.tsx` | Wire "Finish" to publish lesson; per-slide AI generation |

