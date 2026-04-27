# Fix: Generated Curriculum Not Showing in Master Library

## Root Cause

In `src/components/content-creator/CurriculumGeneratorWizard.tsx`, the "Save to Database" button inserts every generated lesson into `curriculum_lessons` with:

```ts
is_published: false
```

But every Master Library reader filters by `is_published = true`:

- `src/services/curriculumLessonService.ts` — `getLessonsBySystem`, `getLessonsByLevel`, `getNextLesson`, `getPreviousLesson` all `.eq('is_published', true)`
- `src/services/lessonLibraryService.ts` — `getLibraryLessons` `.eq('is_published', true)`

Result: lessons save successfully but are invisible to the library. There is also currently no separate "Publish" action — only one "Save to Database" button.

## Fix (Two-Part)

### 1. Rename and repurpose the action as "Publish to Master Library"

In `CurriculumGeneratorWizard.tsx`:

- Change the button label from `Save to Database` → `Publish to Master Library` (icon: `BookOpen` instead of `Save`).
- In `handleSaveToDB` (rename to `handlePublishToLibrary`), set `is_published: true` on the lesson inserts.
- Update success toast: `"Published {savedCount} units and {lessonCount} lessons to the Master Library"`.
- Keep the "skipped duplicates" warning behavior intact.

### 2. Backfill any previously generated unpublished lessons (optional one-shot)

Generated curricula from prior sessions are stuck with `is_published: false`. Provide a small SQL update via the data-update tool to flip those rows to published so the user immediately sees their existing curriculum:

```sql
UPDATE curriculum_lessons
SET is_published = true
WHERE is_published = false
  AND created_by IS NOT NULL;
```

(Scoped to `created_by IS NOT NULL` so we don't accidentally publish system seed rows if any exist as drafts.)

## Files Changed

- `src/components/content-creator/CurriculumGeneratorWizard.tsx` — button label/icon, function rename, `is_published: true`, updated toasts.

## Out of Scope

- No schema changes.
- No new draft/publish toggle workflow (current product has a single Publish action; can be added later if you want a "Save as Draft" path).
- Curriculum units don't have an `is_published` column — only lessons gate the library, so units need no change.

## Verification After Implementation

1. Generate a new curriculum → click "Publish to Master Library".
2. Open the Master Library / lesson library views — newly generated lessons appear under the matching hub/level.
3. Existing previously-generated lessons (after backfill) also appear.
