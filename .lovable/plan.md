## Plan

Two combined upgrades. Phase A confirms/hardens the Creator Studio AI migration. Phase B rebuilds the blueprint generator into a true Dynamic Scope & Sequence engine with anti-literal, anti-repetition rules.

---

### A. Creator Studio AI — Final Migration Pass

The shared `_shared/aiFetch.ts` is already routing every Creator Studio call to Gemini-direct first (Lovable AI is now an optional last-resort fallback only if its key is still set). What's still missing is a **shared persona** and a guarantee that the rewrite / multi-item generators always return structured JSON.

**Files touched (Creator Studio scope only — background cron, n8n-bridge, classroom AI, image/audio pipelines untouched):**

1. **New** `supabase/functions/_shared/studioPersona.ts`
   - Exports `buildStudioSystemPrompt({ role, cefr, ageGroup, targetGrammar?, hub?, outputContract })`.
   - `role` = `"pedagogue" | "game-designer" | "rewriter"`.
   - Always prepends the **Expert Pedagogue / Game Designer** persona, CEFR ladder rules (reuses table from blueprint generator), and "return strict JSON conforming to: …" clause when caller asks.

2. **Edit** the 6 functions wired to Creator Studio buttons so they import and inject this persona + accept a `studioContext` payload (`{ cefr, age_group, hub, target_grammar, previous_topics }`):
   - `generate-practice-items` — force `response_format: json_object` with a `{ items: [...] }` envelope (Gemini rejects naked top-level arrays in JSON mode); add an explicit `count` and per-item schema for Error Detection sentences.
   - `ai-rewrite-text` — accept optional `cefr`/`tone` context, return `{ rewrites: string[] }` so the dialog can show alternatives.
   - `rewrite-slide-field` — same persona injection; keep single-string contract.
   - `ai-slide-game-generator` — game-designer persona, JSON envelope.
   - `generate-canvas-game` — game-designer persona, JSON envelope.
   - `studio-ai-copilot` — pedagogue persona, accepts `studioContext`.
   - `ai-extract-lesson-from-text`, `analyze-media`, `generate-storybook`, `generate-ppp-slides`, `generate-blueprint`, `sync-slides-to-blueprint`, `plan-lesson-blueprint` — persona injection only (already JSON-shaped via tool-calling).

3. **Edit** the corresponding frontend hooks (`PracticeItemsEditor`, `WandFieldButton`, `DifficultyTunerDialog`, `CanvasElementEditor`, `TeacherControlsPanel` slide-game button, `CreatorStudioAITools`, `ImportFromTextDialog`) to forward `cefr`, `target_grammar`, and `hub` from `CreatorContext` so the persona has real context to specialise on.

4. **Verification:** curl-test `generate-practice-items` (5 Error-Detection items at B1, target_grammar = "past simple") and `ai-rewrite-text` (3 rewrites at A2) — both must return valid JSON arrays/envelopes.

No background cron, webhook, or automated pipeline is modified.

---

### B. Dynamic Scope & Sequence Matrix (curriculum blueprint)

All three phases land in **`supabase/functions/generate-curriculum-blueprint/index.ts`** plus a small frontend update.

**Phase 1 — Anti-Literal Constraint**
Append to the system prompt:

> CRITICAL: The hub names (Playground, Academy, Success) indicate **age and proficiency only**. DO NOT generate literal lessons about playgrounds, academies, or workplaces unless the user's `theme_hint` explicitly requests them. Themes must be diverse, vivid, and unrelated to the hub's name.

**Phase 2 — Dynamic Theme Genre Generator**
Inside the function, before building the prompt:

```text
GENRE_POOL by CEFR band:
  A1            → Space Adventure, Magical Creatures, Superheroes,
                  Under the Sea, Robot Friends
  A2 / B1       → Detective Mystery, Time Travel, Sports Championship,
                  Jungle Survival, Teen Drama
  B2 / C1       → Business Negotiation, Sci-Fi Cyberpunk, Ethical Dilemma,
                  Global Tech Startup, Historical Documentary
```

- Map `cefr_level` → band, pick a random genre.
- If the caller already passed a non-empty `theme_hint`, that wins (user intent overrides randomness).
- Otherwise inject the picked genre as `lesson_theme` in both system + user prompts and echo it back in the response (`{ chosen_genre: "Time Travel", … }`) so the UI can show what it picked.

**Phase 3 — Anti-Repetition (`previous_topics`)**

- Edge function: accept `previous_topics: string[]` (max 10, trimmed). When non-empty, append:

  > You MUST NOT reuse any of the following themes, primary vocabulary, storylines, or settings: [list]. Ensure 100% originality. Every unit theme and lesson title must be semantically distinct from this list.

- Frontend (`BlueprintEngine.tsx`): before invoking the function, query Supabase for the **last 5 lesson titles** authored by the current user from `curriculum_lessons` (canonical lessons table per project memory) ordered by `created_at desc`, and pass them as `previous_topics`. Fail open — if the query fails, just send `[]`.

**Validation step** added inside the edge function: after Gemini responds, lowercase-compare every generated `lesson.title` and `unit.theme` against `previous_topics`. If any exact match is found, automatically retry once with a stronger "ABSOLUTELY FORBIDDEN" reminder before returning.

---

### Rollout / verification

- Deploy all touched edge functions in one batch.
- Curl `generate-curriculum-blueprint` four times back-to-back at the same CEFR with the previous response's titles fed as `previous_topics`; confirm zero title duplicates and that themes match the chosen genre pool (no "playground" lessons appear at A1 unless user typed it).
- Manual UI smoke: open Creator Studio → Blueprint Engine, generate twice, confirm dramatically different themes; open Practice Items editor, generate 5 Error-Detection items at B1 / past-simple, confirm a clean JSON list renders.

### Out of scope

- Background AI cron jobs, n8n bridge, classroom realtime AI (tutor, phonetic, character voices), image / audio / video generation, lesson auto-completion.
- The `lessons` table (project rule: curriculum content lives only in `curriculum_lessons`).
