# Content Quality Control & AI Safety System

The **publication gatekeeper** — the final automated reviewer that runs AFTER governance + planning + activities + pronunciation + adaptation. Where governance enforces curriculum rules at generation time, QA inspects the finished lesson artifact and decides if it ships.

## Position in the pipeline

```text
Planner → Governance → Adaptation → Activities → Pronunciation
                                                       │
                                                       ▼
                                              [generated lesson]
                                                       │
                                                       ▼
                                            ┌─────────────────────┐
                                            │ runQualityControl() │  ← NEW
                                            └──────────┬──────────┘
                                                       │
                                          PASS ────────┴──────── FAIL
                                            │                       │
                                            ▼                       ▼
                                  publish to students        block + repair queue
```

## Architecture

All under `src/qa/`. Pure deterministic validators + optional AI-judge for hallucination. No AI calls inside the orchestrator itself — judges are explicit, audited, and cached.

```text
src/qa/
├── index.ts                 → runQualityControl({ lesson, plan, state, context })
├── types.ts                 → QAReport, QAIssue, QAVerdict, severity model
├── orchestrator.ts          → runs all validators, aggregates verdict
├── publishGate.ts           → hard publish/block decision + repair instructions
├── repairDispatcher.ts      → maps failures → existing repair pipelines (activities/pronunciation)
│
├── validators/
│   ├── academicQuality.ts        (1) pedagogical coherence + communication value
│   ├── cefrAccuracy.ts           (2) sentence/grammar/vocab complexity caps per CEFR
│   ├── ageAppropriateness.ts     (3) hub-bound theme/vocabulary/tone audit
│   ├── emotionalSafety.ts        (4) humiliation/anxiety/bullying detector
│   ├── grammarLanguage.ts        (5) AI-phrasing detector + answer-key consistency
│   ├── activityQuality.ts        (6) interaction diversity + cognitive variety
│   ├── narrativeConsistency.ts   (7) character/setting/theme drift
│   ├── jsonStructural.ts         (8) schema + required fields + answer integrity
│   ├── hallucination.ts          (9) AI-judge for fabricated grammar claims/facts
│   └── duplicateDetection.ts     (10) n-gram + activity-fingerprint similarity
│
├── data/
│   ├── unsafeThemeLexicon.ts     → bullying, humiliation, self-harm, slurs, NSFW, gambling
│   ├── ageInappropriateThemes.ts → per-hub bans (Playground bans dating/violence; Success bans childish)
│   ├── cefrComplexityCaps.ts     → sentence_len, clause_depth, lemma_freq_floor per CEFR
│   ├── aiPhrasingMarkers.ts     → "As an AI", "delve into", "in conclusion let me", placeholder tokens
│   └── reservedLexicons.ts      → forbidden/required tokens
│
├── judges/
│   ├── hallucinationJudge.ts    → AI judge prompt (Gemini direct via aiFetch)
│   └── judgeCache.ts            → in-memory + DB-backed cache keyed by content hash
│
└── ui/                          → consumed by content-creator
    └── (see UI Components below)
```

## QAReport contract

```ts
type Severity = 'block' | 'warn' | 'info';
type Domain = 'academic'|'cefr'|'age'|'safety'|'language'|'activity'|'narrative'|'structural'|'hallucination'|'duplicate';

interface QAIssue {
  code: string;            // e.g. 'CEFR_SENTENCE_OVER_CAP'
  domain: Domain;
  severity: Severity;
  message: string;
  locator?: { slideId?: string; activityId?: string; path?: string };
  suggestion?: string;     // human-readable repair hint
  auto_repairable: boolean;
}

interface QAReport {
  verdict: 'publish' | 'repair' | 'block';
  issues: QAIssue[];
  scorecard: Record<Domain, { score: number; passing: boolean }>;
  generated_at: string;
  content_hash: string;
}
```

`verdict`:
- **publish** — zero `block` severity, no critical-domain `warn`
- **repair** — `block` or repeated `warn` issues with `auto_repairable: true`
- **block** — non-repairable failures (safety, hallucination critical, CEFR ceiling)

## Validator details

### 1. academicQuality
- Each activity has `purpose` + `communication_objective` link
- Grammar count vs communication-task count ratio (reject grammar-only)
- Detects worksheet bias (>60% controlled-practice without communicative output)

### 2. cefrAccuracy
- Per-CEFR caps in `cefrComplexityCaps.ts`: max sentence length, max embedded clauses, lemma frequency floor (Zipf), forbidden tense families (already in governance, re-checked at artifact level)
- Cognitive load proxy via Flesch-Kincaid + clause depth

