## Goal

Bring `PlaygroundCreator` and `AcademyCreator` to parity with the rest of the studio:

1. A clean tabbed media panel (Image · Audio · Music · Video · Flashcards) in the middle column.
2. Real persistence to `curriculum_lessons` (the Master Library), with Save Draft, Publish, and Import working.
3. Slide rail upgrades: keyboard reorder + duplicate + delete already exist; add drag-and-drop and an explicit "lesson title / hub" header.

## Reality check

- The named components in the brief (`AudioGenerator`, `ImageGenerator`, `VideoEmbedder`, `FlashcardBuilder`) **do not exist as standalone files**. The richest media UI lives inside `creator-studio/.../TeacherControlsPanel.tsx`, but it is tightly coupled to a different `PPPSlide` shape (CreatorContext) and cannot be dropped into the Playground/Academy slide schemas.
- The reusable backend pieces that **do** exist and we will share:
  - `generate-slide-image`, `generate-slide-voiceover`, `generate-slide-music` edge functions — wrapped by `src/components/creator-studio/steps/slide-studio/mediaGeneration.ts` (`generateSlideImage`, `generateSlideVoiceover`, `generateSlideMusic`).
  - `generateOnePlaygroundImage` from `usePlaygroundImages` (already used for kids).
  - `useLessonEditor` hook + `lessonLibraryService` (`getLibraryLessons`, `getLessonById`, `saveToLibrary`) — the same data layer the Master Library reads from.
- Both creators currently keep slides only in `useState` — no `.from('curriculum_lessons')` call anywhere. That is the disconnect to fix.

## What to build

### 1. New shared `SlideMediaPanel` component

Create `src/components/creator-studio/shared/SlideMediaPanel.tsx`. A self-contained tabbed panel that operates on a generic `slide: any` and an `onPatch(patch)` callback. Tabs:

```text
[ Image ]  [ Audio ]  [ Music ]  [ Video ]  [ Flashcards ]
```

- **Image** — text prompt + "Generate" button (calls `generateSlideImage(prompt, lessonId, slideId, hub)`), URL input, file upload via `uploadSlideAsset`, thumbnail preview. Writes to `slide.image_url` (Playground) or `slide.media.image_url` (Academy — see binding map).
- **Audio** — text → ElevenLabs TTS via `generateSlideVoiceover`, voice dropdown (Sarah / Roger / Lily / Charlie), preview `<audio>`. Writes to `slide.voice.text` and `slide.voice.audio_url`.
- **Music** — prompt + duration → `generateSlideMusic`, preview, writes to `slide.music_url`.
- **Video** — paste YouTube/Vimeo URL, auto-detect ID, write `slide.video_url` + `slide.video_embed_url`.
- **Flashcards** — only enabled when slide type matches (`vocab` / `matching` / `match`). Inline list of `{ front, back, image_url? }` with add/remove/AI image per card; writes to `slide.flashcards` (or `slide.pairs` for `match`).

Each tab uses the existing UI primitives (`Tabs`, `Input`, `Textarea`, `Button`, `Label`, `Card`) and `sonner` toasts. The panel emits a single `onPatch` so the parent's existing `update()` reducer is reused.

### 2. New `useCreatorLesson` hook

Create `src/hooks/useCreatorLesson.ts` (thin wrapper around `useLessonEditor` + `getLibraryLessons` for the Import dropdown):

```text
useCreatorLesson({ hub })
  → { lessonId, setLessonId,
      lesson, isLoading,
      saveDraft(slides), publish(slides),
      libraryList, refreshLibrary }
```

Persistence rules:
- **Save Draft** → `update curriculum_lessons set content = { slides, hub, updated_at }, is_published = false where id = :lessonId`.
- **Publish** → same upsert + `is_published = true`.
- **New lesson** (no `lessonId` yet) → call `saveToLibrary(title, hub, level, slides)` to insert and capture the new id.
- **Import** → `getLibraryLessons(hub)` for the picker, then `getLessonById(id)` and hydrate `setSlides(content.slides)` + `setLessonId(id)`.
- All routed through `curriculum_lessons` (canonical table per project memory).

