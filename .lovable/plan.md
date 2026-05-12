# Fix: "New Curriculum Blueprint" non-2xx error

## Root cause

Edge Function logs for `generate-curriculum-blueprint` show repeated **Gemini 503 UNAVAILABLE — "model is currently experiencing high demand"**. The function returns HTTP 500, so the Supabase client throws `FunctionsHttpError: Edge Function returned a non-2xx status code` and the user sees a generic failure with no friendly message and no retry path.

Gemini 2.5 Flash periodically rejects requests during peak load — a single attempt is fragile. There is no retry, no fallback model, and no graceful payload that the existing `handleAIResponse` helper (used by other wizards) can render as the nice amber "AI overloaded — Retry" toast.

## Plan

### 1. Server: `supabase/functions/generate-curriculum-blueprint/index.ts`

- **Retry with exponential backoff** on transient Gemini failures (`429`, `500`, `502`, `503`, `504`, network throws):
  - Up to **3 attempts**, delays `1.5s → 3s → 6s` with small jitter.
  - Log each retry with attempt number and status.
- **Model fallback**: if `gemini-2.5-flash` still 503s after retries, retry once against `gemini-2.0-flash` as a graceful degrade.
- **Graceful overload payload**: when all retries fail with 429/5xx, return **HTTP 200** with body `{ error: true, message: "The AI curriculum engine is overloaded. Please retry in ~10 seconds." }` (matches the contract `src/lib/aiErrorHandler.ts` already understands).
- **Hard failures only** (missing API key, malformed user input, Gemini 4xx other than 429) keep their current 4xx/500 behavior.
- Keep all existing behavior (UUID injection, skill rotation, Review-last enforcement) intact.

### 2. Client: `src/components/creator-studio/steps/BlueprintEngine.tsx`

- Replace the raw `if (error) throw error; if (data?.error) throw new Error(data.error);` block with the shared `handleAIResponse({ data, error, onRetry: handleGenerate, context: 'Blueprint' })` helper from `src/lib/aiErrorHandler.ts`.
- On graceful failure: stop the spinner, show the amber glassmorphism toast with a **Retry** button, do not push a red `toast.error`.
- On success: continue with the existing normalization code.

### 3. Verify

- Deploy `generate-curriculum-blueprint`.
- Hit `/content-creator/blueprint` and click Generate. Confirm:
  - On success → blueprint renders as before.
  - On simulated 503 (check edge logs) → amber "AI Engine Overloaded" toast with Retry, no red error, spinner clears.
- Re-check `supabase--edge_function_logs` for `generate-curriculum-blueprint` to confirm retries are firing and 200s are being returned.

## Files touched

- `supabase/functions/generate-curriculum-blueprint/index.ts` (retry, fallback, graceful payload)
- `src/components/creator-studio/steps/BlueprintEngine.tsx` (use `handleAIResponse`)

No DB migrations. No schema changes. No new secrets.
