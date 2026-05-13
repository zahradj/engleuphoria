# Deep AI-Error Audit — Edge Functions

## Goal
Eliminate every "Edge function returned a non-2xx status code" failure caused by malformed Gemini JSON, missing CORS on error responses, generic error messages, or unbounded AI hangs. One shared sanitizer + one shared error responder, applied across ~50 AI-calling edge functions.

## Root causes observed
1. Gemini wraps JSON in ```json fences or adds prose → `JSON.parse` throws.
2. Several `catch` blocks return `{ error: "Internal server error" }` or omit `corsHeaders` → frontend sees a generic "Failed to fetch" instead of the real reason.
3. No client-side timeout on `aiFetch` → UI freezes indefinitely on Gemini stalls.
4. System prompts don't explicitly forbid markdown wrapping.

## Approach — Three shared helpers, then sweep callers

### Phase 1 — Create shared utilities (3 small files in `_shared/`)

1. `_shared/aiJson.ts`
   - `export function parseAIJson<T>(raw: string): T` — strips ```json fences, slices outermost `{...}` or `[...]`, throws a clean `Error("AI returned malformed data. Please try generating again.")` on failure (logs the raw text first).
   - `export const RAW_JSON_INSTRUCTION` constant — the "CRITICAL: return ONLY raw JSON…" line to append to every system prompt.

2. `_shared/aiErrorResponse.ts`
   - `export function aiErrorResponse(err: unknown, corsHeaders, status = 500): Response` — always returns `{ error: err.message }` with `...corsHeaders, 'Content-Type': 'application/json'`.
   - Maps known shapes: 429 → "Rate limit reached…", 402 → "AI credits exhausted…".

3. `_shared/aiTimeout.ts`
   - `export async function withTimeout<T>(p: Promise<T>, ms = 25000, label = 'AI call'): Promise<T>` — `Promise.race` with `AbortController`-friendly rejection so callers can show "Oops, our AI is taking a coffee break."

### Phase 2 — Sweep callers (group by risk)

**Tier A — already triggered errors in production (patch first)**
- `lesson-content-generator` — already partially fixed last turn; switch to shared helpers + add `withTimeout`.
- `generate-ppp-slides` — verify all three `callModel` / `callAcademy` / `callAI` use `parseAIJson`; add `RAW_JSON_INSTRUCTION` to academy & full-length system prompts; wrap each `aiFetch` in `withTimeout(45_000)`.
- `ai-lesson-content-generator`, `ai-slide-generator`, `interactive-lesson-generator`, `iron-ppp-generator`, `generate-early-learner-lesson`, `generate-welcome-lesson`, `generate-daily-lesson`, `generate-lesson-content`, `bulk-lesson-generator`.

**Tier B — content/curriculum**
- `ai-curriculum-planner`, `ai-curriculum-analyzer`, `curriculum-generator`, `curriculum-breakdown`, `curriculum-expert-agent`, `generate-blueprint`, `generate-curriculum-blueprint`, `plan-lesson-blueprint`, `generate-learning-path`, `k12-curriculum-generator`, `ai-systematic-slides-batch`, `ai-systematic-curriculum-batch`, `ai-slides-batch-orchestrator`.

**Tier C — slide/practice/game/text utilities**
- `sync-slides-to-blueprint`, `rewrite-slide-field`, `ai-rewrite-text`, `quiz-generator`, `generate-practice-items`, `generate-smart-worksheet`, `generate-storybook`, `generate-canvas-game`, `generate-iron-game`, `ai-game-lesson-generator`, `ai-slide-game-generator`, `ai-activity-generator`, `ai-topic-generator`, `ai-extract-lesson-from-text`, `ai-quality-checker`, `ai-performance-analyzer`, `ai-content-generator`, `studio-ai-copilot`, `ai-tutor` (skip streaming chunks), `ai-core`, `generate-gemini`, `phonetic-analysis`, `analyze-media`.

**Per-file patch pattern**:
```ts
import { parseAIJson, RAW_JSON_INSTRUCTION } from "../_shared/aiJson.ts";
import { aiErrorResponse } from "../_shared/aiErrorResponse.ts";
import { withTimeout } from "../_shared/aiTimeout.ts";
// system prompt:  `${oldPrompt}\n\n${RAW_JSON_INSTRUCTION}`
// fetch:          const aiRes = await withTimeout(aiFetch(...), 25_000, 'slide gen');
// parse:          const data = parseAIJson<MyShape>(raw);
// catch:          } catch (e) { return aiErrorResponse(e, corsHeaders); }
```

### Phase 3 — Frontend friendly messaging
- Confirm `src/lib/aiErrorHandler.ts` surfaces the new richer error strings (it already classifies overload/parse/key — verify the new "AI returned malformed data" hits the parse branch and offers Retry).
- Add timeout-specific copy: "⏳ AI is taking a coffee break — try again."

### Phase 4 — Verify
- For each patched function, deploy + smoke-test with `supabase--curl_edge_functions` using a known-malformed prompt fixture; assert response is JSON `{ error: "..." }` with CORS headers and HTTP 500 (not a 502/disconnect).
- Tail `supabase--edge_function_logs` for `generate-ppp-slides` and `lesson-content-generator` while triggering a real "Generate Slides" run from `/content-creator`.
- Confirm preview no longer surfaces "non-2xx status code"; instead shows the classified amber toast.

## Out of scope (this round)
- Image-generation functions (already migrated to Imagen 3 last round).
- Email/cron functions — no AI JSON parsing.
- Workstream 3 (timezone QA, 5-day credit logic, mic/camera permissions) — separate plan.

## Files touched (estimate)
- 3 new files in `supabase/functions/_shared/`
- ~35 edge function `index.ts` files (mechanical 4-line patch each)
- 1 edit to `src/lib/aiErrorHandler.ts`

## Risk
Low — all changes are additive (helpers + error-shape standardization). No behavior change on the happy path.
