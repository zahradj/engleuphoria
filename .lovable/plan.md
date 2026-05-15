
# Plan — Stabilize Homework API + 4-Skill Placement Test

## Part A — Debug the 502 on Homework generation (do first)

### What I found
- The failing call is `supabase.functions.invoke('generate-homework')` from `HomeworkPlayer` / homework dialog.
- Inspecting `supabase/functions/generate-homework/index.ts`:
  - Required env: `LOVABLE_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. All are present in project secrets — no missing key.
  - CORS headers are set; OPTIONS handled. CORS is not the cause.
  - The function explicitly returns `502` in 4 places, all relating to the AI Gateway:
    1. `aiRes.ok === false` → `502 "AI gateway error <status>"`
    2. empty `content` → `502 "AI returned empty response"`
    3. JSON parse failure → `502 "AI returned invalid JSON"`
    4. shape validation failure → `502 "AI response did not match the 3-activity schema"`
  - Sister function `generate-daily-lesson` is currently logging `402 Payment Required` from the Lovable AI gateway and `503` from Gemini direct → strongly suggests the 502 is the same upstream AI quota / overload bubbling up.
- The client log `body={}` means the function reached the runtime but returned a 502 with a JSON error body that the SDK could not surface — `FunctionsHttpError` swallows the body.

### Root cause (most likely)
Upstream AI gateway is returning 402 (out of credits) or the model returns malformed JSON, and `generate-homework` correctly translates that to a 502 — but the frontend has no visibility, so it just looks like a dead endpoint.

### Fixes (frontend + edge, no logic refactor)
1. **Surface the real error** in `generate-homework` callsite: read `data?.error` / `data?.detail` from the response instead of relying only on the `error` thrown by the SDK; toast a human-readable message ("AI service is temporarily unavailable — please retry in a moment.") with the underlying status.
2. **Edge function resilience** in `generate-homework`:
   - On `aiRes.status === 402` or `429` or `5xx`, fall back to `gemini-direct` (same pattern already used in `generate-daily-lesson`) using `GEMINI_API_KEY`.
   - On JSON parse failure, attempt one repair pass (extract first `{...}` block) before returning 502.
   - Return `200` with `{ success: false, retryable: true, reason }` for transient AI failures so the UI can show retry instead of a hard 502.
3. **Add retry button** in `HomeworkPlayer` when generation fails (single re-invocation, no auto-loop).
4. **Verify** by calling the function via `supabase--curl_edge_functions` with a real lesson payload and confirming a 200 response, then checking edge logs.

Out of scope per the Charter: no changes to the AI prompt, model selection logic, or evaluator.

## Part B — 4-Skill Comprehensive Placement Test

Refactor `src/components/placement/AIPlacementTest.tsx` into a 4-phase wizard. Existing demographics step stays; the single `TestPhase` is replaced by 4 sequential phases.

### New file structure
```text
src/components/placement/
  AIPlacementTest.tsx              (orchestrator — extended)
  phases/
    ListeningPhase.tsx             (NEW — ElevenLabs audio + 4-image grid)
    ReadingPhase.tsx               (NEW — passage + 3 MCQs)
    WritingPhase.tsx               (NEW — image prompt + Textarea, min chars)
    SpeakingPhase.tsx              (NEW — MediaRecorder + playback)
  ComprehensiveProgressBar.tsx     (NEW — 4-stage stepper)
```

### Per-phase behavior
- **Listening (3 items)**: uses `playElevenLabs()` from `@/lib/elevenLabsAudio` for the prompt audio. Shows 4 image cards (placeholder.svg for now). Selecting the correct image advances; wrong logged but allowed.
- **Reading (1 passage, 3 MCQs)**: passage in elevated typography card, MCQs below. All 3 must be answered to enable Next.
- **Writing (1 prompt)**: image + prompt + `<Textarea>`; Next disabled until ≥120 chars and ≥3 sentences.
- **Speaking (1 prompt)**: reuse `MediaRecorder` pattern from `src/hooks/useVoiceRecording.ts`. Pulsing-red mic button while recording, playback control, re-record, then submit. Stores `Blob` in state.

### State + submission
```ts
type Submission = {
  listening: { itemId: string; choice: string; correct: boolean }[];
  reading:   { qid: string; choice: string; correct: boolean }[];
  writing:   { prompt: string; text: string };
  speaking:  { prompt: string; audioBlob: Blob | null; transcript?: string };
};
```
On final Submit:
1. Compute a deterministic preliminary CEFR (existing `calculateCefrLevel` on listening+reading correct count, scaled to /15) so the existing `usePlacementTest.completeTest` keeps working unchanged.
2. Persist via the existing `student_profiles` upsert path — no DB schema change.
3. Stub call site `evaluateComprehensivePlacement(submission)` (frontend-only stub returning the deterministic CEFR) — **does NOT** introduce a new edge function. When you later hand it to Gemini, only that one stub gets wired up.

Per the Charter: no edits to AI evaluator, no new edge functions, no schema changes. Pure UI + state.

### Branding
- Glassmorphism card preserved (`backdrop-blur-xl bg-white/10 border-white/20`).
- Hub-themed accent via existing `CursorTrail themeIndex={hubIndex}`.
- Progress bar uses `Progress` from shadcn; stage labels: *Listening · Reading · Writing · Speaking*.

## Order of execution
1. Ship Part A (502 fixes + retry surface). Verify endpoint returns 200.
2. Then ship Part B (placement test refactor).
3. Defer the database migration until both ship and the user confirms stability.

## Files to touch

**Part A**
- `supabase/functions/generate-homework/index.ts` — add Gemini fallback + soft-fail JSON shape.
- `src/components/student/homework/HomeworkPlayer.tsx` — surface `data.error` and add a retry button (UI only).

**Part B**
- `src/components/placement/AIPlacementTest.tsx` — extend phase enum + routing.
- 4 new phase components + `ComprehensiveProgressBar.tsx`.
- No changes to `usePlacementTest.ts`, `student_profiles`, or any edge function.

## Open question (one)
For the **Listening / Reading / Writing / Speaking content bank**: should I (a) hardcode 1 small static set per CEFR band for now (fastest, ships today), or (b) fetch from an existing table such as `placement_questions` if one exists? If (b), tell me the table name and I'll wire it up read-only.
