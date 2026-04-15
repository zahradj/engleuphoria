

# Hub-Specific Teacher Roles & Student Booking Lock

## Problem
1. **Teacher application** has no hub preference — teachers can't specify which hub(s) they want to teach in
2. **Booking modal** lets students switch between all 3 hubs freely — a Playground student shouldn't see 60-min Academy options
3. **FindTeacher** page doesn't properly filter teachers by the student's hub — Playground students see Academy teachers and vice versa
4. **Hub role** is limited to 2 values (`playground_specialist`, `academy_success_mentor`) — need finer granularity

## Solution

### Database Migration
- Add `hub_preference` column to `teacher_applications` (text, nullable) — stores the teacher's hub choice during application
- Expand `teacher_profiles.hub_role` CHECK constraint to support 4 values: `playground_specialist`, `academy_mentor`, `success_mentor`, `academy_success_mentor`

### Teacher Application Form (Step 5)
Replace the current "Preferred Age Group" radio group with a new **Hub Teaching Preference** selector:
- **Playground Specialist** (Kids 4-11, 30-min sessions)
- **Academy Mentor** (Teens 12-17, 60-min sessions)
- **Success Coach** (Adults 18+, 60-min sessions)
- **Academy + Success Mentor** (Teens & Adults, 60-min sessions)

Save choice to `teacher_applications.hub_preference`. Keep age group field as secondary info.

### BookMyClassModal — Lock to Student's Hub
- Remove the hub selector buttons entirely — the student's `studentLevel` prop determines the hub
- Playground students always see 30-min slots, Academy/Success always see 60-min slots
- No ability to switch hubs from the booking modal

### FindTeacher — Hub-Based Filtering
- Map `hub_role` to visible hubs:
  - `playground_specialist` → visible only in Playground
  - `academy_mentor` → visible only in Academy
  - `success_mentor` → visible only in Success/Professional
  - `academy_success_mentor` → visible in both Academy AND Success (profile appears in both)
- When a student's hub filter is set (from URL param or dashboard context), only matching teachers appear
- The "All" tab still shows everyone for browsing

## Files to Modify

| File | Change |
|------|--------|
| **Migration SQL** | Add `hub_preference` to `teacher_applications`, expand `hub_role` CHECK |
| `EnhancedTeacherApplicationForm.tsx` | Add hub preference selector in Step 5, save to `hub_preference` |
| `BookMyClassModal.tsx` | Remove hub selector, lock to `studentLevel` prop |
| `FindTeacher.tsx` | Update `_hubs` mapping for 4 hub_role values |
| `mem://features/booking/hub-specific-roles-and-classroom-id` | Update memory |

