## Goals (8 fixes)

### 1. Sync Lesson Library → Live Classroom & Storybook Creator
- **Live Classroom**: `LibraryDrawer` already exists in `TeacherClassroom.tsx`, but uses `slideFormat='classroom'` which strips raw slide JSON (losing `image_url`). Switch the drawer to `slideFormat='raw'` so the original slide objects (with images) flow into `updateSharedDisplay({ lessonSlides })`.
- **Storybook Creator hydration**: when a library lesson contains a `storybook` slide, allow opening it directly in the active hub creator. Extend `creatorHydration.ts` so the auto-hydration in PlaygroundCreator/AcademyCreator/SuccessCreator detects `content.slides[i].type === 'storybook'` and pre-selects that slide for editing.
- **Add Storybook builder to Academy Creator**: it's already wired (line 717 `<StorybookEditor>`); confirm the `Storybook` chip is in the slide-type chooser (line 586 ✓) and `makeSlide('storybook')` returns a valid Academy storybook (line 84 ✓). No code change needed beyond verifying Academy hydration also handles existing storybooks (covered above).

### 2. Super-admin Teacher Hub Change Doesn't Persist to Dashboards
`TeacherManagement.handleSaveHubRole` writes `teacher_profiles.hub_role`, but the Playground/Academy/Success **teacher** dashboards route via `useTeacherHub` which reads `hub_role` *plus* `hub_specialty` and the auth `user_metadata.hub_type`. Two issues:
1. Cache: `useTeacherHub` is keyed per-mount; after admin save we don't notify the teacher's session. Add a Supabase Realtime subscription on `teacher_profiles` row inside `useTeacherHub`, or invalidate via `react-query` key `['teacher-hub', userId]`.
2. Some dashboards still fall back to `user_metadata.hub_type` set at signup. Update `handleSaveHubRole` to also call a new edge function `admin-set-teacher-hub` that:
   - updates `teacher_profiles.hub_role`
   - updates `auth.users.user_metadata.hub_type` via service role
   - returns ok
- Surface a clear toast and force the teacher to re-fetch on next page focus.

### 3. Lesson-Slide Frame – Remove Purple Theme, Match Hub
The screenshot shows an Academy Hub session rendering with a purple gradient even when the lesson is from a non-academy hub.
- In `LiveClassroom.tsx` line 90–94 the renderer is selected from `content.hub`. The bleed comes from the *card frame* (`bg-card rounded-3xl border border-border` at line 135) being overridden by `AcademyRenderer`'s own gradient when the hub is academy.
- Fix: pass an explicit `hub`-aware theme wrapper. Replace the wrapper with a hub-token wrapper that uses **flat surfaces** (no purple gradient) and let only the slide content paint hub color. Concretely:
  - Strip the inner `p-6 overflow-auto` wrapper background.
  - Add `bg-white` (or `bg-card`) inside, drop any inherited `bg-gradient` from theme map by passing a "frame=false" prop or a neutral theme variant for the live shell.
- Also align `TeacherClassroom`'s `CenterStage`/`DynamicSlideRenderer` to use the active lesson's hub instead of a hardcoded purple Academy frame (per-hub border colors: Playground=amber, Academy=indigo flat, Success=emerald).

### 4. Playground Multiple-Choice Images + No Sentence TTS
- **Add image fields per option** in PlaygroundCreator's `multiple` editor (line 1080). Replace the single `options` textarea with a per-option editor: each row has `text`, `image_url` (using `<ImageField subject={text}/>`), and a "✓ correct" toggle. Persist as `options: [{label, image_url}]` while remaining backward-compatible (string options still readable).
- Update Playground `SlideRenderer` (in `PlaygroundDemo.tsx`) to render option image + label cards.
- **TTS**: when previewing a `vocab_solo` / multiple-choice slide, only the vocabulary word should be spoken. In `slideAudioHelpers.ts` (and Playground autoplay), restrict autoplay payload to the word/lemma — do not concatenate `voice.text` for full sentences. Specifically:
  - For `vocab_solo`: speak `slide.word` only.
  - For `multiple`: do not autoplay the question; only speak option words on hover/tap.
  - Remove `voice.autoPlay` defaults from the Playground `makeSlide('multiple')` template (line 84) and `vocab_solo` (line 101).

### 5. Multi-Item Activities Across All Three Hub Creators
Currently each activity holds **one** item. Convert to a list:

| Slide type | New structure |
|---|---|
| `multiple` | `items: [{question, options[], answer}]` |
| `truefalse` | `items: [{statement, answer}]` |
| `fill` | `items: [{text, answer}]` |
| `match` | `items: [{instruction, pairs:[…]}]` (or keep flat pairs) |

