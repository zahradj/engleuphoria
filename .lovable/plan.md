
# Plan: Integrate Student Level Evaluation & AI Learning Path Generation

## Summary

This plan integrates your student level evaluation logic and AI learning path prompt into the existing codebase. The key changes include:

1. **Update the age threshold** for student level categorization (your logic uses age 12 as the cutoff for "playground" vs "academy", while the current code uses age 10)
2. **Create an AI-powered onboarding flow** that collects interests and generates personalized learning paths
3. **Add an edge function** to call the AI for curriculum generation

---

## Current vs. Your Proposed Logic

| Level | Current Code | Your Logic |
|-------|-------------|------------|
| Playground | Ages 4-10 | Ages < 12 |
| Academy | Ages 11-17 | Ages 12-17 |
| Professional | Ages 18+ | Ages 18+ |

Your logic simplifies the lower boundary (any age below 12 goes to playground).

---

## Implementation Steps

### Step 1: Update `evaluateStudentLevel` Function

**File:** `src/hooks/useStudentLevel.ts`

Update the `determineStudentLevel` function to match your logic:

```typescript
export function determineStudentLevel(age: number): StudentLevel {
  if (age < 12) return 'playground';
  if (age >= 12 && age < 18) return 'academy';
  return 'professional';
}
```

Also add the score parameter (for future placement test integration):

```typescript
export function evaluateStudentLevel(score: number, age: number): StudentLevel {
  // Score can be used for CEFR level determination
  // Age determines the UI/dashboard track
  if (age < 12) return 'playground';
  if (age >= 12 && age < 18) return 'academy';
  return 'professional';
}
```

---

### Step 2: Create AI Learning Path Generator Edge Function

**New File:** `supabase/functions/generate-learning-path/index.ts`

This edge function will:
1. Receive student interests and level
2. Call Lovable AI with your curriculum generation prompt
3. Return a structured 4-week learning path as JSON

```typescript
// Key logic using Lovable AI
const prompt = `Act as an expert ESL Teacher. Create a 4-week personalized 
English learning path for a student in the "${level}" track 
who loves ${interests.join(', ')}. Format the output as a structured 
JSON curriculum with:
- week_number (1-4)
- theme (related to student interests)
- lessons (array of 3-5 lessons per week)
- Each lesson: title, duration_minutes, skill_focus, activity_type`;

const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${LOVABLE_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "google/gemini-3-flash-preview",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ],
    // Use structured output for reliable JSON
    tools: [{
      type: "function",
      function: {
        name: "create_learning_path",
        parameters: { /* JSON schema for 4-week curriculum */ }
      }
    }],
    tool_choice: { type: "function", function: { name: "create_learning_path" } }
  }),
});
```

---

### Step 3: Create Student Onboarding Flow Component

**New File:** `src/components/onboarding/StudentOnboardingFlow.tsx`

A multi-step wizard that replaces or enhances the current `StudentApplication.tsx`:

**Step 1: Welcome Screen**
- Friendly greeting with mascot (Pip for kids, modern UI for teens/adults)
- Explain what comes next

**Step 2: Select Interests**
Categories to choose from:
- Games & Fun
- Music & Movies
- Sports
- Travel & Adventure
- Science & Technology
- Art & Creativity
- Animals & Nature
- Food & Cooking

These get stored in `student_profiles.interests[]`

**Step 3: Quick English Check (Optional)**
- 5 simple questions to estimate starting CEFR level
- Vocabulary matching and sentence completion
- Results stored in `student_profiles.placement_test_score`

**Step 4: Your Learning Path**
- Call the `generate-learning-path` edge function
- Display the AI-generated 4-week curriculum preview
- "Start Learning" button saves path and redirects to dashboard

---

### Step 4: Add Onboarding Route

**File:** `src/App.tsx`

Add a new protected route for onboarding:

```tsx
<Route path="/onboarding" element={
  <ImprovedProtectedRoute requiredRole="student">
    <StudentOnboardingFlow />
  </ImprovedProtectedRoute>
} />
```

---

### Step 5: Update Dashboard.tsx Onboarding Gate

**File:** `src/pages/Dashboard.tsx`

The current logic already checks `onboardingCompleted`:

```typescript
if (!onboardingCompleted && studentLevel) {
  setRedirectPath('/onboarding');
  return;
}
```

Ensure this redirects to the new `StudentOnboardingFlow` component.

---

### Step 6: Store Generated Learning Path

