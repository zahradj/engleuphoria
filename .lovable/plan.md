

## Plan: Remove Lesson Generation Step & Add Lesson Blueprint Panel

### Overview
Three changes: (1) Remove Step 2 "Lesson Generation" from the pipeline, making it a 3-step flow (Curriculum → Slide Builder → Content Library). (2) Add a "Lesson Blueprint" tab next to Teacher's Guide in the Slide Builder — a scientifically grounded, slide-by-slide checklist showing what each slide should contain based on proven ESL/EFL pedagogy. (3) Make Teacher's Guide auto-generatable by AI after all slides are built.

### Pipeline Change: 4 Steps → 3 Steps

```text
BEFORE:  Curriculum → Lesson Generation → Slide Builder → Content Library
AFTER:   Curriculum → Slide Builder → Content Library
```

**Files:**
- `ContentCreatorStepper.tsx` — Change `PipelineStep` to `1 | 2 | 3`, update STEPS array to 3 items, adjust progress badges
- `ContentCreatorDashboard.tsx` — Remove case 2 (NewLibrary), shift Slide Builder to step 2, Content Library to step 3, update `goNext`/`goPrev` bounds
- `CurriculumStep.tsx` — Change "Next: Generate Lessons" to "Next: Slide Builder"
- `AdminLessonEditor.tsx` — Change "Back: Lesson Generation" to "Back: Curriculum"

### Lesson Blueprint Panel (New)

A new `LessonBlueprint.tsx` component placed in a tabbed panel alongside Teacher's Guide. It shows a structured checklist for 20–25 slides based on the **PPP method** (Presentation → Practice → Production) combined with **spaced repetition** and **Bloom's taxonomy** progression:

| Slide Range | Phase | What to Include | Pedagogy |
|---|---|---|---|
| 1 | Warm-up | Title slide, lesson objective, engagement hook | Activate prior knowledge |
| 2–3 | Presentation | New vocabulary with visuals + audio | Input hypothesis (Krashen) |
| 4–5 | Guided Practice | Matching / drag-and-drop with the new vocabulary | Recognition → recall |
| 6–7 | Presentation | Grammar/structure in context | Noticing hypothesis |
| 8–9 | Controlled Practice | Fill-in-the-blank / sentence builder | Accuracy focus |
| 10–11 | Freer Practice | Sorting / quiz activities | Fluency building |
| 12–13 | Production | Role-play prompts / open-ended tasks | Communicative competence |
| 14 | Review | Quick quiz covering all objectives | Spaced retrieval |
| 15 | Wrap-up | Summary + self-assessment | Metacognition |

The blueprint dynamically maps to the actual slide count. Each entry shows:
- A checkbox (auto-checked when the slide has matching content)
- Recommended element types (e.g., "Add: vocabulary image + audio")
- Phase label with color coding (Presentation = blue, Practice = amber, Production = green)

Clicking a blueprint item selects that slide in the organizer.

**File:** `src/components/admin/lesson-builder/LessonBlueprint.tsx`

### Right Panel: Tabbed Guide + Blueprint

Replace the fixed TeacherGuide panel with a tabbed container:

```text
[ Teacher's Guide | Lesson Blueprint ]
```

Plus an "Auto-Generate Guide" button in the Teacher's Guide tab that sends all slide content to AI and populates teacher notes for every slide at once.

**File:** `src/components/admin/lesson-builder/AdminLessonEditor.tsx` — wrap right panel in Tabs, add AI auto-generate button for Teacher's Guide

### Technical Details

| File | Change |
|---|---|
| `ContentCreatorStepper.tsx` | 3-step pipeline, updated type and STEPS array |
| `ContentCreatorDashboard.tsx` | Remove case 2, renumber steps |
| `CurriculumStep.tsx` | Update next button label |
| `AdminLessonEditor.tsx` | Tabbed right panel (Guide + Blueprint), back button label, AI guide generation |
| `LessonBlueprint.tsx` | New — slide-by-slide pedagogical checklist with auto-detection |

