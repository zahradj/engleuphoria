
# Plan: Clean Up Auth Users & Enhance Playground Dashboard

## Summary
This plan addresses two main requests:
1. **Delete old auth users** so those emails can sign up fresh
2. **Refactor the Playground dashboard** to pull real lessons from the database and track progress per student

---

## Part 1: Delete Remaining Auth Users

### Problem
The previous migrations cleaned out your app data tables (`public.users`, `public.user_roles`, etc.), but the underlying **auth.users** records in Supabase still exist. Those emails cannot re-register until removed.

### Current State
- 5 accounts still exist in `auth.users`
- Only 1 remains in `public.users` (the admin)
- You want to keep only the admin account (`f.zahra.djaanine@engleuphoria.com`)

### Solution
I cannot delete auth.users directly through code. You must manually delete them from the Supabase dashboard:

**Step-by-step:**
1. Open [Supabase Authentication > Users](https://supabase.com/dashboard/project/dcoxpyzoqjvmuuygvlme/auth/users)
2. Find and delete the following accounts:
   - `djaaninesana@gmail.com`
   - `djaanine.zahra@gmail.com`
   - `zahra.djaanine@gmail.com`
   - `f.zahra.djaanine@gmail.com` (teacher account)
3. Keep only `f.zahra.djaanine@engleuphoria.com` (admin)

Once deleted, those emails can register again as new users.

---

## Part 2: Refactor & Enhance Playground Dashboard

### Current State
The Playground uses **hardcoded mock lessons** from `LessonContext.tsx` (5 demo lessons). It does not connect to your real curriculum database.

### Target State
- **Pull lessons from `curriculum_lessons`** table (filtered by `target_system = 'kids'`)
- **Track progress via `student_lesson_progress`** (current user ID + lesson ID)
- Show lessons as a **fun adventure map** with locked/current/completed states
- Add visual polish and gamification

### Database Changes Required

#### 1. Ensure `student_lesson_progress` RLS policies exist
Currently the table exists with the right columns. I will verify and add any missing RLS policies:

```text
student_lesson_progress:
  - id, user_id, lesson_id, status, score, time_spent_seconds, attempts
  - started_at, completed_at, created_at, updated_at

Policies to ensure:
  - Students can INSERT/UPDATE/SELECT their own rows (user_id = auth.uid())
  - Teachers can SELECT all rows for reporting
```

### Code Changes

#### 1. Create `usePlaygroundLessons` hook
**New file: `src/hooks/usePlaygroundLessons.ts`**

Responsibilities:
- Fetch all lessons with `target_system = 'kids'` from `curriculum_lessons`
- Fetch the logged-in user's `student_lesson_progress` records
- Compute each lesson's status: `completed | current | locked`
- Provide `markLessonComplete(lessonId)` function
- Handle loading/error states

#### 2. Update `LessonContext.tsx`
- Remove hardcoded `INITIAL_LESSONS`
- Add a `getPlaygroundLessonsFromDB()` method that delegates to the new hook (or deprecate this context for Playground in favor of the hook)

#### 3. Refactor `PlaygroundDashboard.tsx`
- Use `usePlaygroundLessons()` hook
- Pass real lessons to `KidsWorldMap`
- Show loading spinner while fetching
- Handle empty state (no lessons yet)

#### 4. Update `KidsWorldMap.tsx`
- Accept lessons as prop (instead of calling `useLessonContext`)
- Add animated mascot (Pip the Parrot) that follows the current level
- Add floating star/XP counter from student's total
- Add theme selection (jungle/space/underwater) stored in user preferences

#### 5. Update `LevelNode.tsx`
- Display lesson title and lesson number on hover
- Add "NEW" badge for freshly unlocked lessons
- Add 3-star rating for completed lessons (based on score)

#### 6. Enhance `LessonPlayerModal.tsx`
- On quiz completion, call `markLessonComplete()`
- Award XP/stars based on score
- Show confetti celebration
- Auto-unlock next lesson

#### 7. Update `FloatingBackpack.tsx`
- Pull badges from `student_achievements` table
- Pull star count from aggregate XP
- Add "Trophy Room" button that navigates to certificates

### Visual Enhancements
- Animated mascot (Pip) that bounces near current lesson
- Particle effects on path between completed nodes
- Sound effects on level click and completion
- Responsive layout for mobile (bottom navigation auto-hides on scroll)

---

## Technical Details

### Database Query: Get Playground Lessons

```sql
SELECT 
  cl.id,
  cl.title,
  cl.sequence_order as lesson_number,
  cl.difficulty_level,
  cl.content,
  slp.status as progress_status,
  slp.score,
  slp.completed_at
FROM curriculum_lessons cl
LEFT JOIN student_lesson_progress slp 
  ON cl.id = slp.lesson_id 
  AND slp.user_id = :currentUserId
WHERE cl.target_system = 'kids'
  AND cl.is_published = true
ORDER BY cl.sequence_order ASC
```

### Progress Calculation Logic

```text
for each lesson in order:
  if lesson has progress.status = 'completed':
    lesson.status = 'completed'
  else if lesson is first OR previous lesson is completed:
    lesson.status = 'current'
  else:
    lesson.status = 'locked'
```

### Position Calculation for Map

Lessons will be distributed along a winding path:
```text
lessonIndex % 2 === 0 ? leftSide : rightSide
y = 80 - (lessonIndex * 10)  // Start from bottom, go up
```

---

## Files to Create/Modify

| Action | File |
|--------|------|
| Create | `src/hooks/usePlaygroundLessons.ts` |
| Modify | `src/contexts/LessonContext.tsx` |
| Modify | `src/components/student/dashboards/PlaygroundDashboard.tsx` |
| Modify | `src/components/student/kids/KidsWorldMap.tsx` |
| Modify | `src/components/student/kids/LevelNode.tsx` |
| Modify | `src/components/student/kids/LessonPlayerModal.tsx` |
| Modify | `src/components/student/kids/FloatingBackpack.tsx` |
| Add Migration | RLS policies for `student_lesson_progress` (if missing) |

---

## Verification Steps

After implementation:
1. Sign up as a new student (use a fresh email)
2. Navigate to `/playground`
3. Verify real lessons appear as map nodes
4. Click a lesson and complete the quiz
5. Confirm the lesson marks as completed
6. Confirm the next lesson unlocks
7. Refresh page and verify progress persists
8. Check `student_lesson_progress` table has correct data

---

## Timeline Estimate

| Task | Effort |
|------|--------|
| Auth user cleanup (manual) | 5 minutes |
| Create usePlaygroundLessons hook | Medium |
| Update PlaygroundDashboard | Small |
| Update KidsWorldMap | Medium |
| Update LevelNode + visual polish | Medium |
| Update LessonPlayerModal (progress saving) | Medium |
| Update FloatingBackpack (real data) | Small |
| RLS policy verification | Small |
| Testing & verification | Medium |

