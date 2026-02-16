

# Adaptive Decision Tree + Interest Injection + Teacher Smart Matchmaker

## Overview

This is a 3-part upgrade that transforms the placement test from static scoring to an intelligent adaptive system, saves student interests as context keywords for AI-powered lesson personalization, and adds an AI-driven teacher-student matching system.

---

## Part 1: Adaptive Decision Tree (IRT-Inspired Scoring)

### What Changes

Currently, all 5 questions are presented in a fixed order with fixed difficulty. The new system tracks difficulty per question, adjusts the next question's difficulty based on the previous answer, and uses a weighted `age + performance + complexity` formula for the final placement.

### File: `src/components/placement/TestPhase.tsx`

- Add a `difficulty` field (0.0 to 1.0) to each question in the question banks
  - Playground: difficulties range from 0.3 (easy vocab) to 0.7 (slightly harder)
  - Academy: 0.5 to 0.9
  - Professional: 0.6 to 1.0
- Add 3 extra questions per bank (total 8 per level), tagged by difficulty tier (easy/medium/hard)
- Implement adaptive selection: after answering Q1, if correct, pick a harder Q next; if wrong, pick an easier one
- Track `TestResult[]` instead of just `number[]` for answers:
  ```typescript
  interface TestResult {
    questionIndex: number;
    selectedOption: number;
    correctOption: number;
    isCorrect: boolean;
    difficulty: number;
  }
  ```
- Update `onComplete` to return `TestResult[]` instead of `number[]`

### File: `src/components/placement/AIPlacementTest.tsx`

- Update state to hold `TestResult[]` instead of `number[]`
- Pass `TestResult[]` to the updated `completeTest` hook
- Remove the hardcoded `CORRECT_INDICES` map (no longer needed; correctness is tracked per result)

### File: `src/hooks/usePlacementTest.ts`

- Replace the `completeTest` signature to accept `TestResult[]` directly
- Implement the IRT-inspired scoring:
  ```typescript
  const score = results.filter(r => r.isCorrect).length;
  const avgComplexity = results.reduce((acc, r) => acc + r.difficulty, 0) / results.length;
  ```
- Pass `score`, `avgComplexity`, and `age` to the updated `evaluateStudentLevel`

### File: `src/hooks/useStudentLevel.ts`

- Update `evaluateStudentLevel` to accept `avgComplexity`:
  ```typescript
  evaluateStudentLevel(age, correctCount, totalQuestions, avgComplexity)
  ```
- Refine the promotion/demotion rules:
  - Kid promotion: `age < 12 && score > 4 && avgComplexity > 0.8` (genius kid who answered hard questions correctly)
  - Adult foundational: `age > 18 && score < 2` (struggling adult)
  - Default: age-based level

---

## Part 2: Interest Injection (Context Keywords)

### What Changes

The Demographics phase already collects a "goal" (Travel, Work, School, Fun). We will expand this to also collect **specific interests** (like "Minecraft", "Football", "Technology") and save them to the existing `interests` column in `student_profiles`.

### File: `src/components/placement/DemographicsPhase.tsx`

- After the goal selection, add one more step: "What are some things you love?"
- Show age-appropriate interest chips:
  - Age < 12: Minecraft, Animals, Cartoons, Sports, Music, Space, Dinosaurs, Drawing
  - Age 12-18: Gaming, Social Media, Movies, Music, Sports, Fashion, Travel, Coding
  - Age > 18: Technology, Business, Travel, Health, Finance, Leadership, Art, Cooking
- Allow selecting 2-4 interests (same pattern as the existing `InterestsStep` component)
- Update `onComplete` to return `{ age, goal, interests }` instead of `{ age, goal }`

### File: `src/components/placement/AIPlacementTest.tsx`

- Store the selected interests in state
- Pass interests to the `completeTest` hook

### File: `src/hooks/usePlacementTest.ts`

