

# AI Curriculum & Lesson Generator -- Standalone Module

## Current State Analysis

Your platform already has extensive curriculum and lesson generation infrastructure:

**Existing Components:**
- `CurriculumBuilder` -- hierarchical track/level/lesson viewer
- `CurriculumLibrary` -- lesson grid with filters, preview, edit, publish
- `NewLibrary` (AI Generator) -- lesson generation with unified pipeline (content + games + images)
- `LessonEditorPage` + `SlideEditor` -- slide-level editing
- `LessonPicker` -- master curriculum checklist
- `BulkLessonGenerator` -- batch generation
- `CurriculumProgressDashboard` + `CurriculumExportDashboard`
- `QualityDashboard`, `GenerationHistoryPanel`

**Existing Edge Functions (17+):** `n8n-bridge`, `curriculum-generator`, `curriculum-expert-agent`, `interactive-lesson-generator`, `generate-iron-game`, `batch-generate-lesson-images`, etc.

**Existing Database:** `tracks`, `curriculum_levels`, `curriculum_units`, `curriculum_lessons` tables with full hierarchy. Master curriculum data map in `src/data/masterCurriculum.ts`.

**Current Role System:** `app_role` enum has `student | teacher | admin`. No `content_creator` role exists yet.

## What Needs to Be Built

Rather than rebuilding what exists, the plan is to:
1. Add a `content_creator` role to the system
2. Create a dedicated Content Creator dashboard page that consolidates existing components into the 6-section layout requested
3. Add a **Curriculum Generator** wizard (AI generates units/lessons structure from scratch)
4. Add a **Quiz Generator** tab
5. Wire everything with proper role-based access

---

## Implementation Plan

### Step 1: Add `content_creator` Role

**Database Migration:**
- Alter `app_role` enum to add `'content_creator'`
- Update `has_role` and `get_user_role` functions to handle the new role
- Add RLS policies so content creators can access curriculum tables

### Step 2: Create Content Creator Dashboard Page

**New file:** `src/pages/ContentCreatorDashboard.tsx`

A standalone page at route `/content-creator` with its own sidebar containing the 6 sections:
1. **Curriculum Generator** -- new AI-powered wizard
2. **Curriculum Editor** -- reuses existing `CurriculumBuilder`
3. **Lesson Generator** -- reuses existing `NewLibrary` (AI Generator)
4. **Lesson Editor** -- reuses existing `CurriculumLibrary` (with preview/edit)
5. **Quiz Generator** -- new component
6. **Content Library** -- reuses existing `CurriculumLibrary` filtered view

**New files:**
- `src/components/content-creator/ContentCreatorSidebar.tsx`
- `src/components/content-creator/CurriculumGeneratorWizard.tsx`
- `src/components/content-creator/QuizGenerator.tsx`

### Step 3: Curriculum Generator Wizard

A multi-step form where the Content Creator inputs:
- Student level (Beginner / Elementary / Pre-Intermediate / Intermediate)
- Age group (Kids / Teens / Adults)
- Number of units
- Number of lessons per unit

Calls the existing `curriculum-expert-agent` edge function (which already uses Lovable AI Gateway) to generate:
- Units with titles
- Lesson titles per unit
- Learning objectives, grammar focus, vocabulary themes

Output is displayed in a structured tree view, editable inline, and saveable to `curriculum_units` + `curriculum_lessons` tables.

### Step 4: Quiz Generator

A component that:
- Lets the Content Creator select a lesson or enter a topic + level
- Calls an edge function to generate 5-question quizzes with:
  - Multiple choice, fill-in-the-blank, matching, sentence ordering
  - Correct answers + explanations
- Saves quiz data as structured JSON in the lesson content or a dedicated field

**New edge function:** `quiz-generator` -- uses Lovable AI Gateway with tool calling for structured output.

### Step 5: Route & Access Control

- Add lazy-loaded route `/content-creator` in `App.tsx`
- Protect with `ImprovedProtectedRoute` requiring `content_creator` role
- Add redirect from `Dashboard.tsx` for content_creator role
- Update `AdminDashboard` login check to also allow content_creator role where appropriate

### Step 6: Content Library View

Reuses `CurriculumLibrary` with additional filters:
- Filter by level, unit, lesson
- Show generated content organized hierarchically
- Export as JSON for platform integration

---

## Technical Architecture

```text
/content-creator (new route)
├── ContentCreatorDashboard.tsx (new page)
├── ContentCreatorSidebar.tsx (new - 6 tabs)
├── CurriculumGeneratorWizard.tsx (new - AI wizard)
├── QuizGenerator.tsx (new - quiz creation)
├── CurriculumBuilder (existing - reused)
├── NewLibrary (existing - reused as Lesson Generator)
├── CurriculumLibrary (existing - reused as Lesson Editor + Content Library)
└── quiz-generator/ (new edge function)

Database Changes:
├── ALTER TYPE app_role ADD VALUE 'content_creator'
├── RLS policies for content_creator on curriculum tables
└── No new tables needed (uses existing curriculum_lessons.content JSON)
```

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/pages/ContentCreatorDashboard.tsx` | Create |
| `src/components/content-creator/ContentCreatorSidebar.tsx` | Create |
| `src/components/content-creator/CurriculumGeneratorWizard.tsx` | Create |
| `src/components/content-creator/QuizGenerator.tsx` | Create |
| `supabase/functions/quiz-generator/index.ts` | Create |
| `src/App.tsx` | Add route |
| `src/pages/Dashboard.tsx` | Add content_creator redirect |
| Database migration | Add content_creator to app_role enum + RLS |

