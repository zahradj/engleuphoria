## Fix curriculum save: `on_conflict` parser error

### Root cause
PostgREST's `on_conflict` query param accepts only **column names**, not expressions. The migration `20260501115349` created the unique index on expressions (`(ai_metadata->>'cefr_level')`, etc.), and the client passes those expressions to `.upsert({ onConflict })`. PostgREST refuses to parse them → the error you saw.

### Fix

**1. Migration** — promote the slot keys to real `STORED GENERATED` columns and rebuild the partial unique index on those columns:

```sql
ALTER TABLE public.curriculum_lessons
  ADD COLUMN IF NOT EXISTS slot_cefr_level    text
    GENERATED ALWAYS AS (ai_metadata->>'cefr_level')    STORED,
  ADD COLUMN IF NOT EXISTS slot_unit_number   text
    GENERATED ALWAYS AS (ai_metadata->>'unit_number')   STORED,
  ADD COLUMN IF NOT EXISTS slot_lesson_number text
    GENERATED ALWAYS AS (ai_metadata->>'lesson_number') STORED;

DROP INDEX IF EXISTS public.curriculum_lessons_unique_slot;

CREATE UNIQUE INDEX IF NOT EXISTS curriculum_lessons_unique_slot
  ON public.curriculum_lessons
    (created_by, target_system, slot_cefr_level, slot_unit_number, slot_lesson_number)
  WHERE slot_cefr_level   IS NOT NULL
    AND slot_unit_number  IS NOT NULL
    AND slot_lesson_number IS NOT NULL;
```

Generated columns auto-backfill from existing rows; writers keep setting only `ai_metadata`.

**2. Client** — change both `onConflict` strings to plain column names:

- `src/components/creator-studio/steps/blueprint/CurriculumMap.tsx` (line 107)
- `src/services/lessonLibraryService.ts` (line 142)

Both become:
```ts
onConflict: 'created_by,target_system,slot_cefr_level,slot_unit_number,slot_lesson_number'
```

### Result
- Same dedupe semantics (same 5-tuple, same partial filter).
- PostgREST can resolve `on_conflict` against real columns and use the matching unique index.
- Curriculum blueprint save and library upserts will succeed.

Approve to apply.
