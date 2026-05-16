# Intelligent Activity Generation System

A new `src/activities/` module that turns a validated `LessonPlan` (planner) + `LessonState` (governance) into a sequenced, validated list of activities. Activities are never generated in isolation — they inherit theme, CEFR, grammar/vocab scope, pacing, and hub identity from the upstream contracts.

## Architecture

```
src/activities/
  types.ts                    # ActivitySpec, ActivityPurpose, GenerationContext
  catalog/
    activityCatalog.ts        # All supported types + metadata (stage fit, modalities, CEFR range, hub fit)
    hubActivityProfiles.ts    # Playground/Academy/Success preferences & bans
  selection/
    activitySelector.ts       # Picks activity types per flow stage (no randomness — weighted by fit score)
    sequencer.ts              # Orders activities, enforces pacing/cognitive load from planner
    fitScorer.ts              # Score(stage, cefr, hub, recentModalities, loadBudget)
  generation/
    activityPromptBuilder.ts  # Per-type Gemini prompt builder (inherits planner+governance prompts)
    narrativeBinder.ts        # Injects theme, characters, setting, recurring scenario into every prompt
    vocabRecycler.ts          # Tracks which target words have appeared; forces recycling per VocabRecyclingPlan
    grammarContextualizer.ts  # Wraps grammar targets in communicative scenarios (no isolated drills)
    activityGenerator.ts      # Main entry: generateActivities(plan) → ActivitySpec[]
  validation/
    activityValidator.ts      # Per-activity hard checks (placeholders, MCQ sanity, answer presence)
    coherenceValidator.ts     # Cross-activity: theme drift, repetition, vocab coverage, pacing
    activityRepair.ts         # Targeted regeneration prompt for a single failing activity
  index.ts
```

## Core Types

```ts
type ActivityPurpose =
  | 'hook' | 'input' | 'discovery' | 'controlled'
  | 'communicative' | 'production' | 'reflection' | 'review';

type ActivityType =
  | 'warmup' | 'poll' | 'opinion' | 'matching' | 'drag_drop'
  | 'fill_blank' | 'sentence_builder' | 'pronunciation'
  | 'reading' | 'listening' | 'roleplay' | 'debate'
  | 'speaking_mission' | 'storytelling' | 'collaborative'
  | 'reflection' | 'retrieval' | 'review_challenge';

interface ActivitySpec {
  id: string;
  type: ActivityType;
  purpose: ActivityPurpose;
  stage: PedagogicalStage;
  modalities: Modality[];
  target_vocab_used: string[];
  grammar_targets_used: string[];
  narrative_anchor: { characters: string[]; setting: string; scene: string };
  content: any;          // type-specific JSON payload
  estimated_load: 'low' | 'medium' | 'high';
}
```

## Pipeline (no random generation)

```text
LessonPlan (planner) ──► activitySelector ──► sequencer ──► activityGenerator (Gemini)
       │                       │                  │                  │
       ▼                       ▼                  ▼                  ▼
  LessonState         pick types per stage   enforce pacing   prompts inherit:
  (governance)        via fitScorer          + recycling      planner prompt +
                                                              governance prompt +
                                                              narrative binder
                                                                   │
                                                                   ▼
                                              activityValidator (per item)
                                              coherenceValidator (whole set)
                                                                   │
                                                                   ▼
                                              activityRepair on failures (max 2 passes)
```

## Selection Logic (fitScorer)

For each stage slot in `flow_map`, score every catalog entry:
- +stage fit, +hub fit, +CEFR fit
- −recent same-modality (anti-fatigue, uses planner `cognitive_load`)
- −type already used in last N slides (anti-repetition)
- +vocab recycling debt (favors types that surface under-recycled words)
- Hard reject if banned by hub profile or above CEFR.

Highest score wins → deterministic, explainable, no randomness.

## Generation Rules

Every Gemini call is composed as:
```
buildPlannerSystemPrompt(plan)
+ buildGovernanceSystemPrompt(plan.lesson_state)
+ buildNarrativeBinder(plan, previousActivities)
+ buildActivityPrompt(type, purpose, vocabDebt, grammarTarget)
```

Narrative binder enforces:
- Same characters/setting from `lesson_state.theme`.
- Scene continuity (references previous activity outcome).
- Tone matches `blueprint.emotional_tone`.

Grammar contextualizer wraps targets in scenarios — never "Conjugate the verb" style drills.

## Validation Gates

Per activity (hard errors → repair):
- Placeholder/empty content
- Missing answer key on MCQ/fill-blank
- Vocab outside target+support+function words
- Grammar outside target+review+exposure
- Sentence length > CEFR cap

Whole-lesson coherence (hard errors → repair or block):
- Theme drift between activities
- < 3 stage-appearances for any target word (violates `VocabRecyclingPlan`)
- Two adjacent same-type activities
- Receptive streak > planner's `max_consecutive_receptive`

## Hub Activity Profiles

- **Playground**: favors `drag_drop`, `matching`, `storytelling`, `pronunciation`; bans `debate`, `professional roleplay`; short cycles (2–3 slides per purpose).
- **Academy**: favors `roleplay`, `opinion`, `collaborative`, `speaking_mission`; identity-driven prompts.
- **Success**: favors `roleplay`, `debate`, `speaking_mission`, `review_challenge`; realistic workplace/life scenarios.

## Integration Points

- New entry: `generateActivities(plan)` consumed by `ai-lesson-generator` edge function and the Content Creator's AI Co-Pilot Studio.
- Result is persisted as the slides array on `curriculum_lessons`, with `governance_status` set by the existing `runGovernance()` pass after generation.
- UI: add `ActivityCoherencePanel` next to existing `GovernanceReportPanel` to surface coherence issues + per-activity "Regenerate" buttons.

## Memory

Add `mem://activities/intelligent-generation` capturing:
- Activities MUST be produced via `generateActivities(plan)` — never ad-hoc.
- Every prompt MUST chain planner + governance + narrative binder.
- Vocab recycling, pacing, and hub profile are hard constraints, not suggestions.

Update `mem://index.md` Core to add: "Activity generation routed through `src/activities/generateActivities()` — no isolated AI exercise calls."

## Out of scope (this iteration)

- Editing existing `ai-lesson-generator` edge function payloads (separate wiring task).
- New DB columns (reuses `curriculum_lessons.lesson_state` + `governance_report`).
- New activity renderer components (existing renderers are reused; only JSON schema is produced).
