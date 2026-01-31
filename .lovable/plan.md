
# Student Experience Enhancement Plan
## Specialized Dashboards & AI Lesson Agent

---

## Overview

This plan enhances the three student dashboards (Playground, Academy, Professional) with level-specific features and adds an AI Lesson Agent that generates personalized daily lessons. It also improves the placement test completion experience with a "typing" summary effect.

---

## Part 1: Playground Dashboard (Kids) Enhancements

### 1.1 New Sidebar with 3D-Style Icons

**New File:** `src/components/student/kids/PlaygroundSidebar.tsx`

A vertical sidebar with large, colorful 3D-style icons:
- Home (house icon with shadow)
- Learn (book with sparkles)
- My Pet (paw print)
- Badges (trophy)
- Settings (gear)

Each icon uses:
- Drop shadow effects for 3D appearance
- Soft pastel gradients (rose-100 to pink-200, sky-100 to blue-200)
- Large touch targets (56x56px minimum)
- Bouncy hover animations via Framer Motion

### 1.2 Virtual Pet Widget

**New File:** `src/components/student/kids/VirtualPetWidget.tsx`

Features:
- A cute animated pet (selectable: Lion 🦁, Panda 🐼, Bunny 🐰)
- Pet mood states: Happy, Hungry, Sleepy (based on learning activity)
- "Feed Me" mechanic: "Learn 5 words to feed your pet!"
- Progress bar showing words learned today (0/5)
- Pet happiness meter (filled by completing lessons)
- Celebratory animation when pet is fed

**Database Change:** Add `pet_type` and `pet_happiness` columns to `student_profiles`

### 1.3 Color Palette Update

Apply soft pastel palette to PlaygroundDashboard:
```css
--playground-bg: #FFF5F5 (rose-50)
--playground-primary: #F9A8D4 (pink-300)
--playground-secondary: #93C5FD (blue-300)
--playground-accent: #86EFAC (green-300)
--playground-text: #6B21A8 (purple-800)
```

### 1.4 Updated PlaygroundDashboard.tsx

Integrate sidebar + pet widget alongside the existing KidsWorldMap:
- Left panel: PlaygroundSidebar (collapsed on mobile)
- Center: KidsWorldMap (adventure path)
- Right panel: VirtualPetWidget (floating on mobile)

---

## Part 2: Academy Dashboard (Teens) Enhancements

### 2.1 Daily Streak Component

**New File:** `src/components/student/academy/DailyStreakCard.tsx`

Features:
- Flame icon with current streak count (7 days)
- Weekly calendar dots showing activity (Mon-Sun)
- "Keep your streak alive!" motivational message
- Streak freeze indicator (if available)
- Animation: Flame grows larger at 7, 30, 100-day milestones

### 2.2 Enhanced Leaderboard

**Update:** `src/components/student/dashboards/AcademyDashboard.tsx`

Improvements to existing leaderboard:
- Add weekly/monthly/all-time tabs
- Show rank change indicators (up/down arrows)
- Highlight current user with glow effect
- "Challenge Friend" button for peer competition
- XP gains per day visualization

### 2.3 Social Lounge (Mocked Discord-Style UI)

**New File:** `src/components/student/academy/SocialLounge.tsx`

A Discord-inspired chat interface (mocked/read-only):
- Channel list sidebar: #general, #study-groups, #memes
- Message feed with avatar, username, timestamp, message
- Typing indicator animation
- Reaction buttons (emoji)
- "Coming Soon" overlay for actual chat functionality
- Purpose: Create FOMO and community feel, prepare for future chat integration

### 2.4 Updated Academy Color Tokens

```css
--academy-bg: #0f0f1a (dark mode default)
--academy-primary: #6366F1 (indigo-500)
--academy-secondary: #8B5CF6 (violet-500)
--academy-accent: #22D3EE (cyan-400)
--academy-surface: #1a1a2e (dark card)
```

---

## Part 3: Professional/Hub Dashboard (Adults) Enhancements

