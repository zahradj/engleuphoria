# Educational Stabilization Engine

A new layer that sits **after** orchestration and **alongside** QA, continuously monitoring and improving the pedagogical quality of every generated lesson and the curriculum-wide learning trajectory of every student. Nothing replaces existing systems — this is the "professional editor" layer that ensures lessons feel designed, not generated.

## 1. Scope

In scope:
- New `src/stabilization/` engine with coherence, flow, cognitive-load, retention, and consistency validators.
- Integration as **Stage 9.5** in `runLessonGeneration()` (between QA `qualityControl` and `publish`), plus a longitudinal post-lesson analyzer that runs on `feedbackLoop` signals.
- New DB tables for pedagogical telemetry + repair signals.
- Memory rules pinning the contract.

Out of scope:
- No new student-facing UI screens (only a small admin/content-creator "Pedagogical Health" panel reusing existing components).
- No changes to lesson player rendering, no new AI providers, no curriculum re-authoring.

## 2. Architecture

```text
runLessonGeneration()
  ├─ … existing stages 1-8 …
  ├─ 9.  qualityControl  (existing — safety + hallucination)
  ├─ 9.5 stabilization   (NEW — pedagogical quality)
  │     ├─ coherenceValidator
  │     ├─ flowValidator
  │     ├─ cognitiveLoadValidator
  │     ├─ speakingIntegrationValidator
  │     ├─ retentionValidator
  │     └─ stabilizationRepair (≤2 passes, planner-bounded)
  └─ 10. publish

feedbackLoop (post-lesson)
  └─ longitudinalAnalyzer
        ├─ skillProgressionMonitor
        ├─ activityBalanceMonitor
        ├─ fatigueMonitor
        └─ curriculumDriftMonitor
              └─ emits CurriculumStabilizationSignal → next runLessonGeneration
```

## 3. Per-lesson validators (`src/stabilization/validators/`)

Each validator takes `LessonContext` and returns `{ verdict: pass|repair|block, issues: Issue[], metrics: Record }`.

- **coherenceValidator** — narrative thread continuity (binder tokens reused ≥N), vocab recycling ≥3, topic drift score, abrupt-transition detector between adjacent activities.
- **flowValidator** — checks 6-slide arc (Warm-Up → Prime → Mimic → Practice → Produce → Cool-Off), scaffolding monotonicity (GRR: I-do → We-do → You-do), reflection + closure presence.
- **cognitiveLoadValidator** — token-per-slide budget by CEFR + age, new-vocab density cap, grammar-construct-per-slide cap, instruction length, fatigue curve (front-loaded difficulty, eased close).
- **activityBalanceValidator** — no >2 consecutive same activity type; receptive/productive ratio per hub; speaking-opportunity floor per lesson length.
- **speakingIntegrationValidator** — pronunciation focus actually exercised, BRAVERY-reward path exists, shadowing/produce step present for CEFR ≥ A2.
- **retentionValidator** — SRS targets surfaced, callback to previous unit vocab, recycle of last-lesson errors from mistake repository.

All thresholds live in `src/stabilization/policy.ts` and are **hub × CEFR × age** keyed (Playground tolerances looser on grammar, stricter on fatigue; Success stricter on coherence).

## 4. Repair pipeline (`stabilizationRepair.ts`)

- Up to **2 passes**, each bounded by the **planner blueprint** and **governance state** (cannot raise CEFR, cannot add forbidden grammar).
- Repair operations: re-sequence activities, inject reflection beat, swap repetitive activity for adjacent-type variant from the same plan, compress over-long instructions, add missing recycling slot.
- After repairs, re-run the failed validators only. Persistent `block` verdicts halt publish and write to `orchestrator_runs.conflicts`.

## 5. Longitudinal analyzer (`src/stabilization/longitudinal/`)

Runs inside `feedbackLoop` after each completed lesson:

- **skillProgressionMonitor** — checks 4-skill balance over last N lessons; flags under-served skill.
- **activityBalanceMonitor** — detects activity-type fatigue across lessons (e.g. 5× drag-drop in a row).
- **fatigueMonitor** — engagement + accuracy decay slope from `student_motivation_profile` + `student_mastery`.
- **curriculumDriftMonitor** — verifies hub-identity divergence (B1 Playground ≠ B1 Academy) over the running unit.

Output: `CurriculumStabilizationSignal` rows consumed at the **start** of the next `runLessonGeneration()` and merged into `LessonContext.adaptive` via a new `applyStabilizationSignals()` step, respecting the 8-tier priority matrix (these are **soft tier 6 — adaptive**; CEFR/curriculum still win).

## 6. Database (1 migration)

- `pedagogical_quality_reports` — `lesson_id`, `student_id` (nullable for template runs), `verdicts` JSONB (per validator), `metrics` JSONB, `repairs_applied` JSONB, `final_verdict`, `created_at`. RLS: admins + content_creators read; service role write.
- `curriculum_stabilization_signals` — `student_id`, `signal_type` (`skill_imbalance | activity_fatigue | learner_fatigue | hub_drift`), `payload` JSONB, `consumed_at` nullable, `created_at`. RLS: self select, admins read all, service role write. Index `(student_id, consumed_at NULLS FIRST, created_at DESC)`.

## 7. Integration points

- `src/orchestrator/pipeline.ts` — add `stabilization` stage between `qualityControl` and `publish`; add `applyStabilizationSignals` pre-planner step.
- `src/orchestrator/feedbackLoop.ts` — invoke `runLongitudinalAnalysis()` after existing mutations.
- `src/orchestrator/types.ts` — extend `LessonContext.qa` with `stabilization` block.
- Memory: add Core rule + new file `mem://qa/educational-stabilization-engine` describing contract, validators, repair bounds, and the "soft tier 6" signal channel.

## 8. Admin/Creator visibility (minimal UI)

A single panel on `/content-creator` lesson detail (reusing existing card components) showing the latest `pedagogical_quality_reports` row: per-validator verdict chips, metrics sparkline, repair history. No new routes, no design tokens added.

## 9. Files

**New (~16):**
- `src/stabilization/{index.ts, types.ts, policy.ts, orchestrator.ts, stabilizationRepair.ts}`
- `src/stabilization/validators/{coherence,flow,cognitiveLoad,activityBalance,speakingIntegration,retention}Validator.ts`
- `src/stabilization/longitudinal/{index.ts, skillProgression.ts, activityBalance.ts, fatigue.ts, curriculumDrift.ts}.ts`
- `src/components/content-creator/PedagogicalHealthPanel.tsx`
- 1 Supabase migration

**Edited:**
- `src/orchestrator/pipeline.ts`, `feedbackLoop.ts`, `types.ts`
- `mem://index.md` (+ new memory file)

## 10. Acceptance

- Every `runLessonGeneration()` produces a `pedagogical_quality_reports` row.
- Publish is blocked when any validator returns `block` after 2 repair passes.
- Hard tiers (CEFR / curriculum / age / safety) are never overridden by stabilization repairs or signals.
- Longitudinal signals affect at most the next lesson's adaptive layer (tier 6), never CEFR ceiling.
