# Master Library — Fix Duplicates & Missing A2 Level

## What's actually broken (confirmed in DB)

Query against `curriculum_lessons` for `target_system='teen'`:

| CEFR (in `ai_metadata`) | Rows in DB | Unique unit+lesson slots |
|---|---|---|
| A1 | 150 | 50 |
| A2 | 250 | 50 |

Two distinct bugs working together:

1. **A2 is invisible in the Library.** Every row was saved with `difficulty_level = 'beginner'`. The Library's grouping helper `difficultyToCefr('beginner')` always returns `'A1'`, so all 400 teen lessons are crammed under Academy → A1. A2 has nowhere to render. The real CEFR is sitting unused in `ai_metadata.cefr_level`.
2. **Duplicates exist at the DB level.** A1 has 3× copies of each of its 50 lessons; A2 has 5× copies. The previous "anti-spam lock" only protects against double-clicking a single Save button — it does nothing about repeated blueprint generations or parallel inserts, and there is no DB constraint preventing a second copy of `(creator, hub, cefr, unit, lesson)` from being written.

## The fix (3 parts)

### 1. Read CEFR from the right place (UI)

In `src/components/creator-studio/steps/LibraryManager.tsx`, change the level resolver so it prefers `ai_metadata.cefr_level` (and `ai_metadata.level`) over the coarse `difficulty_level` enum. Fallback chain:

```text
ai_metadata.cefr_level  →  ai_metadata.level  →  difficultyToCefr(difficulty_level)
```

Apply this in two places: the `levelGroups` memo (line ~261) and the per-card gradient (line ~576). Result: A1 and A2 (and B1/B2/C1/C2 in the future) each render as their own collapsible Level section under the Academy hub.

### 2. Purge existing duplicates (one-time migration)

Keep the **oldest** row for each `(created_by, target_system, ai_metadata.cefr_level, ai_metadata.unit_number, ai_metadata.lesson_number)` tuple, delete the rest. Expected outcome: 400 teen rows → 100 (50 A1 + 50 A2). A preview SELECT will be shown for confirmation before the DELETE runs.

### 3. Make duplicates impossible going forward (DB constraint)

Add a partial unique index on `curriculum_lessons`:

```sql
CREATE UNIQUE INDEX curriculum_lessons_unique_slot
ON public.curriculum_lessons (
  created_by,
  target_system,
  (ai_metadata->>'cefr_level'),
  ((ai_metadata->>'unit_number')::int),
  ((ai_metadata->>'lesson_number')::int)
)
WHERE ai_metadata ? 'cefr_level'
  AND ai_metadata ? 'unit_number'
  AND ai_metadata ? 'lesson_number';
```

Then update the blueprint save path (`CurriculumMap.tsx` / `lessonLibraryService.saveToLibrary`) to use `.upsert(..., { onConflict: 'created_by,target_system,...' })` so a re-run **updates** the existing lesson instead of inserting a duplicate. Surface the constraint violation as a friendly toast: *"This lesson slot already exists — updated in place."*

### 4. Also persist CEFR to `difficulty_level` correctly

When saving, set `difficulty_level` to the actual CEFR string (`'A1'`, `'A2'`, …) instead of the bucket word `'beginner'`. The existing `difficultyToCefr` helper already accepts both, so old rows keep working.

## Files to change

- `src/components/creator-studio/steps/LibraryManager.tsx` — fix level resolution (no longer collapses A2 into A1).
- `src/components/creator-studio/steps/blueprint/CurriculumMap.tsx` — switch insert → upsert, write real CEFR into `difficulty_level`.
- `src/services/lessonLibraryService.ts` (`saveToLibrary`) — same upsert + real CEFR.
- New SQL migration — partial unique index + one-time dedupe DELETE (preview first).

## What stays the same

- Single source of truth remains `curriculum_lessons` (per project memory).
- Existing UI hierarchy (Hub → Level → Unit → Lesson) is unchanged — it just finally has the data it needs to render every level.
- All existing RLS policies and the anti-spam button lock stay in place; the DB constraint is a belt-and-braces second line of defense.

## After this lands you'll see

```text
Academy Hub
├── Level A1   (50 lessons)
│   ├── Unit 1: My Digital Life     → Lessons 1–5
│   ├── Unit 2: …
│   └── Unit 10: Global Citizens
└── Level A2   (50 lessons)         ← finally visible
    ├── Unit 1: …
    └── …
```

No duplicates, A2 visible, and re-running a generation can never create a second copy.