### 3.1 Skills Radar Chart

**New File:** `src/components/student/hub/SkillsRadarChart.tsx`

Using Recharts RadarChart (already installed):
- 6 skill axes: Speaking, Listening, Reading, Writing, Grammar, Vocabulary
- Current level vs. target level overlay
- Animated transitions when data updates
- Tooltip showing skill level (1-10) and improvement suggestions

Skills data structure:
```typescript
interface SkillData {
  skill: string;
  current: number;
  target: number;
}
```

### 3.2 Business Milestones Card

**New File:** `src/components/student/hub/BusinessMilestonesCard.tsx`

Features:
- List of professional achievements:
  - "Completed Business Email Course"
  - "Delivered First Presentation"
  - "Passed Interview Prep Module"
- Progress toward next milestone
- Certificate icons for completed courses
- Time investment tracker: "You've saved 4.5 hours this month"

### 3.3 Time Saved Analytics

**New File:** `src/components/student/hub/TimeSavedWidget.tsx`

Displays:
- Hours saved compared to traditional learning
- Efficiency metrics (lessons/hour, words/day)
- Comparative benchmark: "You're 23% faster than average"
- Weekly time investment graph

### 3.4 Dark Mode "Wealth Management" Aesthetic

Update HubDashboard with premium feel:
```css
--hub-bg: #111827 (gray-900)
--hub-surface: #1F2937 (gray-800)
--hub-primary: #10B981 (emerald-500)
--hub-accent: #3B82F6 (blue-500)
--hub-text: #F9FAFB (gray-50)
--hub-muted: #9CA3AF (gray-400)
```

Add subtle gradients, glass-morphism cards, and premium typography.

---

## Part 4: AI Lesson Agent Interface

### 4.1 Generate Today's Lesson Button

**New File:** `src/components/student/AILessonAgent.tsx`

Shared component adapted per student level:

**Button States:**
1. **Ready**: "Generate Today's Lesson" with sparkle icon
2. **Thinking**: Animated thinking state with typewriter messages
3. **Complete**: Lesson card revealed with slide-up animation

**Thinking Messages (rotated every 3 seconds):**
- "Analyzing your interests..."
- "Reviewing your previous mistakes..."
- "Crafting the perfect vocabulary..."
- "Building your personalized quest..."
- "Almost ready..."

### 4.2 Edge Function: generate-daily-lesson

**New File:** `supabase/functions/generate-daily-lesson/index.ts`

Logic:
1. Fetch student profile (interests, CEFR level, recent errors)
2. Query `student_lesson_progress` for weak areas
3. Call Lovable AI with personalized prompt
4. Return structured lesson with:
   - Topic (based on interests + level)
   - 5 Target Vocabulary words (with IPA, definition, example)
   - Quest (interactive task description)
   - Estimated duration

**Prompt Template:**
```
You are an ESL lesson designer. Create a personalized 15-minute lesson for a ${level} student (CEFR ${cefrLevel}) who enjoys ${interests.join(', ')}.

Their recent struggles include: ${weakAreas.join(', ')}.

Return JSON:
{
  "topic": "string",
  "tagline": "Short catchy subtitle",
  "vocabulary": [
    { "word": "string", "ipa": "string", "definition": "string", "example": "string" }
  ],
  "quest": {
    "title": "string",
    "description": "string",
    "type": "dialogue|quiz|writing|listening"
  },
  "estimated_minutes": 15
}
```

### 4.3 Lesson Card Display

**New File:** `src/components/student/DailyLessonCard.tsx`

Shows:
- Topic title with level-specific styling
- Tagline/subtitle
- 5 vocabulary words in collapsible accordion
- Quest card with "Start Quest" button
- Estimated time badge
- "Regenerate" button if user doesn't like the topic

Level-specific theming:
- **Playground**: Rounded corners (24px), bright colors, emoji accents
- **Academy**: Medium corners (12px), dark mode, gradient accents
- **Professional**: Subtle corners (8px), clean white/gray, green accent

