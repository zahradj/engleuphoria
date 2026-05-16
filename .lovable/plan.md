## Curriculum Governance System

Transform lesson generation from free-form AI output into rule-bound, validated, hub-aware curriculum production. All governance is **prompt + validation** layered around the existing Gemini-direct pipeline — no replacement of `ai-lesson-generator` or wizard architecture.

### 1. Architecture

```text
┌──────────────────────────────────────────────────────────┐
│  LessonStateContract  (single source of truth per lesson)│
│  hub · cefr · theme · characters · tone · goal · setting │
│  grammar{target,review,blocked,exposure}                 │
│  vocab{target,support,recycled,forbidden_categories}     │
│  sequence_template                                       │
└───────────────┬──────────────────────────────┬───────────┘
                │ injected into every prompt   │ validated against every output
                ▼                              ▼
       ┌────────────────┐             ┌────────────────────┐
       │ Governance     │             │ Validation Engine  │
       │ Prompt Builder │             │ (7 sub-validators) │
       └────────────────┘             └─────────┬──────────┘
                                                │ pass → publish
                                                │ fail → repair-or-reject
```

All governance code lives under `src/governance/` (pure TS, no React) so it's reusable by Wizard, Co-Pilot, ai-lesson-generator edge fn, and future SCORM/H5P exporters.

### 2. Files to create

**Schemas (Zod) — `src/governance/schemas/`**
- `lessonState.ts` — `LessonStateSchema` (the contract above) + `LessonState` type
- `grammarPolicy.ts` — `{target_grammar, review_grammar, blocked_grammar, exposure_grammar}`
- `vocabPolicy.ts` — `{theme, target_vocab, support_vocab, recycled_vocab, forbidden_vocab_categories}`
- `themePolicy.ts` — characters / tone / goal / setting
- `cefrPolicy.ts` — per-CEFR caps (sentence length, clause depth, abstractness flag, max syllables)
- `slidePolicy.ts` — per-activity output shape (used by validator)

**Engines — `src/governance/engines/`**
- `grammarEngine.ts` — `validateGrammar(slide, policy)` scans text for blocked tense/structure patterns (regex + small grammar fingerprint table)
- `vocabEngine.ts` — `validateVocab(slide, policy)` — checks every content-word is in target/support/recycled OR allowed-stopwords; flags forbidden-category terms via lexicon map
- `themeEngine.ts` — `validateTheme(slide, state)` — ensures referenced names/setting/tone match; rejects unrelated scenarios
- `cefrEngine.ts` — `validateCEFR(slide, cefr)` — Flesch-Kincaid / clause counter / banned-construction list per level
- `sequenceEngine.ts` — `validateSequence(slides)` — Hook→Context→Input→Discovery→Controlled→Communicative→Reflection ordering, no >2 consecutive same modality, mandatory communicative slide every N slides
- `qualityEngine.ts` — rejects placeholders (`lorem`, `New sentence here.`, empty prompts, duplicate exercises, mismatched MCQ keys, malformed JSON, incomplete sentences)

**Orchestrator — `src/governance/`**
- `governanceRunner.ts` — `runGovernance(slides, state): GovernanceReport` runs all 7 engines, returns `{passed, errors[], warnings[], slideIndex?}`
- `repairPipeline.ts` — for soft failures, builds a targeted re-prompt for the offending slide only (single-slide regeneration, not whole lesson)
- `promptInjector.ts` — `buildGovernanceSystemPrompt(state)` produces the contract block prepended to every Gemini prompt (used by all generation edge fns and the Co-Pilot Studio)

**Lexicons / Rule tables — `src/governance/data/`**
- `blockedGrammarPatterns.ts` — regex fingerprints per grammar construct (passive voice, third conditional, future perfect, etc.)
- `cefrCaps.ts` — `{A1:{maxSentenceWords:8,maxClauses:1,…}, …, C1:{…}}`
- `forbiddenCategoryLexicon.ts` — keyword sets per category (business, medical, environmental, etc.)
- `stopwords.ts` — function-word allowlist for vocab engine

**Persistence**
- DB migration: new column `curriculum_lessons.lesson_state JSONB` (the active contract) + `curriculum_lessons.governance_report JSONB` (last validation result) + `curriculum_lessons.governance_status TEXT CHECK IN ('pending','passed','failed','published')`. RLS: read same as existing; write restricted to teachers/creators/admin.
- Index on `(governance_status, hub)`.

**UI surfaces (minimal, presentation)**
- `src/components/governance/GovernanceBadge.tsx` — pass/fail/warnings chip used in Creator lists
- `src/components/governance/GovernanceReportPanel.tsx` — collapsible error list per slide inside the Wizard / Co-Pilot review step
- Hook publish buttons (Wizard, Co-Pilot, all 3 Creator pages) so they refuse to publish when `governance_status !== 'passed'`, with override only for `admin` role

### 3. Integration points

- `supabase/functions/ai-lesson-generator/index.ts` — after generation, before returning, call `runGovernance`; attach report; if hard-fail, run `repairPipeline` once.
- `supabase/functions/ai-slide-generator` and `ai-slides-batch-orchestrator` — same wrapper.
- Wizard (`useUnifiedLessonGenerator`) and Co-Pilot Studio — call `buildGovernanceSystemPrompt(state)` and prepend to every Gemini request.
- Game Maker — extend so generated game content_json is run through `vocabEngine` + `grammarEngine` against the parent lesson's state if linked.

### 4. Hub × CEFR alignment

Governance reads `HUB_CONFIGS[hub]` so caps differ even at the same CEFR (per memory `mem://curriculum/hub-cefr-matrix`):
- Playground B1: `cefrCaps.B1` overridden with `maxSentenceWords: 10`, `bannedRegisters: ['corporate','exam-prep']`
- Academy C1: `bannedRegisters: ['corporate','boardroom']`
- Success any level: `bannedRegisters: ['cartoon','nursery','teen-slang']`

### 5. Validation flow (publish gate)

```text
Generate → governanceRunner →
  ├─ hard errors (blocked grammar / forbidden vocab / broken JSON / placeholder)
  │     → block publish, surface in GovernanceReportPanel, offer "Regenerate slide"
  ├─ soft warnings (cefr drift, sequence imbalance)
  │     → allow publish with badge, log to governance_report
  └─ all green
        → status='passed' → publish enabled
```

### 6. Out of scope (ask before doing)

- Authoring the per-CEFR caps numeric tables with linguist-validated values — initial values will be conservative defaults; tuning is a follow-up pass.
- Rebuilding the existing wizard/co-pilot UIs — only minimal report panel + publish-gate hook in this turn.
- Migrating historical lessons — new lessons go through governance; old lessons remain `governance_status='pending'` for a future backfill job.

### 7. Memory entries to add after build

- `mem://governance/lesson-state-contract` — schema + injection rule
- `mem://governance/validation-pipeline` — 7 engines + hard/soft error policy
- Core line: "Curriculum governance: every generated lesson MUST pass `governanceRunner` before publish; blocked grammar/vocab/CEFR/theme drift = hard reject."
