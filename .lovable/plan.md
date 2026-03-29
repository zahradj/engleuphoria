

## Upgrade Platform: Canva Builder, AI Activities, Context-Aware Tutor, Instructor Analytics

This is a large cross-cutting upgrade touching the lesson builder, AI tutor, content generation, and teacher dashboard. I'll break it into four phases.

---

### Phase 1: Canva-Style Drag-and-Drop Lesson Builder

**Current state**: The `EditorCanvas` supports slide types (image, video, quiz, poll, draw) with form-based editing — no visual canvas or drag-and-drop positioning.

**Upgrade**: Transform the editor into a visual canvas where elements (text blocks, images, shapes, activity widgets) can be dragged, resized, and layered on a 1920x1080 slide.

**Files to create/modify**:
- **Create** `src/components/admin/lesson-builder/canvas/CanvasEditor.tsx` — Main canvas with 1920x1080 scaled viewport, element rendering, selection, and transform handles
- **Create** `src/components/admin/lesson-builder/canvas/CanvasElement.tsx` — Draggable/resizable wrapper using pointer events for move + resize
- **Create** `src/components/admin/lesson-builder/canvas/ElementToolbar.tsx` — Left sidebar with draggable element types (Text, Image, Shape, Quiz, Matching, Fill-blank, Audio)
- **Create** `src/components/admin/lesson-builder/canvas/PropertiesPanel.tsx` — Right panel for editing selected element properties (font, color, size, quiz options)
- **Update** `src/components/admin/lesson-builder/types.ts` — Add `CanvasElement` type with `x, y, width, height, rotation, zIndex, elementType, content`
- **Update** `src/components/admin/lesson-builder/EditorCanvas.tsx` — Replace form-based editor with `CanvasEditor` import
- **Update** `src/components/admin/lesson-builder/AdminLessonEditor.tsx` — Wire new canvas into the existing editor shell

**Key technical decisions**:
- Pure pointer-event based drag (no external DnD library needed)
- Scale transform approach: `transform: scale(containerWidth/1920)` with `transform-origin: top left`
- Elements stored as JSON array per slide in the existing `Slide` type

---

### Phase 2: AI Auto-Generation of Activities

**Current state**: The `studio-ai-copilot` generates markdown lessons. The `quiz-generator` creates MCQ quizzes. No auto-generation of interactive activities (matching, fill-blank, drag-drop, sorting).

**Upgrade**: Add an "AI Generate Activities" button that takes lesson content and produces structured interactive activities automatically.

**Files to create/modify**:
- **Create** `supabase/functions/ai-activity-generator/index.ts` — Edge function that accepts lesson content + activity type preferences, returns structured activity JSON (matching pairs, fill-in-blank sentences, drag-drop categories, sorting sequences) using Lovable AI gateway
- **Create** `src/components/admin/lesson-builder/AIActivityGenerator.tsx` — UI button + modal that lets creators select activity types and generates them from lesson content
- **Update** `src/components/admin/lesson-builder/types.ts` — Add activity element types: `matching`, `fill-blank`, `drag-drop`, `sorting`, `sentence-builder`
- **Update** `src/components/content-creator/CreatorStudioAITools.tsx` — Add "Generate Activities" to the Magic Wand toolset

**Edge function design**: Uses tool-calling to extract structured output (activity items with answers, distractors, instructions) rather than free-form text.

---

### Phase 3: Enhanced Context-Aware AI Tutor

**Current state**: The `ai-tutor` edge function uses OpenAI directly (not Lovable AI gateway), sends only CEFR level and recent 20 messages as context. No awareness of student's lesson history, weak areas, assignments, or mistake patterns.

**Upgrade**: Make the tutor context-aware by injecting student profile data (recent lessons, skill scores, mistake history, pending assignments) into the system prompt, and migrate to Lovable AI gateway.

**Files to modify**:
- **Update** `supabase/functions/ai-tutor/index.ts` — Switch from direct OpenAI to Lovable AI gateway (`https://ai.gateway.lovable.dev/v1/chat/completions` with `LOVABLE_API_KEY`). Before calling AI, fetch student context: recent `interactive_lesson_progress`, `student_skills` scores, `homework_submissions` with grades, and `ai_tutoring_sessions` mistake patterns. Inject this as a "Student Context" block in the system prompt.
- **Update** `src/hooks/useAITutor.ts` — Pass additional context (current lesson topic, recent mistakes) when calling the edge function
- **Update** `src/components/ai/AITutorInterface.tsx` — Show a "Context" indicator showing what the tutor knows about the student, add streaming support for real-time responses

**Context injection example**:
```
Student Context:
- Skill Scores: Vocabulary 7/10, Grammar 4/10, Fluency 6/10
- Recent Lessons: "Business Negotiations" (completed), "Email Writing" (in progress)
- Weak Areas: Past tense irregular verbs, conditional sentences
- Pending Homework: 2 assignments due
- Mistake History: commonly confuses "their/there/they're"
```

---

### Phase 4: Instructor Analytics & Reporting Dashboard

**Current state**: `ReportsTab.tsx` exists but uses hardcoded mock data (3 fake students, static metrics).

**Upgrade**: Replace mock data with real Supabase queries showing actual student progress, engagement, and completion rates.

**Files to create/modify**:
- **Create** `src/components/teacher/analytics/StudentProgressChart.tsx` — Recharts line/bar chart showing student progress over time from `interactive_lesson_progress`
- **Create** `src/components/teacher/analytics/EngagementMetrics.tsx` — Cards showing real attendance rate, homework completion rate, average quiz scores from actual DB data
- **Create** `src/components/teacher/analytics/ClassOverview.tsx` — Summary grid with total students, lessons completed, average CEFR progress
- **Create** `src/hooks/useTeacherAnalytics.ts` — Hook that queries `sessions`, `homework_submissions`, `interactive_lesson_progress`, `student_skills` filtered by the teacher's assigned students
- **Update** `src/components/teacher/ReportsTab.tsx` — Replace hardcoded data with real components and the analytics hook
- **Migration**: Create a DB function `get_teacher_student_stats(teacher_id UUID)` that aggregates student metrics for a given teacher

---

### Database Changes

**Migration 1**: `get_teacher_student_stats` function
```sql
CREATE OR REPLACE FUNCTION public.get_teacher_student_stats(p_teacher_id UUID)
RETURNS TABLE(
  student_id UUID, student_name TEXT, lessons_completed BIGINT,
  avg_score NUMERIC, homework_completion_rate NUMERIC, last_active TIMESTAMPTZ
) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = 'public' AS $$
  -- Aggregates from sessions, progress, and homework tables
  -- filtered by teacher's students
$$;
```

---

### Summary

| Phase | Files | Scope |
|---|---|---|
| 1. Canva Builder | 5 new + 3 modified | Visual drag-and-drop canvas editor |
| 2. AI Activities | 1 edge fn + 2 components + 1 type update | Auto-generate matching/fill-blank/sorting |
| 3. Context Tutor | 1 edge fn + 1 hook + 1 component | Student-aware AI with Lovable AI gateway |
| 4. Analytics | 3 new components + 1 hook + 1 update + 1 migration | Real data teacher dashboard |