- Accept `interests: string[]` in `completeTest`
- Save to `student_profiles.interests` alongside level and score:
  ```typescript
  .update({
    student_level: level,
    onboarding_completed: true,
    placement_test_score: score,
    interests: interests,
    ...
  })
  ```

### How it connects to lesson generation

The existing `generate-daily-lesson` edge function and `AILessonAgent` already read `student_profiles.interests` and inject them into the AI prompt. By saving interests during placement, every future lesson will use them (e.g., "Teach Present Continuous using examples from Minecraft").

---

## Part 3: Smart Teacher Matchmaker

### What Changes

After the placement test redirects to the dashboard, show a "Top 3 Recommended Teachers" section. The matching algorithm scores teachers based on: specialization match to student level, overlapping interests, availability, rating, and experience.

### New File: `src/hooks/useTeacherMatchmaker.ts`

- Fetches the student's profile (level, interests) and all approved teachers with their profiles
- Implements a scoring algorithm:
  ```
  matchScore = (specializationMatch * 40) + (interestOverlap * 30) + (rating * 20) + (availabilityBonus * 10)
  ```
  - `specializationMatch`: Does the teacher specialize in the student's level? (e.g., "Kids Storyteller" for Playground)
  - `interestOverlap`: How many of the student's interests overlap with the teacher's specializations?
  - `rating`: Teacher's average rating (normalized)
  - `availabilityBonus`: Does the teacher have open slots in the next 7 days?
- Returns the top 3 teachers sorted by score

### New File: `src/components/student/RecommendedTeachers.tsx`

- Displays 3 teacher cards in a horizontal row
- Each card shows: profile image, name, specializations as badges, rating stars, years of experience, and a "Book Trial Lesson" button
- Glassmorphism styling consistent with the placement test
- Clicking "Book Trial Lesson" creates a record in `class_bookings` with `status: 'pending'` and `booking_type: 'trial'`

### Dashboard Integration

- Add `RecommendedTeachers` to all 3 student dashboards (Playground, Academy, Hub) below the existing learning path section
- Only show if the student has no existing bookings (first-time experience)

### Admin Visibility

- No new admin components needed: the existing `class_bookings` table and admin dashboard already surface booking records. The `status: 'pending'` bookings from trial lessons will appear in the admin's existing class schedule views.

---

## Database Changes

### Migration: Add no new tables (use existing schema)

- `student_profiles.interests` already exists as `ARRAY` type -- no migration needed
- `teacher_profiles.specializations` already exists as `ARRAY` type -- no migration needed
- `class_bookings` already has all needed columns (`student_id`, `teacher_id`, `status`, `booking_type`, etc.) -- no migration needed
- `teacher_availability` already tracks open slots -- no migration needed

No database migrations required. All data fits into the existing schema.

---

## File Summary

| File | Action | Description |
|------|--------|-------------|
| `src/components/placement/TestPhase.tsx` | Modify | Add difficulty per question, adaptive question selection, return `TestResult[]` |
| `src/components/placement/DemographicsPhase.tsx` | Modify | Add interest selection step after goals |
| `src/components/placement/AIPlacementTest.tsx` | Modify | Handle `TestResult[]` and `interests`, pass to hook |
| `src/hooks/usePlacementTest.ts` | Modify | Accept `TestResult[]` and `interests`, IRT scoring, save interests |
| `src/hooks/useStudentLevel.ts` | Modify | Add `avgComplexity` param to `evaluateStudentLevel` |
| `src/hooks/useTeacherMatchmaker.ts` | Create | Teacher scoring algorithm and top-3 ranking |
| `src/components/student/RecommendedTeachers.tsx` | Create | Teacher recommendation cards with "Book Trial" |
| `src/components/student/dashboards/PlaygroundDashboard.tsx` | Modify | Add `RecommendedTeachers` section |
| `src/components/student/dashboards/HubDashboard.tsx` | Modify | Add `RecommendedTeachers` section |
| Academy dashboard file | Modify | Add `RecommendedTeachers` section |

