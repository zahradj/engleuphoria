# Hybrid Academy Creator — Implementation Plan

Mirror the Playground Creator pattern to add a fully integrated **Academy Creator** inside the existing Creator Studio Shell. Reuse the shared editor state engine; swap viewport + AI prompt based on the active hub.

## 1. Routing & Navigation

- `CreatorContext.tsx`: extend `CreatorStep` union with `'academy-creator'`.
- `CreatorStudioShell.tsx`:
  - Map path `/content-creator/academy-creator` → step `academy-creator`.
  - Render `<AcademyCreator />` for that step.
- `StudioSidebar.tsx` & `StudioMobileNav.tsx`:
  - Add nav entry: key `academy-creator`, icon `GraduationCap`, emoji `🎓`, label "Academy Creator", fallback string.
  - Active state uses Academy palette (indigo/purple) instead of amber when on this route, via a small per-item accent override.

## 2. Academy Creator Page (`src/pages/AcademyCreator.tsx`)

Refactor existing standalone page to plug into Studio Shell (no own header/sidebar):

- Reuse the same shared slide state hook used by Playground (`slides`, `activeIndex`, add/delete/reorder/duplicate, AI generate modal).
- Three-pane layout matching Playground Creator:
  - **Left**: slide list (block badges: Warm-up, Vocab, Reading, Grammar, Practice, Interactive, Speaking).
  - **Center**: live preview rendered by the **AcademyDemo engine** (same components used in `/academy-demo`), bound to the active slide.
  - **Right**: contextual editor form for the active slide type.
- Editor forms per Academy block:
  - Pedagogical metadata header (CEFR level, target grammar, vocab list, duration).
  - Warm-up: opinion/poll prompt + options.
  - Vocabulary: word list + matching pairs (with optional image generation via existing `usePlaygroundImages` reused as a generic asset hook — or a sibling `useAcademyImages` if style differs).
  - Reading/Listening: passage text, TTS script (non-autoplay), comprehension TF/MCQ.
  - Grammar: rule explanation + error-detection items.
  - Practice: fill-in-the-blank, sentence builder.
  - Interactive: debate/roleplay prompts.
  - Speaking: free-output prompt + rubric.
- "Generate with AI" modal: collects topic, CEFR level, target grammar, vocab focus → calls edge function with `hub_type: 'academy'`.

## 3. AI Generation — Edge Function Update

Extend `supabase/functions/generate-ppp-slides/index.ts`:

- Branch on `hub_type === 'academy'`:
  - **System prompt**: "You are a Master TEFL/CELTA-trained lesson designer for teenagers. Produce a 60-minute, 7-block academy lesson with rigorous progression, level-appropriate language for the given CEFR, and authentic communicative tasks."
  - **Strict JSON schema** enforced via tool-calling (`tools` + `tool_choice`):
    ```
    { academy_slides: [
      { block: 'warmup'|'vocabulary'|'reading'|'grammar'|'practice'|'interactive'|'speaking',
        title, instructions, content: {...block-specific shape} }
    ]}
    ```
  - **Validation**: must contain at least one slide per block, in the order Warm-up → Vocabulary → Reading → Grammar → Practice → Interactive → Speaking.
  - **2-retry loop**: on schema/order failure, re-prompt with the validator's error message; throw after 2nd retry.
- Keep existing Playground branch untouched.
- Return `{ academy_slides }` for academy, `{ slides }` for playground (current).

## 4. Translations

Add `nav.academy_creator` key to `src/translations/english/nav.ts` (and other locales as fallback strings already cover them).

## Technical Details

**Files to modify**
- `src/components/creator-studio/CreatorContext.tsx`
- `src/components/creator-studio/CreatorStudioShell.tsx`
- `src/components/creator-studio/StudioSidebar.tsx`
- `src/components/creator-studio/StudioMobileNav.tsx`
- `src/pages/AcademyCreator.tsx` (refactor to shell-embedded)
- `supabase/functions/generate-ppp-slides/index.ts` (academy branch + schema + retry)
- `src/translations/english/nav.ts`

**Reuse**
- AcademyDemo rendering components for live preview.
- Same slide-state engine that powers Playground Creator (no fork).
- Existing `generate-ppp-slides` infrastructure (auth, CORS, hydration helper).

**Out of scope**
- New DB tables (uses existing lesson persistence layer).
- Asset generation pipeline changes (Playground image hydration stays Playground-only unless an Academy slide explicitly requests an image).
