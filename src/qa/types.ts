// Content Quality Control & AI Safety System — shared types

export type QASeverity = 'block' | 'warn' | 'info';

export type QADomain =
  | 'academic'
  | 'cefr'
  | 'age'
  | 'safety'
  | 'language'
  | 'activity'
  | 'narrative'
  | 'structural'
  | 'hallucination'
  | 'duplicate';

export type QAVerdict = 'publish' | 'repair' | 'block';

export interface QALocator {
  slideId?: string;
  activityId?: string;
  path?: string;
}

export interface QAIssue {
  code: string;
  domain: QADomain;
  severity: QASeverity;
  message: string;
  locator?: QALocator;
  suggestion?: string;
  auto_repairable: boolean;
}

export interface QADomainScore {
  score: number;     // 0-100
  passing: boolean;
}

export interface QAReport {
  verdict: QAVerdict;
  issues: QAIssue[];
  scorecard: Record<QADomain, QADomainScore>;
  generated_at: string;
  content_hash: string;
}

// ----------------------------------------------------------------
// Inputs to validators
// ----------------------------------------------------------------

export type Hub = 'Playground' | 'Academy' | 'Success';
export type CEFR = 'Pre-A1' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface QAActivity {
  id: string;
  type: string;
  purpose?: string;
  stage?: string;
  modalities?: string[];
  target_vocab_used?: string[];
  grammar_targets_used?: string[];
  narrative_anchor?: {
    characters?: string[];
    setting?: string;
    scene?: string;
  };
  content?: any;
}

export interface QASlide {
  id: string;
  kind: string;             // warmup | prime | mimic | practice | produce | cool_off | etc
  title?: string;
  body_text?: string;
  activities?: QAActivity[];
  grammar_explanation?: string;
  examples?: string[];
}

export interface QALesson {
  id?: string;
  hub: Hub;
  cefr: CEFR;
  unit_id?: string;
  title?: string;
  communication_objective?: string;
  slides: QASlide[];
}

export interface QAContextInput {
  lesson: QALesson;
  plan?: any;       // optional planner output for cross-checks
  state?: any;      // optional governance state for cross-checks
}
