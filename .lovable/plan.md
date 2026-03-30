

## Plan: Fix Curriculum Save-to-Database Failure

### Problem Summary

Two distinct bugs prevent the content creator from saving generated curriculum:

**Bug 1 — Edge function mode mismatch**: The wizard sends `mode: 'curriculum_structure'` but the edge function only handles `curriculum`, `lesson`, `unit`, etc. It falls through to the default lesson prompt, which causes the AI to return plain text instead of JSON, triggering the parse error.

**Bug 2 — Wrong column names in INSERT**: The `handleSaveToDB` function in `CurriculumGeneratorWizard.tsx` uses column names that don't exist in the `curriculum_units` table:
- `name` → should be `title`
- `unit_order` → should be `unit_number`
- Missing required columns: `age_group`, `cefr_level`, `learning_objectives`

### Changes

**File 1: `src/components/content-creator/CurriculumGeneratorWizard.tsx`**

Fix the `handleSaveToDB` function to use correct column names and include all required fields:

```typescript
const { data: unitData, error: unitError } = await supabase
  .from('curriculum_units')
  .insert({
    title: unit.title,
    unit_number: unit.unitNumber,
    age_group: config.ageGroup,
    cefr_level: cefrLevel,
    learning_objectives: unit.lessons.flatMap(l => l.objectives || []),
  })
  .select()
  .single();
```

Also fix the edge function invocation to use `mode: 'curriculum'` instead of `mode: 'curriculum_structure'`.

**File 2: `supabase/functions/curriculum-expert-agent/index.ts`**

Add `curriculum_structure` as a recognized alias for the curriculum mode in `getSystemPrompt`, `getModelForMode`, and `getMaxTokensForMode`. Also improve JSON extraction in the parse step to handle array-wrapped or markdown-fenced responses more robustly. Ensure the `buildUserPrompt` includes `unitCount` and `lessonsPerUnit` context when present.

### Technical Details

| File | Change |
|---|---|
| `CurriculumGeneratorWizard.tsx` | Fix column names (`title`, `unit_number`), add required fields (`age_group`, `cefr_level`, `learning_objectives`) |
| `curriculum-expert-agent/index.ts` | Handle `curriculum_structure` mode, improve JSON extraction resilience |

