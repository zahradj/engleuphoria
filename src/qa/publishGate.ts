import type { QAReport } from './types';

export interface PublishDecision {
  allowed: boolean;
  reason: string;
  next_action: 'publish' | 'repair' | 'block';
  repair_codes: string[];
}

/**
 * Maps a QAReport to a publish decision. The actual DB write
 * (set `curriculum_lessons.published = true` and persist `qa_*` columns)
 * should be performed by the caller based on this decision.
 */
export function decidePublish(report: QAReport): PublishDecision {
  if (report.verdict === 'publish') {
    return {
      allowed: true,
      reason: 'All QA validators passed.',
      next_action: 'publish',
      repair_codes: [],
    };
  }

  const repair_codes = report.issues
    .filter((i) => i.severity === 'block' && i.auto_repairable)
    .map((i) => i.code);

  if (report.verdict === 'repair') {
    return {
      allowed: false,
      reason: 'Lesson has repairable blocking issues.',
      next_action: 'repair',
      repair_codes,
    };
  }

  return {
    allowed: false,
    reason: 'Lesson has non-repairable blocking issues (safety/hallucination/structural).',
    next_action: 'block',
    repair_codes,
  };
}