### 3. ageAppropriateness
- Hub-bound theme bans (Playground: dating, violence, alcohol; Success: childish characters, baby talk)
- Maturity score per slide; rejects mismatches

### 4. emotionalSafety (HARD GATE)
- Lexicon scan: humiliation prompts ("laugh at the student who…"), bullying frames, public-comparison tasks
- Speaking task safety: rejects "make fun of", "perform in front of class" without opt-out scaffold
- All hits = `block` severity

### 5. grammarLanguage
- AI-phrasing markers (`"As an AI"`, `"delve into"`, `"It is important to note"`, placeholder `{topic}` leaks)
- Answer-key consistency: MCQ correct answer exists in options; fill-blank answer fits the gap
- Reuses existing `governance/engines/grammarEngine.ts` results but adds artifact-level checks

### 6. activityQuality
- Interaction diversity: ≥4 distinct activity types per lesson
- Repetition cap: no type >3× consecutively
- Cognitive variety: no two adjacent activities sharing same modality + purpose

### 7. narrativeConsistency
- Character/setting present in opening slide must persist (or be explicitly closed) — reuses `narrativeBinder` metadata
- Tone consistency check: no register flips mid-lesson

### 8. jsonStructural
- Zod schemas per activity type
- Required fields, type checks, no `null` in critical paths
- Media URL integrity (basic shape only — no network call)

### 9. hallucination (AI JUDGE)
- Targeted prompt to Gemini direct via existing `aiFetch`
- Inputs: grammar explanations + example sentences + claimed CEFR
- Output: structured JSON `{ verdict, claims_checked: [{claim, accurate, evidence}], confidence }`
- Cached on `content_hash` via `judges/judgeCache.ts` (in-memory + new `qa_judge_cache` row reuse)
- Only runs when grammar/explanation slides present

### 10. duplicateDetection
- 5-gram shingling per activity prompt → Jaccard similarity
- Activity fingerprint = sorted(type + targets + content keys)
- Cross-lesson check optional (current scope: within-lesson)

## Publication gate

`publishGate.ts`:
- `verdict === 'publish'` → set `curriculum_lessons.published = true`, persist report on `qa_report` JSONB column
- `verdict === 'repair'` → dispatch to `repairDispatcher` (calls existing `activityRepair` / `pronunciation` repair) up to 2 attempts; re-run QA
- `verdict === 'block'` → write `qa_report`, leave unpublished, surface report in content-creator UI

## Database (new migration)

Add to existing `curriculum_lessons`:
- `qa_report` JSONB
- `qa_verdict` TEXT  -- 'publish' | 'repair' | 'block' | null
- `qa_checked_at` TIMESTAMPTZ
- `qa_content_hash` TEXT

New table `qa_judge_cache`:
- `content_hash` PK
- `judge_name` TEXT
- `result` JSONB
- `created_at` TIMESTAMPTZ
- RLS: admin + content_creator read, system write

## Integration points (read-only impact)

- `src/ai/lesson-generation/*` orchestrators call `runQualityControl(...)` before persisting `published=true`
- `Co-Pilot Studio` publish button gated on `qa_verdict === 'publish'`
- Existing `governance` continues as the generation-time contract; QA is the post-generation auditor (no logic overlap, complementary scopes)

## UI Components

- `src/components/qa/QAReportPanel.tsx` — domain scorecard, expandable issues, repair hints
- `src/components/qa/QABadge.tsx` — verdict pill (publish/repair/block) for lesson list rows
- `src/components/qa/SafetyAlertBanner.tsx` — red banner when emotional-safety block triggered
- Wire into Content Creator lesson editor and admin lesson review queue

## Validation rules (meta)
- Hard gates: emotionalSafety, jsonStructural, age-inappropriate for Playground
- Soft gates (warn → auto-repair): activityQuality, duplicateDetection, narrativeConsistency
- Mid gates: cefrAccuracy and grammarLanguage produce `block` if score < threshold, `warn` otherwise

## Memory
- New: `mem://qa/content-quality-control` — binding contract, validator list, publish gate
- Update `mem://index.md` Core: "Lessons MUST pass `runQualityControl()` (`src/qa/`) before `published=true`. Emotional safety and structural validity are hard gates. AI hallucination judge runs on grammar slides via Gemini direct, cached by content hash."

## Out of scope
- Re-implementing governance/planning validators (QA wraps and complements them, never duplicates)
- Cross-lesson plagiarism / curriculum-wide duplicate detection (future)
- Live moderation of student-generated content (separate system)
- Teacher manual override UI (admin-only path; not in this build)
- Multi-language safety lexicons beyond English (current scope: EN content)
