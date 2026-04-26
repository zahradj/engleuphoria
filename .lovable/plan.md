# Phase 3: Slide Studio & PPP Generator

Build out the `<SlideStudio />` component so creators can auto-generate, edit, and publish a full PPP lesson into the `curriculum_lessons` library. The work spans one new edge function, several new UI components, and a wired-up publish flow that hands off to `<LibraryManager />`.

---

## 1. Edge Function — `generate-ppp-slides`

New function: `supabase/functions/generate-ppp-slides/index.ts`.

- Inputs: `lesson_title`, `objective`, `skill_focus`, `cefr_level`, `hub`.
- Uses Lovable AI Gateway (`google/gemini-3-flash-preview`) with **tool calling** for strict structured output (no JSON-in-text parsing).
- Returns a 6-slide PPP arc honoring the project's "Scaffolded Mastery" rule (Warm-Up → Presentation → Practice → Production → Review), with the right slide_type per phase.

Strict per-slide schema enforced via tool parameters:
```
{
  phase: 'Warm-up' | 'Presentation' | 'Practice' | 'Production' | 'Review',
  slide_type: 'text_image' | 'multiple_choice' | 'drawing_prompt',
  title: string,
  content: string,             // for MCQ: stringified JSON { question, options[], answer }
  teacher_script: string,      // 2–3 high-energy sentences
  visual_keyword: string       // 1–2 words, Unsplash-friendly
}
```
- IDs are generated client-side (`crypto.randomUUID()`) after the response so we don't trust the model with UUIDs.
- Handles 429 / 402 with proper status codes surfaced to the toast layer.

---

## 2. Context updates — `CreatorContext.tsx`

Extend `PPPSlide` so it matches the new schema without breaking existing fields:
```
slide_type?: 'text_image' | 'multiple_choice' | 'drawing_prompt'
teacher_script?: string         // new (replaces teacher_instructions in UI)
```
Keep legacy fields as optional. Also expose helper setters:
- `updateSlide(id, patch)` — patches one slide and flips `isDirty`.
- `replaceSlides(slides[])` — used after generation.

---

## 3. New components under `src/components/creator-studio/steps/slide-studio/`

```
slide-studio/
  SlideStudio.tsx          // orchestrator (replaces current placeholder)
  EmptyState.tsx           // big "✨ Auto-Generate PPP Slides" CTA
  SlideThumbnailRail.tsx   // LEFT column — phase-grouped thumbnails
  SlideCanvas.tsx          // CENTER column — WYSIWYG with Unsplash bg
  TeacherControlsPanel.tsx // RIGHT column — script + slide_type dropdown
  phaseTheme.ts            // shared phase color tokens
```

### `SlideStudio.tsx` (orchestrator)
- Reads `activeLessonData` from context. If missing → friendly "Pick a lesson from the Blueprint first" panel + button to switch step.
- Renders header strip with **Lesson Title** + **Objective** + skill badge.
- If `slides.length === 0` → render `<EmptyState />`.
- Else → 3-column grid `grid-cols-[260px_1fr_320px]` with the rail / canvas / controls.
- Holds `activeSlideId` local state.

### `EmptyState.tsx`
- Massive centered card, gradient CTA "✨ Auto-Generate PPP Slides".
- Calls `supabase.functions.invoke('generate-ppp-slides', …)` with a loading state.
- On success → assigns UUIDs and `replaceSlides(...)`, auto-selects first slide.
- Surfaces 402 / 429 with branded toasts per workspace rules.

### `SlideThumbnailRail.tsx`
- Scrollable list grouped by PPP phase, color-coded with `phaseTheme.ts` (Warm-Up amber, Presentation blue, Practice purple, Production emerald, Review slate).
- Each card shows phase chip, slide number, truncated title, and a tiny `slide_type` icon.
- Click sets active slide.

### `SlideCanvas.tsx`
- Uses `https://source.unsplash.com/1024x768/?{visual_keyword}` as background with a dark overlay for readability.
- Inline-editable **title** (`contentEditable` styled input) and **content** (textarea) with debounced `updateSlide`.
- For `multiple_choice`: parses `content` JSON and shows editable question + chip options (falls back gracefully if JSON malformed).
- For `drawing_prompt`: renders a prompt card with a placeholder canvas illustration.
- Glassmorphic card per workspace branding.

