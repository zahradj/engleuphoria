

## Gemini "2026 Powerhouse" Feature Set — Full Implementation Plan

This plan implements all four major features described by Gemini: the Immersive Student Lesson Reader, Netflix-style Materials Gallery, Enhanced Skill Radar, and Mastery Badge system.

---

### What Already Exists
- **Creator Studio** with split-screen editor, Focus Mode, AI generation, cover image generation, "Magic Wand" AI tools, readability meter, and `MasteryBadge` component
- **SkillsRadarChart** with Recharts radar, `student_skills` table, `useStudentSkills` hook, current/target comparison
- **LessonPlayer** with slide-based playback, quiz scoring, XP, and `LessonCompletionModal` with confetti
- **curriculum_lessons** table storing published content from Creator Studio

### What Needs to Be Built

---

### Phase 1: Immersive Student Lesson Reader Page

A new `/lesson/:id` route and `ImmersiveLessonReader` component — the "Focus Sanctuary."

**New file: `src/pages/student/LessonReaderPage.tsx`**
- Route wrapper that fetches `curriculum_lessons` by ID via Supabase
- Passes lesson data to `ImmersiveLessonReader`

**New file: `src/components/student/lesson-reader/ImmersiveLessonReader.tsx`**
- Full-screen centered narrow column (max-w-2xl) with large 18-20px body text
- **Ambient glow background**: CSS mesh gradient that shifts color based on track (Mint/kids, Indigo/teens, Gold/adults)
- **Glassmorphic hero header**: lesson title, CEFR level badge, estimated reading time (word count / 200 wpm)
- Renders markdown content (reuse `markdownToHtml` from `CreatorStudioPreview`)
- **Vertical scroll progress bar** on the left edge
- **Floating bottom toolbar**: Listen (TTS via existing `useTextToSpeech`), Theme toggle, Font size toggle
- **Quiz Reveal**: Hidden until scroll reaches end → confetti + "Challenge the Quiz" button appears → Bento card quiz UI with green glow/red shake feedback
- On quiz completion → triggers `LessonCompletionModal` + skill XP update

**New file: `src/components/student/lesson-reader/FloatingToolbar.tsx`**
- Centered bottom toolbar with Listen, Theme, Font Size buttons
- Glass panel styling

**New file: `src/components/student/lesson-reader/QuizReveal.tsx`**
- Intersection Observer triggers reveal animation
- Bento-card MCQ layout with correct (glow green) / wrong (shake + hint) feedback
- XP award on completion

**New file: `src/components/student/lesson-reader/WordInsightPopup.tsx`**
- `onMouseUp` selection handler → detects highlighted word
- Glassmorphic popup showing: meaning, pronunciation (phonetic), example sentence
- Uses existing `studio-ai-copilot` edge function with a new `mode: 'word-insight'`

**Update: `src/App.tsx`** — Add route: `<Route path="/lesson/:id" element={<LessonReaderPage />} />`

**Update: `supabase/functions/studio-ai-copilot/index.ts`** — Add `word-insight` mode that returns `{ meaning, pronunciation, example }` for a given word + context

---

### Phase 2: Netflix-Style Materials Gallery

Replace or augment the student's lesson browsing with large glassmorphic vertical cards.

**New file: `src/components/student/MaterialsGallery.tsx`**
- Fetches published `curriculum_lessons` filtered by student's track
- Renders responsive grid of `LessonCard` components
- Search/filter by level, track

**New file: `src/components/student/LessonCard.tsx`**
- Large vertical card with glassmorphic overlay
- Cover image from `ai_metadata.coverImageUrl` or gradient fallback
- Track icon: 🚀 Playground, 🎮 Academy, 💼 Professional
- CEFR level badge, title, estimated reading time
- Thin neon progress bar at bottom (from `student_lesson_progress` if exists)
- Click navigates to `/lesson/:id`

**Update: Student dashboards** (HubDashboard, AcademyDashboard, PlaygroundDashboard) — Add a "Lessons Library" section using `MaterialsGallery`

---

### Phase 3: Enhanced Skill Radar ("Aurora Radar")

Upgrade the existing `SkillsRadarChart` with premium visuals and comparison mode.

**Update: `src/components/student/hub/SkillsRadarChart.tsx`**
- Replace flat fills with SVG `<defs>` radial/linear gradients (`#8B5CF6` → `#D946EF` at 30% opacity)
- Add "grow from center" animation using Framer Motion (scale 0→1 on mount)
- Add "Show Global Average" toggle — overlays a semi-transparent grey radar
- Add 100% "ripple" pulse animation on axes where `current === 10` (CSS keyframe)
- Dark mode: deep indigo web with neon-cyan pulses; Light mode: slate-grey with ink blue fills
- Tooltip: "You are in the top X% of users this week" (computed or static initially)

**New DB function**: `get_global_skill_averages()` — returns average scores across all students for the 5 pillars (for the comparison overlay)

---

### Phase 4: Mastery Badge + Reward System

Enhance the completion flow so finishing a content-creator lesson triggers a themed badge.

**Update: `src/components/content-creator/MasteryBadge.tsx`**
- Add 3D rotation animation (Framer Motion `rotateY`)
- Dark mode: neon glow medal; Light mode: metallic gold coin
- Accept `skillName` prop to show "You've mastered {topic}"

**Update: `src/components/student/lesson-reader/QuizReveal.tsx`**
- On quiz pass → show rotating 3D `MasteryBadge` + message "Your Skill Radar has been updated"
- Call `useStudentSkills.refresh()` to update radar

**Update: `src/hooks/useStudentSkills.ts`**
- Add `incrementSkill(skillName, amount)` function that UPSERTs `student_skills`

---

### Database Changes

**Migration 1**: Add `get_global_skill_averages` function
```sql
CREATE OR REPLACE FUNCTION public.get_global_skill_averages()
RETURNS TABLE(skill_name text, avg_score numeric)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = 'public'
AS $$
  SELECT skill_name, ROUND(AVG(current_score), 1)
  FROM student_skills
  GROUP BY skill_name;
$$;
```

---

### Files Summary

| File | Action |
|---|---|
| `src/pages/student/LessonReaderPage.tsx` | Create — route wrapper |
| `src/components/student/lesson-reader/ImmersiveLessonReader.tsx` | Create — main reader |
| `src/components/student/lesson-reader/FloatingToolbar.tsx` | Create — bottom toolbar |
| `src/components/student/lesson-reader/QuizReveal.tsx` | Create — quiz reveal + bento cards |
| `src/components/student/lesson-reader/WordInsightPopup.tsx` | Create — AI word popup |
| `src/components/student/MaterialsGallery.tsx` | Create — Netflix card grid |
| `src/components/student/LessonCard.tsx` | Create — glassmorphic lesson card |
| `src/components/student/hub/SkillsRadarChart.tsx` | Update — aurora gradients, comparison, animation |
| `src/components/content-creator/MasteryBadge.tsx` | Update — 3D rotation, theme-aware |
| `src/hooks/useStudentSkills.ts` | Update — add `incrementSkill` |
| `supabase/functions/studio-ai-copilot/index.ts` | Update — add `word-insight` mode |
| `src/App.tsx` | Update — add `/lesson/:id` route |
| Student dashboards (Hub, Academy, Playground) | Update — add Materials Gallery section |
| Database migration | Create — `get_global_skill_averages` function |

