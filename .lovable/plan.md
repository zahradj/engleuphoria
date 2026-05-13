## Audit findings

- **Assessment creation paths are mostly correct on the frontend:** `CreateAssessmentDialog.tsx` and `AssessmentCreator.tsx` create new assessments with `.insert()` and do not pass hardcoded assessment IDs.
- **Root database risk:** current RLS policies use broad `FOR ALL` rules on `assessments` and `assessment_questions`, which allows teachers to update/delete historical assessments and questions after creation. There is no database-level immutability trigger.
- **Question/content media risk:** `assessment_questions` stores `question_text`, `options`, `correct_answer`, `rubric`, and `audio_url`; because updates are allowed, old tests/questions/audio can be modified by any frontend path or future generator bug.
- **Lesson generator error swallowing:** the active creator pages call `generate-ppp-slides`, but Academy/Playground only throw `error.message`; Success partially uses `handleAIResponse`, but empty/wrong response shapes still collapse into generic “AI returned no Success slides”. The UI does not reliably show backend `error`, `detail`, or Google/Gateway response text.
- **Backend status check:** `generate-ppp-slides` has a catch returning status `500` with `error` and `stack`, but some provider failures return `{ error: 'AI gateway error', detail: ... }` with `502`/other status; the frontend must extract both fields.

## Plan

1. **Add database-level assessment immutability**
   - Create a migration with trigger functions on `public.assessments` and `public.assessment_questions`.
   - Block updates/deletes to historical question rows, including question text, answers, options, rubrics, audio URLs, and metadata.
   - Block destructive assessment deletion.
   - Keep only safe lifecycle fields mutable on assessments if needed for existing UI: `is_published`, `published_at`, `due_date`, `updated_at`. All content fields such as `title`, `description`, `assessment_type`, `cefr_level`, `duration_minutes`, `passing_score`, and `total_points` become immutable after insert.
   - This protects existing rows even if a future frontend bug accidentally calls `.update()` or `.upsert()`.

2. **Tighten assessment frontend save/delete behavior**
   - Keep new assessment saves as pure `.insert()` operations.
   - Ensure question inserts never send frontend temp IDs; let Postgres generate UUIDs.
   - Remove or disable the destructive delete action in `AssessmentsList.tsx` so the UI matches the database protection.
   - Keep publish/unpublish working if lifecycle fields remain allowed.

3. **Create a shared raw Edge Function error extractor**
   - Add a frontend helper that extracts the exact technical error from Supabase function responses:
     - `error.message`
     - `data.error`
     - `data.detail`
     - `data.stack`
     - nested JSON/message shapes where present
   - Use this instead of generic fallback text in lesson generation flows.

4. **Fix lesson generator error surfacing in all creator pages**
   - Update `SuccessCreator.tsx`, `AcademyCreator.tsx`, and `PlaygroundCreator.tsx` around `generateWithAI`.
   - On any Supabase function error or invalid slide payload, show a toast titled **Generation Failed** with the exact raw error string.
   - Preserve the retry action where currently available.
   - Include returned response keys in the error when the function succeeds but returns the wrong shape, so we can see whether the backend returned `slides`, `success_slides`, `academy_slides`, `playground_slides`, etc.

5. **Normalize `generate-ppp-slides` error responses**
   - Ensure every failing path returns JSON with at least:
     - `error`: exact human-readable technical message
     - `detail`: raw provider/Gateway body when available
     - `status`: provider status when available
   - Keep failure statuses non-2xx, using `500` for internal exceptions and provider-specific statuses where already meaningful.

6. **Validate after implementation**
   - Run targeted searches to confirm no assessment creation path uses `.update()`/`.upsert()` for new tests or hardcoded IDs.
   - Use read-only database inspection to confirm triggers/policies exist.
   - Check the relevant frontend/Edge Function files after edits and run targeted tests or Edge Function calls where safe.