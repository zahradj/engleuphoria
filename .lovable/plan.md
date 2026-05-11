# Switch Image Generation to Google AI Studio

## Root cause

Six edge functions currently generate images via the Lovable AI Gateway (`https://ai.gateway.lovable.dev/v1/chat/completions` with `google/gemini-*-image-preview`), which is billed against Lovable AI credits and is now returning `402` / failing. The project already has `GEMINI_API_KEY` in Supabase secrets (used by `plan-lesson-blueprint` and `generate-gemini`), so we can call Google's image model directly with no third-party cost.

## Approach

Add one shared helper that calls Google's Generative Language API for images and swap the gateway fetch in every image function to use it. Keep input/output shapes identical so no frontend code changes are needed.

**Model choice:** `gemini-2.5-flash-image` via `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=GEMINI_API_KEY`. This is Google's "Nano Banana" image model, available on AI Studio keys, returns inline base64 PNG in `candidates[0].content.parts[].inline_data`. (Imagen 3 on AI Studio is gated to paid tier in many regions; Nano Banana works on the same free key already in use for text and matches the prompt-only contract these functions expect.)

## Changes

### 1. New shared helper — `supabase/functions/_shared/googleImageClient.ts`
Single function:
```ts
generateGoogleImage(prompt: string): Promise<{ bytes: Uint8Array; contentType: string }>
```
- Reads `GEMINI_API_KEY` from env (throws clear error if missing).
- POSTs to `…/models/gemini-2.5-flash-image:generateContent` with `{ contents: [{ parts: [{ text: prompt }] }] }`.
- Walks `candidates[0].content.parts[]`, finds the part with `inline_data` (or `inlineData`), returns decoded bytes + mime.
- Maps non-200 responses to typed errors so callers can return 429/402/500.

### 2. Refactor 6 edge functions to use the helper
For each, replace the `fetch("https://ai.gateway.lovable.dev/...")` block + base64 decode with one call to `generateGoogleImage(prompt)`. Storage upload, response shape, CORS, and error JSON stay exactly the same.

- `supabase/functions/generate-slide-image/index.ts` — main Slide Studio "Generate image" button. Keeps `applyHubStyle` prompt suffix and `lesson-assets` upload.
- `supabase/functions/ai-image-generation/index.ts` — generic image service used by `services/imageGeneration.ts`, `lessonImageService.ts`, `fetchSlideImage.ts`, `VocabularyImage.tsx`.
- `supabase/functions/generate-lesson-image/index.ts` — single-prompt helper.
- `supabase/functions/batch-generate-lesson-images/index.ts` — vocabulary batch (loops through `imagePrompts`, calls helper per slide, preserves per-slide error map).
- `supabase/functions/generate-playground-images/index.ts` — Playground subject thumbnails.
- `supabase/functions/generate-character-image/index.ts` — character/storybook portraits.

### 3. Frontend
**No changes required.** All callers already invoke these functions via `supabase.functions.invoke(...)` and consume `{ url }` or `{ imageUrl }` from storage. Removing Lovable AI Gateway happens entirely server-side, so loading spinners and error toasts (`services/imageGeneration.ts`, `useVocabularyImageGenerator.ts`, `mediaGeneration.ts`) keep working unchanged.

### 4. Out of scope
- `generate-slide-music`, `generate-slide-voiceover`, and any text-only `generate-gemini` / `plan-lesson-blueprint` calls — not affected.
- DB schema, RLS, and storage buckets — unchanged.
- No removal of `LOVABLE_API_KEY`; other non-image functions (e.g. `ai-tutor`, `studio-ai-copilot`) still use it for text/streaming.

## Verification

1. From `/playground-creator` (current route) → Slide #2 → **Media › Image › Generate** → confirm an image appears and is stored under `lesson-assets/studio/...`.
2. Tail logs for `generate-slide-image` and confirm a 200 response with no `ai.gateway.lovable.dev` calls.
3. Trigger a vocab batch generation to validate `batch-generate-lesson-images` returns per-slide URLs.
4. Trigger Playground subject image to validate `generate-playground-images`.
