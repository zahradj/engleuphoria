

# Plan: AI Lesson Architect — Generator UI + Edge Function

## Summary

Build a Glassmorphism-styled "AI Lesson Architect" panel inside the Content Creator Dashboard (Step 1 area or as a new tab). It calls a new `generate-lesson-plan` edge function that uses the existing `GEMINI_API_KEY` secret to generate PPP-structured lesson plans via the Lovable AI Gateway. Results display in a Markdown viewer with Edit and Save capabilities, inserting into the existing `curriculum_lessons` table.

## 1. New Edge Function: `generate-lesson-plan`

**File:** `supabase/functions/generate-lesson-plan/index.ts`

- Reads `GEMINI_API_KEY` from `Deno.env`
- Accepts JSON body: `{ hub, topic, targetGrammar, targetVocabulary }`
- Validates inputs with basic checks (non-empty strings, hub in allowed list)
- Constructs a system prompt enforcing PPP pedagogy with hub-specific rules:
  - **Playground**: 30 min, high-energy, gamified, age 5-11
  - **Academy**: 60 min, grammar-focused deep learning, age 12-17
  - **Success**: 60 min, professional coaching, adults 18+
- Calls `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent` using the GEMINI_API_KEY directly (not the Lovable AI Gateway, since we have a dedicated Gemini key)
- Returns the generated Markdown lesson plan as `{ lessonPlan: string, hub, topic }`
- Includes CORS headers and proper error handling (429/402/500)

**Config:** Add `[functions.generate-lesson-plan]` with `verify_jwt = false` to `supabase/config.toml`

## 2. New Frontend Component: `AILessonArchitect`

**File:** `src/components/content-creator/AILessonArchitect.tsx`

A two-column layout (form left, output right) with Glassmorphism styling:

**Left Column — Form:**
- Hub Selection dropdown (Playground / Academy / Success Hub) with hub-colored badges
- Lesson Topic text input
- Target Grammar/Vocabulary text input
- "Generate Lesson Plan" button with pulsing animation during loading (uses `animate-pulse` + gradient border)

**Right Column — Output:**
- Markdown viewer using `react-markdown` (already in project or will be added)
- "Edit" button toggles between Markdown preview and a textarea for manual edits
- "Save to Curriculum Library" button that inserts into `curriculum_lessons` table:
  - `title`: extracted from topic
  - `target_system`: mapped from hub (playground/teens/adults)
  - `difficulty_level`: mapped from hub
  - `duration_minutes`: 30 or 60 based on hub
  - `content`: JSON with the markdown stored inside
  - `created_by`: current user ID
  - `is_published`: false (draft)

## 3. Integration into Content Creator Dashboard

**File:** `src/pages/ContentCreatorDashboard.tsx`

Add the `AILessonArchitect` component into Step 1 (Curriculum Step) as a tab or a prominent card, or as a floating action accessible from any step. The simplest approach: add it as a collapsible section within Step 1 below the curriculum explorer.

## 4. Database Migration

**No new tables needed.** The existing `curriculum_lessons` table has all required columns (`title`, `content`, `target_system`, `difficulty_level`, `duration_minutes`, `created_by`, `is_published`). The AI-generated content will be saved as a JSON object in the `content` column with the markdown in a `markdown` field.

## 5. Dependency

Add `react-markdown` package if not already present, for rendering the AI output.

## Files Affected

| Action | File |
|--------|------|
| Create | `supabase/functions/generate-lesson-plan/index.ts` |
| Create | `src/components/content-creator/AILessonArchitect.tsx` |
| Modify | `supabase/config.toml` (add function entry) |
| Modify | `src/pages/ContentCreatorDashboard.tsx` (integrate component) |
| Add dep | `react-markdown` (if missing) |

