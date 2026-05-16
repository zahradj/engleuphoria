# Adaptive Learning & Mastery System

Layered on top of the existing Governance → Planning → Activities → Pronunciation pipeline. This becomes the **5th pillar**: a per-learner intelligence layer that personalizes every generated lesson without breaking curriculum integrity.

## Architecture

```text
LearnerProfile ──► MasteryTracker ──► ErrorPatternDetector
       │                  │                    │
       ▼                  ▼                    ▼
   AdaptiveDifficulty ◄── ReviewScheduler ──► PersonalizedAdjuster
       │                                        │
       ▼                                        ▼
   SpeakingSupport ◄── ConfidenceTracker ──► LessonPlanner (existing)
                                                │
                                                ▼
                                        Activities + Pronunciation
                                        (inherit adaptation context)
```

All modules live under `src/adaptive/` and feed a single `AdaptationContext` that is prepended to the existing prompt chain (`planner → governance → adaptation → activity`).

## Module Breakdown

### 1. `src/adaptive/profile/` — Learner Profile Engine
- `types.ts` → `LearnerProfile` (hub, CEFR, strengths[], weaknesses[], engagement_style, preferred_pacing, anxiety_level)
- `profileBuilder.ts` → bootstraps from placement test + onboarding
- `profileUpdater.ts` → mutates profile after each lesson via mastery deltas
- Persisted on new table `learner_profiles` (JSONB blob + indexed columns)

### 2. `src/adaptive/mastery/` — Mastery Tracking Engine
- Per-skill records: `{ skill, mastery: 0-100, confidence: 0-100, trend, review_priority, last_seen }`
- Skill domains: grammar, vocabulary, pronunciation, reading, listening, speaking, fluency, communication_goal
- `masteryCalculator.ts` → weighted formula (recency × accuracy × delayed-recall × communicative-use)
- Mastery gate: ≥85% sustained across 3 exposures with ≥1 communicative application
- Persisted on `skill_mastery` table (one row per student × skill)

### 3. `src/adaptive/difficulty/` — Adaptive Difficulty Engine
- `difficultyResolver.ts` → outputs `DifficultyProfile { sentence_length_cap, scaffolding_level, support_density, challenge_tier }`
- CEFR-bounded: adaptations never cross hub CEFR matrix
- Hooks into planner `cognitiveLoad.ts` as a multiplier, not a replacement

### 4. `src/adaptive/review/` — Intelligent Review System
- Modified SM-2 spaced repetition keyed to mastery + confidence + error frequency
- `reviewScheduler.ts` → emits `ReviewQueue` (vocab, grammar, pron items due)
- Feeds `vocabRecycler.ts` and `pronunciationRunner.ts` with priority items
- Supports: retrieval practice, interleaving, spiral reinforcement

### 5. `src/adaptive/errors/` — Error Pattern Detection
- `errorClassifier.ts` → taxonomy (omission, substitution, overgeneralization, L1 interference, pronunciation_substitution, word_stress)
- `patternAggregator.ts` → frequency + recency + severity scoring
- Consumes existing `mistake_repository` table (extends, doesn't replace)
- Emits `corrective_recommendations[]` consumed by adjuster

### 6. `src/adaptive/personalization/` — Personalized Lesson Adjuster
- `lessonAdjuster.ts` → main entry `adaptLessonPlan(plan, profile, mastery, errors)`
- Pre-teaches weak vocab, swaps reading passages within CEFR band, injects targeted speaking tasks
- Runs **after** `generateLessonPlan()`, **before** `runGovernance()` — preserves contract

### 7. `src/adaptive/engagement/` — Confidence & Engagement Tracking
- Signals: speaking turn ratio, hesitation latency, retry rate, completion %, challenge acceptance
- `engagementScorer.ts` → `EngagementState { confidence, motivation, frustration_risk }`
- Drives emotional difficulty: shorter cycles, lower-pressure speaking, hype boosters

### 8. `src/adaptive/speaking/` — Adaptive Speaking Support
- Tiered scaffolds: sentence_starters → guided_frames → open_communication → debate/improv
- `speakingSupportResolver.ts` → injected into `narrativeBinder` + `pronunciationRunner`

### 9. `src/adaptive/promptInjector.ts`
- `buildAdaptationSystemPrompt(profile, mastery, difficulty, review, speaking)`
- Inserted **after** planner+governance, **before** activity/pronunciation prompts
- Single source of personalization context for all AI calls

### 10. `src/adaptive/index.ts`
- `runAdaptation({ studentId, plan })` → orchestrates all 8 engines, returns `AdaptationContext`
- Pure orchestrator — no AI calls; consumed by the existing lesson generator

## Hub Adaptation Profiles
`src/adaptive/hubAdaptationProfiles.ts`:
- **Playground**: short cycles (≤90s), visual scaffold mandatory, repetition weight ×1.5, no failure states
- **Academy**: identity-sensitive copy, peer-challenge tier unlocks, confidence shield (no public correction)
- **Success**: efficiency mode, business communication scaffolds, fluency-first over accuracy-first

## Database (new migration)
- `learner_profiles` (student_id PK, profile JSONB, updated_at) — RLS: owner + teacher of student
- `skill_mastery` (student_id, skill_domain, skill_key, mastery, confidence, trend, last_seen) — composite PK
- `review_queue` (student_id, item_type, item_key, due_at, priority) — indexed on (student_id, due_at)
- `engagement_signals` (student_id, lesson_id, signals JSONB, recorded_at)
- Extends `mistake_repository` with `pattern_category`, `frequency_score` columns

All tables use `auth.uid()` RLS + `has_role(auth.uid(), 'teacher')` read policy for assigned students.

## UI Components
- `src/components/adaptive/LearnerProfilePanel.tsx` — teacher view of profile + mastery heatmap
- `src/components/adaptive/MasteryRadar.tsx` — student-facing skill radar chart
- `src/components/adaptive/AdaptationReportPanel.tsx` — content creator view of why a lesson was adapted

## Integration Points (read-only impact on existing code)
- `src/planning/lessonPlanner.ts` → calls `runAdaptation()` after plan validation
- `src/activities/generation/activityGenerator.ts` → consumes `AdaptationContext.difficulty + review queue`
- `src/pronunciation/pronunciationRunner.ts` → consumes `AdaptationContext.errors.pronunciation`
- Prompt chain order becomes: `planner → governance → **adaptation** → narrative → activity/pronunciation`

## Validation
`src/adaptive/validator.ts` — rejects:
- adaptations that cross CEFR ceiling for hub
- difficulty deltas > 2 tiers in one lesson
- review-only lessons with no new input
- remedial loops repeating same skill ≥3 lessons without variation

## Memory
- New: `mem://adaptive/learning-system` — binding contract for personalization
- New: `mem://adaptive/mastery-progression` — mastery gate + progression rules
- Update `mem://index.md` Core: "Every lesson generation MUST call `runAdaptation()` after planning and prepend `buildAdaptationSystemPrompt()` before activity prompts. No static lesson delivery."

## Out of scope
- Replacing the existing `mastery-reporting-loop` (extends it)
- Live classroom realtime adaptation (post-MVP)
- Teacher manual override UI (separate task)
- ML model training — uses deterministic rules + AI prompts only
