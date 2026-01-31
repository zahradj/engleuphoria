

# Plan: Enhanced Student Profile Fields for AI Personalization

## Summary

This plan adds three new fields to the student experience that will significantly improve AI lesson personalization:

| Field | Purpose | Captured In |
|-------|---------|-------------|
| `learning_style` | Visual, Auditory, or Kinesthetic | Onboarding Step 2 (new) |
| `mistake_history` | Words the student got wrong | Lessons/Quizzes (automatic) |
| `weekly_goal` | Short-term goal like "Prepare for interview" | Dashboard widget (new) |

**Note:** The `learning_style` column already exists in the database but is not being captured during onboarding. This plan connects all the pieces.

---

## Part 1: Capture Learning Style During Onboarding

### 1.1 New Onboarding Step: Learning Style Quiz

**New File:** `src/components/onboarding/steps/LearningStyleStep.tsx`

A fun, interactive step between "Interests" and "Quick Check" with 3-4 simple questions that determine learning style.

**Questions:**
1. "When learning something new, you prefer to:"
   - Watch videos or diagrams (Visual)
   - Listen to explanations or podcasts (Auditory)
   - Try it yourself hands-on (Kinesthetic)

2. "You remember things best by:"
   - Seeing them written down (Visual)
   - Hearing them spoken (Auditory)
   - Doing or practicing them (Kinesthetic)

3. "In class, you enjoy:"
   - Pictures, charts, and colors (Visual)
   - Discussions and music (Auditory)
   - Games, role-play, and movement (Kinesthetic)

The most frequent selection becomes the learning style.

**Level-specific UI:**
- **Playground:** Big colorful icons, playful animations
- **Academy:** Modern card-based selection with gaming vibes
- **Professional:** Clean, minimalist selection interface

### 1.2 Update Onboarding Flow

**File to Update:** `src/components/onboarding/StudentOnboardingFlow.tsx`

Changes:
- Add new step "Learning Style" between "Interests" and "Quick Check"
- Update steps array: `['Welcome', 'Interests', 'Learning Style', 'Quick Check', 'Your Path']`
- Store `learning_style` in `OnboardingData`
- Save to `student_profiles.learning_style` on completion

---

## Part 2: Mistake History Tracking

### 2.1 Database Migration

**Add new column to `student_profiles`:**

```sql
ALTER TABLE public.student_profiles
ADD COLUMN IF NOT EXISTS mistake_history JSONB DEFAULT '[]';

COMMENT ON COLUMN student_profiles.mistake_history IS 
'Array of word/phrase mistakes for AI prioritization';
```

**Mistake History Structure:**
```json
[
  {
    "word": "accommodate",
    "context": "vocabulary_quiz",
    "timestamp": "2026-01-31T10:30:00Z",
    "error_type": "spelling",
    "correct_answer": "accommodate",
    "student_answer": "accomodate"
  },
  {
    "word": "their/there",
    "context": "grammar_exercise",
    "timestamp": "2026-01-30T14:15:00Z",
    "error_type": "homophone",
    "correct_answer": "their",
    "student_answer": "there"
  }
]
```

### 2.2 Create Mistake Tracking Hook

**New File:** `src/hooks/useMistakeTracker.ts`

```typescript
interface MistakeEntry {
  word: string;
  context: string;
  timestamp: string;
  error_type: 'spelling' | 'grammar' | 'vocabulary' | 'pronunciation' | 'homophone';
  correct_answer: string;
  student_answer: string;
}

const useMistakeTracker = () => {
  const recordMistake = async (mistake: Omit<MistakeEntry, 'timestamp'>) => {
    // Append to mistake_history array
    // Keep last 50 mistakes (rolling window)
  };

  const getMistakes = async (): Promise<MistakeEntry[]> => {
    // Return current mistakes for AI analysis
  };

  const getWeakAreas = (): string[] => {
    // Analyze mistakes and return common patterns
  };

  return { recordMistake, getMistakes, getWeakAreas };
};
```

### 2.3 Integration Points

Update these components to record mistakes:
- `QuickAssessmentStep.tsx` - Record wrong answers
- `DailyLessonCard.tsx` - Record quiz mistakes
- Future lesson components - Any interactive exercises

---

## Part 3: Weekly Goal Widget

### 3.1 Database Migration

**Add new column to `student_profiles`:**

```sql
ALTER TABLE public.student_profiles
ADD COLUMN IF NOT EXISTS weekly_goal TEXT,
ADD COLUMN IF NOT EXISTS weekly_goal_set_at TIMESTAMPTZ;
```

### 3.2 Weekly Goal Widget Component

**New File:** `src/components/student/WeeklyGoalWidget.tsx`

Features:
- Display current weekly goal
- "Set Goal" button opens selection modal
- Level-specific goal suggestions

**Goal Suggestions by Level:**

**Playground (Kids):**
- Learn 10 new words
- Complete 3 lessons
- Help Pip find his friends
- Earn 500 stars

**Academy (Teens):**
- Improve my speaking confidence
- Prepare for an English test
- Understand song lyrics better
- Chat with online friends in English

**Professional (Adults):**
- Prepare for a job interview
- Write professional emails confidently
- Present in English at work
- Travel conversation skills
- Negotiate in English

### 3.3 Modal for Setting Goals

**New File:** `src/components/student/WeeklyGoalModal.tsx`

- Pre-set goal buttons (from suggestions above)
- Custom goal text input
- Save updates `weekly_goal` and `weekly_goal_set_at`
- Toast confirmation on save

---

## Part 4: AI Integration

### 4.1 Update generate-daily-lesson Edge Function

**File:** `supabase/functions/generate-daily-lesson/index.ts`

