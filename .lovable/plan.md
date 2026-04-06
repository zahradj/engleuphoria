

## Fix: Teacher Application Submission Error

### Root Cause
The form inserts `status: 'new'` and `current_stage: 'application_received'`, but the database check constraints only allow specific values:
- **status**: `pending`, `under_review`, `interview_scheduled`, `accepted`, `rejected`
- **current_stage**: `application_submitted`, `documents_review`, `equipment_test`, `interview_scheduled`, `interview_completed`, `final_review`, `approved`, `rejected`

### Fix (1 file change)
**`src/components/teach-with-us/SimpleTeacherForm.tsx`** — Lines 210-211:
- Change `status: 'new'` to `status: 'pending'`
- Change `current_stage: 'application_received'` to `current_stage: 'application_submitted'`

This is a two-line fix that will resolve the "Application Failed" error immediately.

