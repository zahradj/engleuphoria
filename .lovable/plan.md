

# Fix: Stale Build Errors + CV Upload Visibility

## What's Happening

1. **The CV upload field already exists** — it's Step 5 of the 5-step wizard form. The code at lines 573-627 of `SimpleTeacherForm.tsx` renders a full drag-to-upload area with file type validation and size limits.

2. **The build errors are stale** — `grep` confirms zero occurrences of `full_name` in `TeacherApplicationReview.tsx`. All references were already replaced with `getDisplayName()`. The build system is reporting errors from a cached state.

## Plan

### 1. Force a clean rebuild
Touch `TeacherApplicationReview.tsx` with a trivial whitespace change to invalidate the build cache and clear the stale `full_name` errors. This is the only blocking issue — once the build succeeds, the preview will update and the user can navigate through all 5 form steps including the CV upload.

### 2. No other code changes needed
The CV upload UI, file validation, storage upload logic, and form data model (`cvFile: File | null`) are all already implemented and working. The user just needs the build to succeed so they can reach Step 5.

| File | Action |
|------|--------|
| `src/components/admin/TeacherApplicationReview.tsx` | Trivial touch to force rebuild |

