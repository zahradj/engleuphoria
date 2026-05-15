## Goals

Three independent improvements to the classroom + creator studio:

1. Fix overlay collision in **StudentClassroom** (XP/points badge covering End Class).
2. Add **"Generate with AI"** buttons inside the option-list editors (Multiple Choice, True/False, Options) so creators can append items via a prompt.
3. Build a **Smart Contextual Dictionary popover** for any text rendered via `RichText` / reading slides.

---

## 1. StudentClassroom overlay fix

`src/components/student/classroom/StudentClassroom.tsx` currently has two fixed elements colliding with the End Class control:
- `fixed top-3 right-3 z-[110]` (line ~299) – realtime/connection chip
- `fixed top-3 right-4 z-30` (line ~534) – `XPStreakIndicator` (the points badge)

`StudentClassroomHeader` already renders the End Class button on the right, so both `fixed` overlays sit on top of it.

**Fix:** Mirror the teacher pattern — pass the XP/points + connection status into `StudentClassroomHeader` as props and render them inline before the `|` divider preceding End Class. Remove both `fixed top-3 right-*` blocks from `StudentClassroom.tsx`. Keep the same star/XP visuals (scaled), just relocate them.

---

## 2. "Add with AI" inside option editors

Affected editors (all read/write `slide.options[]` or `slide.items[]`):
- `src/components/creator-studio/shared/DynamicListEditor.tsx` — the shared list editor used by Multiple Choice, True/False, Options, Word Bank, etc.
- `src/components/lesson-player/editorial/EditorialQuizMCQ.tsx` (preview surface — no edit changes needed)

**Plan:**
- Add an **"+ Add with AI"** button next to the existing "+ Add option" in `DynamicListEditor`.
- Clicking opens a small inline prompt (`Popover` + textarea + Generate button): "Describe what to add (e.g. 'one more distractor about past tense')".
- On submit → call a new edge function `generate-activity-options` with `{ activityType, currentItems, slideContext, count }`.
- Function returns `{ items: [{label, isCorrect?}, …] }`; client appends them to `slide.options`.
- Reuses the existing Lovable AI Gateway pattern (`google/gemini-3-flash-preview`, structured output via `Output.object` + Zod).
- Surfaces 402/429 with the same toast pattern used in `StorybookEditor`.

---

## 3. Smart Contextual Dictionary popover

### 3a. Component
`src/components/lesson-player/DictionaryPopover.tsx`
- Built on Radix `Popover` (already in `src/components/ui/popover.tsx`) anchored to a virtual element at the selection rect.
- Sections: selected **word** (large), small **thumbnail image**, **English definition**, **translation in student's language** (from `useLanguage()` → `language` option mapped to ISO code).
- Loading state uses the existing `Skeleton` component.
- Premium look: `rounded-2xl`, `shadow-2xl`, `backdrop-blur`, hub-themed accent ring via `useHubClassroomTheme`. Dismiss on click-outside (Radix default) + Esc.

### 3b. Selection logic
- `src/components/lesson-player/RichText.tsx`: wrap rendered nodes in a `<span onMouseUp={...} onDoubleClick={...}>`. On `mouseup`, read `window.getSelection()`, capture single-word selection (or word under cursor on dblclick), and the **surrounding sentence** by walking the parent text node and slicing on `.!?`.
- Emits to a new lightweight context/provider `DictionaryContext` (mounted once near the lesson player root) so any RichText instance can trigger the same popover.
- Also wire `SlideReadingSplit` passages (already use `RichText`, so free).

### 3c. Edge function
`supabase/functions/fetch-dictionary-definition/index.ts`
- Input: `{ word, context, language, hub }`
- **Cache check:** new table `dictionary_cache (id, word, context_hash, language, definition, translation, image_url, created_at)` with unique `(word, context_hash, language)`. `context_hash` = sha-256 of normalised sentence.
- **AI generation (cache miss):** Lovable AI Gateway `google/gemini-3-flash-preview` with `Output.object` schema returning `{ definition, translation }` grounded on the surrounding sentence + target language.
- **Visual aid:** call existing `imageGenerationService` / `ai-image-generation` edge function with hub-branded prompt ("flat vector icon, single subject, [hub] accent color").
- Persist row → return JSON `{ definition, translation, image_url, cached: false }`.
- Standard CORS + 402/429 surfacing.

### 3d. DB migration
```sql
create table public.dictionary_cache (
  id uuid primary key default gen_random_uuid(),
  word text not null,
  context_hash text not null,
  language text not null,
  definition text not null,
  translation text not null,
  image_url text,
  created_at timestamptz default now(),
  unique (word, context_hash, language)
);
alter table public.dictionary_cache enable row level security;
create policy "dictionary_cache_read" on public.dictionary_cache
  for select to authenticated using (true);
-- writes happen from edge function with service role.
```

---

## Out of scope
- Teacher-side "add with AI" already lives in other editors (Storybook); only option-list editors get it now.
- No changes to existing stars/sync icons from the previous turn.
- No multi-word phrase translation (single word only for v1).

## Files to add / edit
- edit `src/components/student/classroom/StudentClassroom.tsx`
- edit `src/components/student/classroom/StudentClassroomHeader.tsx`
- edit `src/components/creator-studio/shared/DynamicListEditor.tsx`
- new `supabase/functions/generate-activity-options/index.ts`
- new `src/components/lesson-player/DictionaryPopover.tsx`
- new `src/components/lesson-player/DictionaryContext.tsx`
- edit `src/components/lesson-player/RichText.tsx`
- new `supabase/functions/fetch-dictionary-definition/index.ts`
- new migration creating `dictionary_cache`
