

# Bundle Optimization and Security Audit Results

## Part 1: Verification Results

### Landing Page - PASSED
The landing page renders instantly without any black screen. The fix (removing `if (loading) return null`) is working correctly -- content appears immediately while auth loads in the background.

### Language Persistence - NEEDS MANUAL TESTING
The LanguageContext is now synced with i18next and the `clearAllCaches` function preserves `i18nextLng`. To verify: switch language in the app, refresh the page, and confirm the language persists.

### Dark/Light Mode Persistence - NEEDS MANUAL TESTING
The `clearAllCaches` function now preserves `theme-mode`. To verify: toggle the theme, refresh, and confirm the preference survives.

---

## Part 2: Bundle Size Optimization

### Problem
In `src/App.tsx`, 17 page components are **eagerly imported**, meaning they are all bundled into the initial JavaScript payload even though most users only visit 1-2 pages on first load. Only 5 components (ParentDashboard, CommunityPage, TeacherClassroomPage, StudentClassroomPage, AIPlacementTest) are lazy-loaded.

### Pages to Convert to Lazy Loading

| Page | Used By | Priority |
|------|---------|----------|
| AboutPage | Public visitors | High |
| TeachWithUsPage | Public visitors | High |
| ForTeachersPage | Public visitors | High |
| Login | Auth flow | High |
| SignUp | Auth flow | High |
| TeacherSignUp | Auth flow | Medium |
| StudentSignUp | Auth flow | Medium |
| TeacherApplication | Auth flow | Medium |
| StudentApplication | Auth flow | Medium |
| EmailVerification | Auth flow | Medium |
| ResetPassword | Auth flow | Medium |
| StudentDashboard | Students only | High |
| TeacherDashboard | Teachers only | High |
| AdminDashboard | Admins only | High |
| Dashboard | Role router | Medium |
| StudentOnboardingFlow | Students only | Medium |
| AssessmentTaker | Assessments | Low |
| AssessmentResults | Assessments | Low |

### What Stays Eagerly Loaded
- `LandingPage` -- the entry point, must load instantly

### Implementation

**File: `src/App.tsx`**

1. Replace all 17 eager imports (lines 17-32, 44-45) with `lazy()` calls
2. Wrap all lazy-loaded route elements in `<Suspense fallback={<LoadingFallback />}>`
3. Keep `LandingPage` as the only eager import

```text
// BEFORE (eager - all in initial bundle)
import AboutPage from "./pages/AboutPage";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
// ... 14 more

// AFTER (lazy - loaded on demand)
const AboutPage = lazy(() => import("./pages/AboutPage"));
const Login = lazy(() => import("./pages/Login"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
// ... 14 more
```

Each route that uses a lazy component gets wrapped:
```text
<Route path="/about" element={
  <Suspense fallback={<LoadingFallback />}>
    <AboutPage />
  </Suspense>
} />
```

### Expected Impact
- Initial bundle reduced by ~60-70% (removing 17 page modules from main chunk)
- Each page loads only when navigated to
- Users see the skeleton loading state briefly on first visit to each page

---

## Part 3: Security Scan Summary

The scan found **224 issues** across three categories:

### Category A: RLS Enabled but No Policies (3 tables) -- INFO
Three tables have RLS enabled but no policies defined, meaning **all access is blocked**. This is safe (restrictive) but may cause features to silently fail.

### Category B: Overly Permissive RLS Policies (~25 tables) -- WARN
Many tables have `USING (true)` or `WITH CHECK (true)` on INSERT/UPDATE/DELETE operations, meaning **any authenticated user can modify any row**. This is the most critical security concern.

### Category C: Anonymous Access Policies (~100+ tables) -- WARN
Many RLS policies are enforced on roles that include `anon`, meaning unauthenticated users could potentially access data. Most of these are likely false positives (policies check `auth.uid()` internally), but should be reviewed.

### Category D: Functions Without search_path (5 functions) -- WARN
Five database functions don't have `search_path` set, making them vulnerable to search path injection.

### Category E: Extension in Public Schema (1) -- WARN
An extension is installed in the `public` schema instead of a dedicated schema.

### Recommendation
The security findings are extensive and should be tackled as a **separate dedicated task** -- fixing 25+ overly permissive RLS policies and 100+ anonymous access policies requires careful review of each table's access patterns to avoid breaking functionality. The bundle optimization can proceed independently.

---

## Implementation Steps

### Step 1: Convert all eager imports to lazy imports in App.tsx
- Move 17 page imports from static `import` to `lazy(() => import(...))`
- Keep only `LandingPage` as eager import

### Step 2: Wrap all lazy route elements in Suspense
- Add `<Suspense fallback={<LoadingFallback />}>` around every lazy component in Routes
- Reuse the existing `LoadingFallback` component

### Step 3: Clean up unused direct imports
- Remove the `AssessmentTaker` and `AssessmentResults` named imports and convert to lazy default imports (may require adding `export default` wrappers)

