## Auto-Suggest Target Vocabulary in Story Creator

Add an "✨ Auto-Suggest" button next to the Target Vocabulary input that asks the AI to propose between **5 and 12** topical vocabulary words for the chosen CEFR level + genre, **always including any vocab from the linked lesson** so the existing 5–12 validator passes on first try.

---

### 1. Edge Function — `supabase/functions/ai-core/index.ts`

Add a new lightweight action `suggest_vocabulary`:

- Input: `{ action: 'suggest_vocabulary', cefr_level, genre, linked_lesson_title?, linked_grammar?, must_include?: string[] }`
- Prompt Gemini with strict instructions:
  - Return JSON only: `{ "words": ["...", "..."] }`
  - Total length **between 5 and 12**, deduped (case-insensitive)
  - **Every word in `must_include` MUST be present** (those are the linked-lesson words)
  - Single lemmas/short phrases, age-appropriate for the CEFR level, thematically tied to the genre + linked lesson topic
- Server-side post-processing:
  - Lowercase-dedupe, strip empties, trim
  - Re-inject any missing `must_include` words
  - If total > 12 → trim non-required tail; if < 5 → fall back to repeating must-include + safe genre words
- Return `{ words: string[] }` with CORS + JWT validation matching the rest of `ai-core`.

### 2. Creator UI — `src/components/creator-studio/steps/StoryCreator.tsx`

Add to the Target Vocabulary block:

- New `suggesting` state.
- New `handleSuggestVocab` async handler that:
  1. Builds `must_include` from `linkedLesson` (via existing `vocabListToArray`) ∪ already-typed words in `vocabInput`.
  2. Calls `supabase.functions.invoke('ai-core', { body: { action: 'suggest_vocabulary', cefr_level: cefrLevel, genre, linked_lesson_title: linkedLesson?.title, linked_grammar: linkedLesson?.grammar_pattern, must_include } })`.
  3. On success: sets `vocabInput` to the returned comma-joined list; toasts `"Suggested N vocabulary words ✓"`.
  4. On failure: toast error, leave existing input untouched.
- UI: a small `Button variant="outline" size="sm"` with `Sparkles` icon labelled **"Auto-suggest"**, placed inline on the right of the Target Vocabulary label row. Disabled while `busy`, `suggesting`, or when `cefrLevel`/`genre` are unset. Shows `Loader2` spinner while suggesting.
- The existing 5–12 validator stays exactly as-is — the new flow is just an aid.

### 3. Backward compatibility

- No DB changes.
- Pure additive: existing manual typing flow and linked-lesson auto-merge continue to work.
- If the edge function is ever offline, the button surfaces a toast and the user can still type words manually.

### Files to edit

- `supabase/functions/ai-core/index.ts` — add `suggest_vocabulary` action + helper.
- `src/components/creator-studio/steps/StoryCreator.tsx` — add suggest button, handler, and state.

### Out of scope

- Suggesting grammar patterns (handled by linked lesson).
- Editing/persisting vocab on linked curriculum lessons themselves.
