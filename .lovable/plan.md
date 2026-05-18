Root cause found:

1. Curriculum generation is failing at the edge function because Gemini returns a huge JSON payload and hits `MAX_TOKENS`, then the function returns non-2xx.
2. Even when the edge function returns structured lesson fields, `BlueprintEngine.tsx` currently strips them out when mapping the response into `CurriculumData`.
3. The Unified Lesson Generator initializes its form from the lightweight `activeBlueprintContext`, not the resolved structured blueprint, so vocabulary/grammar/goals can be empty or wrong.
4. Curriculum-bound saving may also be fragile because the upsert uses slot columns but the row payload does not clearly populate those same slot columns.

Implementation plan:

1. Fix curriculum blueprint generation reliability
   - Update `generate-curriculum-blueprint` to produce compact structured JSON that cannot balloon into long prose.
   - Add deterministic fallback enrichment inside the edge function for any missing structured fields, so every lesson always has:
     - `communication_goal`
     - `grammar_focus`
     - `vocabulary_focus`
     - `pronunciation_focus`
     - `phonics_focus`
     - `review_targets`
     - `game_targets`
     - `homework_targets`
     - `story_state`
   - Handle `MAX_TOKENS` gracefully by retrying with a smaller/compact prompt before failing.

2. Preserve structured blueprint fields in the frontend
   - Fix `BlueprintEngine.tsx` so it stores the complete lesson objects returned by the edge function instead of discarding enriched fields.
   - Keep backward compatibility for older blueprint rows that only have `title`, `skill_focus`, and `objective`.

3. Hydrate the Unified Lesson Generator from the real blueprint object
   - In `UnifiedLessonGeneratorPage.tsx`, when `resolvedBlueprint` loads, sync form state from it:
     - title from `lesson_title`
     - theme from `story_state.theme`
     - grammar from `grammar_focus`
     - vocab from `vocabulary_focus`
     - goal from `communication_goal`
     - review from `review_targets`
   - Ensure Curriculum Mode sends the resolved structured blueprint into `linkBlueprintToGenerator()` without empty overrides replacing valid blueprint data.
   - Keep Manual Mode fully independent and working without curriculum data.

4. Fix pre-flight validation behavior
   - Validate curriculum mode against the actual resolved blueprint plus intentional user edits.
   - Validate manual mode against manual fields only.
   - Show clear warnings/blockers instead of silently failing or generating empty lessons.

5. Fix save/upsert consistency
   - Ensure `saveUnifiedLessonToLibrary()` writes the slot fields used by the `onConflict` key:
     - `slot_cefr_level`
     - `slot_unit_number`
     - `slot_lesson_number`
   - Store the blueprint hash in `ai_metadata.unified_output.blueprint_hash` so duplication detection works as intended.

6. Verify the flow
   - Check TypeScript/runtime errors relevant to `/content-creator`.
   - Confirm the blueprint route no longer throws the `MAX_TOKENS` failure for normal 2-unit/4-lesson generation.
   - Confirm selecting a blueprint lesson opens the Unified Generator with structured grammar/vocab/goal populated.
   - Confirm manual generation still works without any blueprint loaded.