// Master Curriculum Orchestration Engine — shared types.
// Pure TS. No React, no Supabase. Safe to import from edge functions.

import type { Cefr, Hub, LessonState } from '@/governance/types';
import type { LessonPlan } from '@/planning/types';
import type { AdaptationContext } from '@/adaptive/types';
import type { PronunciationRunResult } from '@/pronunciation/pronunciationRunner';
import type { RunGamificationResult } from '@/gamification/types';
import type { ActivitySpec, ActivityAIClient } from '@/activities/types';

export const ORCHESTRATOR_VERSION = '1.0.0';

export type PipelineStageName =
  | 'curriculum_selection'
  | 'blueprint_creation'
  | 'lesson_state'
  | 'flow_planning'
  | 'activity_generation'
  | 'pronunciation_injection'
  | 'adaptive_personalization'
  | 'gamification_layering'
  | 'quality_validation'
  | 'publish_gate';

export type StageStatus = 'ok' | 'warning' | 'error' | 'skipped';

export interface StageReport {
  stage: PipelineStageName;
  status: StageStatus;
  durationMs: number;
  notes?: string[];
  error?: string;
}

export interface LessonContextMeta {
  stateHash: string;
  generatedAt: string;
  orchestratorVersion: string;
  promptChainHash: string;
}

export interface LessonContext {
  hub: Hub;
  cefr: Cefr;
  lessonState: LessonState;
  plan: LessonPlan;
  adaptive: AdaptationContext;
  pronunciation: PronunciationRunResult;
  gamification: RunGamificationResult;
  activities: ActivitySpec[];
  qa?: any; // QAReport from src/qa
  meta: LessonContextMeta;
}

export type QAVerdict = 'publish' | 'repair' | 'block';

export interface OrchestrationResult {
  context: LessonContext;
  stageReports: StageReport[];
  verdict: QAVerdict;
  passed: boolean;
  conflicts: ConflictResolutionLog[];
}

// === Conflict / priority types ===

export type PriorityTier =
  | 'cefr'
  | 'curriculum'
  | 'educational'
  | 'age'
  | 'communication'
  | 'adaptive'
  | 'gamification'
  | 'ui';

export interface EngineProposal<T = unknown> {
  source:
    | 'planner'
    | 'governance'
    | 'adaptive'
    | 'pronunciation'
    | 'activities'
    | 'gamification'
    | 'qa'
    | 'ui';
  tier: PriorityTier;
  field: string;
  proposedValue: T;
  rationale: string;
  hard?: boolean; // hard = non-overridable for that tier
}

export interface ConflictResolutionLog {
  field: string;
  winningSource: EngineProposal['source'];
  winningTier: PriorityTier;
  losers: Array<{ source: EngineProposal['source']; tier: PriorityTier; rationale: string }>;
  resolvedAt: string;
}

// === Orchestrator input ===

export interface OrchestrationInput {
  hub: Hub;
  cefr: Cefr;
  unitId: string;
  lessonId: string;
  studentId?: string;
  blueprintOverrides?: Partial<{
    lesson_title: string;
    theme: string;
    grammar_focus: string[];
    target_vocab: string[];
    communication_goal: string;
    review_targets: string[];
  }>;
  ai: ActivityAIClient;
  // Optional: pre-fetched personalization payloads (else defaults used)
  learnerProfile?: any;
  mastery?: any[];
  errors?: any[];
  engagement?: any;
  motivationProfile?: any;
}

// === Real-time adaptation signals ===

export type AdaptationSignalType =
  | 'activity_complete'
  | 'speaking_attempt'
  | 'mistake'
  | 'idle'
  | 'request_help';

export interface AdaptationSignal {
  type: AdaptationSignalType;
  studentId: string;
  lessonId: string;
  activityId?: string;
  payload: Record<string, unknown>;
  at: string;
}

export interface LessonContextPatch {
  difficultyDelta?: number;          // bounded by CEFR cap
  scaffoldingBoost?: number;         // 0..2
  vocabRepeatBoost?: number;         // extra appearances for target word(s)
  pacingHint?: 'slow_down' | 'maintain' | 'accelerate';
  notes?: string[];
}

// === Feedback-to-curriculum ===

export type FeedbackSignalType =
  | 'lesson_completed'
  | 'milestone_quiz_score'
  | 'mistake_pattern'
  | 'vocab_struggle'
  | 'speaking_breakthrough';

export interface FeedbackSignal {
  studentId: string;
  lessonId: string;
  type: FeedbackSignalType;
  payload: Record<string, unknown>;
  at: string;
}
