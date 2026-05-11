# Blueprint Schema Expansion — SWBAT, Final Task, Language Variant, Visual Theme

Add four new pedagogical / visual fields end-to-end: blueprint type → Generate Lesson modal inputs → AI auto-fill prompt → slide generator → image prompt aesthetic.

## 1. Type & payload changes

**`src/components/creator-studio/shared/blueprintTypes.ts`**
- Add to `LessonBlueprint`:
  - `learning_objective?: string` — SWBAT statement
  - `final_output_task?: string` — production-stage task description
  - `language_variant?: LanguageVariant`
  - `visual_theme?: VisualTheme`
- Add union types + label maps:
  - `LanguageVariant = 'American English' | 'British English' | 'Global/Neutral'` (default `'American English'`)
  - `VisualTheme = '3D Animation' | 'Anime/Manga' | 'Watercolor' | 'Professional/Realistic'` (default `'Professional/Realistic'`)
- Export `VISUAL_THEME_PROMPT_SUFFIX: Record<VisualTheme, string>` with the exact aesthetic phrase to append to image prompts (e.g. `'3D Animation' → ', rendered in vibrant Pixar-style 3D animation, soft global illumination, clean vector edges'`).

**`GenerateLessonPayload`** (in `GenerateLessonModal.tsx`)
- Add: `language_variant: LanguageVariant`, `visual_theme: VisualTheme`.
- Also surface AI-produced `learning_objective` and `final_output_task` back to caller via a new optional `onBlueprintHints` callback OR (preferred) include them in `GenerateLessonPayload` as `learning_objective?: string`, `final_output_task?: string` so the three Creator pages can store them on the blueprint.

## 2. Generate Lesson modal UI

**`src/components/creator-studio/shared/GenerateLessonModal.tsx`**
- Add two new dropdowns above the "Blueprint Details" collapsible (always visible, side-by-side on `sm:`):
  - **Language Variant** — `American English` (default) / `British English` / `Global/Neutral`
  - **Visual Theme** — `Professional/Realistic` (default) / `3D Animation` / `Anime/Manga` / `Watercolor`
- Persist selections via `useState`, re-sync on `open` like other fields.
- Pass both into `onGenerate` payload.

**Auto-Fill prompt update (inside `handleAutoFill`)**
- Extend the JSON shape requested from `generate-gemini` to also return:
  - `learning_objective` — single sentence starting with `"Student will be able to ..."`, functional, observable, level-appropriate.
  - `final_output_task` — one-sentence production task (roleplay / debate / free speak / show-and-tell) that proves mastery of grammar+vocab.
- Update system prompt: include current `language_variant` so spelling/vocab in suggestions matches it (e.g. avoid "fries" if British).
- Store returned `learning_objective` and `final_output_task` in new local state and render them as **read-only preview cards** inside the Blueprint Details panel (with a small ✏ edit toggle so the teacher can refine).

## 3. AI prompt — `generate-gemini` consumers

No changes to the generic `generate-gemini` edge function itself (it's a passthrough). The new fields are handled by:
- The auto-fill prompt above (modal).
- `plan-lesson-blueprint/index.ts` and `generate-ppp-slides/index.ts` (below).

## 4. Blueprint planner & slide generator

**`supabase/functions/plan-lesson-blueprint/index.ts`**
- Accept new optional inputs: `learning_objective`, `final_output_task`, `language_variant`, `visual_theme`.
- Inject into system prompt:
  - `LANGUAGE VARIANT: <variant>. Use matching spelling and regional vocabulary throughout.`
  - `VISUAL THEME: <theme>. Every image_prompt MUST end with: "<VISUAL_THEME_PROMPT_SUFFIX[theme]>".`
  - If `learning_objective`/`final_output_task` provided, treat as authoritative; otherwise instruct AI to generate them and include them in the returned JSON.
- Add `learning_objective` and `final_output_task` to the JSON schema returned to client.
- Add a hard rule: **the final slide of `lesson_structure` MUST be a `production` / `free_speaking` phase whose `note` matches `final_output_task` verbatim.**

**`supabase/functions/generate-ppp-slides/index.ts`**
- Accept the same four fields from request body.
- Append `VISUAL_THEME_PROMPT_SUFFIX[theme]` to every generated `image_prompt` / `image_prompt_detailed` (server-side guarantee even if model forgets).
- Inject `LANGUAGE VARIANT` rule into the system prompt.
- Ensure final slide content reflects `final_output_task`.

## 5. Wire the three Creator pages

**`src/pages/PlaygroundCreator.tsx`, `AcademyCreator.tsx`, `SuccessCreator.tsx`**
- Extend the local blueprint state with the four new fields.
- Pass `defaultLanguageVariant` (`'American English'`) and `defaultVisualTheme` (`'Professional/Realistic'`) to `GenerateLessonModal`.
- In the `onGenerate` handler, forward `language_variant`, `visual_theme`, `learning_objective`, `final_output_task` into both:
  - `plan-lesson-blueprint` invocation
  - `generate-ppp-slides` invocation
- Persist the four new fields onto the blueprint object stored in component state so subsequent regeneration reuses them.

## 6. Blueprint preview (read-only display)

**`src/components/creator-studio/shared/LessonBlueprintPanel.tsx`**
- Add two new info rows at the top of the panel:
  - **🎯 Learning Objective (SWBAT):** `{learning_objective}`
  - **🏁 Final Output Task:** `{final_output_task}`
- Add small chip row showing **Variant:** `{language_variant}` · **Theme:** `{visual_theme}`.

## Verification

1. Open Creator Studio → click Generate Lesson → see new "Language Variant" and "Visual Theme" dropdowns above Blueprint Details.
2. Click Auto-Fill → AI returns vocab/grammar **plus** SWBAT and Final Task; both render in the modal.
3. Submit → blueprint panel shows SWBAT + Final Task + variant/theme chips.
4. Inspect generated slides JSON: every `image_prompt` ends with the chosen theme suffix; final slide is a production task matching `final_output_task`; spelling matches variant (e.g. "colour" for British).

## Out of scope
- No DB schema changes — fields ride along with the existing JSON blueprint payload.
- No changes to the lesson player renderer.
- No new edge functions; only updates to `plan-lesson-blueprint` and `generate-ppp-slides`.