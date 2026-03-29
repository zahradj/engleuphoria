

## Plan: Pass Curriculum Context from Step 1 to Step 2

### Problem
Steps 1 and 2 are disconnected -- when a content creator generates or selects a curriculum in Step 1, they have to manually re-select the system, level, and age group in Step 2's lesson generator.

### Solution
Add shared state in the dashboard that captures curriculum context from Step 1 and pre-fills Step 2's filters automatically.

---

### Changes

**1. Define a `CurriculumContext` type and state in `ContentCreatorDashboard.tsx`**
- Add state: `curriculumContext: { system, level, levelId, ageGroup } | null`
- Pass setter to `CurriculumStep` and context to `NewLibrary`

**2. Update `CurriculumStep.tsx`**
- Accept `onCurriculumSelected: (ctx) => void` prop
- When the wizard generates a curriculum or when the user selects an existing one in the editor, call the callback with `{ system, level, levelId, ageGroup }`
- Show a visual indicator of the selected curriculum context (badge/chip)

**3. Update `CurriculumGeneratorWizard.tsx`**
- Accept `onCurriculumGenerated` callback prop
- After successful save to DB, invoke callback with the config values (level, ageGroup, system)

**4. Update `NewLibrary.tsx` props and initialization**
- Add optional `initialContext?: { system, level, levelId, ageGroup }` prop
- In a `useEffect`, when `initialContext` is provided, pre-set `system`, `difficulty`, `selectedLevelId` states
- Show a dismissible banner: "Pre-filtered from your Step 1 curriculum"

### Files

| File | Action |
|---|---|
| `src/pages/ContentCreatorDashboard.tsx` | Add `curriculumContext` state, wire props |
| `src/components/content-creator/CurriculumStep.tsx` | Add `onCurriculumSelected` callback, forward to wizard/builder |
| `src/components/content-creator/CurriculumGeneratorWizard.tsx` | Add `onCurriculumGenerated` callback prop |
| `src/components/admin/NewLibrary.tsx` | Add `initialContext` prop, auto-fill filters |

