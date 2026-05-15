## Scope

Fix Cycle 1 localization on the placement test entry. The strings you listed ("Welcome to The Academy, {{name}}!", "≈5 minutes", "Personalized", "One time only", "Start My Assessment") don't currently exist in the codebase — the placement currently jumps straight into the `DemographicsPhase` chat. So this plan **adds a real Welcome screen** as Step 0, fully localized, with a language switcher.

Out of scope: question logic, demographics chat, processing, dashboards, edge functions.

## Changes

### 1. New `WelcomePhase.tsx` (`src/components/placement/`)
A hub-themed welcome card shown before `DemographicsPhase`. Contents (all via `t()`):
- H1: `t('placement.welcome.title.{hub}', { name })` — e.g. "Welcome to The Academy, {{name}}!"
- Subtitle: `t('placement.welcome.subtitle')` — "Before we open your dashboard, let's calibrate your level."
- 3 chip badges: `t('placement.welcome.chip.duration')` ("≈5 minutes"), `t('placement.welcome.chip.personalized')` ("Personalized"), `t('placement.welcome.chip.oneTime')` ("One time only")
- CTA button: `t('placement.welcome.cta')` ("Start My Assessment")
- Pulls student name from `useAuth()` user metadata (fallback "there").

### 2. `AIPlacementTest.tsx`
- Add `'welcome'` as the new initial `Phase` (welcome → demographics → test → processing → complete).
- Mount `<WelcomePhase hub={resolvedHub} onStart={() => setPhase('demographics')} />`.
- Add `<LanguageSwitcher variant="ghost" size="sm" compact />` in the existing header (right side), keeping the centered Logo. Reuse the existing `src/components/common/LanguageSwitcher.tsx` — no new component.

### 3. Translation keys (add to all 6 `placement.ts` dictionaries)
```
placement.welcome.title.playground   "Welcome to the Playground, {{name}}!"
placement.welcome.title.academy      "Welcome to The Academy, {{name}}!"
placement.welcome.title.professional "Welcome to Success Hub, {{name}}!"
placement.welcome.subtitle           "Before we open your dashboard, let's calibrate your level."
placement.welcome.chip.duration      "≈5 minutes"
placement.welcome.chip.personalized  "Personalized"
placement.welcome.chip.oneTime       "One time only"
placement.welcome.cta                "Start My Assessment"
placement.welcome.greetingFallback   "there"
```
Translate accurately for `en, es, fr, it, tr, ar` (RTL handled by existing `applyDirection` in `src/lib/i18n.ts`).

### 4. Auto-detection — verification only
`src/lib/i18n.ts` already uses `i18next-browser-languagedetector` with order `['localStorage','navigator','htmlTag']` and `load: 'languageOnly'`. No change needed; will confirm in preview.

### Files touched
- **Create:** `src/components/placement/WelcomePhase.tsx`
- **Edit:** `src/components/placement/AIPlacementTest.tsx`, `src/translations/{english,spanish,french,italian,turkish,arabic}/placement.ts`

### Not touched
`PlaygroundTest.tsx`, `AcademyTest.tsx`, `SuccessTest.tsx` are 1-line wrappers around `AIPlacementTest` — fixing the shell once covers all three funnels (cleaner than duplicating per file as your message suggested).
