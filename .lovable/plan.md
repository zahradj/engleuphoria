## Playground Hub — AI Backend Overhaul + Image Pipeline + Animations

Three coordinated changes: tighten the AI generator schema, swap emojis for AI-generated images, and add a unified feedback animation system.

---

### Step 1 — AI Backend Overhaul (strict schema + retry)

**File:** `supabase/functions/generate-ppp-slides/index.ts` (lines 80–142, the `playground` branch)

- Replace the playground system prompt with the exact wording requested:
  > "You are an expert children's EdTech game designer. Create a highly interactive, fun English lesson. Keep vocabulary very simple. Output ONLY a valid JSON array of slide objects. Do not wrap in markdown or backticks. You MUST use a variety of these exact slide types."
- Append the strict per-type schema as canonical examples (intro, multiple, truefalse, fill, match, drag) — no `emoji` field; instead each visual slide type takes `image_url: string` (and `match.pairs[].image_url`).
- Wrap the AI call + `JSON.parse` in a `tryParse()` helper with **up to 2 retries**: on parse/validation failure, send a follow-up message ("Your previous output was not valid JSON. Return ONLY a valid JSON array matching the schema.") before giving up with a 500.
- Keep the existing `allowed` type filter, but extend validation to require: `voice` object on every slide; `image_url` on `multiple`/`truefalse`/`drag`/`match.pairs[]`.
- After parsing, collect every required image subject (option labels, statement subject, drag word, match pair words) and call the new `generate-playground-images` function (Step 2) to hydrate `image_url` fields before returning.

---

### Step 2 — Schema + UI refactor (drop emojis, add images)

**`src/pages/PlaygroundDemo.tsx`** (the canonical `Slide` type — also imported by `PlaygroundCreator`)

- Remove emoji-as-target. Update the union:
  - `multiple` → add `image_url?: string` (kept optional for backward compat); options stay text-only.
  - `truefalse` → add `image_url?: string`.
  - `drag` → replace `target: string` with `image_url: string` + `word: string`.
  - `match` → `pairs: { word: string; image_url: string }[]` (remove `match` field).
- **`<MatchGame />`** (line 338): render `<img src={pair.image_url} alt={pair.word} className="rounded-lg shadow-sm h-24 w-24 object-cover" />` instead of the emoji string. Keep tap-word → tap-image flow.
- **`<DragDrop />`** (line 291): the drop zone shows a placeholder illustration (`/playground/placeholder-dropzone.svg` — silhouette + "?" box) until the correct word is dropped, then swaps to `<img src={slide.image_url} />`. The draggable card displays the word on top + small thumbnail of the image.
- Update the in-file `SLIDES` demo deck to use real `image_url` placeholders.
- **`PlaygroundCreator.tsx`**: drop the `emoji` column on `SLIDE_TYPES` (use a `lucide-react` icon instead). The "Target (emoji)" field at line 487 becomes "Image URL" with a button "Generate image with AI" (calls `generate-playground-images` for that single subject).

---

### Step 3 — AI image pipeline

**New edge function:** `supabase/functions/generate-playground-images/index.ts`

- `POST { subjects: string[] }` → returns `{ images: { subject: string; url: string }[] }`.
- Uses the **Lovable AI Gateway** with model `google/gemini-2.5-flash-image` (per `<ai-image-generation>` guidance — no extra API keys needed; `LOVABLE_API_KEY` is already set).
- Style prompt prepended to every subject:
  > "Style: Highly cheerful, colorful, high-quality cartoon illustration. Suitable for pre-school children. Friendly character design. Clean background, centered subject, soft lighting. Absolutely no mature themes or scary elements."
- Decode the returned base64 PNG, upload to Supabase Storage bucket `playground_assets` at `ai/{slug(subject)}-{hash}.png`, return the public URL.
- Cache: before generating, check storage for an existing object with the same hash key and reuse it (cuts repeat costs).

**Migration:**
- Create public bucket `playground_assets` (`insert into storage.buckets (id, name, public) values ('playground_assets', 'playground_assets', true)`).
- RLS on `storage.objects`: public SELECT for this bucket; INSERT restricted to service role (the edge function uses service role key, so no client-side write policy needed).

**Frontend hook:** `src/hooks/usePlaygroundImages.ts` — small wrapper around `supabase.functions.invoke('generate-playground-images', { body: { subjects } })` used by both the Creator's per-slide button and the AI generation flow.

---

### Step 4 — Kid-friendly animations

**New hook:** `src/hooks/usePlaygroundAnimation.ts`

- Returns `{ celebrate(), shake(targetRef), state }`.
- `celebrate()`: fires `canvas-confetti` (already a dep) full-screen burst + sets `state = 'correct'` for 1.2s so the active card animates `scale: [1, 1.2, 1], rotate: [0, 360, 0]`. Triggers `usePlaygroundAudio.play("Great job!")`.
- `shake(ref)`: animates `x: [-10, 10, -10, 10, -10, 10, 0]` on the passed element + plays `"Try again!"`.

**Wire-in:**
- In `PlaygroundDemo.tsx`, replace each game's local correct/wrong handler with the hook — Multiple, TrueFalse, Fill, Drag, Match all call `celebrate()` / `shake()`.
- Wrap the slide renderer in `<AnimatePresence mode="wait">` with `<motion.div key={slideIndex} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} transition={{ duration: 0.3 }}>` for the requested horizontal slide-in/out between slides.

---

### Files touched

- `supabase/functions/generate-ppp-slides/index.ts` — new prompt + retry + image hydration
- `supabase/functions/generate-playground-images/index.ts` — **new**
- Migration — new storage bucket + RLS
- `src/pages/PlaygroundDemo.tsx` — schema, MatchGame, DragDrop, transitions
- `src/pages/PlaygroundCreator.tsx` — image fields, remove emoji column, "Generate image" button
- `src/hooks/usePlaygroundAnimation.ts` — **new**
- `src/hooks/usePlaygroundImages.ts` — **new**
- `public/playground/placeholder-dropzone.svg` — **new** (simple inline silhouette)

No new npm deps (framer-motion + canvas-confetti already installed).

---

### Notes / risks

- The image generation step inside `generate-ppp-slides` adds latency (~1–3s per image). To keep generation snappy I'll fan out image calls **in parallel** (`Promise.all`) and cap subjects per lesson at ~12.
- Existing playground decks using `emoji`/`target: '🍎'` will keep rendering because the new fields are added alongside (the renderer falls back to a tiny text label if `image_url` is missing). New AI-generated decks will always have images.
