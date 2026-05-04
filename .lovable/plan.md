## Goal

Fix the urgent Success Creator crash, then ship five upgrades: Teacher Notes + Role Simulator, Visual Flashcards, Excel-style dynamic activity builder, Success Hub corporate AI structure with Buffer slides, and a Lesson Summary "Trophy/Review" slide.

## P0 — Crash fix (do first, ships standalone)

`SuccessCreator.makeSlide()` calls `SLIDE_TYPES.find(...)!.defaultBlock` and crashes when an old/imported revision has a slide type that isn't in the current `SLIDE_TYPES` table (console: `Cannot read properties of undefined (reading 'defaultBlock')` from RevisionHistoryModal restore path).

Fix: lookup with safe fallback.

```ts
function makeSlide(type: SlideType): Slide {
  const entry = SLIDE_TYPES.find((s) => s.type === type);
  if (!entry) return { type: 'intro', block: 'warmup', title: 'New section', subtitle: '' } as Slide;
  const block = entry.defaultBlock;
  switch (type) { /* unchanged */ }
}
```

Same defensive lookup added to `AcademyCreator.makeSlide()` and `PlaygroundCreator.makeSlide()` for parity.

## 1. Teacher Notes + Role Simulator

**Schema**
- `PlaygroundDemo.Slide`: add `teacher_notes?: string` to every union member (single-line edit on each variant).
- `AcademyDemo.Slide` and `SuccessDemo.Slide`: same.

**Editor (right column → moves to bottom of editor card)**
- New `<TeacherNotesField>` component rendered under the slide form (in the Editor column, below the tabs — not the preview column, since preview is a viewer not an editor). Amber background (`bg-amber-50 border-amber-300`) + "📝 Teacher Script / Notes (Hidden from Student)" label, bound to `slide.teacher_notes` via `update({ teacher_notes })`.

**Role Simulator (top of Live Preview column)**
- Segment toggle `[👨‍🏫 Teacher View] [🎓 Student View]`, default `teacher`.
- New `previewRole` state passed to `PlayablePreviewPane` as a prop, then forwarded to `renderSlide(slide, idx, { previewRole })`.
- Behaviour:
  - **Student**: hide Next/Back arrows, hide "Force Sync" / sync chrome, do NOT render `teacher_notes`.
  - **Teacher**: full chrome + a floating bottom panel showing `slide.teacher_notes` ("📝 Teacher Script") with amber accent.
- `PlayablePreviewPane.tsx`: add optional `previewRole` prop, pass through to renderSlide and conditionally render its built-in nav controls.

**AI prompt update**
- Edge function `generate-ppp-slides` (and any per-hub variants): append to system prompt:
  > "For every slide, populate `teacher_notes` with one short sentence telling the live teacher how to deliver this slide (e.g. 'Ask the student to read the sentence aloud before playing the audio.'). Never reveal teacher_notes to the student."
- Add `teacher_notes: { type: "string" }` to the structured-output JSON schema.

## 2. Visual Flashcards (Playground + Academy)

**Schema (`flashcards` field already on slides via SlideMediaPanel)**
```ts
type FlashcardItem = { id: string; word: string; image_url?: string; audio_url?: string; definition?: string };
```

**Playground UI** (`PlaygroundDemo` + new `Flashcard` slide variant if not present, otherwise update existing renderer):
- Card: `aspect-[3/4] rounded-3xl overflow-hidden`. Top 75% = `<img class="w-full h-full object-cover">` (no emoji fallback — show neutral placeholder if missing). Bottom 25% = bold word pill + circular "▶ Audio" button.

**Academy UI** (split layout):
- `grid grid-cols-2 min-h-[420px]`. Left: image (`object-cover`). Right: `<h3 class="text-3xl font-bold">{word}</h3>` + `<p class="text-base">{definition}</p>` + Audio button.

**Editor integration**
- `SlideMediaPanel` already has flashcard editing (per earlier scan). Update each row to include:
  - `word` input (existing `front`)
  - `definition` input (new)
  - "🪄 AI Generate Image" button per row → calls `ai-image-generation` with prompt `"Vocabulary illustration for: {word}, clean flat style, white background"` and patches that row's `image_url`.
  - "🔊 Generate Audio" → calls existing TTS endpoint, sets `audio_url`.

## 3. Excel-style Dynamic Activity Builder

For interactive slide types in the Right/Editor column whose data is an array (`fill_blank`, `multiple`, `matching`, `drag`, `cluster.activities`, `opinion.options`, `functional_pattern.examples`):

- Render rows via `.map()`.
- Below the list: full-width dashed button **`+ Add New Item`** that pushes an empty template onto the array.
- Each row gets a small `<Trash2>` icon (right side) that splices it out.
- Auto-scroll: each row gets `data-item-index={i}`. The Live Preview's `renderSlide` wraps each item with `onClick={() => editorRef.current?.querySelector('[data-item-index="${i}"]')?.scrollIntoView({behavior:'smooth', block:'center'})}` and a momentary `ring-2 ring-orange-400` highlight. A shared `useEditorScrollSync(hub)` hook coordinates the ref.

This is implemented inside each creator's `SlideEditor` switch arms (PlaygroundCreator + AcademyCreator + SuccessCreator).