---

## Part 5: Placement Test Completion Enhancement

### 5.1 Typing Summary Effect

**Update:** `src/components/onboarding/steps/LearningPathStep.tsx`

Before showing the learning path, add a personalized summary that "types out":

**Transition Flow:**
1. Assessment completes → brief loading state
2. AI generates personalized summary based on score
3. Text types out character by character (50ms delay)
4. After typing completes (3-5 seconds), fade in learning path preview
5. "Continue" button appears

**Summary Template Examples:**

**Playground (Score 80%):**
```
"Wow, you're a superstar! 🌟 You got 4 out of 5 questions right! 
You're really good at colors and animals. Let's work on some 
new words together in The Playground!"
```

**Academy (Score 60%):**
```
"Nice work! You scored 60% on the assessment. Your grammar 
is solid, but we can level up your vocabulary together. 
Welcome to The Academy - let's crush those goals! 🎯"
```

**Professional (Score 75%):**
```
"Assessment complete. Your score of 75% places you at 
CEFR B1 (Intermediate). Strengths: formal writing. 
Areas for growth: business idioms. Your personalized 
curriculum is ready."
```

### 5.2 Edge Function: generate-placement-summary

**New File:** `supabase/functions/generate-placement-summary/index.ts`

Calls Lovable AI to generate a 2-3 sentence personalized summary based on:
- Score percentage
- Student level (playground/academy/professional)
- Questions answered correctly vs incorrectly

---

## Part 6: Implementation Files Summary

### New Files to Create

