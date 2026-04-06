

# Plan: Fix Teacher Application Submission + CV Upload

## Two Problems Found

### Problem 1: Applications Not Saving to Database
The `teacher_applications` table is **empty** despite the user seeing "Application Received!" The root cause is the **CV upload storage policy**. The storage bucket `teacher-applications` only allows uploads from `authenticated` users (`auth.role() = 'authenticated'`). Since the Teach With Us form is public (no login required), if a user attaches a CV file, the upload fails and throws an error before the database insert ever runs. Even without a CV, we should verify the insert works by also adding an `anon` upload policy.

Additionally, the form's error handling may be masking failures: if the storage upload error is thrown, the catch block shows a toast, but the user may have missed it.

### Problem 2: Admin Dashboard Shows `full_name` as Blank
The admin `TeacherApplicationReview` component references `application.full_name` everywhere (card titles, avatar fallbacks, detail dialogs), but the `teacher_applications` table has no `full_name` column -- only `first_name` and `last_name`. The `.select('*')` query succeeds, but `full_name` is always `undefined`, so teacher names appear blank.

---

## Technical Changes

### 1. Fix Storage Policy for Anonymous CV Uploads
**Database migration**: Add an RLS policy on `storage.objects` allowing `anon` users to upload to the `teacher-applications` bucket. This lets unauthenticated applicants upload their CV.

```sql
CREATE POLICY "Anyone can upload application files"
ON storage.objects FOR INSERT TO anon
WITH CHECK (bucket_id = 'teacher-applications');
```

### 2. Fix `full_name` in Admin Dashboard
**File: `src/components/admin/TeacherApplicationReview.tsx`**

- Update the `TeacherApplication` interface to remove `full_name` and rely on `first_name` + `last_name`
- Add a computed display name: `const displayName = \`\${app.first_name} \${app.last_name}\`.trim() || 'Unknown'`
- Replace all `application.full_name` references in both `TeacherApplicationReview` and the `ApplicationGrid` component with the computed name
- Update the search filter to search `first_name` and `last_name` instead of `full_name`

### 3. Improve Error Visibility in SimpleTeacherForm
**File: `src/components/teach-with-us/SimpleTeacherForm.tsx`**

- In the `handleSubmit` catch block, log the full error object so storage vs. DB failures are distinguishable
- Make the error toast more descriptive (show the actual error message)

---

## Summary of Changes

| File | Action |
|------|--------|
| Database migration | Add anon upload policy for `teacher-applications` storage bucket |
| `src/components/admin/TeacherApplicationReview.tsx` | Replace all `full_name` with `first_name + last_name` computed name |
| `src/components/teach-with-us/SimpleTeacherForm.tsx` | Improve error logging in submit handler |