### 3. Refactor `PlaygroundCreator` middle column

Keep all existing per-type fields (intro/multiple/truefalse/fill/drag/match/draw — they ARE the "Basic Text" and "Interactive Data" sections). Wrap them in tabs:

```text
[ Basic ]  [ AI Media & Audio ]  [ Interactive Data ]
```

- **Basic** = the current `SlideEditor()` text/option fields (no change).
- **AI Media & Audio** = mounted `<SlideMediaPanel>` with hub="playground".
- **Interactive Data** = the existing `match.pairs` / `multiple.options` / `drag` editors that aren't basic text. (For most slide types this tab is hidden.)

Header buttons (top-right): replace the JSON-only set with `Save Draft`, `Publish`, `Import from Library ▾`, `Preview`, `JSON`. Add a **Lesson Title** input + hub badge in the header row. Wire to `useCreatorLesson({ hub: 'playground' })`.

### 4. Refactor `AcademyCreator` middle column

Same pattern with `useCreatorLesson({ hub: 'academy' })`. Academy slides have richer types; the Media tab is enabled on every type, the Flashcards tab is enabled for `vocab` / `matching`.

### 5. Slide rail (left column) parity

Both creators already have move-up / move-down / duplicate / delete. Add:
- HTML5 drag-and-drop reorder (`onDragStart` / `onDragOver` / `onDrop` on the slide list items) — small inline implementation, no new lib.
- "+ New from template" stays as-is.

### 6. Routing the Master Library to these creators

In the existing Master Library / Curriculum Manager lesson cards, add an "Edit in Studio" button that links to:
- `/playground-creator?lessonId=:id` for Playground hub
- `/academy-creator?lessonId=:id` for Academy hub

Both creators read `?lessonId=` on mount (via `useSearchParams`) and hydrate. This closes the loop: lessons saved here are immediately editable from Master Library and vice versa.

## Technical details

**Slide → DB binding:** payload is stored as `curriculum_lessons.content = { slides: Slide[], hub, updated_at }` to match what `lessonLibraryService.getSlidesArray` already understands.

**File touch list:**

```text
NEW   src/components/creator-studio/shared/SlideMediaPanel.tsx
NEW   src/hooks/useCreatorLesson.ts
EDIT  src/pages/PlaygroundCreator.tsx       — header, tabs, persistence, drag-drop
EDIT  src/pages/AcademyCreator.tsx          — header, tabs, persistence, drag-drop
EDIT  src/components/content-creator/CurriculumManager.tsx
        — add "Edit in Studio" link per lesson card (Playground/Academy only)
```

**Reused (no edits):**
- `src/components/creator-studio/steps/slide-studio/mediaGeneration.ts`
- `src/components/creator-studio/steps/slide-studio/uploadSlideAsset.ts`
- `src/services/lessonLibraryService.ts`
- `src/hooks/useLessonEditor.ts`
- Edge functions: `generate-slide-image`, `generate-slide-voiceover`, `generate-slide-music`

**No DB migration needed** — `curriculum_lessons` already has `content jsonb`, `is_published`, `target_system`, `created_by`.

**Out of scope (not in this pass):**
- Replacing the Playground/Academy `SlideRenderer` to read the new `slide.voice.audio_url` / `slide.music_url` fields. Today the renderer uses browser TTS for `voice.text`; pre-generated audio URLs will simply sit on the slide JSON ready to be wired in a follow-up.
- Per-slide `lesson-slides` storage bucket policy changes (uses existing bucket via `uploadSlideAsset`).
- Cross-hub conversion (a Playground lesson cannot be opened in AcademyCreator — the schemas differ).
