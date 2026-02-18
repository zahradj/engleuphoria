

# Phase 7: "Perfect Classroom" -- AI Live-Syllabus, Shared Notes, Feedback Loop, and UI Polish

## Summary

Four professional improvements to both the Teacher and Student classroom views: an AI-powered "Today's Mission" sidebar, a real-time shared notes area with AI conversation starters, a teacher-only lesson wrap-up feedback form, and UI polish (live indicator + focus mode).

---

## Database Changes (Migration)

Add 2 new columns to the existing `classroom_sessions` table to support real-time shared notes syncing:

```sql
ALTER TABLE public.classroom_sessions
  ADD COLUMN IF NOT EXISTS shared_notes text DEFAULT '',
  ADD COLUMN IF NOT EXISTS session_context jsonb DEFAULT '{}';
```

- `shared_notes`: Real-time synced text area content (teacher writes, student sees via Realtime subscription -- already in place for other fields)
- `session_context`: Stores the "Context Handshake" data loaded when teacher enters (student level, last mistakes, interests) so both views can read it

No new tables needed. The existing `lesson_feedback_submissions` table already handles wrap-up data (fields: `feedback_content`, `student_performance_rating`, `lesson_objectives_met`, `homework_assigned`).

---

## Part 1: AI Live-Syllabus Sidebar ("Today's Mission")

### New File: `src/components/classroom/TodaysMissionSidebar.tsx`

A collapsible right-side panel visible to both teacher and student that displays:

- **Target Vocabulary**: 4-6 words pulled from the current lesson's objectives (`lessons.lesson_objectives`)
- **Main Grammar Point**: Extracted from the lesson title or objectives
- **Practical Goal**: A human-readable goal (e.g., "Order a coffee in English")
- Each item has a checkbox -- teacher can tick them off during the lesson (synced via `classroom_sessions.session_context`)
- Styled with a dark glass panel (`bg-gray-900/95 backdrop-blur`) to match the existing classroom aesthetic
- Collapsible via a chevron toggle (same pattern as `SlideNavigator`)

Data flow: When the teacher enters the classroom, a query fetches the `lesson_objectives` from the `lessons` table using the `room_id`. If no structured objectives exist, fallback to the lesson title.

---

## Part 2: Real-Time Shared Notes + AI Suggest

### New File: `src/components/classroom/SharedNotesPanel.tsx`

- A textarea area embedded within the "Today's Mission" sidebar (below the checklist)
- Teacher types notes; content saved to `classroom_sessions.shared_notes` on debounced input (500ms)
- Student sees notes updating in real-time via the existing Realtime subscription on `classroom_sessions`
- Students can also type (both parties share the same text field)

### "AI Suggest" Button

- A button labeled "AI Suggest" with a sparkle icon
- When clicked, reads the student's profile (`student_level`, `interests`, `mistake_history`) from `session_context`
- Generates 3 personalized conversation starters locally (no edge function needed -- template-based):
  - If student interested in "Minecraft": "Tell me about your favorite Minecraft world"
  - If student struggled with Present Perfect: "Have you ever visited another country?"
  - Generic fallback: "What did you do last weekend?"
- Results are appended to the shared notes area

### Service Updates

**File: `src/services/classroomSyncService.ts`** (Modify)

- Add `sharedNotes` and `sessionContext` to `ClassroomSession` interface
- Add `sharedNotes` and `sessionContext` to `SessionUpdate` interface
- Add mapping in `updateSession()` for `shared_notes` and `session_context`
- Add mapping in `mapToSession()` for both fields

**File: `src/hooks/useClassroomSync.ts`** (Modify)

- Expose `sharedNotes` and `sessionContext` from session state
- Add `updateSharedNotes(notes: string)` action
- Add `updateSessionContext(context: object)` action
- Return both in the hook's return object

---

## Part 3: Context Handshake (Teacher Enters Room)

### New File: `src/hooks/useStudentContext.ts`

- A hook that takes a `studentId` and fetches:
  - `student_profiles`: `student_level`, `mistake_history`, `interests`, `cefr_level`
  - `users`: `full_name`
- Returns a formatted context object:
  ```typescript
  {
    studentName: "Emma",
    level: "professional",
    cefrLevel: "B1",
    lastMistake: "Present Perfect tense",
    interests: ["Technology", "Travel"],
    summary: "Reminder: This student is in the Professional track and struggled with 'Present Perfect' yesterday."
  }
  ```
- This context is saved to `classroom_sessions.session_context` when the teacher enters, so both views can read it
- Teacher sees a small notification banner at the top of the classroom: "Emma -- Professional Track -- Last struggle: Present Perfect"