## 4. Success Hub — Corporate AI + Buffer Block

**Routing alias**
- Add `<Route path="/dashboard/success-creator" element={<SuccessCreator />} />` alongside the existing `/success-creator` route.

**Corporate UI polish (SuccessDemo)**
- Confirm/upgrade theme: dark navy `bg-slate-900` for "teacher view" of slide canvas, white inner card, serif headings (`font-serif text-slate-900`), emerald accent kept minimal. Already mostly in place — only add serif to slide titles.

**AI prompt (edge function `generate-ppp-slides` branch `hub === 'success'`)**
Replace the system prompt with the Master Corporate English Trainer brief, output blocks in this exact order with these counts:

| Block | Slides |
|---|---|
| `warmup` (Business Context) | 2 |
| `vocab` (Idioms / Phrasal Verbs) | 3 |
| `context` (Reading or Listening — case study / email) | 2 |
| `functional` (Grammar in Use — formal vs informal) | 3 |
| `practice` (Negotiation / rewrite / fill) | 3 |
| `output` (Speaking / Presentation) | 2 |
| **`buffer` (Buffer & Review)** | **3–4 EXTRA optional slides** |

- Add `'buffer'` to `Block` union in `SuccessDemo.tsx` + add a `BLOCKS` entry `{ id: 'buffer', label: 'Buffer & Review' }`.
- In `PlayablePreviewPane` and `SuccessClassroom` rendering, when `slide.block === 'buffer'`, show a small badge `🕒 Extra Time` (top-right of slide canvas).
- AI must include `is_buffer: true` flag on those slides for clarity.

## 5. Lesson Summary "Trophy / Review" Slide (bonus)

**New slide type** `lesson_summary` (auto-appended by the AI, also addable manually):
```ts
{ type: 'lesson_summary', block: 'output', vocab_recap: string[], grammar_recap: string, takeaway: string, teacher_notes?: string }
```

**Renderers**
- **Playground**: Big confetti burst on enter (`fireConfetti`), trophy icon, "🏆 Level Complete!", list of words mastered (max 5) as colourful chips, "Great job!" CTA.
- **Academy / Success**: Clean white "Review Sheet" — Title "📋 Lesson Recap" + sectioned cards: Vocabulary (5 chips), Grammar Rule (single sentence), Your Takeaway, with a small "📸 Screenshot-friendly" hint.

**AI**
- Edge function appends one `lesson_summary` slide as the final slide of every Academy/Success/Playground generation, populated from the actual vocab/grammar/objective fields produced earlier in the deck.

## Files to create/edit

**Create**
- `src/components/creator-studio/shared/TeacherNotesField.tsx`
- `src/components/creator-studio/shared/PreviewRoleToggle.tsx`
- `src/components/creator-studio/shared/DynamicListEditor.tsx` (reusable add-row + trash + scroll-into-view helper)
- `src/components/creator-studio/shared/FlashcardEditor.tsx` (per-row word/def/AI image/audio controls)
- `src/components/lesson-summary/PlaygroundSummary.tsx`
- `src/components/lesson-summary/AcademySummary.tsx` (shared with Success, themed by prop)

**Edit**
- `src/pages/SuccessCreator.tsx` — crash fix, teacher notes field, preview role toggle, dynamic list editors, summary slide, buffer block.
- `src/pages/AcademyCreator.tsx` — defensive `makeSlide`, teacher notes, preview role toggle, dynamic list editors, summary slide.
- `src/pages/PlaygroundCreator.tsx` — defensive `makeSlide`, teacher notes, preview role toggle, dynamic list editors, summary slide.
- `src/pages/PlaygroundDemo.tsx` — `teacher_notes` on Slide union, `lesson_summary` renderer, image-centric Flashcard renderer.
- `src/pages/AcademyDemo.tsx` — same: union, summary, image+definition flashcard.
- `src/pages/SuccessDemo.tsx` — union, summary, `buffer` block + 🕒 badge, serif title polish.
- `src/components/creator-studio/shared/PlayablePreviewPane.tsx` — `previewRole` prop, conditional chrome, floating teacher notes panel, badge support.
- `src/components/creator-studio/shared/SlideMediaPanel.tsx` — wire new FlashcardEditor for `flashcards` field.
- `src/App.tsx` — add `/dashboard/success-creator` alias.
- `supabase/functions/generate-ppp-slides/index.ts` — add `teacher_notes` schema field, branch on `hub === 'success'` for corporate structure + buffer block, append `lesson_summary` slide.

## Out of scope

- Reworking the live `/classroom/:id` real-time sync engine to honour `previewRole` (separate flow — only the creator's preview pane is updated).
- Migrating saved lessons in the DB to backfill `teacher_notes` (new field is optional).
- Audio generation pipeline changes — flashcards reuse the existing TTS endpoint.

## Validation

- Open `/success-creator` → no crash, can add slides normally.
- Toggle "Student View" in preview → arrows hidden, no notes panel.
- Add a Fill-in-the-Blank slide → click "+ Add New Item" → new row appears in editor and on canvas; trash deletes it.
- Generate Success lesson via AI → 7 blocks present, last block tagged 🕒, final slide is a `lesson_summary`.
