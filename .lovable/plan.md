# Bypass Lovable AI Gateway for Image Generation

## Why
The current `_shared/googleImageClient.ts` calls `https://ai.gateway.lovable.dev/...`, which charges your Lovable AI balance (now empty, hence the "fill in the balance" prompt). Your project already has a `GEMINI_API_KEY` secret, so we can call Google directly and skip the gateway entirely — no Lovable AI credits consumed.

## The fix (one file)
Rewrite `supabase/functions/_shared/googleImageClient.ts` to call Google's Generative Language API directly with the **gemini-2.5-flash-image** model (a.k.a. "Nano Banana", the current supported image-gen endpoint that replaced the retired `imagen-3.0-generate-001`).

### Endpoint
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_API_KEY}
```

### Request body
```json
{
  "contents": [{ "parts": [{ "text": "<prompt>" }] }],
  "generationConfig": { "responseModalities": ["IMAGE"] }
}
```

### Response parsing
Image bytes arrive as base64 in:
```
candidates[0].content.parts[].inlineData.{mimeType, data}
```
Decode `data` → `Uint8Array`, keep `mimeType` (usually `image/png`), build the same `dataUrl` shape callers already expect.

### Contract preserved
- Same exported `generateGoogleImage(prompt)` signature
- Same `GoogleImageResult { bytes, contentType, dataUrl }`
- Same `GoogleImageError` with HTTP status mapping (429 → rate limit, 401/403 → auth, others → 502)
- All 6 callers (`generate-slide-image`, `generate-lesson-image`, `generate-character-image`, `generate-playground-images`, `batch-generate-lesson-images`, `ai-image-generation`) keep working unchanged and auto-redeploy.

## What stays the same
- All edge functions and frontend services (`imageGeneration.ts`, `lessonImageService.ts`, `usePlaygroundImages.ts`) untouched.
- Picsart post-processing, Supabase Storage uploads, hub art-style prompt suffixes — all unchanged.

## What you'll need
Nothing. `GEMINI_API_KEY` is already set in your project secrets. Google's free tier on `gemini-2.5-flash-image` is generous; billing only kicks in if you've enabled it on your Google Cloud project.

## Verification after implementation
1. Open Success Creator → Generate Lesson → confirm slide images render.
2. Tail edge function logs for `generate-slide-image` / `ai-image-generation` — expect 200s, no `ai.gateway.lovable.dev` calls, no `imagen-3.0-generate-001` 404s.

## Files touched
- `supabase/functions/_shared/googleImageClient.ts` (rewrite internals only)
