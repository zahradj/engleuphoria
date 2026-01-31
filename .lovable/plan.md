
# Architecture Refactoring Plan: Role-Based Dashboard & Student Level System

## Executive Summary

This plan refactors the core authentication and routing architecture to properly support three user roles (admin, teacher, student) and three distinct student experiences (Playground, Academy, Professional/Hub) based on age and placement testing.

---

## Current State Analysis

### What Already Exists

**Database Schema:**
- `user_roles` table with `app_role` enum: `student`, `teacher`, `admin`
- `student_profiles` table with `placement_test_score`, `interests`, `cefr_level`
- `users` table with `current_system` column (values: KIDS, TEENS, ADULTS)

**Routing:**
- `ImprovedProtectedRoute` checks user role and redirects
- Separate routes: `/playground/*`, `/academy/*`, `/hub/*` for students
- Teacher uses `/admin/*`, Super Admin uses `/super-admin/*`

**Dashboards:**
- `PlaygroundDashboard` (Kids 4-10): Colorful map with lessons
- `AcademyDashboard` (Teens 11-17): Dark mode sidebar, leaderboard
- `HubDashboard` (Adults 18+): Clean corporate design

**Onboarding:**
- `PlacementTestFlow` component exists
- `StudentSignUp` determines system based on age

### What's Missing

1. **Unified `/dashboard` route** that auto-redirects based on role AND student_level
2. **`student_level` enum** in database (`playground`, `academy`, `professional`)
3. **`onboarding_completed` boolean** to gate access until placement is done
4. **Multi-step onboarding component** with interests + basic assessment
5. **Consistent design tokens** per student level

---

## Part 1: Database Schema Updates

### 1.1 Add `student_level` enum and column

```sql
-- Create the student_level enum
CREATE TYPE public.student_level AS ENUM ('playground', 'academy', 'professional');

-- Add columns to student_profiles
ALTER TABLE public.student_profiles
ADD COLUMN IF NOT EXISTS student_level public.student_level DEFAULT 'playground',
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
```

### 1.2 Rename `current_system` references

The existing `users.current_system` column stores `KIDS`, `TEENS`, `ADULTS`. We will:
- Keep this column for backward compatibility
- Use `student_profiles.student_level` as the canonical source for routing
- Add a database trigger to sync `student_level` from `current_system` on existing records

### 1.3 Migration Script

```sql
-- Update existing student_profiles based on users.current_system
UPDATE student_profiles sp
SET student_level = CASE 
  WHEN u.current_system = 'KIDS' THEN 'playground'::public.student_level
  WHEN u.current_system = 'TEENS' THEN 'academy'::public.student_level
  WHEN u.current_system = 'ADULTS' THEN 'professional'::public.student_level
  ELSE 'playground'::public.student_level
END
FROM users u
WHERE sp.user_id = u.id;
```

---

## Part 2: Routing Logic Refactor

### 2.1 Create Unified `/dashboard` Route

**New Route Handler: `src/pages/Dashboard.tsx`**

This page acts as a smart router:
1. Checks if user is authenticated
2. Reads user role from `user_roles` table
3. If admin: redirect to `/super-admin`
4. If teacher: redirect to `/admin`
5. If student: check `student_profiles.student_level`:
   - `playground`: redirect to `/playground`
   - `academy`: redirect to `/academy`
   - `professional`: redirect to `/hub`

### 2.2 Onboarding Gate

Before redirecting students, check `onboarding_completed`:
- If `false`: show `StudentOnboardingFlow` component
- If `true`: proceed to dashboard

### 2.3 Updated Route Configuration

```text
App.tsx Routes:
  /dashboard       -> <Dashboard /> (smart router)
  /playground/*    -> <StudentDashboard systemId="kids" />
  /academy/*       -> <StudentDashboard systemId="teen" />
  /hub/*           -> <StudentDashboard systemId="adult" />
  /admin/*         -> <TeacherDashboard />
  /super-admin/*   -> <AdminDashboard />
```

