# Cycle 2 wiring + Homework Generation Fix

## Part A — Finish Cycle 2 (Adaptive Dashboard)

The hooks, edge functions, and room components were built last cycle but never mounted. Wire them in for all three hubs.

1. **Mount `DashboardHero`** (greeting + `CEFRBar` + `XPStreakWidget` + `RecapCard`) at the top of:
   - `src/pages/dashboard/PlaygroundDashboard.tsx`
   - `src/pages/dashboard/AcademyDashboard.tsx`
   - `src/pages/dashboard/HubDashboard.tsx` (Success)
   Hub-coloured accent passed as prop (`playground|academy|success`).

2. **Routes** in `src/App.tsx`:
   - `/dashboard/vocabulary` → `VocabularyRoomPage`
   - `/dashboard/speaking`   → new `SpeakingStudioPage`
   - `/dashboard/library`    → new `GradedLibraryPage`
   Each page resolves the student's hub via `useStudentLevel` and renders the matching room.

3. **Recap → Active Theme link**: `RecapCard` "Continue this week's theme" CTA navigates to `/dashboard/vocabulary` with the resolved theme prefilled.

4. **XP wiring**: call `award-xp` from `VocabularyRoom` (quiz pass), `SpeakingStudio` (submit), `GradedLibraryRoom` (mark complete).

## Part B — Root-cause fix for `Homework Failed: … status=400 body={}`

### Diagnosis
Edge logs show the function returns **400 in ~278 ms**, well before the AI call. That isolates the failure to the input-validation block in `supabase/functions/generate-homework/index.ts` (lines 90–105):

- `bp.vocabulary` is empty/missing → falls into "No blueprint or vocabulary/grammar provided", **or**
- vocabulary normalises to fewer than 3 strings → "Need at least 3 vocabulary items".

The Academy lesson the user is editing has a saved `curriculum_lessons` row, but `vocabulary_list` / blueprint vocabulary is empty or below the threshold, so the request never reaches Gemini.

The toast shows `body={}` because `extractEdgeError` does `JSON.stringify(error.context.body)` — supabase-js v2 hands back the response body as a `Blob`, which serialises to `{}`. The real JSON message from the function is being thrown away.

### Fix (root cause, both ends)

1. **`supabase/functions/generate-homework/index.ts`** — make vocabulary resolution resilient before failing:
   - If blueprint vocab < 3, hydrate from `curriculum_lessons.vocabulary_list` (already attempted) **plus** fall back to `unit_vocabulary` (joined via lesson → unit) and finally `vocabulary_bank` filtered by the lesson's theme/CEFR.
   - Only return 400 after all hydration paths fail, and include `code: "INSUFFICIENT_VOCABULARY"`, the resolved count, and a human hint ("Add at least 3 vocabulary words to the lesson before generating homework").
   - Keep the response shape `{ error, code, hint, vocabularyCount }`.

2. **`src/lib/extractEdgeError.ts`** — read `context.body` when it is a `Blob`/`ReadableStream`:
   - If `body instanceof Blob` → `await body.text()` then JSON-parse.
   - If body has a `.getReader` (stream) → drain to text.
   - Make `extractEdgeError` async (`await`) and update the three creator pages (`AcademyCreator`, `PlaygroundCreator`, `SuccessCreator`) plus any other call sites to `await` it.

3. **Creator UX** — when the toast surfaces `code: INSUFFICIENT_VOCABULARY`, show the hint inline and focus the blueprint vocabulary field instead of a raw error string.

### Verification
- `supabase--curl_edge_functions` POST `generate-homework` with `{ lesson_id: <real id> }` and inspect the JSON body (no more `{}`).
- Add 3 vocab words to the lesson, retry, and confirm the assignment row is inserted.
- Check `supabase--edge_function_logs generate-homework` for the new structured error code on the failure case.

## Files touched
- `supabase/functions/generate-homework/index.ts`
- `src/lib/extractEdgeError.ts`
- `src/pages/AcademyCreator.tsx`, `PlaygroundCreator.tsx`, `SuccessCreator.tsx`
- `src/pages/dashboard/PlaygroundDashboard.tsx`, `AcademyDashboard.tsx`, `HubDashboard.tsx`
- `src/pages/dashboard/SpeakingStudioPage.tsx` (new), `GradedLibraryPage.tsx` (new)
- `src/App.tsx`
