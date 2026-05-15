## Audit summary — last ~3 days

| Request | Status |
|---|---|
| Auth-flow fix (sign-in infinite spinner, multi-role race) | ✅ Shipped |
| Placement Test: combine 15 MCQ + 4-skill phases for 12+ | ✅ Shipped |
| Hard ban on Lovable AI Gateway at runtime; route all generation to Gemini direct | ❌ **Partially done** — fix below |

## What's wrong today

- Shared helpers (`_shared/aiFetch.ts`, `_shared/aiFailover.ts`, `_shared/geminiClient.ts`) already prefer Gemini-direct when `GEMINI_API_KEY` is set, but they still **fall back** to the Lovable Gateway when Gemini errors. That fallback is what's burning your Lovable AI credits and triggering "Out of AI credits" on transient failures.
- 11 edge functions still call the Lovable Gateway with **raw `fetch(...)`**, completely bypassing the shared Gemini-first router. The most painful one is **`generate-storybook`** (the "Generate Story" button you flagged): it hits `https://ai.gateway.lovable.dev/...` directly with `LOVABLE_API_KEY`, so every story burns Lovable credits.
- Image generation is already clean — `_shared/googleImageClient.ts`, `generate-slide-image`, `generate-character-image`, `ai-image-generation` all hit Google Generative Language directly with `GEMINI_API_KEY`. No changes needed there.
- `GEMINI_API_KEY` is configured in secrets ✅.

## Plan: enforce the Gateway Bypass rule (backend-only)

**Strict scope:** Edge Functions only. Zero edits to React components, routes, AuthContext, ProtectedRoute, ImprovedProtectedRoute, LiveClassroom, Creator Studio, or any UI/CSS.

### 1. Make shared helpers Gemini-only when key is present

In `_shared/aiFetch.ts`, `_shared/aiFailover.ts`, `_shared/geminiClient.ts`:
- If `GEMINI_API_KEY` is set, **never** fall back to the Lovable Gateway. On Gemini failure, throw the Gemini error so callers surface it as a normal 429/5xx (with friendly toast), instead of silently spending credits.
- Only use the Lovable Gateway when `GEMINI_API_KEY` is **missing** (graceful degradation for dev sandboxes).
- Tool-calling path in `aiFailover.ts` currently force-routes to Lovable when `tools` are present — switch to Gemini's `functionDeclarations` (the translation already exists in `aiFetch.ts`, lift it into shared form) so tool-using callers stay on Gemini too.

### 2. Re-route the 11 raw-fetch functions through `aiFetch`

Replace `fetch('https://ai.gateway.lovable.dev/v1/chat/completions', …)` with `aiFetch(…)` (same args) in:

- `generate-storybook/index.ts` (the "Generate Story" path you flagged)
- `ai-core/index.ts` (2 sites)
- `rewrite-slide-field/index.ts`
- `generate-canvas-game/index.ts`
- `analyze-media/index.ts`
- `generate-quiz-questions/index.ts`
- `generate-lesson-audio/index.ts`
- `fetch-dictionary-definition/index.ts` (2 sites)
- `studio-ai-copilot/index.ts`
- `ai-extract-lesson-from-text/index.ts`

These already use OpenAI-style `messages` + `tools` payloads, which `aiFetch` translates to Gemini `functionDeclarations` and back, so callers' downstream `data.choices[0].message.tool_calls` parsing keeps working unchanged.

### 3. Persist the rule

Save a project memory entry (`mem://architecture/runtime-ai-gemini-only`) so future code changes never reintroduce a Lovable Gateway runtime call. Add a Core line: "All runtime AI generation (text, story, vocab, image prompts) MUST go through Gemini direct via `aiFetch` / `googleImageClient`. Lovable AI Gateway is forbidden at runtime."

### 4. Deploy + verify

Deploy: `generate-storybook`, `ai-core`, `rewrite-slide-field`, `generate-canvas-game`, `analyze-media`, `generate-quiz-questions`, `generate-lesson-audio`, `fetch-dictionary-definition`, `studio-ai-copilot`, `ai-extract-lesson-from-text` (the shared `_shared/*` helpers ship with each).

Then trigger "Generate Story" from the UI and check `generate-storybook` edge logs — expect `✅ Recovered via Gemini direct` (or no gateway line at all) and **no** `https://ai.gateway.lovable.dev` request.

## Files touched (backend only)

- `supabase/functions/_shared/aiFetch.ts`
- `supabase/functions/_shared/aiFailover.ts`
- `supabase/functions/_shared/geminiClient.ts`
- `supabase/functions/generate-storybook/index.ts`
- `supabase/functions/ai-core/index.ts`
- `supabase/functions/rewrite-slide-field/index.ts`
- `supabase/functions/generate-canvas-game/index.ts`
- `supabase/functions/analyze-media/index.ts`
- `supabase/functions/generate-quiz-questions/index.ts`
- `supabase/functions/generate-lesson-audio/index.ts`
- `supabase/functions/fetch-dictionary-definition/index.ts`
- `supabase/functions/studio-ai-copilot/index.ts`
- `supabase/functions/ai-extract-lesson-from-text/index.ts`
- new memory: `mem://architecture/runtime-ai-gemini-only` + Core update

No frontend, no DB, no auth, no routing changes.
