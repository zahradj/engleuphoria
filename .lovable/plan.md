

# Fix Interview Scheduling + Add Experience & Age Group to All Forms

## Problem 1: Interview Scheduling Fails
The error `"permission denied for table users"` occurs because the `interviews` table has an RLS policy ("Teachers can view own interviews") that queries `auth.users` directly:
```sql
USING (teacher_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
```
The `authenticated` role does not have SELECT permission on `auth.users`. Every time the admin loads interviews or tries to insert one, PostgreSQL evaluates ALL policies on the table (including teacher ones) and hits this permission error.

**Fix**: Replace the `auth.users` subquery with `auth.jwt() ->> 'email'`, which is always available without table access.

## Problem 2: Add Experience Years & Preferred Age Group to All Forms
Current state of each form:

| Form | Route | Experience Years | Preferred Age Group |
|------|-------|-----------------|-------------------|
| SimpleTeacherForm | /teach-with-us | Has numeric input | **Missing** |
| TeacherApplicationForm | /for-teachers | Free text (parsed to int) | **Missing** |
| EnhancedTeacherApplicationForm | /teacher-application | Has numeric input | Has radio group |
| TeacherApplicationForm (full) | /teacher-application | Has numeric input | Has checkbox group |

### Changes

#### Migration (1 SQL migration)
- Drop and recreate the "Teachers can view own interviews" policy using `auth.jwt() ->> 'email'` instead of querying `auth.users`

#### SimpleTeacherForm.tsx
- Add a "Preferred Age Group" selection (radio group with Kids/Teens/Adults/All Ages) to Step 2 or Step 3
- Include `preferred_age_groups` in the insert payload as an array

#### TeacherApplicationForm.tsx (/for-teachers)
- Replace free-text "experience" field with a numeric "Years of Experience" input
- Add a "Preferred Age Group" selection (radio or checkbox group)
- Include `preferred_age_groups` in the insert payload
- Update form state and validation

### Technical Details
- The `teacher_applications` table already has `teaching_experience_years` (integer) and `preferred_age_groups` (text[]) columns — no schema changes needed for the form fields
- The only schema change is the RLS policy fix on `interviews`
- Age group options will match the existing convention: `kids`, `teens`, `adults`, `all`

