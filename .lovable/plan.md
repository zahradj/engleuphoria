## Goal

Refactor the inline "AI Generate" modal currently duplicated across the three Hub Creators (Playground / Academy / Success) into a single shared `GenerateLessonModal` component with a two-step **Auto-Fill → Generate Slides** flow. The teacher can review and edit the AI-suggested vocabulary, grammar, and phonics **before** committing to slide generation, and the validated blueprint hydrates the left-side `LessonBlueprintPanel` sidebar automatically.

---

## Phase 1 — Extract & Expand the Modal

**Current state**
- The "AI Generate" modal is inline JSX inside each hub page (`PlaygroundCreator.tsx` ~line 883, `AcademyCreator.tsx` ~855, `SuccessCreator.tsx` ~813), each with hub-specific colors. Inputs: Topic + CEFR Level only.
- Submit calls each hub's `generateWithAI()`, which internally calls `plan-lesson-blueprint` → `generate-ppp-slides` (so the AI plans the blueprint silently, with no chance to review).

**Changes**
1. Create `src/components/creator-studio/shared/GenerateLessonModal.tsx`:
   - Props: `open`, `onClose`, `hub: 'playground' | 'academy' | 'success'`, `defaultTopic`, `defaultLevel`, `defaultBlueprint?`, `onGenerate(payload) → Promise<void>`, `busy`.
   - Hub-aware theming via the existing per-hub gradient/border tokens (read from `hubTheme.ts`); same look as today, just centralized.
   - Renders the Topic input, CEFR select, then a new **Blueprint Details** section that is:
     - Collapsed by default with a chevron header `Blueprint Details (auto-filled by AI)`.
     - Auto-expands the moment Auto-Fill returns or the user clicks the header.
     - Inputs:
       - **Target Vocabulary** — five separate small text inputs (Word 1 … Word 5), arranged in a 5-column grid on desktop / 2-col on mobile. (Five inputs match the existing blueprint shape and the sidebar's bindings.)
       - **Grammar Focus** — single text input.
       - **Target Phonics** — single text input (free text label like "Short /a/").
2. Replace the inline modal in each hub page with `<GenerateLessonModal …/>`. Hub UI stays pixel-identical because the new component reuses the same Tailwind classes per hub.

---

## Phase 2 — Auto-Fill Step

**Changes**
1. Add a `✨ Auto-Fill Blueprint Details` button placed inline next to the Topic input (right side, small ghost button on desktop; full-width below the input on mobile).
2. On click:
   - Disable while `autoFillBusy === true`; show inline `Loader2`.
   - Call `supabase.functions.invoke('generate-gemini', { body: { … } })` with a compact JSON-mode prompt:
     ```
     system: "You are an ESL Curriculum Designer. Pick 5 target vocab + 1 grammar rule + 1 phonics focus suitable for the topic and CEFR level. Hub: <hub>."
     prompt: "TOPIC: <topic>\nCEFR LEVEL: <level>\nReturn ONLY: { vocabulary: string[5], grammar: string, target_phonics: string }"
     responseMimeType: 'application/json'
     temperature: 0.7
     ```
   - On success: populate the five vocab inputs, grammar, phonics; expand the Blueprint Details section; toast `Blueprint suggested — review and edit before generating.`
   - On failure: surface the error via `toast.error` (handle 429 / 402 like elsewhere).
3. Auto-Fill is **optional** — the teacher can also type values manually.

---

## Phase 3 — Generate Slides + Sidebar Hydration

**Changes**
1. Rename the primary submit button to `Generate Slides` (sparkles icon, hub gradient).
2. The button is disabled until: topic is non-empty AND **all 5 vocab slots are filled AND grammar is non-empty** (phonics optional). This forces the teacher through the review step.
3. On click, the modal calls the parent's `onGenerate({ topic, level, vocabulary, grammar, target_phonics })`. The hub page's handler:
   - **Skips** `plan-lesson-blueprint` (the modal already owns the validated blueprint).
   - Sets the sidebar state via `setBlueprint({ vocabulary, grammar, target_phonics, interests, specific_needs, ...keepAuxFields })` **immediately** so the left sidebar visibly fills before slide generation finishes.
   - Calls `generate-ppp-slides` with the merged blueprint shape already in use today (including `pedagogical_framework`, `phases`, `lesson_structure` derived from sensible per-hub defaults: Playground=Immersion, Academy=Discovery, Success=TaskBased — same defaults the edge function already applies when `phases` are missing, so we can omit them and let the function fill in).
   - On success, `setSlides(...)`, close the modal, toast `Generated N slides ✨`. Sidebar already shows the validated blueprint.
4. Re-opening the modal preserves the last-used values (`defaultBlueprint` is read from current sidebar state), so the teacher can iterate.

---

## Phase 4 — Cleanup

- Remove the inline modal JSX block (and its hub-specific styles) from each of the three hub pages.
- Delete the `interests` / `specific_needs` plumbing in the modal (those remain editable only in the sidebar — no UI change there).
- No edge-function changes are required: `generate-gemini` and `generate-ppp-slides` already accept the inputs we need. We are simply removing one intermediate auto-call (`plan-lesson-blueprint`) from this entry point.

---

## Verification Checklist

- [ ] All three hub pages render the same modal component; per-hub colors match the previous inline modal.
- [ ] `Auto-Fill Blueprint Details` populates 5 vocab + grammar + phonics from `generate-gemini` in <3 s.
- [ ] Teacher can edit any field after auto-fill.
- [ ] `Generate Slides` is disabled until vocab[5] + grammar are present.
- [ ] After clicking, the left `LessonBlueprintPanel` sidebar shows exactly the validated values.
- [ ] Slide generation still uses `generate-ppp-slides` and produces the same hub-themed slides as before.
- [ ] No visual regression in the Hub Creator pages (modal styling matches the prior inline version).

---

## Technical Notes

- Modal lives at `src/components/creator-studio/shared/GenerateLessonModal.tsx`; type-only re-exports the existing `LessonBlueprint` shape from `LessonBlueprintPanel`.
- The Auto-Fill prompt is intentionally tiny (single Gemini call, ~1k output tokens) for speed and cost.
- Sidebar hydration is performed in the hub's `onGenerate` handler before `await`-ing the slide call so the user sees the panel update instantly.
