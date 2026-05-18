# Fix: Curriculum-to-Generator Integration

## Root cause

1. **Curriculum Blueprint stores thin lesson refs only.** `BlueprintLessonRef` in `CreatorContext.tsx` carries `{id, title, skill_focus, objective}` — no vocabulary, pronunciation, phonics, adaptive profile, story state, game/homework targets.
2. **`loadLessonBlueprintFromCurriculum` papers over the gap** by returning a `LessonBlueprint` with empty arrays for vocabulary/pronunciation/phonics/game/homework targets. The generator then receives mostly empty fields and produces weak/empty output.
3. **No pre-flight validation** — `validateBlueprintIntegrity` exists in `lessonBlueprint.ts` but is never invoked before generation. Failures surface as silent empty decks instead of actionable warnings.
4. **Mode selection is implicit.** The page already branches on `fromBlueprint`, but there is no clear "Manual Mode" affordance or auto-fallback when blueprint resolution fails partway.

## Fix

### 1. Enrich `BlueprintLessonRef` with full structured fields

Extend `BlueprintLessonRef` (`src/components/creator-studio/CreatorContext.tsx`) to carry the full lesson blueprint shape:

```text
BlueprintLessonRef {
  id, lesson_number, title, skill_focus, objective,
  + communication_goal?: string
  + grammar_focus?: string[]
  + vocabulary_focus?: string[]
  + pronunciation_focus?: string[]
  + phonics_focus?: string[]
  + review_targets?: string[]
  + adaptive_profile?: { difficulty_tier, scaffolding_boost, pacing_hint }
  + story_state?: { arc, theme, characters }
  + game_targets?: string[]
  + homework_targets?: string[]
}
```

All new fields are optional → fully backwards compatible with existing curricula in state/DB.

### 2. Have the Blueprint edge function emit those fields

Update `supabase/functions/generate-blueprint/index.ts` (and the curriculum-generation prompt) to require the LLM to emit, for each lesson:

- `communication_goal` (one sentence, derived from `objective`)
- `grammar_focus[]` (≤2 items, CEFR-bounded)
- `vocabulary_focus[]` (hub vocab cap: Playground 8 / Academy 14 / Success 16)
- `pronunciation_focus[]`, `phonics_focus[]` (CEFR-bounded)
- `review_targets[]` (titles of earlier lessons in unit recycling vocab/grammar)
- `adaptive_profile` (defaults: tier 3, boost 0, pacing maintain)
- `story_state` (arc string, theme = unit theme, characters[])
- `game_targets[]`, `homework_targets[]` (1–3 each, drawn from vocabulary_focus)

Prompt enforces hub × CEFR matrix and vocab cap. Schema-validated server-side before returning.

### 3. Promote `loadLessonBlueprintFromCurriculum` to a pass-through

Rewrite `curriculumBinding.ts:loadLessonBlueprintFromCurriculum` to:

- Read the full structured fields directly off the lesson ref when present
- Fall back to derived defaults (current behavior) only for missing fields, never overwrite real data
- Stamp `unit_number`, `lesson_number`, `unit_title`, `curriculum_title`, `previous_lesson_title`, `next_lesson_title`, `prerequisite_skills` from tree walk

### 4. Wire the generator to support two explicit modes with auto-fallback

Refactor `UnifiedLessonGeneratorPage.tsx`:

- Add `mode: 'curriculum' | 'manual'` derived state. `curriculum` when `fromBlueprint && resolvedBlueprint` resolves AND validation passes; otherwise `manual`.
- Show a clear mode badge in the header ("Curriculum Mode · locked fields" vs "Manual Mode · free authoring").
- Add a "Switch to Manual Mode" button in Curriculum Mode for explicit override (unlocks all fields, drops curriculum slot binding for that run).
- If blueprint resolution fails (no `resolvedBlueprint` or `assertCurriculumSafe` returns `block`), automatically fall back to Manual Mode with a `toast.warning` explaining why — never block generation.

### 5. Pre-flight validation gate (no silent failures)

Before `handleGenerate` calls `generateUnifiedLesson`:

- Call `validateBlueprintIntegrity()` from `lessonBlueprint.ts` on the resolved blueprint.
- Plus a lightweight manual-mode check: `title`, `cefr`, `goal`, and at least one of `grammar` / `vocab` non-empty.
- Render a `<ValidationWarningPanel>` listing each issue with severity. `block`-level issues disable the Generate button with an inline reason; `warn`-level issues are shown but do not block.
- Replace the current "no curriculum loaded" banner with this panel so all validation state lives in one place.

### 6. Persist enriched fields end-to-end

- `CurriculumMap.tsx` lesson cards already render `objective`; no UI change required, but verify enriched fields survive the round-trip when curricula are saved/restored (the persistence layer already stores curricula as JSON, so the extra fields ride along automatically).
- `linkBlueprintToGenerator` already accepts the full blueprint — once the source is enriched, no change needed.

## Files touched

- **Edit**: `src/components/creator-studio/CreatorContext.tsx` (extend `BlueprintLessonRef`)
- **Edit**: `src/services/contentCreator/curriculumBinding.ts` (pass-through resolution)
- **Edit**: `src/pages/content-creator/UnifiedLessonGeneratorPage.tsx` (mode state, fallback, validation gate)
- **New**: `src/components/content-creator/ValidationWarningPanel.tsx`
- **Edit**: `supabase/functions/generate-blueprint/index.ts` (emit structured fields; prompt + schema)

## Out of scope

- No changes to orchestrator, governance, planner, QA, stabilization, gamification engines.
- No DB migration — enriched curriculum data fits inside existing JSON storage.
- No changes to lesson save format (`curriculum_lessons.ai_metadata` already carries arbitrary blueprint JSON).

## Result

- Curriculum Mode delivers fully-populated `LessonBlueprint` objects → orchestrator generates coherent lessons.
- Manual Mode remains a first-class standalone path; auto-engaged when curriculum data is absent or invalid.
- All validation surfaces as visible warnings; generation never fails silently.