Implementation:
- Add a small generic **`ItemListEditor`** (`src/components/creator-studio/shared/ItemListEditor.tsx`) that renders a numbered list with "+ Add item" / "🗑 Remove" controls and slots a child editor.
- Update `SlideEditor` cases in **PlaygroundCreator, AcademyCreator, SuccessCreator** to render via `ItemListEditor` when `items` exist, while keeping single-item back-compat (auto-migrate legacy single-item slides to `items: [{…}]` on first edit).
- Update the renderers (`PlaygroundDemo`, `AcademyDemo`, `SuccessDemo`) to step through `items` (carousel inside one slide) — show "Question 1 / N" and a Next-Question button before advancing the slide.
- Validate: at least 1 item required; max 10 per slide.

### 6. Images Not Appearing in Live Classroom (Academy Creator)
Two contributing bugs:
1. **`slideFormat='classroom'`** in `TeacherClassroom`'s `LibraryDrawer` runs `extractClassroomSlides()` which only emits text fields. Switch to `'raw'` (see fix 1).
2. **Signed URLs**: Academy lessons store images in `lesson-slides` bucket. The classroom-side renderer must call `supabase.storage.from('lesson-slides').getPublicUrl(...)` if the stored value is a relative path. Add a `resolveImageUrl()` helper in `src/utils/lessonImageUpload.ts` and call it from `AcademyRenderer` and `CenterStage` before rendering `<img>`.

### 7. Platform Readiness for Live Lessons
Quick smoke pass:
- Ensure `classroom_states` realtime is enabled (already migrated).
- Verify `/classroom/:id` resolves bookings via `resolve_classroom_id` RPC (already in place).
- Add a "Start Live Lesson" CTA on the Teacher Dashboard that opens `/classroom/:bookingId` for the next upcoming booking and copies the student join link.
- Confirm the new "Sync Library" button persists slides through `useSharedDisplaySync`.

### 8. `scaffolded_media`: Fix "non-2xx status" From `analyze-media`
Mismatch between client and edge function:
- Client `ScaffoldedMediaEditor.analyze()` sends `{ media_url, media_kind, transcript, hub, mode:'segments' }` and reads `data.segments`.
- Function expects `{ transcript, cefr_level, hub_type, media_url }`, requires `transcript ≥30 chars`, and returns `quiz_slides`.

Fix in two places (must match):
1. **Client** (`ScaffoldedMediaEditor.tsx`): rename payload keys (`hub`→`hub_type`, drop `mode`, add `cefr_level` from blueprint), and read `data.quiz_slides` mapped into `segments`.
2. **Edge function** (`analyze-media`): also accept the legacy `hub` alias and emit BOTH `quiz_slides` AND `segments` (with `start_time/end_time` derived by splitting the transcript into N chunks of equal duration when `media_kind === 'youtube'`).
3. Validate transcript length client-side and show a friendly toast ("Paste a transcript of at least 30 characters before generating checkpoints") instead of swallowing the 400.

## Files to be Edited / Created
- `src/components/teacher/classroom/TeacherClassroom.tsx` (LibraryDrawer slideFormat, frame neutralisation)
- `src/components/teacher/classroom/CenterStage.tsx` (image URL resolver, hub-aware frame)
- `src/components/lesson-player/LibraryDrawer.tsx` (default slideFormat='raw')
- `src/pages/LiveClassroom.tsx` (neutral frame)
- `src/pages/PlaygroundCreator.tsx`, `AcademyCreator.tsx`, `SuccessCreator.tsx` (multi-item editors, multiple-choice images, hydration of storybook items)
- `src/pages/PlaygroundDemo.tsx`, `AcademyDemo.tsx`, `SuccessDemo.tsx` (multi-item renderer, multiple-choice image cards)
- `src/components/creator-studio/shared/ItemListEditor.tsx` *(new)*
- `src/components/creator-studio/shared/ScaffoldedMediaEditor.tsx` (payload + response mapping)
- `src/components/admin/TeacherManagement.tsx` (call new edge function)
- `src/hooks/useTeacherHub.ts` (Realtime invalidation)
- `src/utils/lessonImageUpload.ts` (resolveImageUrl helper)
- `src/lib/playSlideAudio.ts` / `slideAudioHelpers.ts` (vocab-only TTS rule)
- `supabase/functions/analyze-media/index.ts` (segments output, hub alias)
- `supabase/functions/admin-set-teacher-hub/index.ts` *(new)*

## Database / Infra
- Edge function `admin-set-teacher-hub` (uses `SUPABASE_SERVICE_ROLE_KEY`) — needs `verify_jwt = true` + admin-role check inside.
- No new tables. `classroom_states` realtime already enabled.

## Out of Scope
- Recording / video infrastructure changes
- Curriculum content rewriting