Changes:
1. Accept `learning_style` parameter
2. Accept `mistake_history` parameter
3. Accept `weekly_goal` parameter
4. Update AI prompt to incorporate these fields

**Updated Prompt Template:**
```
Create a personalized 15-minute English lesson for ${levelDescription}.

Student Details:
- CEFR Level: ${cefrLevel}
- Interests: ${interestsList}
- Learning Style: ${learningStyle} (prioritize ${learningStyleActivities})
- Weekly Goal: ${weeklyGoal}
- Recent Mistakes to Review: ${mistakesList}

Instructions:
1. Include at least 2 vocabulary words from their mistake history
2. Design activities that match their learning style:
   - Visual: Include diagrams, images, or visual mnemonics
   - Auditory: Include pronunciation practice and listening exercises
   - Kinesthetic: Include role-play, interactive games, or movement
3. Align the lesson topic with their weekly goal when possible
```

### 4.2 Update AILessonAgent Component

**File:** `src/components/student/AILessonAgent.tsx`

Changes:
1. Fetch `learning_style`, `weekly_goal`, and `mistake_history` from student profile
2. Pass these to the edge function
3. Display mistake review section in generated lesson

---

## Part 5: Dashboard Integration

### 5.1 Add Weekly Goal Widget to Dashboards

**Files to Update:**
- `PlaygroundDashboard.tsx` - Add kid-friendly goal widget
- `AcademyDashboard.tsx` - Add motivational goal tracker
- `HubDashboard.tsx` - Add professional goal widget

### 5.2 Display Learning Style Badge

Show learning style badge in dashboard header:
- Visual (eye icon)
- Auditory (headphones icon)  
- Kinesthetic (hand icon)

---

## Implementation Files Summary

### New Files to Create

| File | Purpose |
|------|---------|
| `src/components/onboarding/steps/LearningStyleStep.tsx` | Learning style quiz during onboarding |
| `src/hooks/useMistakeTracker.ts` | Hook for recording and retrieving mistakes |
| `src/components/student/WeeklyGoalWidget.tsx` | Goal display and setting widget |
| `src/components/student/WeeklyGoalModal.tsx` | Modal for selecting/entering goals |

### Files to Update

| File | Changes |
|------|---------|
| `src/components/onboarding/StudentOnboardingFlow.tsx` | Add learning style step, update data flow |
| `src/components/onboarding/steps/QuickAssessmentStep.tsx` | Record mistakes when answers are wrong |
| `supabase/functions/generate-daily-lesson/index.ts` | Accept new parameters, update AI prompt |
| `src/components/student/AILessonAgent.tsx` | Fetch and pass student data to edge function |
| `src/components/student/dashboards/PlaygroundDashboard.tsx` | Add goal widget |
| `src/components/student/dashboards/AcademyDashboard.tsx` | Add goal widget |
| `src/components/student/dashboards/HubDashboard.tsx` | Add goal widget |

### Database Migration

```sql
-- Add mistake_history and weekly_goal columns
ALTER TABLE public.student_profiles
ADD COLUMN IF NOT EXISTS mistake_history JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS weekly_goal TEXT,
ADD COLUMN IF NOT EXISTS weekly_goal_set_at TIMESTAMPTZ;

-- Index for efficient mistake queries
CREATE INDEX IF NOT EXISTS idx_student_profiles_mistake_history 
ON student_profiles USING GIN (mistake_history);

-- Add comment for documentation
COMMENT ON COLUMN student_profiles.mistake_history IS 
'Rolling array of last 50 mistakes for AI lesson personalization';
COMMENT ON COLUMN student_profiles.weekly_goal IS 
'Student-set short-term learning goal (e.g., Prepare for job interview)';
```

---

## User Flow: How It Works

```text
NEW STUDENT ONBOARDING
     |
     v
[Step 1: Welcome] --> [Step 2: Interests] --> [Step 3: Learning Style Quiz]
                                                   |
                                                   v
                                         Determines: Visual/Auditory/Kinesthetic
                                                   |
                                                   v
                            [Step 4: Quick Check] --> Records any wrong answers
                                                        to mistake_history
                                                   |
                                                   v
                            [Step 5: AI Learning Path] --> Uses learning_style
                                                   |
                                                   v
                            [Dashboard] --> Set Weekly Goal
                                                   |
                                                   v
                     [Generate Daily Lesson] --> AI uses:
                                                - interests
                                                - learning_style
                                                - weekly_goal  
                                                - mistake_history
                                                   |
                                                   v
                            Personalized lesson targeting weak areas,
                            matching learning style, aligned with goals
```

---

## Technical Details

### Mistake History Limits

- Store maximum 50 entries (rolling window)
- Older entries are automatically removed
- Priority is given to recent mistakes
- Words repeated multiple times get higher weight in AI prompt

### Learning Style Activities Map

| Style | Preferred Activities |
|-------|---------------------|
| Visual | Diagrams, flashcards, charts, videos, color-coding |
| Auditory | Podcasts, pronunciation drills, listening exercises, discussions |
| Kinesthetic | Role-play, games, drag-and-drop, typing exercises, movement |

### Weekly Goal Reset Logic

- Goals persist until changed by student
- Optional: Prompt to update goal every Monday
- Track goal completion (future enhancement)

---

## Testing Checklist

1. Complete onboarding as a new student
   - Verify learning style quiz appears
   - Confirm learning style is saved to database

2. Answer questions wrong during Quick Check
   - Verify mistakes are recorded in mistake_history

3. Open dashboard and set a weekly goal
   - Verify goal is saved and displayed

4. Generate a daily lesson
   - Verify the lesson references:
     - Learning style activities
     - Weekly goal alignment
     - Mistake review words

5. Check database records
   - Confirm all three fields are populated correctly

