

# AIPlacementTest - Chat-Based Adaptive Placement Test

## Overview

A premium, chat-based placement test component where an AI avatar ("The Guide") converses with the student through a typewriter-animated chat interface. It collects demographics, runs 5 adaptive questions based on age group, shows a processing animation, then updates the database and redirects to the correct dashboard.

## New Files to Create

### 1. `src/components/placement/AIPlacementTest.tsx` (Main orchestrator)

- Manages the overall flow through 4 phases: `demographics`, `test`, `processing`, `complete`
- Uses Framer Motion `AnimatePresence` for smooth phase transitions
- Glassmorphism container: `backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl`
- Full-screen gradient background matching the Engleuphoria brand
- Holds all state: `age`, `goal`, `answers[]`, `score`, `determinedLevel`

### 2. `src/components/placement/TypewriterText.tsx` (Reusable typewriter effect)

- Accepts `text: string` and `speed?: number` (default ~40ms per char)
- Uses `useState` + `useEffect` with a `setInterval` to reveal characters one by one
- Calls an `onComplete` callback when finished typing
- Renders with a blinking cursor animation at the end while typing

### 3. `src/components/placement/ChatBubble.tsx` (Chat message component)

- Two variants: `role: 'guide' | 'user'`
- Guide bubbles: left-aligned with avatar icon (a gradient circle with a sparkle/brain icon), glassmorphism background
- User bubbles: right-aligned with a subtle blue/purple background
- Guide messages use `TypewriterText`; user messages render instantly
- Framer Motion entry animation: `initial={{ opacity: 0, y: 20 }}` -> `animate={{ opacity: 1, y: 0 }}`

### 4. `src/components/placement/DemographicsPhase.tsx`

- Chat-style flow:
  1. Guide says: "Hello! I'm your Guide. I'm here to find the perfect learning path for you."
  2. Guide asks: "First, how old are you?"
  3. User types age into a styled input (glassmorphism, rounded-2xl)
  4. Guide responds based on age with age-appropriate language
  5. Guide asks: "What do you want to achieve with English?"
  6. User selects from 4 goal cards (Travel, Work/Business, School/Exams, Fun/Social) or types custom
- On completion, calls `onComplete({ age, goal })` which determines the question set

### 5. `src/components/placement/TestPhase.tsx`

- Receives `age` to determine question category:
  - `age < 12`: Image-based/simple vocabulary (Playground style with emojis, bright colors)
  - `age 12-18`: Grammar + social scenarios (Academy style)
  - `age > 18`: Business English + complex structures (Professional style)
- Each question appears as a Guide chat message with typewriter effect
- Answer options appear as interactive cards below the chat (glassmorphism, hover effects)
- After selecting, the Guide gives brief feedback before the next question
- Progress indicator: 5 small dots at the top showing completion
- Uses `AnimatePresence` for question transitions

### 6. `src/components/placement/ProcessingPhase.tsx`

- Triggered after the 5th question is answered
- Full-screen centered animation:
  - Animated brain/sparkle icon with pulse effect
  - Text: "Generating your personalized learning path..." with typewriter effect
  - Animated progress bar (0% to 100% over ~4 seconds using Framer Motion `animate`)
  - Subtle particle/glow effects around the progress area
- After the bar reaches 100%, triggers the database update and redirect

### 7. `src/hooks/usePlacementTest.ts` (Business logic hook)

- `determineLevel(age)`: Uses the existing `determineStudentLevel` from `useStudentLevel.ts`
- `calculateScore(answers, questions)`: Returns score percentage
- `completeTest(userId, level, score)`: Updates `student_profiles` table:
  - `student_level` = determined level ('playground' | 'academy' | 'professional')
  - `onboarding_completed` = true
  - `placement_test_score` = calculated score
  - `placement_test_completed_at` = new Date().toISOString()
- Returns the dashboard route using existing `getStudentDashboardRoute(level)`

## Routing Changes

### `src/App.tsx`

- Add a new route: `/ai-placement-test`
- Protected with `ImprovedProtectedRoute requiredRole="student"`
- Lazy-loaded with `Suspense`

## Question Bank (embedded in TestPhase.tsx)

**Playground (age < 12)** - 5 image/emoji-based vocabulary questions:
- "Which animal says 'Meow'?" with emoji options
- Color identification, counting, basic greetings, simple verbs

**Academy (age 12-18)** - 5 grammar/social scenario questions:
- Correct tense usage, conditional sentences, phrasal verbs
- Social scenario: "Your friend invites you to a party. How do you respond?"

**Professional (age > 18)** - 5 business English questions:
- Formal email language, idiomatic expressions, complex grammar
- "Which phrase is most appropriate for a client presentation?"

## Design Tokens

- Background: `bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900`
- Glass panels: `backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl`
- Guide avatar: gradient circle `from-violet-500 to-fuchsia-500` with sparkle icon
- Text: `text-white` for primary, `text-white/70` for secondary
- Accent buttons: `bg-gradient-to-r from-violet-600 to-fuchsia-600`
- Soft shadows: `shadow-[0_8px_32px_rgba(0,0,0,0.3)]`
- Progress dots: `bg-white/30` inactive, `bg-violet-400` active, `bg-green-400` completed

## Technical Notes

- All questions are static/embedded (no AI API call needed for question generation)
- Reuses `determineStudentLevel` and `getStudentDashboardRoute` from existing `useStudentLevel.ts`
- Database update uses `supabase.from('student_profiles').update(...)` matching the existing pattern in `StudentOnboardingFlow.tsx`
- Navigation uses `react-router-dom`'s `useNavigate` with `replace: true`
- The typewriter speed adjusts slightly based on message length (shorter = slower per char for readability)

## File Summary

| File | Action |
|------|--------|
| `src/components/placement/AIPlacementTest.tsx` | Create |
| `src/components/placement/TypewriterText.tsx` | Create |
| `src/components/placement/ChatBubble.tsx` | Create |
| `src/components/placement/DemographicsPhase.tsx` | Create |
| `src/components/placement/TestPhase.tsx` | Create |
| `src/components/placement/ProcessingPhase.tsx` | Create |
| `src/hooks/usePlacementTest.ts` | Create |
| `src/App.tsx` | Add route for `/ai-placement-test` |

