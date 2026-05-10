## Diagnosis summary

- The teacher role update in Super Admin only changes `teacher_profiles.hub_role`.
- The teacher is now `playground_specialist`, but their existing availability rows are still 60-minute slots: current DB scan shows `open_30m_future_slots = 0` and `open_60m_future_slots = 70` for the Playground specialist.
- Playground students only book 30-minute lessons by design, so the teacher profile can be filtered out or appear with no bookable slots.
- `get_approved_teachers()` also does not return `hub_role`, so the frontend performs extra reads and can misclassify teachers if RLS or fallback logic fails.
- `BookMyClassModal` currently falls back to “all teachers for this duration” when no hub-role teachers are found, which can hide the real data problem and show wrong teachers.
- `GEMINI_API_KEY` is already configured, so no secret prompt is needed.

## Implementation plan

### 1. Fix teacher hub assignment at the root

Create a Supabase migration that updates the backend source of truth:

- Update `public.get_approved_teachers()` to return `hub_role`, `can_teach`, `profile_complete`, `profile_approved_by_admin`, and `is_available` so the student booking UI does not need fragile secondary joins.
- Add a database trigger on `teacher_profiles.hub_role` updates:
  - When a teacher becomes `playground_specialist`, future unbooked availability is normalized to:
    - `duration = 30`
    - `end_time = start_time + 30 minutes`
    - `hub_specialty = 'Playground'`
  - When a teacher becomes `academy_mentor`, future unbooked availability is normalized to 60-minute Academy slots.
  - When a teacher becomes `success_mentor`, future unbooked availability is normalized to 60-minute Professional slots.
  - When a teacher becomes `academy_success_mentor`, future unbooked availability is normalized to 60-minute Academy/Professional-compatible slots.
- Backfill existing future unbooked rows for current teachers so the teacher already changed in Super Admin immediately becomes visible to Playground students.

### 2. Fix student teacher discovery and booking UI

Update the booking frontend so it uses one canonical hub-role path:

- In `src/pages/student/FindTeacher.tsx`:
  - Read `hub_role` directly from the updated `get_approved_teachers()` response.
  - Keep the explicit `user_roles.role = 'teacher'` fallback, but join it to `teacher_profiles` with approval flags and `hub_role`.
  - Do not default missing hub roles to Academy/Success; mark them as unassigned/general instead.
  - Show a proper hub-specific empty state, e.g. `No Playground teachers currently available`.
- In `src/components/student/BookMyClassModal.tsx`:
  - Remove the “fall back to all teachers” behavior when no teachers match the hub role.
  - Filter by both `teacher_profiles.hub_role` and the slot duration required by the student hub.
  - Display a clear empty state when no slots exist for the selected hub.
- Ensure the selected teacher is respected in the modal. Right now `FindTeacher` stores `selectedTeacherId`, but `BookMyClassModal` does not receive/use it; I will pass it through and filter slots to that teacher when booking from a teacher card.

### 3. Add lesson blueprint generation to all creators

Bring the Blueprint workflow into every creator consistently:

- PlaygroundCreator, AcademyCreator, and SuccessCreator already have a `LessonBlueprintPanel`; I will add an explicit blueprint section inside each “Generate with AI” modal so the teacher can see or edit the blueprint before pressing Generate.
- Add an “Auto-generate blueprint” action that generates:
  - exactly 5 target vocabulary items based on topic + CEFR level + hub
  - grammar focus
  - phonics/pronunciation focus where appropriate
- Use that blueprint as the required input for slide generation so vocabulary is always generated according to topic and lesson/student level.

### 4. Create `generate-gemini` edge function

Add a new Supabase Edge Function:

- `supabase/functions/generate-gemini/index.ts`
- Standard CORS headers including `Access-Control-Allow-Origin: *`
- Securely reads `Deno.env.get('GEMINI_API_KEY')`
- Accepts `{ prompt: string }`, plus optional structured helpers like `system`, `responseMimeType`, `model`, and `temperature` for internal reuse
- Calls Gemini via Deno `fetch`:
  - `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- Returns:
  - `text` for simple generation
  - raw Gemini metadata only where useful for debugging
- Add input validation and safe error responses with CORS on every response.

### 5. Refactor Creator AI generation away from Lovable AI Cloud

Update Creator Studio AI paths to call Supabase/Gemini instead of Lovable AI gateway:

- Replace Lovable AI usage in the functions directly used by creators:
  - `plan-lesson-blueprint`
  - `generate-ppp-slides`
  - `generate-practice-items`
  - `sync-slides-to-blueprint`
  - `ai-rewrite-text`
  - `generate-storybook`
  - lesson-builder generator functions used by Creator dashboards where applicable
- Keep frontend calls as `supabase.functions.invoke(...)`; the frontend must never call Gemini directly or expose the API key.
- For simple text-generation frontend actions, route through `generate-gemini`.
- For structured lesson JSON generation, update the existing specialized edge functions to use `GEMINI_API_KEY` directly or a shared Gemini request pattern, preserving their current response shapes so the UI does not break.
- Preserve loading states and existing error toasts.

### 6. Validate the full flow

After implementation:

- Query the DB again to verify the Playground specialist now has future 30-minute Playground slots.
- Test the teacher discovery logic with read queries and the app route assumptions.
- Deploy/test the new `generate-gemini` function with a small prompt.
- Test the blueprint and lesson generation path enough to confirm the UI receives valid data and loading/error states work.

## Technical notes

- The migration will not touch `auth` schema or store secrets in the database.
- Teacher roles remain in `user_roles`; hub teaching assignment remains in `teacher_profiles.hub_role`.
- The Gemini API key remains server-side in Supabase Edge Functions only.
- I will not change the fixed business rules: Playground = 30 minutes, Academy/Success = 60 minutes.