

## Plan: AI Co-Pilot Creator Studio Upgrade

This upgrades the Creator Studio from a basic text editor into an AI-powered authoring environment with lesson generation, content refinement, cover image generation, and a polished device-frame preview.

---

### 1. New Edge Function: `studio-ai-copilot`

A single edge function handling three modes via a `mode` parameter:

- **`generate`**: Takes `track`, `level`, `topic` and returns a full Markdown lesson using the "Elite Curriculum Designer" prompt (narrative intro, core concepts, interactive quiz, tone-matched to track)
- **`refine`**: Takes existing content + target level and rewrites it simpler/harder
- **`cover-image`**: Takes title + track and generates a cover image via `google/gemini-2.5-flash-image`, uploads to Supabase storage, returns the public URL

Uses `LOVABLE_API_KEY` for AI gateway calls. Uses `google/gemini-3-flash-preview` for text generation and `google/gemini-2.5-flash-image` for image generation.

```toml
[functions.studio-ai-copilot]
verify_jwt = false
```

---

### 2. Storage Bucket: `lesson-covers`

SQL migration to create a public storage bucket for generated cover images, with RLS allowing authenticated users to upload and public read access.

---

### 3. UI Overhaul: `CreatorStudio.tsx`

**New state:**
- `topic` (string) -- separate input for AI generation topic
- `generating` (boolean) -- loading state for AI generation
- `coverImageUrl` (string | null) -- generated cover image

**New layout elements:**
- **Topic input + "Generate Lesson" button** at top of editor -- calls `studio-ai-copilot` with mode `generate`, populates title + content
- **Focus Mode toggle** -- when active, dims everything except the editor textarea (opacity transition)

**Updated save flow:**
- Includes `coverImageUrl` in `ai_metadata` when saving to `curriculum_lessons`

---

### 4. UI Overhaul: `CreatorStudioPreview.tsx`

Replace the plain glassmorphic card with a **device frame preview**:
- A CSS tablet/phone frame (rounded border, notch, bezel) wrapping the content
- Cover image displayed as a hero banner at top of preview when present
- Track-specific styling:
  - **Playground**: Warm orange/yellow gradient header, rounded-3xl corners, emoji-rich
  - **Academy**: Dark with electric blue/purple neon accent border
  - **Professional**: Minimalist emerald/charcoal, sharp typography

---

### 5. UI Overhaul: `CreatorStudioAITools.tsx`

Add three new buttons to the Magic Wand popover:
- **"AI Refine"** -- calls `studio-ai-copilot` mode `refine` to simplify/adjust content to match selected CEFR level. Returns updated content that replaces the editor.
- **"Generate Cover Image"** -- calls `studio-ai-copilot` mode `cover-image`, shows the result in the preview
- **"Tone Check"** -- for Professional track, flags informal language; for Playground, flags overly formal language. Client-side heuristic with keyword lists.

Requires lifting `setContent` and `setCoverImageUrl` from `CreatorStudio` into the AI tools (pass as props or use a callback).

---

### 6. Mastery Badge Component

New `src/components/content-creator/MasteryBadge.tsx`:
- A glowing neon medal in dark mode (CSS box-shadow with animated pulse)
- A metallic gold coin in light mode (CSS gradient with shine animation)
- Displayed in the preview card when a lesson is marked as "published"
- Reusable -- can later be triggered in student dashboards on lesson completion

---

### Files

| File | Action |
|---|---|
| `supabase/functions/studio-ai-copilot/index.ts` | **New** -- AI generation, refinement, cover image |
| `supabase/config.toml` | Add `studio-ai-copilot` entry |
| SQL migration | Create `lesson-covers` storage bucket + policies |
| `src/components/content-creator/CreatorStudio.tsx` | Add topic input, generate button, focus mode, cover image state |
| `src/components/content-creator/CreatorStudioPreview.tsx` | Device frame, track-themed styling, cover image hero |
| `src/components/content-creator/CreatorStudioAITools.tsx` | Add Refine, Cover Image, Tone Check actions |
| `src/components/content-creator/MasteryBadge.tsx` | **New** -- dual-theme achievement badge |

