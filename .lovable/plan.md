

## Plan: Redesign Slide Builder as a Lesson Factory

### Overview
Transform Step 3 (Slide Builder) into a full lesson authoring factory. The left panel becomes a **curriculum browser** showing units and lessons from the database. Clicking a lesson loads it into the editor. The existing canvas, AI tools, and activity generators remain. Add slide upload, proper save-to-database, and a lesson preview mode.

### Layout

```text
+---------------------------------------------------------------+
| Lesson Header (title, level, age, Save, Preview)              |
+----------+------------------+---------------------------------+
| Curriculum|  Slide Organizer |   Canvas Editor    | Properties |
| Browser   |  (thumbnails)    |   (1920x1080)      | Panel      |
| - Units   |  + Add Slide     |                    |            |
|   - Lessons|  AI Activities   |                    |            |
|            |  AI Quiz         |                    |            |
|            |  Upload Slide    |                    |            |
+----------+------------------+---------------------------------+
| Pipeline nav (Back / Finish & Save to Library)                |
+---------------------------------------------------------------+
```

### Changes

**1. New component: `CurriculumBrowser.tsx`** (in `lesson-builder/`)
- Fetches `curriculum_units` with nested `curriculum_lessons` from Supabase
- Tree view: collapsible units, each showing lesson titles
- Clicking a lesson loads its data (title, level, content/slides) into the editor
- Visual indicator for lessons that already have slide content vs empty
- Search/filter by unit

**2. Update `AdminLessonEditor.tsx`**
- Add `CurriculumBrowser` as a new left-most panel (before SlideOrganizer)
- Track `activeLessonId` state (the DB lesson being edited)
- When a lesson is selected from the browser, populate editor state from its `content` JSON column
- Update `handleSave` to upsert to `curriculum_lessons.content` using the lesson ID (not just console.log)
- Add image upload button to SlideOrganizer (upload to Supabase Storage, set as slide background)
- Wire Preview button to open a dialog showing slides in presentation mode

**3. Update `SlideOrganizer.tsx`**
- Add an "Upload Image" button per slide (uses Supabase Storage bucket)
- Show slide title or auto-label ("Slide 1", "Slide 2")

**4. New component: `LessonPreviewDialog.tsx`** (in `lesson-builder/`)
- Full-screen dialog that cycles through slides in order
- Renders canvas elements on the 1920x1080 viewport
- Arrow key navigation, slide counter

**5. Update `handleSave` logic**
- Save slides array as JSON into `curriculum_lessons.content` column
- Update `updated_at` timestamp
- Show success/error toast

**6. Storage bucket** (migration)
- Create `lesson-slides` storage bucket for uploaded slide images
- RLS policy: authenticated users can upload/read

### Technical Details

| Component | Key behavior |
|---|---|
| `CurriculumBrowser` | `useQuery` fetching units + lessons, tree UI with Accordion |
| `AdminLessonEditor` | New `activeLessonId` state, loads lesson on selection, saves to DB |
| `LessonPreviewDialog` | Dialog with scaled 1920x1080 viewport, keyboard nav |
| Storage | `lesson-slides` bucket, public read, authenticated write |
| Save | `supabase.from('curriculum_lessons').update({ content: slidesJSON }).eq('id', lessonId)` |

### Files to create/modify

- **Create**: `src/components/admin/lesson-builder/CurriculumBrowser.tsx`
- **Create**: `src/components/admin/lesson-builder/LessonPreviewDialog.tsx`
- **Modify**: `src/components/admin/lesson-builder/AdminLessonEditor.tsx` (add browser panel, save to DB, preview dialog)
- **Modify**: `src/components/admin/lesson-builder/SlideOrganizer.tsx` (add upload button)
- **Migration**: Create `lesson-slides` storage bucket with RLS

