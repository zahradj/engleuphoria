## Engleuphoria Hub Structure Expansion Plan

Expand the three hubs to support broader CEFR ranges while preserving hub identity, age framing, and pedagogical differentiation.

### 1. Update Hub CEFR Ranges (Single Source of Truth)

Update `src/config/hubConfigs.ts` `HUB_CONFIGS.cefrRange`:

- **Playground** (4–9): `Pre-A1 → B1` (was `Pre-A1 → A2`)
- **Academy** (10–17): `Pre-A1 → C1` (was `A2 → B2`)
- **Success** (18+): `Pre-A1 → C1` (was `B1 → C2`)

Update each `ai_persona` and `phonics_rule` block so the AI prompt encodes the new ceilings AND the hub-identity constraints (see Section 3).

### 2. Update Placement Test Funnels

In `src/components/placement/`:
- `PlaygroundTest.tsx` — allow result band up to B1
- `AcademyTest.tsx` — extend up to C1 (currently A1→B2)
- `SuccessTest.tsx` — extend floor down to Pre-A1, ceiling C1

Audit `AIPlacementTest.tsx` IRT weighting + level-band clamp logic so each hub's `forcedHub` respects the new min/max.

### 3. Hub Identity Guardrails in AI Prompts

Add explicit pedagogical rules to each persona so identical CEFR levels diverge by hub:

- **Playground B1**: story-driven, visual, implicit grammar, playful tone, max 10-word sentences, no abstract corporate themes.
- **Academy C1**: teen-modern register, argumentation/analysis/persuasion, IELTS/TOEFL/debate themes, NO corporate tone.
- **Success C1**: professional realism, premium lexical fluency, negotiation/career themes, NO childish/teen themes.

These constraints flow through `useUnifiedLessonGenerator` automatically since it reads `HUB_CONFIGS`.

### 4. Curriculum Data Map

Audit `src/data/masterCurriculum.ts` (Master Data Map) for missing CEFR units per hub. Add scaffolds for:
- Playground B1
- Academy Pre-A1, A1, C1
- Success Pre-A1, A1, A2

Each new entry follows existing 10-unit / 6-lesson architecture (per `mem://curriculum/spiral-staircase-dependency-map`).

### 5. Hub-Aware Lesson Validators

Update `src/utils/validatePedagogy.ts` (and any wizard validation) to:
- Accept the broader CEFR range per hub.
- Reject lessons whose tone/theme mismatches hub identity even at matching CEFR (e.g., reject "corporate negotiation" in Academy C1).

### 6. UI Surfaces to Refresh

- **Hub dashboards** (`PlaygroundDashboard`, `AcademyDashboard`, `HubDashboard`) — level selectors / progress trees must render the expanded ladders.
- **Living Roadmap** — extend node arrays per hub.
- **Creator Studio** level pickers (`AcademyCreator`, `PlaygroundCreator`, `SuccessCreator` + Wizard) — surface the new CEFR options bound by hub.
- **Game Maker** (`GameMaker.tsx`) — extend its `level` dropdown to honor the per-hub allowed range (instead of a flat A1–C2 list).

### 7. Documentation / Memory

Update memory entries:
- `mem://design/hub-personas-and-branding` — new CEFR ranges + identity guardrails.
- `mem://curriculum/spiral-staircase-dependency-map` — note new units.
- Add new memory `mem://curriculum/hub-cefr-matrix` capturing the "B1 Playground ≠ B1 Academy ≠ B1 Success" rule as a Core constraint.

### Technical Notes

- No DB migration required for the level expansion itself (CEFR is stored as text on `curriculum_lessons` / `learning_games`). New `learning_games.level` values fit existing CHECK constraint (A1–C2).
- Bookings/pricing untouched: Playground stays 30 min @ half price even at B1; Academy/Success stay 60 min full price.
- Multi-role + routing logic unchanged.
- All changes are presentation + config + prompt-engineering; no business-logic refactor.

### Out of Scope (ask before doing)

- Authoring the actual lesson content for the newly enabled CEFR slots (large content generation pass — confirm scope first).
- Adding C2 anywhere (explicitly removed in your spec — current Success Hub C2 will be deprecated to C1 ceiling).