### Integration in Teacher Classroom

**File: `src/components/teacher/classroom/TeacherClassroom.tsx`** (Modify)

- Call `useStudentContext(studentId)` on mount
- Save the context to the session via `updateSessionContext()`
- Pass the context to `TodaysMissionSidebar`

---

## Part 4: Instant Lesson Feedback (Teacher-Only Wrap-Up)

### New File: `src/components/classroom/LessonWrapUpDialog.tsx`

- A dialog triggered by a "Lesson Wrap-Up" button (visible only to teachers)
- Contains:
  - **Words Mastered**: Multi-select checkboxes from the Target Vocabulary list
  - **Areas for Improvement**: Dropdown options (Grammar, Pronunciation, Vocabulary, Fluency, Listening)
  - **Quick Notes**: Short text area
  - **Performance Rating**: 1-5 stars
- On submit:
  1. Inserts into `lesson_feedback_submissions` (already exists with all needed columns)
  2. Updates `student_profiles.mistake_history` with any new areas for improvement
  3. Shows a success toast

### Integration

- Add "Lesson Wrap-Up" button to `ClassroomTopBar.tsx` (teacher view only)
- Button styled with a clipboard icon, positioned near the "End Class" button

---

## Part 5: UI Polish

### 5A. Live Indicator

**File: `src/components/teacher/classroom/ClassroomTopBar.tsx`** (Modify)
**File: `src/components/student/classroom/StudentClassroomHeader.tsx`** (Modify)

- Add a pulsing red dot next to the connection badge when `isConnected` is true
- CSS: `animate-pulse` with a `bg-red-500 rounded-full h-2.5 w-2.5` element
- Label: "LIVE" in small red text next to the dot

### 5B. Focus Mode

**File: `src/components/student/classroom/StudentClassroom.tsx`** (Modify)
**File: `src/components/teacher/classroom/TeacherClassroom.tsx`** (Modify)

- Both classrooms already use `h-screen` and don't render the global nav
- Add a keyboard shortcut `F11` or a toggle button to enter/exit browser-like "Focus Mode"
- Focus Mode: hides the header bar (just the top bar shrinks to minimal -- lesson title + live dot + leave button only)
- Toggle via a small eye icon in the header

---

## Notes Persistence for Student Dashboard

### File: `src/components/student/dashboards/PlaygroundDashboard.tsx` (Modify)
### File: `src/components/student/dashboards/AcademyDashboard.tsx` (Modify)
### File: `src/components/student/dashboards/HubDashboard.tsx` (Modify)

- Add a "Last Lesson Notes" card that queries the most recent `classroom_sessions.shared_notes` for the student
- Displays the saved notes in a read-only card below the Daily Quest section
- Only shows if notes exist from the last session

---

## File Summary

| File | Action | Description |
|------|--------|-------------|
| **Migration** | SQL | Add `shared_notes` and `session_context` columns to `classroom_sessions` |
| `src/components/classroom/TodaysMissionSidebar.tsx` | Create | Collapsible mission sidebar with vocabulary, grammar, and goal checkboxes |
| `src/components/classroom/SharedNotesPanel.tsx` | Create | Real-time shared notes textarea with AI Suggest button |
| `src/components/classroom/LessonWrapUpDialog.tsx` | Create | Teacher-only wrap-up form (words mastered, areas for improvement) |
| `src/hooks/useStudentContext.ts` | Create | Fetches student profile context for the "Context Handshake" |
| `src/services/classroomSyncService.ts` | Modify | Add `sharedNotes` and `sessionContext` to sync interfaces and mappings |
| `src/hooks/useClassroomSync.ts` | Modify | Expose shared notes and session context; add update actions |
| `src/components/teacher/classroom/TeacherClassroom.tsx` | Modify | Integrate mission sidebar, context handshake, wrap-up button, focus mode |
| `src/components/teacher/classroom/ClassroomTopBar.tsx` | Modify | Add live indicator dot, wrap-up button, focus mode toggle |
| `src/components/student/classroom/StudentClassroom.tsx` | Modify | Add mission sidebar (read-only checkboxes), focus mode |
| `src/components/student/classroom/StudentClassroomHeader.tsx` | Modify | Add live indicator dot |
| `src/components/student/dashboards/PlaygroundDashboard.tsx` | Modify | Add "Last Lesson Notes" card |
| `src/components/student/dashboards/AcademyDashboard.tsx` | Modify | Add "Last Lesson Notes" card |
| `src/components/student/dashboards/HubDashboard.tsx` | Modify | Add "Last Lesson Notes" card |

