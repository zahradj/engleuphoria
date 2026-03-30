

## Plan: Remove `target_system` from curriculum save logic

### Problem
The `handleSaveToDB` function in `CurriculumGeneratorWizard.tsx` inserts `target_system` into both `curriculum_units` and `curriculum_lessons`, but `curriculum_units` has no such column. The `curriculum_lessons` table likely does have it, but units do not.

### Changes

**File: `src/components/content-creator/CurriculumGeneratorWizard.tsx`**

Remove `target_system: targetSystem` from the `curriculum_units` insert (line ~253). Keep it for `curriculum_lessons` if that table has the column (will verify). The `age_group` field already captures the same intent for units.

### Technical Details

| Table | Has `target_system`? | Action |
|---|---|---|
| `curriculum_units` | No | Remove from insert |
| `curriculum_lessons` | Yes (per schema) | Keep as-is |

Single-line removal fix.

