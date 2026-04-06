
Fix plan for the persistent teacher application failure

1. Re-state the actual issue
- Do I know what the issue is? Yes.
- The current page the user is submitting from is `/for-teachers`, which renders `src/components/teachers/TeacherApplicationForm.tsx`.
- That form inserts `teaching_experience` into `teacher_applications`.
- The current database shape does not have a `teaching_experience` column. It has `teaching_experience_years` instead.
- That is why the previous `motivation` fix did not solve the full problem: the form and schema are still out of sync.

2. Root cause found in the codebase
- `src/components/teachers/TeacherApplicationForm.tsx` sends a payload that does not match the real table:
  - invalid: `teaching_experience`
  - risky: `certifications` is sent as a string, but schema expects `text[]`
- There are also multiple competing teacher application flows in the app:
  - `/for-teachers` → `src/components/teachers/TeacherApplicationForm.tsx`
  - `/teacher-application` → `src/components/teacher/EnhancedTeacherApplicationForm.tsx`
  - `/teach-with-us` → `src/components/teach-with-us/SimpleTeacherForm.tsx`
- These three forms do not agree on the same database columns, which is why the app keeps hitting new schema-cache errors one column at a time.

3. Implementation approach
- I will fix this in two layers so it stops breaking repeatedly:

Step A — Unblock the live `/for-teachers` form
- Update `src/components/teachers/TeacherApplicationForm.tsx` to stop sending nonexistent columns.
- Map its fields to real columns only.
- Convert `certifications` from comma-separated text into a `string[]`.
- Keep `motivation`, `cv_url`, `first_name`, `last_name`, `email`, `phone`, `nationality`, and `current_stage`.
- Replace the invalid `teaching_experience` write with a schema-compatible approach.

Step B — Make the schema and other teacher flows consistent
- Audit the other teacher application forms and align them to the same `teacher_applications` contract.
- Remove obsolete payload keys like `full_name`.
- Decide one canonical field set for teacher applications so the same problem does not move to the next route.

4. Durable fix I will implement
- Prefer a durable alignment instead of another one-column patch:
  - keep `teaching_experience_years` for structured admin review
  - add support for narrative experience only if the UX still needs it
- Because the current public form collects free-text experience rather than a number, I will either:
  - convert that field to years-based input and store it in `teaching_experience_years`, or
  - add a proper text column for narrative experience and keep `teaching_experience_years` optional
- Given the rest of the admin UI already uses years, the best implementation is:
  - update the public form UI to collect experience in a schema-compatible way
  - keep narrative motivation separately in `motivation`

5. Files to update
- `src/components/teachers/TeacherApplicationForm.tsx`
  - fix insert payload
  - normalize certifications
  - improve submit error reporting
  - align the experience input with the real schema
- `src/components/teacher/EnhancedTeacherApplicationForm.tsx`
  - remove unsupported payload fields or map them to real columns
- `src/components/admin/TeacherApplicationReview.tsx`
  - keep admin detail view compatible with the final canonical columns
- `src/components/admin/TeacherApplicationsManagement.tsx`
  - clean up stale assumptions like `full_name` if this screen is still used
- Database migration
  - only if needed after alignment, for truly required fields that the app already depends on across routes

6. Technical details
- Current confirmed mismatch:
  - frontend sends `teaching_experience`
  - schema supports `teaching_experience_years`
- Other likely mismatches already visible in code:
  - `education_level`
  - `target_age_group`
  - `time_zone`
  - `video_url`
- I will not blindly add every missing column unless the route really depends on it; otherwise I will map the UI to the existing schema to reduce future breakage.
- If any extra columns are still required after the audit, I will add them in one migration instead of fixing errors one by one.

7. Validation after implementation
- Submit a new application on `/for-teachers`
- Confirm CV upload still works
- Confirm the insert succeeds without PostgREST schema-cache errors
- Open the Super Admin teacher application view and verify the submission appears with usable data
- Re-test the alternative teacher application route so the next error does not surface immediately after this one
