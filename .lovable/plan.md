## Plan: Vocabulary Image Brain + Story Director Auto-Pilot

### Part 1 — Vocabulary Image "Brain" (Modesty + 60% Branding)

Target file: `supabase/functions/generate-slide-image/index.ts` and `supabase/functions/_shared/hubArtStyles.ts`.

**1.1 Extend the request contract** (backwards compatible):
- Accept new optional fields on the JSON body:
  - `slideKind`: `"vocabulary" | "story" | "scene" | ...`
  - `vocabulary_word`: string
  - `example_sentence`: string
- All existing callers keep working (only `prompt` + `hub` are required).

**1.2 New helper `buildVocabularyPrompt(...)`** in a new file `supabase/functions/_shared/vocabularyImageBrain.ts`:
- Inputs: `vocabulary_word`, `example_sentence`, `hub`.
- Returns a fully expanded scene description that bakes in:
  - **Modesty Protocol** (universal, hub-agnostic): modest/professional clothing; no tight, revealing, suggestive, or culturally insensitive outfits; dignified poses; no lying-down/intimate framing; physical contact only if familial or professional assistance.
  - **Hub-specific clothing rule**: school uniforms (Academy), casual modest (Playground), business casual (Success).
  - **Age-appropriate art style**: Playground = cute cartoon/vector, innocent + fun; Academy = modern comic/webtoon, relatable teen scenarios; Success = professional editorial photography, business/global.
  - **60% Branding Rule**: 50–60% of total color area dominated by the hub's primary color family (Playground orange `#FE6A2F`, Academy purple `#6B21A8`, Success emerald `#059669`) applied to large surfaces — backgrounds, large props, character clothing — not just accents. Remaining 40–50% neutral tones.
  - The **vocabulary word as the visual focal point**, framed by a literal scene drawn from `example_sentence`.

**1.3 Wire into `index.ts`**:
- If `slideKind === "vocabulary"` and `vocabulary_word` is present → run `buildVocabularyPrompt` first, then still pass through `applyHubStyle` (so the existing house-style suffix is preserved).
- Otherwise: behavior unchanged (no regression for other slide types).

**1.4 Client mirror in `src/components/creator-studio/steps/slide-studio/mediaGeneration.ts`**:
- Add optional `vocabulary_word`, `example_sentence`, `slideKind` to `generateSlideImage(...)` signature so vocabulary slide panels can pass them. Do not change existing call sites (params optional).

No DB changes. No new secrets.

---

### Part 2 — Story Director Auto-Pilot (StoryCreator.tsx)

Note: the codebase has `src/components/creator-studio/steps/StoryCreator.tsx` (no `MiniStoryGenerator.tsx`). The Auto-Pilot will be added there — it controls the same fields the brief calls out (title/character/theme/layout/prompt-equivalents).

**2.1 New edge function** `supabase/functions/ai-story-director/index.ts`:
- Auth via the standard Lovable AI Gateway (`LOVABLE_API_KEY`, model `google/gemini-3-flash-preview`).
- Body: `{ hub, vocabulary: string[], characters: {id,name,visual_blueprint?}[], cefrLevel, genre }`.
- System prompt = the "Story Director" instructions from the user's brief.
- Forces strict JSON via AI SDK `Output.object` with Zod schema:
  - `title` (string, ≤ 60 chars)
  - `character_name` (must match one from input list)
  - `theme` ∈ `['Adventure','School Day','Mystery','Business Trip','Negotiation']`
  - `layout` ∈ `['Classic','Comic','Case Study']` (Case Study forced if hub=success, Comic if academy/playground — server-side enforcement after model output)
  - `prompt` (2-sentence string referencing character + theme + vocab)

**2.2 UI changes in `StoryCreator.tsx`**:
- Add a prominent button at the top of the form: **✨ Auto-Configure Entire Story** (gradient, hub-themed, full-width on mobile).
- Loading state with spinner + disabled while the request is in flight.
- On click:
  1. Gather context: `storyHub`, merged vocab list (linked lesson + typed), `characters` (Cast Vault for hub).
  2. Invoke `ai-story-director` edge function.
  3. Hydrate state: `setCustomPrompt`, find character by `character_name` → `setStarringId`, map `theme` → `setGenre`, map `layout` → `setVisualStyle` (Classic→`classic`, Comic→`webtoon` or `comic_western` based on hub, Case Study→`classic` for Success).
  4. Surface a "Story title" field if missing; otherwise store title in a new `storyTitle` state and pass it through to the existing generate flow.
  5. `setPromptTouched(true)` so the auto-rebuild effect doesn't overwrite the AI-chosen prompt.
- Toast: "Story auto-configured ✓ Review and click Generate."

**2.3 No DB changes.** Reuses existing characters list, vocab, and CEFR.

---

### Technical notes

- Edge function CORS via `corsHeaders` already established in the repo pattern.
- `LOVABLE_API_KEY` is auto-managed; no `add_secret` call needed.
- Both features are additive — no existing call sites change behavior unless they opt in by passing the new fields/clicking the new button.
- Files touched:
  - `supabase/functions/_shared/vocabularyImageBrain.ts` (new)
  - `supabase/functions/generate-slide-image/index.ts` (edit)
  - `supabase/functions/ai-story-director/index.ts` (new)
  - `src/components/creator-studio/steps/slide-studio/mediaGeneration.ts` (edit, optional params)
  - `src/components/creator-studio/steps/StoryCreator.tsx` (edit — Auto-Configure button + handler)
