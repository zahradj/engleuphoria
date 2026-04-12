
Goal: stop the repeated “Unit 1” behavior and make the AI Wizard the real source of truth for lesson generation.

What I found
- The current curriculum generator is not using a broken `for (... i++)` loop. It generates from `getSpiralSkeleton(...).slice(...).map(...)`.
- The real weak points are:
  1. AI output is merged by array index, not by `unitNumber` / `lessonNumber`, so malformed AI output can still cause wrong unit decoration.
  2. Saving inserts units blindly, so repeated same-context saves can duplicate Unit 1 data in the database.
  3. Lesson slide generation later ignores most curriculum DNA and rebuilds lessons from a generic `topic`, so the Wizard is not the single source of truth yet.

Implementation plan

1. Harden unit progression so repetition cannot leak through
- Update `validateAndEnforceProgression()` to match AI units by `unitNumber` and lessons by `lessonNumber`, not just by array position.
- Reject or ignore duplicate/misnumbered AI units (especially repeated Unit 1), and fall back to the skeleton for invalid entries.
- Keep skeleton order authoritative: Unit 1 → Unit 2 → … → Unit N, always.

2. Introduce a real “Wizard Manifest” using existing JSON fields
- Add a structured `aiWizardManifest` object to the generated unit/lesson data in `src/data/spiralCurriculumSkeleton.ts`.
- Store:
  - `unitNumber`, `lessonNumber`, `cycleType`
  - `anchorPhoneme`, `grammarGoal`, `vocabularyList`
  - `prerequisiteUnit`, `reviewFromUnit`
  - `skillsRequired`, `hintsDisabled`, `highSupport`
  - `masteryCriteria`
  - `wizardScript`, `wizardActions`, `interactionTriggers`
- Persist unit-level manifest into `curriculum_units.unit_data`.
- Persist lesson-level manifest into `curriculum_lessons.content.ai_wizard_manifest` (and/or `ai_metadata` when helpful).

3. Make save behavior safe and non-duplicating
- Before saving, check for existing curriculum units in the same context (`age_group` + CEFR/level + `unit_number`).
- Replace or block duplicate saves instead of silently inserting another Unit 1 set.
- Also preserve lesson order by treating `sequence_order` as authoritative per unit.
- If needed, add a follow-up DB safeguard (unique constraint/index) after cleaning existing duplicate rows.

4. Make lesson generation Wizard-first
- Refactor `CurriculumManager.generateSlidesForLesson()` so it reads the saved manifest instead of generating from only `topic`.
- Pass manifest data into slide generation:
  - discovery/ladder/bridge get different focus ratios
  - review lessons get high-support integrated recap behavior
  - quiz lessons remove hints and enforce speaking/dictation/grammar-check flow
- Extend `slideSkeletonEngine` so it accepts lesson type, skill focus, phonics target, grammar target, and support mode.

5. Tighten the curriculum edge prompt
- Update `supabase/functions/curriculum-expert-agent/index.ts` so the AI must return exact `unitNumber` / `lessonNumber` mappings and never reissue Unit 1 once Unit 2+ exists in the requested skeleton.
- Keep the AI in decoration-only mode, but now require explicit numbering fidelity.

6. End-to-end verification
- Generate a 6-unit curriculum and confirm units display 1–6 exactly once.
- Save the curriculum twice and confirm duplicates are prevented.
- Open Unit 2 / Lesson 6 and verify the manifest shows quiz mode, no hints, and correct prerequisite linkage.
- Confirm Lesson 5 is review mode with high support and carries forward unit vocabulary.

Technical details
- I do not recommend adding new physical DB columns like `wizard_script`, `wizard_animation`, or `skill_type` yet, because your schema already has `unit_data`, `content`, and `ai_metadata` JSON fields that can hold the manifest cleanly.
- The likely root cause is architectural, not a literal missing increment operator: index-based AI merge + blind DB inserts + generic downstream lesson generation.

Files likely involved
- `src/data/spiralCurriculumSkeleton.ts`
- `src/components/content-creator/CurriculumGeneratorWizard.tsx`
- `src/components/content-creator/CurriculumManager.tsx`
- `src/services/slideSkeletonEngine.ts`
- `src/components/admin/lesson-builder/ai-wizard/types.ts`
- `src/components/admin/lesson-builder/ai-wizard/generatePPPLesson.ts`
- `supabase/functions/curriculum-expert-agent/index.ts`

Possible database work
- Maybe not required for manifest storage.
- May be required for duplicate-prevention constraints after existing repeated rows are normalized.