| File | Purpose |
|------|---------|
| `src/components/student/kids/PlaygroundSidebar.tsx` | 3D-style icon sidebar for kids |
| `src/components/student/kids/VirtualPetWidget.tsx` | Interactive pet that encourages learning |
| `src/components/student/academy/DailyStreakCard.tsx` | Streak tracking component |
| `src/components/student/academy/SocialLounge.tsx` | Mocked Discord-style chat UI |
| `src/components/student/hub/SkillsRadarChart.tsx` | Recharts radar chart for skills |
| `src/components/student/hub/BusinessMilestonesCard.tsx` | Professional achievement tracker |
| `src/components/student/hub/TimeSavedWidget.tsx` | Efficiency metrics display |
| `src/components/student/AILessonAgent.tsx` | AI lesson generation interface |
| `src/components/student/DailyLessonCard.tsx` | Display card for generated lessons |
| `supabase/functions/generate-daily-lesson/index.ts` | AI daily lesson generator |
| `supabase/functions/generate-placement-summary/index.ts` | AI placement test summary |

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/student/dashboards/PlaygroundDashboard.tsx` | Integrate sidebar + pet widget |
| `src/components/student/dashboards/AcademyDashboard.tsx` | Add streak, enhanced leaderboard, social lounge |
| `src/components/student/dashboards/HubDashboard.tsx` | Add radar chart, milestones, time saved |
| `src/components/onboarding/steps/LearningPathStep.tsx` | Add typing summary effect |
| `src/contexts/RoleThemeContext.tsx` | Add student level theming |
| `supabase/config.toml` | Register new edge functions |

### Database Migration

Add to `student_profiles`:
```sql
ALTER TABLE student_profiles
ADD COLUMN pet_type TEXT DEFAULT 'lion',
ADD COLUMN pet_happiness INTEGER DEFAULT 50,
ADD COLUMN words_learned_today INTEGER DEFAULT 0,
ADD COLUMN current_streak INTEGER DEFAULT 0,
ADD COLUMN longest_streak INTEGER DEFAULT 0,
ADD COLUMN last_activity_date DATE;
```

---

## Part 7: Visual Reference

### Playground (Kids 4-11)
```text
┌─────────────────────────────────────────────┐
│  [🏠] [📚] [🐾] [🏆] [⚙️]   ← 3D icon bar    │
├─────────────────────────────────────────────┤
│                                             │
│   ┌─────────────────────────────────┐       │
│   │      ADVENTURE MAP              │       │
│   │   (KidsWorldMap component)      │       │
│   │                                 │       │
│   │   🦜 Pip says: "Let's go!"      │       │
│   │                                 │       │
│   │   ⭐ → ⭐ → ⭐ → 🔒              │       │
│   └─────────────────────────────────┘       │
│                                             │
│   ┌─────────────┐  ┌─────────────────┐      │
│   │ 🦁 My Pet   │  │ ✨ Today's      │      │
│   │ Feed me!    │  │    Lesson       │      │
│   │ [████░] 3/5 │  │ [Generate]      │      │
│   └─────────────┘  └─────────────────┘      │
└─────────────────────────────────────────────┘
```

### Academy (Teens 12-17)
```text
┌────┬──────────────────────────────────────────┐
│    │  Welcome, Alex! 🔥 7-day streak          │
│ 🏠 │                                          │
│    ├──────────────────────────────────────────┤
│ 📖 │  ┌──────────────────┐ ┌───────────────┐  │
│    │  │ CONTINUE LESSON  │ │ LEADERBOARD   │  │
│ 📅 │  │ Writing Workshop │ │ #1 Sarah 4520 │  │
│    │  │ 60% complete     │ │ #2 Mike  3890 │  │
│ 🏆 │  │ [Continue →]     │ │ #3 YOU   2340 │  │
│    │  └──────────────────┘ └───────────────┘  │
│ 👤 │                                          │
│    │  ┌──────────────────────────────────────┐│
│    │  │ 🎮 SOCIAL LOUNGE              [Soon] ││
│ 🌙 │  │ #general: "Who's studying tonight?" ││
│    │  └──────────────────────────────────────┘│
│    │                                          │
│    │  [✨ Generate Today's Lesson]            │
└────┴──────────────────────────────────────────┘
```

### Professional/Hub (Adults 18+)
```text
┌──────────────────────────────────────────────────┐
│  The Hub    Dashboard  Courses  Certificates     │
├──────────────────────────────────────────────────┤
│                                                  │
│  Good morning, Sarah                             │
│                                                  │
│  ┌───────────────────┐  ┌─────────────────────┐  │
│  │  SKILLS RADAR     │  │  TIME SAVED         │  │
│  │                   │  │  ⏱️ 4.5 hrs/month   │  │
│  │    Speaking       │  │  23% faster than    │  │
│  │   /‾‾‾\           │  │  average learner    │  │
│  │  /     \          │  └─────────────────────┘  │
│  │ Grammar  Listening│                           │
│  │  \     /          │  ┌─────────────────────┐  │
│  │   \___/           │  │  MILESTONES         │  │
│  │   Writing         │  │  ✓ Email Course     │  │
│  └───────────────────┘  │  ✓ Interview Prep   │  │
│                         │  ○ Public Speaking  │  │
│  [✨ Generate Today's   └─────────────────────┘  │
│      Lesson]                                     │
└──────────────────────────────────────────────────┘
```

---

## Part 8: Implementation Order

| Priority | Task | Effort |
|----------|------|--------|
| 1 | Database migration (pet columns, streak columns) | Small |
| 2 | Create AILessonAgent + DailyLessonCard shared components | Medium |
| 3 | Create generate-daily-lesson edge function | Medium |
| 4 | Create VirtualPetWidget for Playground | Medium |
| 5 | Update PlaygroundDashboard with sidebar + pet | Medium |
| 6 | Create DailyStreakCard + SocialLounge for Academy | Medium |
| 7 | Update AcademyDashboard with new components | Medium |
| 8 | Create SkillsRadarChart + BusinessMilestonesCard for Hub | Medium |
| 9 | Update HubDashboard with new components + dark mode | Medium |
| 10 | Create generate-placement-summary edge function | Small |
| 11 | Update LearningPathStep with typing effect | Medium |
| 12 | Update RoleThemeContext for student levels | Small |
| 13 | Testing & refinement | Medium |

