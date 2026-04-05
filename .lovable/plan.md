

## Problem Analysis

There are **two distinct issues** to address:

### Issue 1: Slide Generation Not Aligned with Lesson Prompt
The current `generatePPPLesson.ts` is a **hardcoded template engine**, not an AI-driven generator. It uses static topic packs with generic vocabulary (e.g., "Learn", "Play", "Great") that have nothing to do with the user's lesson prompt. The `lessonPrompt` field is only appended as text to a few slides but does **not** influence the actual vocabulary, grammar, activities, or structure.

**Root cause**: The generator picks from a small set of predefined `TopicPack` objects. If the topic doesn't match a known key (only "hello pip" exists for playground), it falls back to a completely generic pack with irrelevant vocabulary.

### Issue 2: Remove the "Manager Review & Produce" page (Step 2)
The user wants to remove the Curriculum Manager (Step 2) from the pipeline, going directly from Blueprint to Slide Builder.

---

## Plan

### Step 1: Replace hardcoded generator with AI-powered generation

**File: `src/components/admin/lesson-builder/ai-wizard/generatePPPLesson.ts`**

- Create a new function `generatePPPLessonWithAI` that sends the lesson prompt, topic, level, age group, and hub config to the **Gemini AI** (via the `studio-ai-copilot` edge function or the `ai-gateway` script pattern).
- The AI will generate a properly structured `TopicPack` (vocabulary with contextual image keywords, grammar target, objectives, dialogue lines, activities) based on the **actual lesson prompt**.
- The existing `generatePPPLesson` function will then use this AI-generated pack instead of the hardcoded one, preserving all the slide-building logic.

**File: `src/components/admin/lesson-builder/ai-wizard/AILessonWizard.tsx`**

- Update `handleGenerate` to call the async AI-powered generation function.
- Make the generation steps reflect actual AI progress (not fake timers).

**New edge function or use existing**: Use the existing `studio-ai-copilot` edge function's `generate` mode, or call the AI gateway directly from the client via a new dedicated function. The prompt will instruct the AI to return a JSON `TopicPack` with vocabulary, grammar, objectives, etc., all aligned with the lesson prompt.

### Step 2: Remove the Manager page (Step 2) from the pipeline

**File: `src/pages/ContentCreatorDashboard.tsx`**
- Remove the `CurriculumManager` import and its case in `renderStepContent`.
- Change `PipelineStep` to go from 1 → 2 (Slide Builder) → 3 (Library), renumbering steps.

**File: `src/components/content-creator/ContentCreatorStepper.tsx`**
- Remove the "Manager" step from `STEPS` array.
- Update `PipelineStep` type to `1 | 2 | 3`.

**File: `src/pages/ContentCreatorDashboard.tsx`**
- Adjust `goNext`/`goPrev` max to 3.
- Update step 2 to render `AdminLessonEditor` and step 3 to render `LessonLibraryHub`.

---

## Technical Details

### AI-Powered TopicPack Generation

The system prompt sent to Gemini will be:

```
You are an ESL curriculum expert. Given a lesson topic, prompt, CEFR level, 
and age group, generate a structured vocabulary and activity pack as JSON.

Return ONLY valid JSON with this structure:
{
  "vocabulary": [{ "word", "definition", "exampleSentence", "fillBlank", "imageKeywords", "emoji" }],
  "grammarTarget": "...",
  "grammarExamples": ["..."],
  "warmUpQuestion": "...",
  "objectives": ["..."],
  "dialogueLines": ["..."],
  "gameDescription": "...",
  "productionTask": "...",
  "songOrChant": "..."
}
```

The lesson prompt will be the primary driver of content. This ensures vocabulary, grammar, and activities are all relevant to the stated objectives.

### Pipeline Simplification

```text
BEFORE:  Blueprint → Manager → Slide Builder → Library
AFTER:   Blueprint → Slide Builder → Library
```

### Files Modified
1. `src/components/admin/lesson-builder/ai-wizard/generatePPPLesson.ts` — Add AI-powered TopicPack generation
2. `src/components/admin/lesson-builder/ai-wizard/AILessonWizard.tsx` — Wire async AI generation
3. `src/pages/ContentCreatorDashboard.tsx` — Remove step 2, renumber
4. `src/components/content-creator/ContentCreatorStepper.tsx` — Remove Manager step, update type

