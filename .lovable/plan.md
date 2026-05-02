## Trial Lesson Generator + Story Creator Engine

Two new generators inside Creator Studio (`/content-creator/*`), wired to the existing `ai-core` edge function via two new actions. Both save into `curriculum_lessons` so they reuse the existing slide renderer.

---

### 1. Routing & Navigation

Extend `CreatorContext.CreatorStep` from `'blueprint' | 'slide-builder' | 'library'` to also include `'trial' | 'story'`.

Update routing in `CreatorStudioShell.tsx` and add the two new steps to:
- `StudioSidebar.tsx` NAV array (desktop)
- `StudioMobileNav.tsx` NAV array (mobile)

New routes (handled by the existing `/content-creator/*` route):
- `/content-creator/trial` → `TrialCreator` step
- `/content-creator/story` → `StoryCreator` step

Add i18n keys to `src/translations/{english,arabic,spanish,french,italian,turkish}/nav.ts`:
- `nav.trial_creator` → "Trial Creator" / equivalents
- `nav.story_creator` → "Story Creator" / equivalents

Icons (lucide): `Zap` for Trial, `BookOpen` for Story. Adheres to flat 2.0 — no 3D.

---

### 2. New UI Components

**`src/components/creator-studio/steps/TrialCreator.tsx`**

Glassmorphic card form (respects hub palette tokens) with inputs:
- Target Demographic: `kids` (Playground/orange) | `teens` (Academy/purple) | `adults` (Success/green) — segmented buttons
- CEFR Level: A1 → C2 select
- Theme: text input (e.g., "Ordering coffee", "Job interview")
- "Generate Trial Lesson" button (disabled while loading; shows spinner + status)

On submit → call `supabase.functions.invoke('ai-core', { body: { action: 'generate_trial_lesson', demographic, cefr_level, theme } })`.
On success → `setActiveLessonData(...)`, persist via `persistLesson` with `ai_metadata.kind = 'trial'`, then navigate to `/content-creator/slide-builder` so the user lands directly in the editor with the generated 6–8 slides.

**`src/components/creator-studio/steps/StoryCreator.tsx`**

Same shell, inputs:
- CEFR Level (A1 → C2)
- Genre: select (Sci-Fi, Fairy Tale, Everyday Life, Mystery, Adventure, Slice of Life) + free-text "Other"
- Target Vocabulary: text input parsed by splitting on commas (5–10 words; client-side validation with friendly error)
- "Generate Story" button

On submit → call `ai-core` with `action: 'generate_story'`. On success same flow as trial but `ai_metadata.kind = 'story'`.

Error handling on both: 429 → "AI is heavily loaded. Please wait 10 seconds and try again." 402 → friendly "AI is temporarily at capacity, please retry." Other → toast `error.message`.

---

### 3. ai-core Edge Function Updates

`supabase/functions/ai-core/index.ts` — add two new action handlers and register them in the router switch.

**`handleGenerateTrialLesson(body)`** — action `generate_trial_lesson`:

Input: `demographic` (kids|teens|adults), `cefr_level`, `theme`.

System prompt (verbatim per spec, with hub-tone modifier):
```
You are designing a 30-minute Trial English Lesson. It must be highly engaging and shorter than standard lessons.
Limit the output to exactly 6 to 8 slides max.
Slide 1: Icebreaker/Hook. Slide 2-3: Quick Vocabulary Win. Slide 4-5: Interactive Speaking/Roleplay. Slide 6: Wrap-up and Celebration.
Tone: <kid-friendly with emojis | teen-friendly academic | refined professional> based on demographic.
Align language and complexity strictly to CEFR <level>.
```

Returns JSON shaped to match `ActiveLessonData` (lesson_title, target_goal, target_vocabulary, slides[] with `slide_type`, `title`, `content`, `teacher_script`, `visual_keyword`, `interactive_data` for MCQ/flashcard/drag types). Uses `callAIWithFailover` with `jsonMode: true`.

**`handleGenerateStory(body)`** — action `generate_story`:

Input: `cefr_level`, `genre`, `target_vocabulary` (string[]).

System prompt (verbatim):
```
Write a highly engaging story strictly aligned with the requested CEFR Level. You MUST naturally include the provided Target Vocabulary Words.
Break the story into 4 to 5 pages (slides).
For each page, generate an image_prompt that we can later use to generate illustrations.
Add 2 Reading Comprehension multiple-choice questions at the very end of the story.
```

Returns JSON: `{ title, slides: [{ page_number, narrative, image_prompt }, ...], comprehension: [{ question, options[4], correct_index }, x2] }`. Then in the handler, map this into `PPPSlide[]`:
- 4–5 narrative slides → `slide_type: 'text_image'`, `image_generation_prompt: image_prompt`
- 2 comprehension slides → `slide_type: 'multiple_choice'` with `interactive_data: MCQData`

Both handlers use the existing `callAIWithFailover` (Gemini direct → Lovable Gateway fallback) and surface `429`/`402` cleanly.

Update the router default-error message to include the two new action names.

---

### 4. Data Saving (curriculum_lessons)

Reuse `persistLesson` — extend it to accept an optional `kind: 'standard' | 'trial' | 'story'` param (default `'standard'`) and write it into `ai_metadata.kind`. No DB migration needed (the `ai_metadata` jsonb column already exists; `curriculum_lessons` has no `hub`/`is_trial` columns and `cycle_type` is constraint-bound).

Filtering in Master Library (`LibraryManager.tsx`): add a "Type" filter chip group — All / Standard / Trial / Story — matching `ai_metadata->>'kind'`.

---

### 5. Files to create / edit

Create:
- `src/components/creator-studio/steps/TrialCreator.tsx`
- `src/components/creator-studio/steps/StoryCreator.tsx`

Edit:
- `src/components/creator-studio/CreatorContext.tsx` — extend `CreatorStep` union
- `src/components/creator-studio/CreatorStudioShell.tsx` — route mapping + Step picker
- `src/components/creator-studio/StudioSidebar.tsx` — add 2 NAV entries
- `src/components/creator-studio/StudioMobileNav.tsx` — add 2 NAV entries
- `src/components/creator-studio/persistLesson.ts` — accept `kind` param, write `ai_metadata.kind`
- `src/components/creator-studio/steps/LibraryManager.tsx` — add Type filter (Standard/Trial/Story)
- `supabase/functions/ai-core/index.ts` — two new handlers + router cases
- `src/translations/*/nav.ts` (6 locales) — add `trial_creator` + `story_creator` keys

---

### Acceptance criteria

- Sidebar + mobile nav show 5 tabs: Blueprint, Slide Studio, **Trial Creator**, **Story Creator**, Master Library.
- Trial form generates a 6–8 slide lesson, lands the user in Slide Studio, row appears in `curriculum_lessons` with `ai_metadata.kind='trial'`.
- Story form generates 4–5 narrative slides + 2 MCQ comprehension slides, persists with `ai_metadata.kind='story'`.
- Master Library filter chips correctly filter by kind.
- 429/402 errors show friendly toasts (no "AI exhausted" wording).
