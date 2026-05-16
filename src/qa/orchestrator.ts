import type { QADomain, QADomainScore, QAIssue, QALesson, QAReport, QAVerdict } from './types';
import { validateAcademicQuality } from './validators/academicQuality';
import { validateCefrAccuracy } from './validators/cefrAccuracy';
import { validateAgeAppropriateness } from './validators/ageAppropriateness';
import { validateEmotionalSafety } from './validators/emotionalSafety';
import { validateGrammarLanguage } from './validators/grammarLanguage';
import { validateActivityQuality } from './validators/activityQuality';
import { validateNarrativeConsistency } from './validators/narrativeConsistency';
import { validateJsonStructural } from './validators/jsonStructural';
import { validateDuplicateDetection } from './validators/duplicateDetection';
import { allText, hashContent } from './util/text';

const ALL_DOMAINS: QADomain[] = [
  'academic', 'cefr', 'age', 'safety', 'language',
  'activity', 'narrative', 'structural', 'hallucination', 'duplicate',
];

/**
 * Synchronous orchestrator: runs all deterministic validators.
 * The hallucination AI-judge runs separately via `runHallucinationJudge()`
 * and its issues can be merged via `mergeJudgeIssues()`.
 */
export function runDeterministicQA(lesson: QALesson): QAReport {
  const issues: QAIssue[] = [
    ...validateJsonStructural(lesson),       // first — others depend on shape
    ...validateAcademicQuality(lesson),
    ...validateCefrAccuracy(lesson),
    ...validateAgeAppropriateness(lesson),
    ...validateEmotionalSafety(lesson),
    ...validateGrammarLanguage(lesson),
    ...validateActivityQuality(lesson),
    ...validateNarrativeConsistency(lesson),
    ...validateDuplicateDetection(lesson),
  ];

  return finalize(lesson, issues);
}

export function mergeJudgeIssues(report: QAReport, judgeIssues: QAIssue[], lesson: QALesson): QAReport {
  return finalize(lesson, [...report.issues, ...judgeIssues]);
}

function finalize(lesson: QALesson, issues: QAIssue[]): QAReport {
  const scorecard = buildScorecard(issues);
  const verdict = deriveVerdict(issues);
  return {
    verdict,
    issues,
    scorecard,
    generated_at: new Date().toISOString(),
    content_hash: hashContent(allText(lesson)),
  };
}

function buildScorecard(issues: QAIssue[]): Record<QADomain, QADomainScore> {
  const out = {} as Record<QADomain, QADomainScore>;
  for (const d of ALL_DOMAINS) {
    const inDomain = issues.filter((i) => i.domain === d);
    const blockers = inDomain.filter((i) => i.severity === 'block').length;
    const warns = inDomain.filter((i) => i.severity === 'warn').length;
    const score = Math.max(0, 100 - blockers * 40 - warns * 10);
    out[d] = { score, passing: blockers === 0 };
  }
  return out;
}

function deriveVerdict(issues: QAIssue[]): QAVerdict {
  const blocks = issues.filter((i) => i.severity === 'block');
  if (blocks.length === 0) return 'publish';

  const unrepairable = blocks.some((i) => !i.auto_repairable);
  const safetyBlock = blocks.some((i) => i.domain === 'safety');
  const hallucinationBlock = blocks.some((i) => i.domain === 'hallucination' && !i.auto_repairable);

  if (safetyBlock || unrepairable || hallucinationBlock) return 'block';
  return 'repair';
}
