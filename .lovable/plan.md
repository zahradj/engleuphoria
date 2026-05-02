## Diagnosis

The current error is no longer the original parser error. The database now has generated slot columns, and the app now sends:

```text
onConflict: created_by,target_system,slot_cefr_level,slot_unit_number,slot_lesson_number
```

However, the unique index that was created is a **partial unique index**:

```sql
WHERE slot_cefr_level IS NOT NULL
  AND slot_unit_number IS NOT NULL
  AND slot_lesson_number IS NOT NULL
```

PostgREST/Supabase client upsert cannot target that partial index from `onConflict` unless the conflict target predicate is also supplied, which the JS client is not doing here. So Postgres rejects the request with:

```text
there is no unique or exclusion constraint matching the ON CONFLICT specification
```

That is why the problem persists even though the columns and index exist.

## Root fix

### 1. Replace the partial unique index with a real unique constraint

Create a new migration that:

- Drops the partial `curriculum_lessons_unique_slot` index.
- Ensures `slot_cefr_level`, `slot_unit_number`, and `slot_lesson_number` are still generated from `ai_metadata`.
- Backfills/deduplicates any existing complete curriculum slots before adding the constraint.
- Adds a plain unique constraint on:

```text
created_by, target_system, slot_cefr_level, slot_unit_number, slot_lesson_number
```

This produces a real constraint that `onConflict` can reliably target through PostgREST.

### 2. Preserve compatibility for lessons without slot metadata

Because Postgres unique constraints allow multiple `NULL` values, non-blueprint lessons without `slot_*` metadata can still coexist. Blueprint lessons with complete slot metadata will dedupe correctly.

### 3. Harden the frontend payload

Update the blueprint save path so every generated blueprint lesson explicitly carries complete slot metadata:

- `ai_metadata.cefr_level`
- `ai_metadata.unit_number`
- `ai_metadata.lesson_number`

Also include defensive normalization so unit/lesson numbers are always written as stable strings/numbers consistently.

### 4. Fix the separate single-lesson save path

`src/services/lessonLibraryService.ts` currently uses the same slot conflict target even when it saves a standalone lesson that does **not** include `unit_number` / `lesson_number`. I will change that flow so it does not use the curriculum-slot upsert path unless it actually has a complete slot identity. For standalone lesson creation, it should insert or use a different safe identity, not the blueprint slot constraint.

### 5. Verification

After changes, verify through read-only checks that:

- `curriculum_lessons_unique_slot` is a real unique constraint / non-partial unique backing index.
- No duplicate complete blueprint slots exist.
- The frontend no longer points a standalone save at the blueprint-only conflict target.

## Expected result

Clicking **Force Save to Library** should update existing curriculum slots or create missing ones without creating duplicates, and without the `ON CONFLICT` constraint error.