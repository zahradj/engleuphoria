

## Plan: Pipeline Progress Tracker on Stepper

### What
Add live progress badges to the Content Creator Stepper showing real counts from Supabase: how many lessons are generated (Step 2) and how many have slides built (Step 3), relative to the total curriculum.

### How

**1. Create `src/hooks/usePipelineProgress.ts`**
- Lightweight hook that queries:
  - Total lessons from master curriculum (via `MASTER_CURRICULUM` data)
  - Generated lessons count from `curriculum_lessons` table
  - Lessons with slides count from `curriculum_lessons` where `slides` column is not null/empty
- Returns `{ totalLessons, generatedLessons, lessonsWithSlides, isLoading }`
- Uses `useQuery` with a reasonable stale time

**2. Update `ContentCreatorStepper.tsx`**
- Accept optional `progress` prop: `{ generatedLessons, totalLessons, lessonsWithSlides }`
- Show small badge/chip under Step 2 label: `"12/45 generated"`
- Show small badge/chip under Step 3 label: `"8/12 with slides"`
- Badges use green tint when complete, muted otherwise

**3. Update `ContentCreatorDashboard.tsx`**
- Call `usePipelineProgress()` hook
- Pass progress data down to `ContentCreatorStepper`

### Files

| File | Action |
|---|---|
| `src/hooks/usePipelineProgress.ts` | **Create** -- query lesson + slide counts |
| `src/components/content-creator/ContentCreatorStepper.tsx` | **Modify** -- render progress badges on steps 2 & 3 |
| `src/pages/ContentCreatorDashboard.tsx` | **Modify** -- wire hook to stepper |

