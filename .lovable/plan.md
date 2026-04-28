# Blueprint-First Generation Architecture

Replace the current single-shot generation in the Slide Studio's `EmptyState` with a 2-step flow: **Plan → Review → Build**. The teacher always sees and edits the lesson plan before any of the 20+ slides are produced.

## 1. New edge function: `generate-blueprint`

Path: `supabase/functions/generate-blueprint/index.ts`. Public CORS, no JWT required (matches `generate-ppp-slides`).

- **Input** (JSON body):
  - `topic` (string, required)
  - `target_audience` (string, required) — e.g. `"A2 Adult Professional"`
  - Optional context passthrough: `cefr_level`, `hub`, `skill_focus` (used to flavor the prompt)
- **Model**: `google/gemini-3-flash-preview` via Lovable AI Gateway, using **tool-calling** for structured output (avoids the JSON-schema complexity issue we hit before).
- **Tool schema** → enforced response shape:
  ```json
  {
    "lesson_title": "string",
    "target_vocabulary": [
      { "word": "string", "definition": "string", "example": "string" }
    ],            // 5–8 items
    "target_grammar_rule": "string",          // one focused rule, e.g. "Past Simple regular verbs"
    "grammar_explanation": "string",          // 1–2 sentence teacher-facing rationale
    "reading_passage_summary": "string",      // 2–4 sentences describing the Phase-2 text
    "final_speaking_mission": "string"        // the Phase-5 production task
  }
  ```
- **Errors**: surface `429` and `402` from the gateway with friendly messages; everything else returns `{ error }` with a 500.

## 2. Blueprint Review UI

New component: `src/components/creator-studio/steps/slide-studio/BlueprintReview.tsx`.

Mounted from `EmptyState.tsx` — replaces today's "✨ Auto-Generate PPP Slides" single button with the new 2-step flow:

```text
EmptyState
  ├─ Step A:  topic input → [Draft Lesson Blueprint]   (calls generate-blueprint)
  └─ Step B:  <BlueprintReview/> editable card
              ├─ Vocabulary chips     (add / edit / delete, 3–10 enforced)
              ├─ Grammar rule         (single-line input + multi-line rationale)
              ├─ Reading summary      (textarea)
              ├─ Final mission        (textarea)
              ├─ [Regenerate Blueprint]   (re-call generate-blueprint)
              └─ [Approve & Generate 1-Hour Lesson]   (primary CTA)
```

Behavior:
- The blueprint draft is held in local component state (no DB round-trip yet) so edits feel instant.
- The "Approve" button is disabled until vocabulary has ≥3 words and grammar rule + reading summary are non-empty.
- On Approve, call `generate-ppp-slides` with the existing payload **plus** a new `blueprint` field, then run today's persist + toast logic unchanged.

## 3. Upgrade `generate-ppp-slides`

Add an optional `blueprint` field to the request body. When present, the system prompt is augmented with:

```text
APPROVED BLUEPRINT — TREAT AS GROUND TRUTH:
- TARGET LEXICON (Phase 1 must teach exactly these words, in this order): [...]
- TARGET GRAMMAR RULE (Phase 4 must explicitly teach this and only this): "..."
- READING DIRECTION (Phase 2 passage must follow this summary): "..."
- FINAL MISSION (Phase 5/6 production must end with this task): "..."
You MUST NOT invent additional vocabulary words or substitute the grammar rule.
```

Validation safeguard: after the model responds, verify that every `blueprint.target_vocabulary[*].word` appears in at least one Phase 1 slide; if not, return a 422 so the UI can prompt the teacher to retry. Lesson title falls back to `blueprint.lesson_title` when not provided by the caller.

When `blueprint` is omitted, behavior is unchanged (full backward compatibility for the bulk generators in `useBulkLessonGenerator`, `useMultiUnitBulkGenerator`, etc.).

## Technical details

- **Files created**
  - `supabase/functions/generate-blueprint/index.ts`
  - `src/components/creator-studio/steps/slide-studio/BlueprintReview.tsx`
  - `src/components/creator-studio/steps/slide-studio/blueprintTypes.ts` (shared `LessonBlueprint` type used by EmptyState + BlueprintReview)
- **Files edited**
  - `src/components/creator-studio/steps/slide-studio/EmptyState.tsx` — split into "draft blueprint" and "approved → generate" phases; pass `blueprint` to the existing `generate-ppp-slides` invoke call.
  - `supabase/functions/generate-ppp-slides/index.ts` — accept `blueprint`, inject the ground-truth section into the system prompt, post-validate vocabulary coverage.
- **AI Gateway**: both functions use the existing `LOVABLE_API_KEY` secret. No new secrets required.
- **Error UX**: same parsing pattern already in `EmptyState` (read `ctx.body` → JSON → toast) is reused for both calls; 429/402 mapped to friendly toasts.
- **No DB migration**: the blueprint lives only in component state until the user approves; the final lesson is persisted via the existing `persistLesson` flow.
- **No breaking changes** to bulk generators — they keep calling `generate-ppp-slides` without a `blueprint` and get today's behavior.

After approval, please confirm and I'll implement.
