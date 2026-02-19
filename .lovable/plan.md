

# Phase 10: Real-time Classroom Engine + Playground Dashboard Enhancement

## Executive Summary

This phase activates the real-time "nerve system" for the Smart Classroom and enhances the Playground Dashboard with game-world aesthetics. The classroom already has strong sync infrastructure (Supabase Postgres Changes + `useClassroomSync`), but needs Realtime to be enabled on the `classroom_sessions` table and a few functional gaps closed. The Playground Dashboard already exists with a world map, virtual pet, and sidebar -- we enhance it with daily streak, coin balance, and a bouncy CTA.

---

## Part 1: Activate Supabase Realtime (The "Nerve System")

### Current State (What Already Works)

- `classroomSyncService.ts` subscribes to `postgres_changes` on `classroom_sessions` for a given `room_id`
- `useClassroomSync` hook manages all session state (slides, tools, canvas tab, notes, stars, timer, dice) and propagates updates to both teacher and student
- `CenterStage` (teacher) and `StudentMainStage` (student) both render based on `activeCanvasTab` synced from the session
- `SharedNotesPanel` with debounced save and AI Suggest already exists inside the `FloatingCoPilot`
- `LessonWrapUpDialog` saves notes and updates `student_profiles.mistake_history`

### What Needs Fixing

#### 1.1 Enable Realtime on `classroom_sessions` table
- **Database Migration**: Run `ALTER PUBLICATION supabase_realtime ADD TABLE classroom_sessions;`
- Without this, the `subscribeToSession` method receives no events, so students see a frozen view

#### 1.2 Add Presence for Typing Indicators
- Add Supabase Presence to the classroom channel in `classroomSyncService.ts`
- Track `{ userId, userName, isTyping }` state
- Display a "Teacher is typing..." or "Student is typing..." indicator in the `SharedNotesPanel`

#### 1.3 Save Notes to `lesson_completions` on End Class
- Modify `handleEndClass` in `TeacherClassroom.tsx` to persist `sharedNotes` to the `lesson_completions` table (or create a `lesson_records` column if needed)
- The `LessonWrapUpDialog` already saves to `lesson_completions` -- we add `shared_notes` to its save payload

#### 1.4 AI Live-Prompter (weak_points tip)
- The `FloatingCoPilot` already reads `sessionContext` (level, interests, lastMistake) and generates mission items
- The `SharedNotesPanel` AI Suggest already pulls from `sessionContext.interests` and `sessionContext.lastMistake`
- Enhancement: Add a dedicated "AI Tip" card that fetches `student_profiles.mistake_history` and displays the top 3 weak areas as actionable tips for the teacher

---

## Part 2: Playground Dashboard Enhancement

### Current State

The `PlaygroundDashboard` already includes:
- `KidsWorldMap` -- zone-based lesson map with star progress
- `PlaygroundSidebar` -- navigation sidebar
- `VirtualPetWidget` -- pet that grows from learning words
- `WeeklyGoalWidget` -- weekly goal tracker
- `AILessonAgent` -- AI-powered lesson recommendations
- `RecommendedTeachers` -- teacher cards

### What We Add

#### 2.1 Coin Balance (Stars) Header Bar
- Add a top bar showing the student's total stars (from `getTotalStars()`) with a coin/star icon
- Include a "Daily Streak" fire icon with streak count (from `student_profiles.daily_streak` or local tracking)

#### 2.2 Bouncy "Enter the Classroom" CTA
- Add a prominent, animated button using Framer Motion with a bounce effect
- Links to the student's next scheduled lesson room (from `get_student_upcoming_lessons`)
- If no upcoming lesson, shows "Book a Lesson" instead

#### 2.3 "Word of the Day" in Virtual Pet Widget
- Enhance `VirtualPetWidget` to display a daily vocabulary word
- The pet "says" the word in a speech bubble

---

## Technical Details

### Database Migration

```sql
-- Enable Realtime on classroom_sessions
ALTER PUBLICATION supabase_realtime ADD TABLE classroom_sessions;

-- Add shared_notes column to lesson_completions if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lesson_completions' AND column_name = 'shared_notes'
  ) THEN
    ALTER TABLE public.lesson_completions ADD COLUMN shared_notes text DEFAULT '';
  END IF;
END $$;

-- Add daily_streak to student_profiles if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'student_profiles' AND column_name = 'daily_streak'
  ) THEN
    ALTER TABLE public.student_profiles ADD COLUMN daily_streak integer DEFAULT 0;
    ALTER TABLE public.student_profiles ADD COLUMN last_streak_date date;
  END IF;
END $$;
```

### Files to Modify

| File | Change |
|------|--------|
| `src/services/classroomSyncService.ts` | Add Presence tracking (typing indicators) to the channel subscription |
| `src/components/classroom/SharedNotesPanel.tsx` | Show typing indicator using Presence state |
| `src/components/teacher/classroom/TeacherClassroom.tsx` | Pass `sharedNotes` to `LessonWrapUpDialog` on end class |
| `src/components/classroom/LessonWrapUpDialog.tsx` | Save `shared_notes` to `lesson_completions` |
| `src/components/classroom/FloatingCoPilot.tsx` | Add "AI Weak Points Tip" card showing top 3 mistake areas |
| `src/components/student/dashboards/PlaygroundDashboard.tsx` | Add star balance header, daily streak, bouncy CTA |
| `src/components/student/kids/VirtualPetWidget.tsx` | Add "Word of the Day" speech bubble |

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/student/kids/PlaygroundTopBar.tsx` | Star balance + daily streak + notification bell |
| `src/components/student/kids/EnterClassroomCTA.tsx` | Bouncy animated "Enter the Classroom" button |

### Flow Summary

```
Teacher clicks tab -> updateCanvasTab() -> DB update -> Realtime event -> Student receives -> StudentMainStage re-renders with new tab

Teacher types notes -> debounced updateSharedNotes() -> DB update -> Realtime event -> Student's SharedNotesPanel updates + Presence shows "Teacher is typing..."

End Class -> LessonWrapUpDialog saves shared_notes to lesson_completions -> Student dashboard shows "Last Lesson Notes"
```

