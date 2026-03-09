

## Analysis: Your Blueprint vs. Existing Architecture

Your project already has a mature, normalized curriculum database that is **more capable** than the proposed `materials` table. Creating a separate `materials` table would duplicate functionality and fragment content.

Here is what already exists:

| Your Proposal | Already Exists |
|---|---|
| `materials.track` (playground/academy/professional) | `curriculum_lessons.target_system` (kids/teens/adults) |
| `materials.level` (A1-C2) | `curriculum_lessons.difficulty_level` + `curriculum_levels.cefr_level` |
| `materials.content` (Markdown) | `curriculum_lessons.content` (JSON with full slide data) |
| `materials.status` (draft/published) | `curriculum_lessons.is_published` |
| `materials.created_by` | Missing -- this is the one gap |
| `materials.ai_metadata` | Missing -- another gap |
| `materials.language` | Missing -- for future translation |
| `library_assets` table | Already stores PDFs, videos, images, games |
| `lesson_materials` junction table | Already links assets to lessons |

### Recommended Plan

Instead of a parallel table, **extend the existing schema** and build the Creator Studio UI on top of it.

---

### 1. Database Migration: Extend `curriculum_lessons`

Add the missing columns to the existing table:

```sql
ALTER TABLE curriculum_lessons
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.users(id),
  ADD COLUMN IF NOT EXISTS ai_metadata JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';
```

Add an RLS policy for content creators:

```sql
CREATE POLICY "Content creators can manage lessons"
ON curriculum_lessons FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'content_creator')
  OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  public.has_role(auth.uid(), 'content_creator')
  OR public.has_role(auth.uid(), 'admin')
);
```

---

### 2. New Sidebar Tab: "Creator Studio"

Add a `creator-studio` tab to `ContentCreatorSidebar.tsx` and build a new component `CreatorStudio.tsx`.

---

### 3. Creator Studio UI (`src/components/content-creator/CreatorStudio.tsx`)

A split-screen editor:

```text
+---------------------------+---------------------------+
|   EDITOR (Left)           |   LIVE PREVIEW (Right)    |
|                           |                           |
|  [Title input]            |   Glassmorphic card       |
|  [Track pills: PG/AC/PR] |   showing rendered        |
|  [Level selector: A1-C2]  |   Markdown content        |
|  [Markdown textarea]      |   as a student would      |
|                           |   see it                  |
|  [Magic Wand] floating    |                           |
|  - Generate quiz          |   [Readability meter]     |
|  - Extract vocabulary     |   "Level: B2"             |
|  - Generate cover image   |                           |
+---------------------------+---------------------------+
|  [Save Draft]  [Publish]                              |
+-------------------------------------------------------+
```

**Features:**
- **Track selector**: Three pill buttons mapping to `target_system` values (`kids` / `teens` / `adults`)
- **Level selector**: CEFR dropdown (A1-C2) mapping to `difficulty_level`
- **Markdown editor**: Textarea with content, saved as Markdown string inside the JSON `content` column
- **Live preview**: Right panel renders the Markdown in a glassmorphic card using `dangerouslySetInnerHTML` with DOMPurify (already installed)
- **Save**: Inserts/updates `curriculum_lessons` with `created_by = auth.uid()`, `ai_metadata`, `language`

**AI Tools (Magic Wand popover):**
- **Auto-Quiz**: Calls existing `quiz-generator` edge function
- **Extract Vocabulary**: Calls existing `curriculum-expert-agent` with a vocabulary extraction prompt
- **Generate Cover Image**: Calls Nano Banana (gemini-2.5-flash-image) via a new edge function, uploads to storage, saves as `thumbnail_url`
- **Readability meter**: Client-side calculation based on sentence length and word complexity, displayed as estimated CEFR level

---

### 4. Files to Create/Modify

| File | Action |
|---|---|
| DB migration | Add `created_by`, `ai_metadata`, `language` columns + RLS policy |
| `src/components/content-creator/ContentCreatorSidebar.tsx` | Add `creator-studio` tab |
| `src/components/content-creator/CreatorStudio.tsx` | **New** -- split-screen editor |
| `src/components/content-creator/CreatorStudioPreview.tsx` | **New** -- glassmorphic live preview |
| `src/components/content-creator/CreatorStudioAITools.tsx` | **New** -- Magic Wand popover with AI actions |
| `src/components/content-creator/ReadabilityMeter.tsx` | **New** -- real-time CEFR level estimator |
| `src/pages/ContentCreatorDashboard.tsx` | Add `creator-studio` case to switch |

No new edge functions are strictly required (reuses existing `quiz-generator` and `curriculum-expert-agent`). Cover image generation can be added as a follow-up.

