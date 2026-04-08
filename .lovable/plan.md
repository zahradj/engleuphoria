

## Plan: Systematic ESL Curriculum Engine

This plan builds the "Slowly-Slowly" 3-Lesson Cycle engine on top of your existing database tables, AI Wizard, and content creator pipeline. It adds phonics tracking, the visual roadmap, and the Map of Sounds — without duplicating existing infrastructure.

### What Already Exists (No Duplication)

- **curriculum_units** — has `title`, `unit_number`, `vocabulary_themes`, `grammar_focus`, `skills_focus`, `cefr_level`, `age_group`
- **curriculum_lessons** — has `unit_id`, `title`, `difficulty_level`, `target_system`, `content` (JSON), `sequence_order`
- **curriculum_levels** — CEFR levels, age groups, tracks
- **interactive_lesson_progress** — completion tracking per student
- **AI Wizard** — `generateTopicPackWithAI` + `CurriculumGeneratorWizard` already generate structured curricula

### What Needs to Be Built

---

### Step 1 — Database: Add Phonics Tracking + Lesson Cycle Metadata

**Migration 1**: Add columns to `curriculum_lessons` for the 3-lesson cycle:

```sql
ALTER TABLE curriculum_lessons
  ADD COLUMN IF NOT EXISTS cycle_type TEXT CHECK (cycle_type IN ('discovery', 'ladder', 'bridge')),
  ADD COLUMN IF NOT EXISTS phonics_focus TEXT,
  ADD COLUMN IF NOT EXISTS vocabulary_list JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS grammar_pattern TEXT,
  ADD COLUMN IF NOT EXISTS skills_focus TEXT[] DEFAULT '{}';
```

**Migration 2**: Create `student_phonics_progress` table:

```sql
CREATE TABLE student_phonics_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phoneme TEXT NOT NULL,
  mastered_at TIMESTAMPTZ,
  lesson_id UUID REFERENCES curriculum_lessons(id) ON DELETE SET NULL,
  mastery_level TEXT DEFAULT 'unseen' CHECK (mastery_level IN ('unseen','introduced','practiced','mastered')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, phoneme)
);
ALTER TABLE student_phonics_progress ENABLE ROW LEVEL SECURITY;
```

With RLS policies for authenticated students to read/update their own rows and admins to manage all.

---

### Step 2 — AI Wizard: Enforce the "Slowly-Slowly" 3-Lesson Cycle

Modify the `CurriculumGeneratorWizard.tsx` and the `curriculum-expert-agent` Edge Function prompt to enforce the cycle structure:

- Every unit generates exactly 3 lessons:
  - **Lesson 1 (Discovery)**: Phonics (short sound) + 5 nouns. Skills: Listening/Reading.
  - **Lesson 2 (Ladder)**: Verbs + Adjectives. Sentence Ladders. Skills: Writing/Grammar.
  - **Lesson 3 (Bridge)**: Questions + Real-Life Use. Speaking/Fluency.
- Cognitive load rule: max 1 phoneme + 5 new words per lesson.
- Scaffolding: each lesson progresses from Recognition → Production.

The AI prompt will include structured output requirements for `cycle_type`, `phonics_focus`, `vocabulary_list`, and `grammar_pattern` per lesson.

Update the save logic in `CurriculumGeneratorWizard` to persist these new fields when writing to `curriculum_lessons`.

---

### Step 3 — UI: Unit Roadmap ("Islands" Map)

Create `src/components/student/curriculum/UnitRoadmap.tsx`:

- Visual map showing units as themed "islands" connected by a path
- Each island shows 3 lesson dots (1-2-3) with completion states:
  - Grey = locked, Blue = available, Gold = completed
- Pulls data from `curriculum_units` + `curriculum_lessons` + `interactive_lesson_progress`
- Responsive: scrollable horizontal on mobile, full map on desktop
- Uses the project's glassmorphic card style with the existing color coding (Amber/Indigo/Slate per demographic)

---

### Step 4 — UI: Map of Sounds (Phonics Dashboard)

Create `src/components/student/curriculum/MapOfSounds.tsx`:

- Grid of phoneme cards (26 letters + common digraphs like /sh/, /ch/, /th/)
- Each card shows:
  - The phoneme symbol (e.g., `/a/`)
  - Status indicator: Grey (unseen) → Blue (introduced) → Silver (practiced) → Gold (mastered)
  - Animation: gold shimmer when mastered
- Data from `student_phonics_progress` table
- Organized by vowels vs consonants sections
- Includes a progress bar showing "X of Y sounds mastered"

---

### Step 5 — UI: Lesson Preview ("Teacher Guide" View)

Create `src/components/content-creator/LessonCyclePreview.tsx`:

- Displays the AI Wizard's generated lesson with:
  - Cycle type badge (Discovery / Ladder / Bridge)
  - Phonics focus highlight
  - Vocabulary list (max 5 words with definitions)
  - Grammar pattern display
  - Scripted intro text
  - Interactive activity instructions
  - "Real-World Mission" section
- Accessible from the Content Creator pipeline (Step 2: Slide Builder) as a panel/tab

---

### Step 6 — Integration: Wire into Student Dashboard

- Add "My Learning Path" tab to the student dashboard that renders `UnitRoadmap`
- Add "Map of Sounds" as a widget/tab on the student dashboard (kids system only)
- When a lesson is completed via `interactive_lesson_progress`, trigger an upsert to `student_phonics_progress` to advance the phoneme mastery level

---

### Files to Create
- `src/components/student/curriculum/UnitRoadmap.tsx`
- `src/components/student/curriculum/MapOfSounds.tsx`
- `src/components/student/curriculum/PhonemeCard.tsx`
- `src/components/content-creator/LessonCyclePreview.tsx`
- `src/hooks/useStudentPhonicsProgress.ts`
- `src/data/phonemeMap.ts` (phoneme definitions + ordering)

### Files to Modify
- `supabase/functions/curriculum-expert-agent/index.ts` — update prompt for 3-lesson cycle
- `src/components/content-creator/CurriculumGeneratorWizard.tsx` — save new fields
- `src/components/student/LearningPathTab.tsx` — integrate UnitRoadmap
- Student dashboard component — add Map of Sounds widget

### Database Migrations
- Add `cycle_type`, `phonics_focus`, `vocabulary_list`, `grammar_pattern`, `skills_focus` to `curriculum_lessons`
- Create `student_phonics_progress` table with RLS