**Database Table:** `personalized_learning_paths` (already exists)

When the AI generates a path, save it:

```typescript
await supabase.from('personalized_learning_paths').insert({
  student_id: user.id,
  path_name: `${level} Learning Journey`,
  total_steps: 20, // 4 weeks × 5 lessons
  path_data: aiGeneratedCurriculum,
  learning_style: 'mixed',
  difficulty_preference: 'adaptive',
  estimated_completion_days: 28,
  ai_generated: true
});

// Mark onboarding complete
await supabase.from('student_profiles')
  .update({ onboarding_completed: true, interests: selectedInterests })
  .eq('user_id', user.id);
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `supabase/functions/generate-learning-path/index.ts` | AI curriculum generation edge function |
| `src/components/onboarding/StudentOnboardingFlow.tsx` | Multi-step onboarding wizard |
| `src/components/onboarding/steps/WelcomeStep.tsx` | Step 1: Welcome |
| `src/components/onboarding/steps/InterestsStep.tsx` | Step 2: Select interests |
| `src/components/onboarding/steps/QuickAssessmentStep.tsx` | Step 3: Basic English check |
| `src/components/onboarding/steps/LearningPathStep.tsx` | Step 4: Show AI-generated path |

## Files to Modify

| File | Changes |
|------|---------|
| `src/hooks/useStudentLevel.ts` | Update age thresholds to match your logic |
| `src/App.tsx` | Add `/onboarding` route |
| `src/pages/StudentSignUp.tsx` | Update to use new `evaluateStudentLevel` function |

---

## User Flow After Implementation

```text
New Student Signs Up
       |
       v
[Age collected during signup]
       |
       v
[evaluateStudentLevel(score, age)] 
       |
       v
[student_profiles created with student_level + onboarding_completed=false]
       |
       v
User Logs In --> /dashboard
       |
       v
[Dashboard checks onboarding_completed = false]
       |
       v
Redirect to /onboarding
       |
       v
[4-step wizard: Welcome → Interests → Quick Check → AI Path]
       |
       v
[AI generates personalized 4-week curriculum based on interests + level]
       |
       v
[Path saved to personalized_learning_paths]
       |
       v
[onboarding_completed = true]
       |
       v
Redirect to /playground, /academy, or /hub based on level
```

---

## AI Prompt for Learning Path (Full Version)

```typescript
const systemPrompt = `You are an expert ESL curriculum designer specializing in 
personalized learning for students of all ages. Create engaging, age-appropriate 
content that matches student interests.`;

const generateLearningPathPrompt = (interests: string[], level: string) => {
  return `Act as an expert ESL Teacher. Create a 4-week personalized 
  English learning path for a student in the "${level}" track 
  who loves ${interests.join(', ')}. 
  
  Format the output as a structured JSON curriculum with:
  - 4 weeks of content
  - Each week has a theme related to the student's interests
  - 5 lessons per week (20 total)
  - Each lesson includes: title, skill_focus (speaking/reading/writing/listening), 
    activity_type, estimated_duration_minutes, difficulty_level (1-10)
  
  For ${level} track:
  ${level === 'playground' ? '- Use simple vocabulary, games, songs, and colorful activities' : ''}
  ${level === 'academy' ? '- Include social scenarios, trending topics, and interactive challenges' : ''}
  ${level === 'professional' ? '- Focus on business communication, formal writing, and career skills' : ''}`;
};
```

---

## Design Tokens by Level (Already Planned)

| Level | Colors | Border Radius | Font |
|-------|--------|---------------|------|
| Playground | Orange/Yellow | rounded-3xl | Fredoka |
| Academy | Indigo/Violet | rounded-xl | Inter |
| Professional | Emerald/Charcoal | rounded-lg | Inter |

These will be applied through `RoleThemeContext` during the onboarding and dashboard experiences.

---

## Verification Steps

1. Sign up as a new student (age 8)
   - Should see onboarding flow after login
   - Select interests
   - Complete quick check
   - AI generates Playground-style curriculum
   - Redirect to /playground

2. Sign up as a new student (age 15)
   - Should see onboarding flow after login
   - AI generates Academy-style curriculum
   - Redirect to /academy

3. Sign up as a new student (age 25)
   - Should see onboarding flow after login
   - AI generates Professional-style curriculum
   - Redirect to /hub

4. Check `personalized_learning_paths` table
   - Verify AI-generated paths are saved correctly

