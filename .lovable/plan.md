# 4-Part Sequential PPP Generation Pipeline

Refactor the monolithic "generate everything in one call" into 4 small, fast, pedagogically-aligned chunks that stream into the deck as they arrive.

## The 4 Stages (PPP-aligned)

| # | Stage | Slides | Pedagogical role |
|---|-------|--------|------------------|
| 1 | `foundation`  | Intro + Spaced-Repetition Review + Target Vocabulary | Warm-up |
| 2 | `mechanics`   | Visual Grammar + Phonics/Pronunciation               | Presentation |
| 3 | `application` | Interactive games (Drag-Drop, Sentence Builder, Match) | Practice |
| 4 | `mastery`     | Roleplay/Production task + Lesson Review/Goodbye    | Production |

Each chunk is a separate Edge Function call → never times out, renders progressively.

## Frontend changes — `src/hooks/useUnifiedLessonGenerator.ts`

Replace the single `generateContent()` call inside `generateLesson()` with a sequential loop:

```ts
const STAGES = ['foundation', 'mechanics', 'application', 'mastery'] as const;
type StageId = typeof STAGES[number];

const STAGE_LABELS: Record<StageId, string> = {
  foundation:  'Generating Intro & Vocabulary…',
  mechanics:   'Generating Grammar & Phonics…',
  application: 'Generating Interactive Games…',
  mastery:     'Finalizing Roleplay & Review…',
};
```

- New state: `currentStage: StageId | null`, `setCurrentStage`.
- New state: `streamingSlides: GeneratedSlide[]` exposed to the modal sidebar.
- Loop:
  ```ts
  let allSlides: GeneratedSlide[] = [];
  for (const stage of STAGES) {
    setCurrentStage(stage);
    updateStage('content', { status: 'running', message: STAGE_LABELS[stage] });
    const chunk = await generateChunk(config, stage, allSlides, signal);
    allSlides = [...allSlides, ...chunk];
    setStreamingSlides(allSlides);            // progressive render
    updateStage('content', { progress: ((STAGES.indexOf(stage)+1)/4)*100 });
  }
  ```
- `generateChunk()` calls `n8n-bridge` (or a new direct call to `lesson-content-generator`) with payload:
  ```json
  { "action": "generate-lesson-chunk",
    "current_stage": "foundation",
    "previous_slide_count": 0,
    "topic": "...", "hub_type": "...", "ai_persona": "...",
    "level": "...", "cefr_level": "...", "duration_minutes": 60,
    "age_group": "...", "blueprint": { ... } }
  ```
- On any chunk failure: keep already-rendered slides, surface a "Retry this section" toast (uses existing `aiErrorHandler.ts`), do not blow away the deck.
- Games stage: only run `generateGames()` for `application` slides that came back as placeholders. Image stage and Finalizing stage stay as-is.

## Modal / sidebar UI

The "Generate Slides" button consumer (creator modal, e.g. `SuccessCreator`, Academy/Playground equivalents) reads `streamingSlides` + `currentStage` from the hook and:
- appends slides to the Lesson Blueprint sidebar as they arrive,
- shows a small badge/spinner: `STAGE_LABELS[currentStage]`.

No business-logic changes — purely a render of new hook state.

## Edge Function changes — `supabase/functions/lesson-content-generator/index.ts` and `n8n-bridge/index.ts`

1. Accept new payload fields: `current_stage`, `previous_slide_count`, `blueprint`.
2. Build the Gemini system prompt with a `switch (current_stage)`:
   - `foundation` → "Generate ONLY 3 slides: (1) Intro, (2) Spaced-Repetition Review of the previous lesson, (3) Target Vocabulary. Use the hub's `ai_persona`. Number slides starting at `previous_slide_count + 1`."
   - `mechanics` → "Generate ONLY 2–3 slides covering Visual Grammar explanation and Phonics/Pronunciation."
   - `application` → "Generate ONLY 3–4 interactive practice slides (drag_and_drop, sentence_builder, match_pairs). Each must include full game data (items, targets, correct answers)."
   - `mastery` → "Generate ONLY 2 slides: (1) Production roleplay/simulation task, (2) Lesson Review + Goodbye."
3. Keep `responseMimeType: "application/json"` and require a JSON **array** of slide objects: `[ { slide_type, phase, content, teacher_notes, … } ]`.
4. Keep `RAW_JSON_INSTRUCTION` + `parseAIJson` from `_shared/aiJson.ts`.
5. `n8n-bridge` adds a route for `action === 'generate-lesson-chunk'` that forwards to `lesson-content-generator` and returns `{ status, slides: [...] }`.

## Strict JSON / safety
- Each chunk is validated with `parseAIJson` and must be `Array.isArray`.
- Hub config (`HUB_CONFIGS`) continues to inject `ai_persona` per call — no regression to the age-locked behavior.
- All 4 calls reuse the same `AbortController` so Cancel still works mid-stage.

## Out of scope
- No DB schema changes.
- No changes to image/audio batch generation (those already chunk).
- Playground 30-min lessons keep the same 4 stages but the prompt yields fewer slides per stage (handled by existing `duration_minutes` hint).

## Files to edit
- `src/hooks/useUnifiedLessonGenerator.ts` — sequential loop + new exposed state.
- `src/pages/SuccessCreator.tsx` (and Academy/Playground creator pages) — render `streamingSlides` + `currentStage` label.
- `supabase/functions/lesson-content-generator/index.ts` — stage-aware prompt + array response.
- `supabase/functions/n8n-bridge/index.ts` — new `generate-lesson-chunk` action.
