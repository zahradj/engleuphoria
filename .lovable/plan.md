

# Plan: Engleuphoria Master Architecture Alignment

This plan audits the current codebase against the "Engleuphoria Master Architecture" spec and addresses the gaps. Many items are already implemented correctly; this plan focuses on what still needs fixing.

---

## Already Implemented (No Changes Needed)

- **Legal pages**: `/terms-of-service`, `/privacy-policy`, `/refund-policy` all exist with the 5-Day (120-hour) cancellation rule explicitly documented
- **Unified classroom route**: `/classroom/:bookingId` resolves any ID flavor, checks `teacher_id`/`student_id` match, and grants admin bypass
- **Hub-level route guards**: `/playground`, `/academy`, `/hub` are protected with `requiredStudentLevel`
- **Teacher path cleanup**: All teacher routes use `/teacher/*`, not `/admin`
- **GEMINI_API_KEY**: Already configured as an Edge Function secret and used by `geminiClient.ts`
- **Glassmorphism on landing page**: `backdrop-blur`, mesh gradients, and glass panels are present across 12+ landing components

---

## Changes Required

### 1. Fix Hub Design Tokens to Match Brand Standards

**File**: `src/constants/hubDesignTokens.ts`

The current tokens use incorrect hex values. Update to match workspace rules:

| Hub | Current | Corrected |
|-----|---------|-----------|
| Playground primary | `#1A237E` (navy) | `#FE6A2F` (orange) |
| Academy primary | N/A (missing) | `#6B21A8` (royal purple) |
| Professional primary | `#059669` | `#059669` (correct) |

- Rename the `academy` key values to use purple branding (`#6B21A8` primary, `#F5F3FF` lavender accent)
- Fix `playground` to use orange/yellow (`#FE6A2F` primary, `#FEFBDD` yellow accent)
- Ensure Success Hub keeps emerald green with mint accent (`#F0FDFA`)

### 2. Add Teacher Instructions Sidebar to Classroom

**New file**: `src/components/classroom/TeacherInstructionsSidebar.tsx`

**Modified file**: `src/components/teacher/classroom/TeacherClassroom.tsx`

- Create a collapsible sidebar panel that displays teacher-facing lesson instructions
- Include sections: Lesson Objectives, Key Vocabulary, Activity Notes, Timing Suggestions
- Only visible to the teacher participant (not students)
- Uses glassmorphic styling consistent with classroom UI standards
- Toggle button in the ClassroomTopBar

### 3. Registration Hub Tagging

**Modified file**: `src/pages/StudentSignUp.tsx`

- Detect the referring hub from the URL path or query parameter (e.g., `/student-signup?hub=academy`)
- Save the detected hub as metadata during signup so the `determineStudentLevel` function can use it as a secondary signal alongside age
- Ensure that a student registering from the Academy landing page flow gets `student_level: 'academy'` even without age-based inference

### 4. Apply Glassmorphism to Student Dashboards

**Modified files**: Student dashboard shell components

- Add `backdrop-blur-xl`, semi-transparent backgrounds, and subtle border glow to the main dashboard cards and navigation
- Apply hub-specific mesh gradient backgrounds:
  - Playground: warm orange-to-yellow gradient
  - Academy: purple-to-lavender gradient  
  - Professional: emerald-to-mint gradient
- Preserve all existing functionality and layout structure

### 5. System Audit Verification

After all changes, verify:
- Playground pages render with `#FE6A2F` orange coating
- Academy pages render with `#6B21A8` purple coating
- Success Hub pages render with `#059669` green coating
- Playground lessons show 30-minute duration; Academy/Success show 60 minutes
- Academy students cannot access `/playground` routes (already enforced by `ImprovedProtectedRoute`)
- `/classroom/:id` blocks unauthorized users (already working)

---

## Technical Details

### Files Created
- `src/components/classroom/TeacherInstructionsSidebar.tsx`

### Files Modified
- `src/constants/hubDesignTokens.ts` (correct hex values)
- `src/pages/StudentSignUp.tsx` (hub detection from URL)
- `src/components/teacher/classroom/TeacherClassroom.tsx` (add instructions sidebar toggle)
- `src/components/teacher/classroom/ClassroomTopBar.tsx` (add sidebar toggle button)
- Student dashboard layout components (glassmorphism coating)

### No Database Migrations Required
All booking/classroom logic (`classroom_id` UUID generation, `resolve_classroom_id` RPC, permission checks) is already in place.

### No New Secrets Required
`GEMINI_API_KEY` is already configured.

