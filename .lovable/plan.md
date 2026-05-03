# Step 1: Fix Broken Video Slide Component

Scope: only `src/components/lesson-player/editorial/VideoSlide.tsx` (the component used everywhere video slides render via `DynamicSlideRenderer`). Step 2 (Fill-in-the-Blanks density) is intentionally deferred until after this fix is verified, per your instructions.

## Current problem

`VideoSlide.tsx` already supports YouTube IDs and direct `.mp4` URLs, but:

- When `video_url`/`video_id` are missing it renders a "Conversation Starter" card that depends on a fallback image — if there's no image either, it shows an emoji block, which is what's reading as "broken".
- It does not enforce a uniform `aspect-video` wrapper for every render path.
- The fallback copy doesn't match the requested message.
- Vimeo URLs aren't recognized.

## Changes (single file)

`src/components/lesson-player/editorial/VideoSlide.tsx`

1. **Robust URL detection**
   - Keep existing YouTube ID extraction.
   - Add Vimeo detection (`vimeo.com/{id}` → `https://player.vimeo.com/video/{id}`).
   - Keep direct `.mp4 / .webm / .ogg` support via native `<video controls>`.
   - Wrap every player path in a single shared container: `w-full max-w-3xl mx-auto aspect-video rounded-2xl overflow-hidden bg-black shadow-md`.

2. **Safe fallback (no crash, no blank)**
   - Trigger fallback when `videoUrl` is `undefined | null | ''` AND no `videoId`.
   - Render inside the same `aspect-video` container so layout is stable:
     - Centered `VideoIcon` (lucide `Video` or `VideoOff`) sized `w-16 h-16` in muted hub accent.
     - Text: *"Video content is being updated. Let's discuss this topic instead!"* in `text-lg text-slate-600 text-center max-w-md`.
     - Soft background using `accentSoft` so it still looks branded, not white.
   - Remove the old image-dependent "Conversation Starter" branch (or keep it only when a `fallbackImg` exists — preferred: drop it entirely to match the spec).

3. **Defensive guards**
   - Guard against `slide` being `undefined`.
   - Wrap `<iframe>` and `<video>` in `onError` handlers that swap to the fallback UI via local state (`hasError`).
   - Keep instructions + key takeaways rendering below the player when present.

4. **No new dependencies**
   - We do **not** add `react-player`. The native `<iframe>` + `<video>` setup already covers YouTube, Vimeo, and direct MP4/WebM, matching the "similarly robust standard HTML5 setup" allowance in your brief, and avoids bundle bloat. If you'd rather we install `react-player`, say the word and I'll switch.

## Verification

After the change:
- Slide with valid YouTube URL → embedded player at 16:9.
- Slide with `.mp4` URL → native video player at 16:9.
- Slide with no `video_url` → branded fallback card with camera icon and the exact copy above (no crash, no blank).
- Slide with broken/blocked embed → `onError` flips to the same fallback.

## Out of scope (will tackle next round)

Step 2 — high-density Fill-in-the-Blanks (`EditorialFillBlanks.tsx`) — held until you confirm the video fix.
