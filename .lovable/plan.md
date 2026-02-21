

# Post-Class Feedback Loop: "How Was Your Session?"

## Overview

Build a beautiful, minimalist post-class feedback modal that appears when a student leaves the classroom. It captures Teacher Energy, Material Relevance, a confidence metric ("Euphoria Metric"), and an improvement suggestion. Low ratings (1-2 stars) trigger an instant admin notification.

---

## 1. Database Migration

### New table: `post_class_feedback`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | auto-generated |
| student_id | UUID -> users(id) | NOT NULL |
| teacher_id | UUID -> users(id) | NOT NULL |
| lesson_id | TEXT | nullable, the room/session ID |
| teacher_energy_rating | INTEGER | 1-5 stars |
| material_relevance_rating | INTEGER | 1-5 stars |
| feels_more_confident | BOOLEAN | The "Euphoria Metric" |
| improvement_suggestion | TEXT | "One thing that could be better" |
| created_at | TIMESTAMPTZ | default NOW() |

### RLS Policies:
- Students can INSERT their own feedback (`student_id = auth.uid()`)
- Students can SELECT their own feedback
- Admins can SELECT all feedback

### Database trigger: `notify_admin_low_rating`
- AFTER INSERT on `post_class_feedback`
- Fires when `teacher_energy_rating <= 2` OR `material_relevance_rating <= 2`
- Inserts a notification into `admin_notifications` for all admins with type `low_rating_alert`, including teacher name, student name, and the ratings in metadata

---

## 2. New Component: PostClassFeedbackModal

### File: `src/components/student/classroom/PostClassFeedbackModal.tsx`

**Props:**
- `isOpen: boolean`
- `onClose: () => void`
- `teacherName: string`
- `teacherId: string`
- `lessonId: string`

**Layout (minimalist, warm design):**
1. Title: "How was your session with [Teacher Name]?"
2. Two 5-star rating rows:
   - "Teacher Energy" (with a lightning bolt icon)
   - "Material Relevance" (with a book icon)
3. The "Euphoria Metric": "Do you feel more confident in English after this lesson?" with Yes/No toggle buttons
4. Text area: "One thing that could be better" (optional, max 500 chars)
5. "Submit Feedback" button + "Skip" link

**Behavior:**
- On submit, insert into `post_class_feedback`
- Show a thank-you toast
- Call `onClose()` to navigate away

---

## 3. Integration into Student Classroom

### Modify: `src/components/student/classroom/StudentClassroom.tsx`

**Current behavior (line 91-97):**
```text
handleLeaveClass -> toast -> navigate('/playground')
```

**New behavior:**
- Instead of navigating immediately, set `showFeedbackModal = true`
- Render `PostClassFeedbackModal` at the bottom of the component
- On modal close (submit or skip), THEN navigate to `/playground`
- Pass teacher name from `sessionContext` or fallback to "Teacher"

---

## Files Summary

| Action | File | Purpose |
|--------|------|---------|
| Migration | SQL | Create `post_class_feedback` table + `notify_admin_low_rating` trigger + RLS |
| Create | `src/components/student/classroom/PostClassFeedbackModal.tsx` | The feedback modal UI |
| Modify | `src/components/student/classroom/StudentClassroom.tsx` | Wire modal into leave flow |

---

## Technical Notes

- The admin alert trigger uses the existing `admin_notifications` table and the same pattern as `notify_admin_new_user` (loops through `user_roles WHERE role = 'admin'`)
- The modal uses existing Radix Dialog, Star from lucide-react, and Tailwind -- no new dependencies
- The `lesson_id` stores the `roomId` string, not a UUID FK, since the classroom uses string-based room IDs
- The feedback is separate from the existing `teacher_reviews` table (which is tied to `class_bookings`). This captures session-specific pedagogical quality metrics rather than a general teacher rating

