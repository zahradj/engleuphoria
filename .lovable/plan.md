# Fix: Google Image Generation 404 (deprecated Imagen 3 model)

## Root cause
`supabase/functions/_shared/googleImageClient.ts` calls the deprecated endpoint
`models/imagen-3.0-generate-001:predict` on Google's `v1beta` API. That model is no longer served, so every image generation (lesson images, slide images, character images, playground images, batch images, ai-image-generation) returns 404. All 6 callers fail through this single shared client.

## Fix (single-file change in the shared client)
Rewrite `generateGoogleImage()` to use the **Lovable AI Gateway** image model `google/gemini-2.5-flash-image` (a.k.a. Nano Banana) via the OpenAI-compatible chat-completions endpoint. This is the supported, billed-through-Lovable path and matches our other AI calls.

Behavior contract stays identical (same exported name, same `GoogleImageResult { bytes, contentType, dataUrl }`, same `GoogleImageError`), so none of the 6 calling edge functions need changes.

### Technical details
- Endpoint: `POST https://ai.gateway.lovable.dev/v1/chat/completions`
- Auth: `Authorization: Bearer ${LOVABLE_API_KEY}` (already provisioned, no new secret)
- Body:
  ```json
  {
    "model": "google/gemini-2.5-flash-image",
    "messages": [{ "role": "user", "content": "<prompt>" }],
    "modalities": ["image", "text"]
  }
  ```
- Response: image returned in `choices[0].message.images[0].image_url.url` as a `data:image/png;base64,...` URL — split on `,` to get base64, decode to bytes, derive `contentType` from the data-URL prefix.
- Error mapping preserved:
  - 429 → "Rate limited, try again shortly" (429)
  - 402 → "AI credits exhausted — add credits in Workspace settings" (402)
  - 401/403 → "LOVABLE_API_KEY rejected" (402)
  - other non-2xx → 502 with truncated body

### Files touched
- `supabase/functions/_shared/googleImageClient.ts` — rewrite internals only; exports unchanged.

### Callers (unchanged, auto-redeploy)
`generate-lesson-image`, `generate-slide-image`, `generate-character-image`, `generate-playground-images`, `batch-generate-lesson-images`, `ai-image-generation`.

### Verification
1. Deploy the 6 functions.
2. From the Success Creator (`/content-creator/success-creator?lessonId=...`) trigger image generation and confirm a 200 + visible image.
3. Tail `generate-slide-image` logs to confirm no more `404 imagen-3.0-generate-001`.

### Notes
- Keeps the function/module name `generateGoogleImage` to avoid touching every caller. A follow-up rename to `generateAIImage` is optional and can be a separate cleanup.
- No DB changes, no new secrets, no UI changes.
