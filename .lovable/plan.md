# UX & Learning Experience Optimization — Speaking-First Flow Restructure

**Primary outcome:** students speak more.
**Method:** flow restructuring (not visual repaint).
**Hard constraints:** don't touch Creator Studio, don't touch auth/routing, keep Flat 2.0 (no 3D, no heavy shadows; Vault claymorphism is the only exception).

---

## Phase 1 — Student experience (ship first)

### 1.1 Speaking-first lesson entry
Today the lesson player opens to whatever the first slide is. Restructure so every lesson session begins with a **2-second "Speak today?" intent prompt** (Bravery vs. Listen-only) that:
- defaults to Bravery,
- persists per session,
- when Bravery is on, every speaking slide auto-focuses the mic with a 1-tap "Try it" affordance instead of nested taps,
- when Listen-only, speaking slides still appear but in low-pressure "shadow & whisper" mode (no scoring shown).

Files: `src/pages/student/LessonReaderPage.tsx`, lesson player shell, slide router.

### 1.2 Restructure the speaking slide flow
Current pattern: read prompt → tap record → speak → wait → score. New pattern (fewer steps, less anxiety):
- **Hold-to-speak** replaces tap-record-tap-stop on touch; tap-to-toggle on desktop.
- **Bravery XP awarded on attempt** (already in gamification engine) is surfaced *immediately* on release — before any scoring — so the reward precedes the judgment.
- Score reveal is **opt-in** ("See how it sounded") for Playground and Academy; Professional gets it inline.
- "Try again" is the primary CTA; "Continue" is secondary. Today it's reversed.

### 1.3 Dashboard hero → one clear next action
The student dashboard hero currently surfaces CEFR bar + XP + streak + recap. Restructure to a **single "Resume / Start" primary tile** that:
- if mid-lesson → "Resume Lesson X" with one tap,
- else if review due → "1-minute Speaking Warm-up",
- else → "Start next lesson",
- CEFR/XP/streak demote to a compact strip below.

Files: `src/components/dashboard/hero/DashboardHero.tsx`, `RecapCard.tsx`, `XPStreakWidget.tsx`.

### 1.4 Lesson completion: speaking moment, not stats dump
Today completion shows a stats/celebration screen. Restructure to a **3-beat flow**:
1. Celebration beat (hub-themed confetti — already exists).
2. **"Say one thing you learned"** — single optional speaking capture, 5s. Counts as Bravery XP. Skippable.
3. Next-step tile (next lesson / review / done for today).

Stats move behind a "See details" disclosure.

### 1.5 Review reminders → ambient, not nagging
Replace toast-style reminders with a persistent **"Warm-up (1 min)"** chip in the dashboard header that pulses softly when SRS items are due. One tap = speaking-only micro-review (3 items max).

### 1.6 Friction cuts
- Remove the intermediate dashboard tab if a single lesson is in progress (deep-link directly).
- Collapse "homework" + "lessons" entry points where they overlap.
- All speaking-task overlays must respect the existing **"never block UI during speaking"** rule in `CelebrationOverlay`.

---

## Phase 2 — Teacher experience (after Phase 1 lands)

Strictly **outside** Creator Studio (locked). Pass focuses on surfaces around it:
- **Curriculum navigation:** unit/lesson tree gets a "needs attention" filter (failing QA, low engagement, high revert count from `mistake_repository`).
- **Adaptive insights panel** on the teacher dashboard: per-student speaking-attempt rate, bravery trend, top 3 stuck patterns. Read-only, pulled from existing `speech_attempts` + adaptive signals.
- **Lesson review tool:** validation badges (governance / QA / stabilization verdicts) surfaced as a single colored strip on each lesson card instead of buried in detail views.

No edits to the Unified Lesson Generator, Blueprint Engine, or generation pipeline.

---

## Out of scope (explicit)
- Auth, routing, `ImprovedProtectedRoute`, `AuthContext`, `CreatorContext` — untouched.
- Generator/blueprint/QA engines — untouched.
- No visual repaint, no new design system, no 3D/shadow effects.
- No DB schema changes. New UI consumes existing tables (`speech_attempts`, `mistake_repository`, `student_motivation_profile`, mastery, XP).

## Success signal
Speaking-attempt rate per lesson session (already tracked in `speech_attempts`). Target: meaningful lift after Phase 1 ships.

## Technical notes
- Hub theming reuses `useHubTheme()` (Playground orange, Academy purple, Success emerald).
- Motivation tone reuses `styleEncouragement()` so copy adapts to learner profile.
- Bravery rewards already exist in `src/gamification/speaking/confidenceRewards.ts` — we change *when* they surface, not the math.
- Celebrations stay routed through `CelebrationOverlay` with `duringSpeakingTask` true on all speaking slides.

```text
Phase 1 order:
  1.3 dashboard hero  →  1.1 intent prompt  →  1.2 speaking slide flow
  →  1.4 completion   →  1.5 ambient reminders  →  1.6 friction cuts
```
