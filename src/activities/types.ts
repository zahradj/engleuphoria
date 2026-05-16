// Intelligent Activity Generation — shared types.
// Pure TS. Consumes LessonPlan (planner) + LessonState (governance).

import type { Cefr, Hub, LessonState } from '@/governance/types';
import type {
  LessonPlan,
  Modality,
  PedagogicalStage,
} from '@/planning/types';

export type ActivityPurpose =
  | 'hook'
  | 'input'
  | 'discovery'
  | 'controlled'
  | 'communicative'
  | 'production'
  | 'reflection'
  | 'review';

export type ActivityType =
  | 'warmup'
  | 'poll'
  | 'opinion'
  | 'matching'
  | 'drag_drop'
  | 'fill_blank'
  | 'sentence_builder'
  | 'pronunciation'
  | 'reading'
  | 'listening'
  | 'roleplay'
  | 'debate'
  | 'speaking_mission'
  | 'storytelling'
  | 'collaborative'
  | 'reflection'
  | 'retrieval'
  | 'review_challenge';

export type CognitiveLoad = 'low' | 'medium' | 'high';

export interface NarrativeAnchor {
  characters: string[];
  setting: string;
  scene: string;
}

export interface ActivitySpec {
  id: string;
  type: ActivityType;
  purpose: ActivityPurpose;
  stage: PedagogicalStage;
  modalities: Modality[];
  target_vocab_used: string[];
  grammar_targets_used: string[];
  narrative_anchor: NarrativeAnchor;
  content: any; // type-specific payload (matches existing renderers)
  estimated_load: CognitiveLoad;
}

export interface ActivityCatalogEntry {
  type: ActivityType;
  modalities: Modality[];
  fits_stages: PedagogicalStage[];
  fits_purposes: ActivityPurpose[];
  min_cefr: Cefr;
  max_cefr: Cefr;
  hub_fit: Record<Hub, number>; // 0..1
  load: CognitiveLoad;
  productive: boolean; // produces language (vs receptive)
  description: string;
}

export interface GenerationContext {
  plan: LessonPlan;
  state: LessonState;
  previous: ActivitySpec[];
  vocabAppearances: Record<string, number>;
}

export type ActivityIssueSeverity = 'error' | 'warning';

export interface ActivityIssue {
  code: string;
  severity: ActivityIssueSeverity;
  message: string;
  activityId?: string;
  field?: string;
}

export interface ActivityValidationReport {
  passed: boolean;
  errors: ActivityIssue[];
  warnings: ActivityIssue[];
}

export interface ActivityGenerationResult {
  activities: ActivitySpec[];
  perActivity: ActivityValidationReport[];
  coherence: ActivityValidationReport;
  passed: boolean;
}

/** Callback for delegating Gemini calls to the host runtime (edge fn / browser). */
export type ActivityAIClient = (args: {
  systemPrompt: string;
  userPrompt: string;
}) => Promise<string>;