### `TeacherControlsPanel.tsx`
- Textarea bound to `teacher_script`.
- `slide_type` dropdown (shadcn `Select`) — switching triggers a sane content reset (e.g. picking `multiple_choice` seeds a default `{question, options, answer}` JSON).
- `visual_keyword` input (so creators can re-roll the background).
- Read-only phase chip with note that phase is set by the blueprint.

---

## 4. Publish flow — `StudioHeader.tsx`

Make the header context-aware:
- When `currentStep === 'slide-builder'` and there are slides, the existing **Publish** button becomes **💾 Save & Publish to Library**.
- Click handler:
  1. Build payload:
     ```
     {
       title: activeLessonData.lesson_title,
       description: activeLessonData.target_goal,
       target_system: activeLessonData.hub,        // playground | academy | success
       difficulty_level: activeLessonData.cefr_level,
       skills_focus: [source_lesson.skill_focus],
       content: { slides: [...] },
       ai_metadata: { source: 'creator-studio-ppp', generated_at, blueprint_ref },
       is_published: true,
       created_by: auth.user.id,
       level_id / unit_id: from blueprint if present
     }
     ```
  2. `supabase.from('curriculum_lessons').insert(payload).select().single()`.
  3. On success → toast "Lesson published 🎉", clear `activeLessonData`, set `isDirty=false`, switch step to `library`.
  4. On error → toast with the Postgres message; don't clear state.

Save Draft (existing button) reuses the same insert with `is_published: false`.

---

## 5. LibraryManager — minimal touch

Out of scope for the full library build, but to make the post-publish landing useful we'll add a small "Recently published" list to `LibraryManager.tsx`: query `curriculum_lessons` filtered by `created_by = auth.uid()` ordered by `updated_at desc limit 10`, with a phase-coloured strip and the lesson title. Full library UI stays for Phase 4.

---

## Technical details

- **Schema**: `curriculum_lessons` already has `content jsonb`, `ai_metadata jsonb`, `skills_focus text[]`, `is_published bool`, `created_by uuid`, `target_system text`, `difficulty_level text` — no migration required. Slides are stored under `content.slides`.
- **Auth**: insert relies on existing RLS for content creators (`created_by = auth.uid()`); we won't touch policies.
- **AI**: edge function uses Lovable AI Gateway with tool-calling for structured output. Default model `google/gemini-3-flash-preview`. CORS + 402/429 handled per house standard.
- **Unsplash** is loaded as a plain `<img>` / CSS `background-image` from `source.unsplash.com` — no key, with a neutral gradient fallback if the request fails.
- **Branding**: glassmorphism cards, hub-specific accent colors in the canvas chrome (Playground orange / Academy purple / Success emerald) read from `activeLessonData.hub`.
- **No mock data, no placeholder slides** — empty state until the AI runs, per project rules.

---

## Files

**New**
- `supabase/functions/generate-ppp-slides/index.ts`
- `src/components/creator-studio/steps/slide-studio/SlideStudio.tsx`
- `src/components/creator-studio/steps/slide-studio/EmptyState.tsx`
- `src/components/creator-studio/steps/slide-studio/SlideThumbnailRail.tsx`
- `src/components/creator-studio/steps/slide-studio/SlideCanvas.tsx`
- `src/components/creator-studio/steps/slide-studio/TeacherControlsPanel.tsx`
- `src/components/creator-studio/steps/slide-studio/phaseTheme.ts`

**Edited**
- `src/components/creator-studio/steps/SlideStudio.tsx` (re-export new orchestrator)
- `src/components/creator-studio/CreatorContext.tsx` (extend `PPPSlide`, add helpers)
- `src/components/creator-studio/StudioHeader.tsx` (wire publish/save-draft to Supabase + step switch)
- `src/components/creator-studio/steps/LibraryManager.tsx` (recent published list)
