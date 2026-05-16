import type { QAIssue, QADomain } from './types';

/**
 * Maps QA issue codes to the downstream repair pipelines that should
 * be invoked. The caller wires these targets to the actual repair
 * functions (e.g., src/activities/validation/activityRepair.ts,
 * src/pronunciation pipeline, narrative binder regeneration).
 */
export type RepairTarget =
  | 'activity_repair'
  | 'pronunciation_repair'
  | 'narrative_rebind'
  | 'grammar_rewrite'
  | 'cefr_simplify'
  | 'theme_replace'
  | 'manual_review';

export interface RepairDispatch {
  target: RepairTarget;
  issue_codes: string[];
  locators: QAIssue['locator'][];
}

const ROUTING: Record<string, RepairTarget> = {
  ACADEMIC_LOW_COMMUNICATION: 'activity_repair',
  ACADEMIC_WORKSHEET_BIAS: 'activity_repair',
  ACADEMIC_NO_COMMUNICATION_OBJECTIVE: 'activity_repair',
  ACADEMIC_PURPOSE_MISSING: 'activity_repair',

  CEFR_SENTENCE_OVER_CAP: 'cefr_simplify',
  CEFR_SENTENCE_OVER_CAP_SOFT: 'cefr_simplify',
  CEFR_CLAUSE_DEPTH_OVER_CAP: 'cefr_simplify',
  CEFR_READING_GRADE_OVER_CAP: 'cefr_simplify',
  CEFR_FORBIDDEN_TENSE_KEYWORD: 'grammar_rewrite',

  AGE_HUB_THEME_BAN: 'theme_replace',
  AGE_HUB_THEME_BAN_SLIDE: 'theme_replace',

  SAFETY_UNSAFE_PHRASE: 'manual_review',
  SAFETY_SPEAKING_TASK_RED_FLAG: 'manual_review',

  LANG_AI_PHRASING: 'grammar_rewrite',
  LANG_PLACEHOLDER_LEAK: 'grammar_rewrite',
  LANG_MCQ_ANSWER_NOT_IN_OPTIONS: 'activity_repair',
  LANG_FILL_BLANK_NO_GAP: 'activity_repair',

  ACTIVITY_LOW_DIVERSITY: 'activity_repair',
  ACTIVITY_CONSECUTIVE_REPETITION: 'activity_repair',
  ACTIVITY_ADJACENT_SAME_MODALITY_PURPOSE: 'activity_repair',

  NARRATIVE_CHARACTER_DRIFT: 'narrative_rebind',
  NARRATIVE_SETTING_DRIFT: 'narrative_rebind',

  HALLUC_FAIL: 'grammar_rewrite',
  HALLUC_CLAIM_INACCURATE: 'grammar_rewrite',
  HALLUC_INCONCLUSIVE: 'manual_review',

  DUPLICATE_ACTIVITY_FINGERPRINT: 'activity_repair',
  DUPLICATE_PROMPT_SIMILARITY: 'activity_repair',
};

export function dispatchRepairs(issues: QAIssue[]): RepairDispatch[] {
  const buckets = new Map<RepairTarget, RepairDispatch>();
  for (const issue of issues) {
    if (issue.severity === 'info') continue;
    const target = ROUTING[issue.code] ?? 'manual_review';
    const existing = buckets.get(target);
    if (existing) {
      existing.issue_codes.push(issue.code);
      existing.locators.push(issue.locator);
    } else {
      buckets.set(target, {
        target,
        issue_codes: [issue.code],
        locators: [issue.locator],
      });
    }
  }
  return [...buckets.values()];
}

export function domainFromCode(code: string): QADomain | undefined {
  if (code.startsWith('ACADEMIC_')) return 'academic';
  if (code.startsWith('CEFR_')) return 'cefr';
  if (code.startsWith('AGE_')) return 'age';
  if (code.startsWith('SAFETY_')) return 'safety';
  if (code.startsWith('LANG_')) return 'language';
  if (code.startsWith('ACTIVITY_')) return 'activity';
  if (code.startsWith('NARRATIVE_')) return 'narrative';
  if (code.startsWith('STRUCT_')) return 'structural';
  if (code.startsWith('HALLUC_')) return 'hallucination';
  if (code.startsWith('DUPLICATE_')) return 'duplicate';
  return undefined;
}
