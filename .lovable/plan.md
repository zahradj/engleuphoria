# Gamification & Motivation System — Implementation Plan

## Goal
Build a pedagogically-aligned motivation ecosystem (`src/gamification/`) that layers on top of the existing curriculum stack (planner → governance → activities → pronunciation → adaptive → QA). Gamification must **reinforce mastery**, never replace it.

## Scope Boundaries
- **In scope:** Architecture, scoring/award logic, mission generation, mastery visualization data, hub-themed reward profiles, adaptive motivation, celebration triggers, DB schema, prompt injection for AI-generated quests.
- **Out of scope:** Re-implementing existing `useStudentXP`, `useStudentStreak`, `useRewards`, `AchievementBadge`, `award-xp` edge function — these will be **wrapped, not replaced**. Visual avatar/vault systems remain in their current modules.
- **Anti-overlap:** No re-implementation of mastery calc (lives in `src/adaptive/mastery/`), no duplicate review scheduling (lives in `src/adaptive/review/`), no replication of governance/QA.

---

## Architecture

```text
src/gamification/
├── index.ts                          # runGamification() orchestrator
├── types.ts                          # XPEvent, Mission, Achievement, MotivationProfile, Celebration
├── hubGamificationProfiles.ts        # Playground/Academy/Success reward tone, visuals, density
│
├── xp/
│   ├── xpRules.ts                    # action → base XP, multipliers (effort, mastery, bravery)
│   ├── xpAwarder.ts                  # pure award resolver (no DB) — wraps existing award-xp call
│   └── antiFarmingGuards.ts          # rate caps, passive-click detection, quality gates
│
├── achievements/
│   ├── achievementCatalog.ts         # meaningful badges tied to skills (Pronunciation Hero, etc.)
│   ├── achievementEvaluator.ts       # checks unlock conditions against mastery + activity logs
│   └── tierResolver.ts               # bronze→platinum progression
│
├── missions/
│   ├── missionTemplates.ts           # narrative archetypes (mystery, travel, interview, debate)
│   ├── missionGenerator.ts           # binds lesson plan → mission narrative via AI prompt
│   ├── missionPromptBuilder.ts       # buildMissionSystemPrompt(plan, hub, profile)
│   └── missionValidator.ts           # ensures mission ≠ distraction, aligns with plan objectives
│
├── streaks/
│   ├── streakResolver.ts             # compassionate streak logic (freeze tokens, recovery)
│   └── streakTypes.ts                # learning, speaking, review, pronunciation streaks
│
├── mastery-viz/
│   ├── masteryProjector.ts           # converts adaptive mastery → visualization data
│   └── skillTreeBuilder.ts           # grammar/vocab/pron/fluency tree structure per hub
│
├── speaking/
│   └── confidenceRewards.ts          # rewards bravery (attempt) > correctness (score)
│
├── motivation/
│   ├── motivationProfiler.ts         # classifies learner: challenge/achievement/social/explorer/anxious
│   ├── encouragementStyler.ts        # picks message tone per profile
│   └── adaptiveRewardScaler.ts       # adjusts reward density by engagement (from adaptive layer)
│
├── social/
│   └── collaborativeMissions.ts      # partner/classroom goals, anti-toxicity guards
│
├── celebration/
│   ├── celebrationTriggers.ts       # mastery up, streak milestone, speaking bravery, etc.
│   └── feedbackComposer.ts           # personalized celebration copy
│
├── governance/
│   └── gamificationGuards.ts         # hard rules: no pedagogy distraction, no humiliation
│
└── promptInjector.ts                 # buildGamificationSystemPrompt() — chains AFTER adaptation
```

## Pipeline Position
```text
planner → governance → adaptive → pronunciation → activities → gamification → QA → publish
                                                                ↑
                                                    wraps activities with mission framing
                                                    + emits XP/achievement triggers
```

## Key Integration Points
1. **Lesson generation** — `generateMission({ plan, hub, profile })` runs BEFORE activity generation prompt; `buildGamificationSystemPrompt()` chains AFTER `buildAdaptationSystemPrompt()`, BEFORE narrative binder.
2. **Adaptive layer** — reads `MotivationProfile` from `motivationProfiler` and feeds it back into `runAdaptation()` engagement scoring.
3. **QA layer** — adds `gamificationGuards` check: mission framing must not violate emotional safety or distract from lesson objective.
4. **Existing hooks** — `useStudentXP`, `useStudentStreak`, `useRewards` continue to power UI. New `useMotivationProfile`, `useActiveMissions`, `useSkillTree`, `useAchievementProgress` hooks added.
5. **award-xp edge function** — extended (not replaced) to accept new action types (`speaking_bravery`, `pronunciation_attempt`, `mission_complete`, `mastery_milestone`, `review_streak`) with anti-farming caps.

## Hub Profiles (`hubGamificationProfiles.ts`)
- **Playground:** high reward density, collectibles, animated celebrations, narrative mascots, no failure-shame ever.
- **Academy:** identity progression, cooperative events, modern badges, moderate density.
- **Success:** sparse premium milestones, fluency/professional tracker, elegant non-childish copy.

## Database (single migration)
- **`student_motivation_profile`** — student_id PK, profile_type, encouragement_style, reward_density, last_recomputed_at, signals JSONB. RLS: student self + admins.
- **`student_missions`** — id, student_id, lesson_id, narrative JSONB, status (active/completed/abandoned), started_at, completed_at. RLS: student self.
- **`student_achievements`** — student_id, achievement_id, tier, unlocked_at, evidence JSONB. RLS: student self read, system insert.
- **`student_skill_tree`** — student_id, hub, tree JSONB (denormalized projection from mastery), updated_at. RLS: student self.
- **`celebration_events`** — id, student_id, trigger_type, payload JSONB, shown_at. RLS: student self.
- **`student_xp` extension** — add `streak_freezes_remaining` INT default 2, `motivation_last_signal` TIMESTAMPTZ.

## UI Components (`src/components/gamification/`)
New (do not duplicate existing):
- `MissionCard.tsx` — active mission framing
- `SkillTreePanel.tsx` — mastery visualization per hub
- `CelebrationOverlay.tsx` — adaptive celebration moments
- `MotivationCoach.tsx` — personalized encouragement banner
- `SpeakingBraveryBadge.tsx` — bravery (not correctness) indicator

## Governance Rules (Hard-Enforced)
1. XP cannot be awarded for passive clicks (anti-farming guard).
2. Mission narrative MUST trace back to a `plan.objective` — validated by `missionValidator`.
3. Streak loss never blocks lesson access or reduces XP.
4. Celebrations cannot interrupt active speaking/communication tasks.
5. No public rankings in Playground; opt-in cooperative only in Academy/Success.
6. AI-generated mission copy passes QA `emotionalSafety` + `ageAppropriateness`.

## Memory Updates
- Create `mem://gamification/system` — system contract, hub profiles, anti-farming rules, integration order.
- Update `mem://index.md` Core rule: "Gamification reinforces mastery — never replaces it. All XP/missions/achievements flow through `runGamification()`."

## Out of Scope (explicit)
- Avatar/Vault inventory (already in `inventoryUnlockService`, `Dynamic Avatar System`)
- Leaderboard infrastructure beyond schema stubs
- Real-time multiplayer mission sync
- Monetary rewards / cash-equivalents
- Replacing existing `useRewards` classroom-side animations
