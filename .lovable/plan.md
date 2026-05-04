## Part A — Harden the Lesson Importer (`ai-extract-lesson-from-text`)

Make the 4-phase generator self-correcting before any slides reach the editor.

### A1. Vocabulary coverage check
After parsing the AI response, verify each of the 5 `_lesson_metadata.target_vocab` words appears (case-insensitive, word-boundary match) in `_source_text`.
- Pass → continue.
- Fail → record `missing_vocab[]` and trigger a **Phase 2 re-run** (see A3).

### A2. Quiz answer verification
Walk every quiz slide (`multiple`, `truefalse`, `multiple_choice`, fill-in-the-blank). For each:
- `multiple` / `multiple_choice`: confirm `options[correctIndex]` (or its key noun) is found in `_source_text`.
- `truefalse`: ask the AI in a tiny verifier call (cheap JSON, gemini-flash) whether the statement is supported by `_source_text` and matches `answer`.
- Fill-in-the-blank: confirm the answer string appears in `_source_text`.
Collect failures into `bad_quiz_slides[]` with their slide indices.

### A3. Regenerate-failed-phases retry mechanism
New helper `regeneratePhase(phase, context)` reuses the same model with a focused prompt:
- **Phase 2 retry** (vocab not covered): "Rewrite ONLY `_source_text` so that ALL of these words appear naturally: [...]. Keep title, vocab, grammar identical."
- **Phase 3 retry** (bad quiz slides): "Regenerate ONLY these slide indices: [...]. Every correct answer must be directly derivable from this passage: <_source_text>."
Up to **2 retry rounds**. After round 2, return whatever passes plus a `validationWarnings[]` field the UI can surface.

### A4. Response shape
```
{ title, level, hub, slides, validation: { vocabCoverage: 5/5, quizVerified: 18/18, retries: 1, warnings: [] } }
```

### A5. UI surfacing
`ImportFromTextDialog` shows a small validation badge after generation (✅ "All checks passed" or ⚠️ "2 warnings — review highlighted slides"). Warned slide indices are passed via `sessionStorage` and the creator marks those slide thumbnails with an amber dot.

---

## Part B — Step 9: Template Marketplace

Let creators publish a finished lesson as a **public template** and let other creators clone it into their own editor with one click.

### B1. Database (migration)
New table `lesson_templates`:
- `id uuid pk`, `created_by uuid` (auth.users), `hub text` ('playground'|'academy'), `title text`, `description text`, `level text`, `cover_image_url text`, `tags text[]`, `slide_count int`, `payload jsonb` (full slides array + metadata), `clone_count int default 0`, `is_published bool default true`, `created_at`, `updated_at`.
- RLS:
  - SELECT: anyone authenticated (public marketplace).
  - INSERT/UPDATE/DELETE: `created_by = auth.uid()` OR `has_role(auth.uid(),'admin')`.
- Index on `(hub, level)` and a GIN index on `tags`.

New RPC `increment_template_clone(template_id uuid)` — security definer, +1 to `clone_count`.

### B2. Edge function — `publish-lesson-template`
Takes the current creator's slides + metadata, validates (≥8 slides, title required), inserts into `lesson_templates`. Returns the new id.

### B3. New page — `/template-marketplace`
- Hub-themed grid (Playground orange / Academy purple).
- Filters: hub, CEFR level, tag chips, search.
- Each card: cover image, title, level badge, slide count, clone count, "by {creator}".
- Card actions: **Preview** (modal slide-deck preview, read-only) and **Clone into editor**.

### B4. "Clone into editor" flow
Reuses the existing `IMPORTED_LESSON_STORAGE_KEY` pattern:
1. Fetch full `payload` from `lesson_templates`.
2. Stash `{ title, level, slides, hub }` into `sessionStorage`.
3. Navigate to `/playground-creator?imported=1` or `/academy-creator?imported=1`.
4. Existing mount-time effect injects slides — zero new wiring in the creators.
5. Call `increment_template_clone` RPC.

### B5. Publish entry point in creators
Add a "Publish as Template" item to the existing `BulkActionsMenu` dropdown in both `AcademyCreator.tsx` and `PlaygroundCreator.tsx`. Opens a small dialog: title, description, tags (comma input), cover image (auto-grab from first slide with imageUrl, or upload). Confirm → calls `publish-lesson-template`.

### B6. Discovery surface
- New tile on `/content-creator` dashboard: **"Browse Template Marketplace"** with a count of available templates per hub.
- Sidebar nav entry under Creator section.

### Files to create
- `supabase/migrations/<ts>_lesson_templates.sql`
- `supabase/functions/publish-lesson-template/index.ts`
- `src/pages/TemplateMarketplace.tsx`
- `src/components/creator-studio/marketplace/TemplateCard.tsx`
- `src/components/creator-studio/marketplace/TemplatePreviewDialog.tsx`
- `src/components/creator-studio/marketplace/PublishTemplateDialog.tsx`
- `src/hooks/useLessonTemplates.ts`

### Files to edit
- `supabase/functions/ai-extract-lesson-from-text/index.ts` (Part A)
- `src/components/creator-studio/shared/ImportFromTextDialog.tsx` (validation badge)
- `src/components/creator-studio/shared/BulkActionsMenu.tsx` (Publish as Template)
- `src/pages/AcademyCreator.tsx` & `src/pages/PlaygroundCreator.tsx` (warned-slide badges, publish dialog mount)
- `src/App.tsx` (add `/template-marketplace` route)
- `supabase/config.toml` (expose `publish-lesson-template`)

### Out of scope (future)
Ratings/reviews, paid templates, version forking. Marketplace ships as free + clone-count only.