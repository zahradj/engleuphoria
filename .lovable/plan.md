## Auto-Hydrate Hub Creators from Master Library

When a teacher clicks a lesson in the Master Library, route them straight into the matching Hub Creator (Playground / Academy / Success) with the Lesson Blueprint already filled in — so they only need to tweak a field and hit ✨ Generate.

### 1. Library card → correct Hub Creator

`src/components/teacher/library/TeacherLessonLibrary.tsx`

- Extend `HUB_META` with a `creatorPath` per hub:
  - `playground` → `/playground-creator`
  - `academy` → `/academy-creator`
  - `professional` → `/success-creator`
- Make the whole card clickable (and keep the Edit button) — both navigate to `${creatorPath}?lessonId=${lesson.id}`. The existing `?lessonId=` URL param is already what `useCreatorLesson` reads, so no new route shape is required.
- The current "Edit" button currently points at the deprecated `/content-creator?edit=…`. Replace it with the hub-specific path so Pre-A1 lessons always re-open in the Playground (visual / audio-first), Academy lessons in Academy, etc.

### 2. Hydration in the three Hub Creators

All three creators (`PlaygroundCreator.tsx`, `AcademyCreator.tsx`, `SuccessCreator.tsx`) already:
- Read `lessonId` from `useSearchParams`
- Pass it to `useCreatorLesson({ initialLessonId })` which fetches the row
- Have a `useEffect` on `lessonHook.lesson?.id` that hydrates `slides`, `title`, and `blueprint` from `ai_metadata.lesson_blueprint`

What's missing — extend that same effect so the **Lesson Blueprint sidebar** is fully primed:

- `setAiTopic(lesson.title)` — so the topic input shows the imported title.
- `setAiLevel(...)` — derive from `ai_metadata.cefr_level` first, otherwise from `lesson.difficulty_level` mapped to the closest CEFR (`beginner→A1`, `intermediate→B1`, `advanced→C1`). Default per hub if unknown (Playground=A1, Academy=A2, Success=B1).
- If `meta.lesson_blueprint` exists, also push its `target_vocabulary`, `grammar_focus`, `interests`, `specific_needs` into the `blueprint` state (already happens through `setBlueprint(meta.lesson_blueprint)` — verify shape matches `LessonBlueprint` type and back-fill missing fields with empty defaults so the inputs render rather than being undefined).

This is purely **additive lines** inside the existing hydrate `useEffect` — no new hook needed.

### 3. UI ready-state

The ✨ Generate button is already enabled whenever `aiTopic.trim()` is non-empty (see `disabled={aiBusy || !aiTopic.trim()}`). Because step 2 sets `aiTopic` on hydrate, the button is automatically active immediately after navigation — no extra wiring required. We just need to ensure the hydrate effect runs **before** the user can interact (it does, since `useCreatorLesson` resolves the row on mount and React re-renders synchronously after state set).

### 4. Hub detection

Hub detection is implicit in the routing: the Master Library card already knows the lesson's hub (from `lesson.hub`), so it sends the user to the correct creator route. Each creator hard-codes its own `hub: 'playground' | 'academy' | 'success'` in `useCreatorLesson`, so there is no risk of cross-hub bleed.

Edge case to handle: if a user manually pastes a Playground lesson's `?lessonId=` into `/academy-creator`, hydration would still try to load it. Add a soft guard in the hydrate effect — if `content.hub` (or `ai_metadata.hub`) does not match the creator's hub, redirect via `navigate(`${correctCreatorPath}?lessonId=${id}`, { replace: true })`. This guarantees Pre-A1 / visual logic always opens in Playground.

### 5. Files touched

| File | Change |
|---|---|
| `src/components/teacher/library/TeacherLessonLibrary.tsx` | Add `creatorPath` to HUB_META; route Edit + card click to `${creatorPath}?lessonId=…` |
| `src/pages/PlaygroundCreator.tsx` | Extend hydrate effect: setAiTopic + setAiLevel + hub-mismatch redirect |
| `src/pages/AcademyCreator.tsx` | Same |
| `src/pages/SuccessCreator.tsx` | Same |

No new routes, no new hooks, no DB changes. The infrastructure is already there — this plan just connects the wires.

### 6. Manual verification

1. Open `/teacher/library`, click an Academy lesson → lands on `/academy-creator?lessonId=<id>` with Topic, Level, Vocab, Grammar all pre-filled.
2. Click ✨ Generate immediately → produces a fresh variant of the same lesson.
3. Click a Playground card → opens `/playground-creator` (not Academy), Pre-A1 visual-first UI active.
4. Manually paste a Playground id into `/academy-creator?lessonId=…` → auto-redirects to `/playground-creator?lessonId=…`.
