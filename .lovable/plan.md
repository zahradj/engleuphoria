

# Upgrade: Smart Placement Logic (Age + Performance Weighting)

## What Changes

Right now, the placement test determines the student level based **only on age** -- a 10-year-old who aces every question still gets "Playground." The user's pseudocode introduces a smarter system that weighs **both age and test performance** to allow:

- **Promotion**: A high-performing kid (age < 12) can be promoted to Academy (Advanced Track)
- **Foundational Track**: A low-performing adult (age > 18) stays in Professional but is flagged for simplified content
- **Default**: Everyone else gets the level matching their age

## Files to Change

### 1. `src/hooks/useStudentLevel.ts`

Replace the current `evaluateStudentLevel` function (which ignores score) with a real weighted evaluation:

```typescript
export function evaluateStudentLevel(
  age: number,
  correctCount: number,
  totalQuestions: number
): { level: StudentLevel; track: string } {
  const defaultLevel = determineStudentLevel(age);
  const scoreRatio = correctCount / totalQuestions;

  // Promotion: High-performing kid advances to Academy
  if (age < 12 && correctCount > 4 && scoreRatio > 0.8) {
    return { level: 'academy', track: 'advanced' };
  }

  // Foundational: Low-performing adult stays in Professional 
  // but gets flagged for simplified content
  if (age > 18 && correctCount < 2) {
    return { level: 'professional', track: 'foundational' };
  }

  return { level: defaultLevel, track: 'standard' };
}
```

### 2. `src/hooks/usePlacementTest.ts`

Update `completeTest` to:
- Accept the raw `answers` array and the `correctIndices` array
- Count correct answers internally
- Call the new `evaluateStudentLevel(age, correctCount, totalQuestions)` instead of `determineStudentLevel(age)`
- Save the resulting `track` alongside the level in the database update (as metadata or a new column if available, otherwise stored in an existing JSONB field)

```typescript
const completeTest = async (
  age: number, 
  answers: number[], 
  correctIndices: number[]
): Promise<string> => {
  const correctCount = answers.filter((a, i) => a === correctIndices[i]).length;
  const score = Math.round((correctCount / correctIndices.length) * 100);
  const { level, track } = evaluateStudentLevel(age, correctCount, correctIndices.length);

  await supabase
    .from('student_profiles')
    .update({
      student_level: level,
      onboarding_completed: true,
      placement_test_score: score,
      placement_test_completed_at: new Date().toISOString(),
    })
    .eq('user_id', user.id);

  return getStudentDashboardRoute(level);
};
```

### 3. `src/components/placement/AIPlacementTest.tsx`

Update `handleProcessingComplete` to pass the raw answers and correct indices to the new `completeTest` signature instead of pre-calculating the score:

```typescript
const handleProcessingComplete = async () => {
  const level = determineStudentLevel(age);
  const key = level as keyof typeof CORRECT_INDICES;
  const route = await completeTest(age, answers, CORRECT_INDICES[key]);
  navigate(route, { replace: true });
};
```

## How the "Secret Sauce" Works

```text
Student takes test (5 questions)
        |
        v
  Count correct answers
        |
        v
  +-----+-----+---------------------+
  | Age < 12  | Score > 4 (80%+)    | --> PROMOTE to Academy (Advanced Track)
  | Age < 12  | Score <= 4          | --> Playground (Standard)
  | Age 12-17 | Any score           | --> Academy (Standard)
  | Age > 18  | Score < 2 (< 40%)   | --> Professional (Foundational Track)
  | Age > 18  | Score >= 2          | --> Professional (Standard)
  +-----+-----+---------------------+
```

## File Summary

| File | Change |
|------|--------|
| `src/hooks/useStudentLevel.ts` | Upgrade `evaluateStudentLevel` to weight age + performance; return level + track |
| `src/hooks/usePlacementTest.ts` | Update `completeTest` to use new evaluation; pass raw answers instead of pre-calculated score |
| `src/components/placement/AIPlacementTest.tsx` | Update `handleProcessingComplete` to pass answers + correct indices to new API |

