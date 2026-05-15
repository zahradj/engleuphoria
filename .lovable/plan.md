## Goal

Restore the previous **15-question CEFR Master Assessment** for ages 12+, then continue into the new **4-skill Comprehensive flow** (Listening → Reading → Writing → Speaking) — a single combined assessment, scored together. Ages under 12 keep the existing Playground adaptive bank (untouched).

## What's wrong today

In the May 15 refactor, `AIPlacementTest.tsx` started routing ages 12+ **directly** into `ComprehensivePhase`, bypassing the original 15-question grammar/listening MCQ bank that lives in `TestPhase.tsx`. So you're seeing different (and fewer) questions than before.

```text
Today (12+):  Demographics → ComprehensivePhase (Listen/Read/Write/Speak) → Processing
Goal  (12+):  Demographics → TestPhase (15 CEFR MCQs) → ComprehensivePhase (4 skills) → Processing
```

## Changes (UI/orchestration only — no DB, no auth, no edge functions)

**1. `src/components/placement/AIPlacementTest.tsx`** — split the `'test'` phase into two ordered sub-phases for ages 12+:
- Add a sub-state: `testStage: 'mcq' | 'comprehensive'` (default `'mcq'`).
- For ages 12+: render `TestPhase` first; on its `onComplete`, store the 15 MCQ `TestResult[]`, switch to `'comprehensive'`, and render `ComprehensivePhase`. On its `onComplete`, **merge** the MCQ results with the 4-skill legacy results and advance to `'processing'`.
- For ages <12: unchanged — `TestPhase` only.

**2. `src/components/placement/comprehensive/ComprehensivePhase.tsx`** — minor: re-index `questionIndex` in `toLegacyResults` so it can be appended after the 15 MCQ results (offset passed in as a prop, default 0). No content/UI changes.

**3. Nothing else.** Per your strict boundary rules:
- No edits to `App.tsx`, `ProtectedRoute`, `AuthContext`, routing, Supabase functions, Creator Studio, or LiveClassroom.
- No DB schema changes — combined results still flow through the existing `usePlacementTest.completeTest(age, results, interests)` path.
- `TestPhase`, the 15-question CEFR bank, the comprehensive content, kids' Playground bank, Demographics, and Processing screens are all left exactly as they are.

## Files touched

- `src/components/placement/AIPlacementTest.tsx` (orchestration: 2-stage test for 12+)
- `src/components/placement/comprehensive/ComprehensivePhase.tsx` (accept `indexOffset` prop; no UI change)

## Verification

1. Sign up as a student aged 14 → first 15 MCQs (CEFR Master Assessment) appear, then auto-transitions to Listening → Reading → Writing → Speaking, then Processing → My Path.
2. Sign up as a student aged 8 → only the playful adaptive bank runs (unchanged).
3. The CEFR level persisted in `student_profiles` reflects both MCQ and 4-skill results.
