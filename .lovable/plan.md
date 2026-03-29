

## Redesign: Unified Step-by-Step Content Creator Pipeline

### Current Problem
The Content Creator Dashboard has 8 separate tabs in a sidebar, making the workflow fragmented. Users jump between disconnected sections without a clear production flow.

### New Design: Linear Pipeline with 4 Steps

Replace the sidebar navigation with a **horizontal stepper** at the top. Each step builds on the previous one, guiding content creators through a logical production pipeline:

```text
Step 1              Step 2              Step 3              Step 4
[Curriculum]  -->  [Lesson Gen]  -->  [Slide Builder]  -->  [Content Library]
 Create/edit        Generate AI         Canva editor,        Browse, manage,
 curriculum         lessons from        activities,          publish final
 structure          curriculum          quizzes              content
```

### Step Details

**Step 1 -- Curriculum**
- Combines the current Curriculum Generator (AI wizard) and Curriculum Editor into one view
- Two sub-tabs: "Generate New" and "Edit Existing"
- Once a curriculum is created/selected, a "Next: Generate Lessons" button advances to Step 2

**Step 2 -- Lesson Generation**
- Shows the current NewLibrary lesson generator, pre-filtered to the curriculum from Step 1 (if coming from there)
- Includes the lesson picker checklist, bulk generation, quality dashboard
- "Next: Build Slides" button advances to Step 3

**Step 3 -- Slide Builder** (full-width, no padding)
- The Canva-style AdminLessonEditor takes over the content area
- Integrates: AI Activity Generator, Quiz Generator, slide management
- This is the main workspace where lessons get their visual slides, interactive activities, and quizzes
- "Finish & Save to Library" button advances to Step 4

**Step 4 -- Content Library**
- The existing CurriculumLibrary showing all completed content
- Browse, preview, publish, or go back to edit

### UI Components

**New file: `src/components/content-creator/ContentCreatorStepper.tsx`**
- Horizontal step indicator (numbered circles with labels connected by lines)
- Steps are clickable (users can jump back to previous steps)
- Current step highlighted with primary color, completed steps show checkmarks
- Replaces the sidebar entirely

**Modified: `src/pages/ContentCreatorDashboard.tsx`**
- Remove sidebar layout, use full-width layout with stepper at top
- State changes from `activeTab` to `currentStep: 1|2|3|4`
- Step 3 renders full-width (no padding), others get standard padding
- Pass `onNextStep` / `onPrevStep` callbacks to child components

**Modified: `src/components/content-creator/ContentCreatorSidebar.tsx`**
- Update the `ContentCreatorTab` type to `'curriculum' | 'lesson-generation' | 'slide-builder' | 'content-library'`
- Keep the file for type exports but the sidebar component itself becomes unused (replaced by stepper)

**New file: `src/components/content-creator/CurriculumStep.tsx`**
- Wraps CurriculumGeneratorWizard and CurriculumBuilder in a tabbed view
- "Generate New" tab and "Edit Existing" tab
- "Next Step" button at the bottom

**Modified: `src/components/content-creator/QuizGenerator.tsx`**
- Will be embedded inside the Slide Builder step rather than standalone

**Modified: `src/components/admin/lesson-builder/AdminLessonEditor.tsx`**
- Add the AI Activity Generator and Quiz Generator as panel/modal options within the builder toolbar
- Add "Save to Library" action

### Files Summary

| File | Action |
|---|---|
| `src/components/content-creator/ContentCreatorStepper.tsx` | **Create** -- Horizontal step navigation component |
| `src/components/content-creator/CurriculumStep.tsx` | **Create** -- Combined curriculum generate + edit view |
| `src/pages/ContentCreatorDashboard.tsx` | **Modify** -- Replace sidebar layout with stepper layout |
| `src/components/content-creator/ContentCreatorSidebar.tsx` | **Modify** -- Update types, sidebar component becomes optional |
| `src/components/admin/lesson-builder/AdminLessonEditor.tsx` | **Modify** -- Integrate quiz generator + activity generator into toolbar |

### Navigation Flow
- Steps are sequential but users can click any completed/current step to jump
- Each step has a clear "Next" CTA at the bottom
- Step 3 (Slide Builder) is full-bleed (no padding), the rest have standard `p-6` padding
- The top bar with user greeting + sign out remains above the stepper