### 2.4 Update ImprovedProtectedRoute

Add `requiredStudentLevel` prop for fine-grained control:

```typescript
interface ImprovedProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'teacher' | 'admin' | 'parent';
  requiredStudentLevel?: 'playground' | 'academy' | 'professional';
  requireOnboarding?: boolean;
  redirectTo?: string;
}
```

---

## Part 3: Student Onboarding Flow

### 3.1 Component: `StudentOnboardingFlow`

**Location:** `src/components/onboarding/StudentOnboardingFlow.tsx`

**Multi-step wizard with 4 steps:**

1. **Welcome Screen**
   - Friendly greeting with mascot (Pip for kids, modern UI for teens/adults)
   - Brief explanation of what comes next

2. **About You (Interests)**
   - Select interests from categories:
     - Games & Fun
     - Music & Movies
     - Sports
     - Travel & Adventure
     - Science & Technology
     - Art & Creativity
   - Stores to `student_profiles.interests[]`

3. **Quick English Check (5 questions)**
   - Adaptive difficulty based on age
   - Question types: vocabulary matching, sentence completion, listening
   - Determines initial CEFR level estimate

4. **Your Learning Path**
   - Shows assigned level (Playground/Academy/Hub)
   - Preview of first lesson
   - "Start Learning" button

### 3.2 Age-to-Level Mapping

```typescript
function determineStudentLevel(age: number): StudentLevel {
  if (age >= 4 && age <= 10) return 'playground';
  if (age >= 11 && age <= 17) return 'academy';
  return 'professional';
}
```

### 3.3 Placement Test Scoring

```text
Score 0-40%   -> CEFR A1 (Beginner)
Score 41-60%  -> CEFR A2 (Elementary)
Score 61-75%  -> CEFR B1 (Intermediate)
Score 76-90%  -> CEFR B2 (Upper Intermediate)
Score 91-100% -> CEFR C1 (Advanced)
```

---

## Part 4: UI Design System

### 4.1 Design Tokens by Level

**Playground (Kids 4-10):**
```css
--radius: 24px (rounded-3xl)
--primary: #FF9500 (orange)
--secondary: #FFD60A (yellow)
--accent: #30D158 (green)
--font: 'Fredoka', cursive
--animation: bouncy (spring physics)
```

**Academy (Teens 11-17):**
```css
--radius: 12px (rounded-xl)
--primary: #6366F1 (indigo)
--secondary: #64748B (slate)
--accent: #8B5CF6 (violet)
--font: 'Inter', sans-serif
--animation: smooth (ease-in-out)
--dark-mode: enabled by default
```

**Professional (Adults 18+):**
```css
--radius: 8px (rounded-lg)
--primary: #10B981 (emerald)
--secondary: #374151 (charcoal)
--accent: #3B82F6 (blue)
--font: 'Inter', sans-serif
--animation: minimal (subtle)
```

### 4.2 Theme Context Enhancement

Update `RoleThemeContext.tsx` to include student level theming:

```typescript
interface ThemeConfig {
  role: 'student' | 'teacher' | 'admin';
  studentLevel?: 'playground' | 'academy' | 'professional';
  colors: ColorPalette;
  borderRadius: string;
  fontFamily: string;
  animationStyle: 'bouncy' | 'smooth' | 'minimal';
}
```

---

## Part 5: Implementation Files

### Files to Create

| File | Purpose |
|------|---------|
| `src/pages/Dashboard.tsx` | Smart router based on role + student_level |
| `src/components/onboarding/StudentOnboardingFlow.tsx` | Multi-step onboarding wizard |
| `src/components/onboarding/steps/WelcomeStep.tsx` | Step 1: Welcome |
| `src/components/onboarding/steps/InterestsStep.tsx` | Step 2: Select interests |
| `src/components/onboarding/steps/QuickAssessmentStep.tsx` | Step 3: Basic English check |
| `src/components/onboarding/steps/LearningPathStep.tsx` | Step 4: Show assigned path |
| `src/hooks/useStudentLevel.ts` | Hook to fetch and manage student level |
| `src/hooks/useOnboardingStatus.ts` | Hook to check onboarding completion |
| `supabase/migrations/XXXXXX_add_student_level.sql` | Database migration |

### Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Add `/dashboard` route, update redirects |
| `src/contexts/AuthContext.tsx` | Add `studentLevel` and `onboardingCompleted` to user object |
| `src/components/auth/ImprovedProtectedRoute.tsx` | Add student level checks |
| `src/pages/Login.tsx` | Redirect to `/dashboard` instead of role-specific routes |
| `src/pages/StudentSignUp.tsx` | Set `student_level` based on age during signup |
| `src/contexts/RoleThemeContext.tsx` | Add student level theming |

---

## Part 6: Data Flow Diagram

```text
User Signs Up
     |
     v
[Age Collected] --> determineStudentLevel()
     |
     v
[student_profiles created with student_level + onboarding_completed=false]
     |
     v
User Logs In --> /dashboard
     |
     v
[Check onboarding_completed]
     |
     +--> FALSE: Show StudentOnboardingFlow
     |              |
     |              v
     |         [Complete 4 steps]
     |              |
     |              v
     |         [Update: onboarding_completed=true, interests, placement_test_score]
     |              |
     |              v
     +--> TRUE: Check role
              |
              +--> admin --> /super-admin
              +--> teacher --> /admin
              +--> student --> Check student_level
                       |
                       +--> playground --> /playground
                       +--> academy --> /academy
                       +--> professional --> /hub
```

---

## Part 7: Security Considerations

1. **Roles stored in `user_roles` table only** (never on profile or users table)
2. **RLS policies** ensure students can only update their own `student_profiles`
3. **Server-side validation** of role changes (admin-only via edge function)
4. **No client-side role checks** for authorization (only for UI rendering)

### RLS Policy for student_profiles

```sql
-- Students can read/update their own profile
CREATE POLICY "students_own_profile" ON student_profiles
FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Teachers can read student profiles (for reporting)
CREATE POLICY "teachers_read_students" ON student_profiles
FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() 
  AND role = 'teacher'
));
```

---

## Part 8: Verification Steps

After implementation:

1. **Sign up as new student (age 8)**
   - Should see onboarding flow
   - Complete interests + assessment
   - Redirect to /playground
   - Verify Playground UI (rounded-3xl, orange/yellow, Fredoka font)

2. **Sign up as new student (age 14)**
   - Should see onboarding flow
   - Complete interests + assessment
   - Redirect to /academy
   - Verify Academy UI (dark mode, indigo, Inter font)

3. **Sign up as new student (age 25)**
   - Should see onboarding flow
   - Complete interests + assessment
   - Redirect to /hub
   - Verify Hub UI (clean white, emerald, minimal)

4. **Login as existing teacher**
   - Should redirect to /admin immediately

5. **Login as existing admin**
   - Should redirect to /super-admin immediately

6. **Visit /dashboard directly**
   - Authenticated: redirects based on role
   - Unauthenticated: redirects to /login

---

## Implementation Order

| Priority | Task | Effort |
|----------|------|--------|
| 1 | Database migration (add student_level enum + columns) | Small |
| 2 | Create useStudentLevel and useOnboardingStatus hooks | Small |
| 3 | Create Dashboard.tsx smart router | Medium |
| 4 | Create StudentOnboardingFlow + 4 step components | Large |
| 5 | Update App.tsx routes | Small |
| 6 | Update AuthContext with student level | Medium |
| 7 | Update ImprovedProtectedRoute | Medium |
| 8 | Enhance RoleThemeContext for student levels | Medium |
| 9 | Update Login/Signup redirects | Small |
| 10 | Testing & verification | Medium |

