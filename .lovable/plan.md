# Fix: Auto-Fill / Blueprint generation 404 across all creators

## Root cause (verified in edge logs)

`generate-gemini` (called by the Auto-Fill button in `GenerateLessonModal`) and `plan-lesson-blueprint` both hit Google's `v1beta` endpoint with model `gemini-1.5-flash`, which Google has retired:

```
models/gemini-1.5-flash is not found for API version v1beta,
or is not supported for generateContent.
```

The function then returns 502, which the Supabase client surfaces as the generic toast *"Edge Function returned a non-2xx status code"*. The same retired model id is also baked into the shared `_shared/geminiClient.ts` used by other generators, so every Creator hub (Playground / Academy / Success) is affected the moment Auto-Fill or blueprint planning runs.

The "You've run out of AI balance" banner is unrelated — these functions go directly to Google AI Studio with `GEMINI_API_KEY`, not the Lovable AI Gateway.

## Fix (minimal, surgical)

Swap the retired model id for the current stable equivalent **`gemini-2.5-flash`** in the three places it is hard-coded. No client/UI changes; no schema changes; the request/response shape is unchanged.

### Files to edit

1. **`supabase/functions/generate-gemini/index.ts`** (line 20)
   - `const DEFAULT_MODEL = 'gemini-1.5-flash';` → `'gemini-2.5-flash'`
   - Also map any incoming `body.model === 'gemini-1.5-flash' | 'gemini-1.5-pro'` → `'gemini-2.5-flash' | 'gemini-2.5-pro'` so older callers passing the old id don't 404.

2. **`supabase/functions/plan-lesson-blueprint/index.ts`** (line 15)
   - `const MODEL = 'gemini-1.5-flash';` → `'gemini-2.5-flash'`

3. **`supabase/functions/_shared/geminiClient.ts`**
   - Type union (line 15): drop `'gemini-1.5-flash' | 'gemini-1.5-pro'` from the public type, keep accepting them at runtime via the existing switch which already maps them to 2.5 — extend that switch so when the function calls Google directly (not the gateway) it sends `'gemini-2.5-flash'` / `'gemini-2.5-pro'` rather than echoing the retired id.
   - Update the two default `model = 'gemini-2.5-flash'` lines (already correct — no change needed, just verify).

### Why `gemini-2.5-flash` (not gateway)

These functions are intentionally decoupled from Lovable AI Gateway (header comment in `generate-gemini` calls this out) and authenticate with the user's own `GEMINI_API_KEY`. Switching to the gateway is a larger architectural change and out of scope. `gemini-2.5-flash` is the documented current replacement on the same `v1beta/models/{id}:generateContent` endpoint, so the fetch URL, payload, and response parsing remain identical.

## Verification

1. Open `/playground-creator` → click **Generate** → click **Auto-Fill** → modal should populate Vocabulary / Grammar / SWBAT / Final Output Task with no toast error.
2. Repeat on `/academy-creator` and `/success-creator`.
3. Click **Generate Slides** → blueprint phase (`plan-lesson-blueprint`) returns 200 and slides stream in.
4. Tail edge logs for `generate-gemini` and `plan-lesson-blueprint` — confirm no more `404 ... gemini-1.5-flash is not found`.

## Out of scope

- No migration to Lovable AI Gateway (requested decoupling stays).
- No prompt / schema changes.
- No UI changes — the existing toast handling is sufficient once the 502 is gone.
