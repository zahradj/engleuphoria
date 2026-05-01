# L1/L2 Localization: UI Only, Lesson Content Stays English

## Goal
Wire the landing page hero, student dashboard, and student sidebar to `react-i18next` so they switch instantly with `<LanguageSwitcher />`, while enforcing a strict rule that all curriculum content rendered from the database stays in English.

## Scope

### IN scope (translate)
- **Landing**: `HeroSection.tsx`, `NavHeader.tsx`, `FinalCTASection.tsx` — hero headline, tagline, CTA buttons ("Start Learning", "Watch Demo", "Join Now"), nav links.
- **Student Dashboard chrome**: `src/pages/StudentDashboard.tsx`, `WelcomeSection.tsx`, `DashboardTab.tsx`, `LearningPathTab.tsx` (tab labels, section headings, button labels — NOT lesson titles).
- **Sidebar**: `StudentSidebar.tsx`, `MinimalStudentHeader.tsx`, `MobileBottomNav.tsx` — already partly translated; audit & complete missing keys.
- **Common UI strings**: "Welcome back", "Start Lesson", "My Progress", "Profile", "Settings", "Continue", "View All", loading/empty states.

### OUT of scope (must stay English — enforce "Do Not Touch" rule)
- `DynamicSlideRenderer.tsx` and any child slide component.
- Anything reading from `curriculum_lessons` / `lesson_slides`: `lesson.title`, `lesson.description`, `slide.target_phrase`, `slide.questions`, vocabulary words, example sentences.
- `LessonPlayerContainer.tsx`, `AcademyLessonLayout.tsx`, `UnitRoadmap.tsx` lesson-data fields.
- `LessonCard.tsx` lesson title/description (only surrounding chrome like a "Start" button gets translated).

## Implementation

### 1. Translation keys
Add a new `landing` namespace and extend `dashboardUI` in all 6 locales (`english`, `arabic`, `french`, `turkish`, `spanish`, `italian`):

```text
landing.hero.headline
landing.hero.tagline
landing.hero.cta_primary    // "Start Learning Free"
landing.hero.cta_secondary  // "Watch Demo"
landing.nav.for_parents / for_teachers / about / login / signup
landing.cta.final_headline / final_button

dashboardUI.sd.welcome_back        // "Welcome back, {{name}}"
dashboardUI.sd.ready_to_learn
dashboardUI.sd.start_lesson
dashboardUI.sd.continue_lesson
dashboardUI.sd.my_progress
dashboardUI.sd.view_all
dashboardUI.sd.tabs.dashboard / learning_path / certificates / billing / chat
```

Register the new `landing.ts` module in each locale's `index.ts`.

### 2. Component refactors
For each in-scope component:
- Import `useTranslation` from `react-i18next`.
- Replace hardcoded English strings with `t('landing.hero.headline')` etc.
- Use interpolation for `{{name}}` in welcome strings.
- Preserve all existing Tailwind classes, glassmorphism, hub colors, animations — no styling changes.

`WelcomeSection.tsx` currently uses `languageText.welcomeUser` (legacy `LanguageContext`); migrate it to `useTranslation` for consistency with the rest of the i18n stack.

### 3. Enforcement of "Do Not Touch" rule
- Add a header comment block to `DynamicSlideRenderer.tsx` and `LessonCard.tsx`:
  ```text
  // L1/L2 RULE: Do NOT wrap lesson content (title, description,
  // target_phrase, questions, vocabulary) in t(). Curriculum content
  // from `curriculum_lessons` must render verbatim in English.
  ```
- Audit these files with `rg "useTranslation"` to confirm none currently apply `t()` to DB-sourced strings; if any exist, remove them.

### 4. Verification
- Manually switch the language via `<LanguageSwitcher />` and confirm:
  - Hero, nav, sidebar, dashboard tabs, welcome message all change.
  - A lesson card's title and the slide content stay in English.
  - Arabic flips RTL correctly (already wired in `LanguageSwitcher`).

## Files to edit
- `src/translations/{english,arabic,french,turkish,spanish,italian}/landing.ts` (new)
- `src/translations/{english,arabic,french,turkish,spanish,italian}/dashboardUI.ts` (extend)
- `src/translations/{...}/index.ts` (register `landing`)
- `src/components/landing/HeroSection.tsx`
- `src/components/landing/NavHeader.tsx`
- `src/components/landing/FinalCTASection.tsx`
- `src/components/dashboard/WelcomeSection.tsx`
- `src/pages/StudentDashboard.tsx` (audit remaining hardcoded strings)
- `src/components/student/DashboardTab.tsx`, `LearningPathTab.tsx` (chrome only)
- `src/components/lesson-player/DynamicSlideRenderer.tsx` (add enforcement comment)
- `src/components/student/LessonCard.tsx` (add enforcement comment)

## Out of scope / not changing
- No DB schema, no Supabase migration, no edge-function changes.
- No changes to lesson player runtime, audio, or scoring logic.
- Teacher/parent dashboards (already done in earlier session).
