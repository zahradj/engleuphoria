// Lesson Plan Validator.
// Runs BEFORE activity generation — rejects incoherent plans early.

import { CEFR_CAPS } from '@/governance/data/cefrCaps';
import type {
  InteractionDistribution,
  LessonPlan,
  PlanValidationIssue,
  PlanValidationReport,
} from './types';
import { totalSlides } from './flowMap';

export function validateLessonPlan(plan: LessonPlan): PlanValidationReport {
  const errors: PlanValidationIssue[] = [];
  const warnings: PlanValidationIssue[] = [];

  const { blueprint, flow_map, communication, vocab_recycling, interaction_distribution } = plan;

  // 1. Grammar scope consistency: blueprint grammar must be allowed at this CEFR level.
  const caps = CEFR_CAPS[blueprint.cefr_level];
  if (caps?.bannedConstructions) {
    for (const g of blueprint.grammar_focus) {
      if (caps.bannedConstructions.some((b) => g.toLowerCase().includes(b.toLowerCase()))) {
        errors.push({
          code: 'GRAMMAR_ABOVE_CEFR',
          severity: 'error',
          field: 'grammar_focus',
          message: `Grammar "${g}" is above ${blueprint.cefr_level} scope for ${blueprint.hub}.`,
        });
      }
    }
  }

  // 2. Vocabulary present.
  if (blueprint.target_vocab.length < 4) {
    warnings.push({
      code: 'VOCAB_TOO_FEW',
      severity: 'warning',
      field: 'target_vocab',
      message: 'Fewer than 4 target vocabulary items — lesson may lack lexical density.',
    });
  }

  // 3. Communication relevance — must not be just a grammar drill.
  if (!communication.goal || communication.goal.trim().length < 6) {
    errors.push({
      code: 'WEAK_COMMUNICATION_GOAL',
      severity: 'error',
      field: 'communication.goal',
      message: 'Lesson has no real communication goal. Grammar cannot be the goal itself.',
    });
  }

  // 4. Pacing / flow coherence.
  const slides = totalSlides(flow_map);
  if (slides < 12) {
    errors.push({
      code: 'FLOW_TOO_SHORT',
      severity: 'error',
      message: `Pedagogical flow only produces ${slides} slides — below 30-minute lesson minimum.`,
    });
  }

  const order = flow_map.map((s) => s.stage).join('>');
  const required = 'hook>context>input>discovery>controlled>communicative>production>reflection';
  if (order !== required) {
    errors.push({
      code: 'FLOW_ORDER_INVALID',
      severity: 'error',
      message: `Stage order must be ${required}. Got ${order}.`,
    });
  }

  // 5. Vocabulary recycling — every target word in >= 3 stages.
  for (const v of vocab_recycling) {
    if (v.appearances.length < 3) {
      warnings.push({
        code: 'VOCAB_UNDER_RECYCLED',
        severity: 'warning',
        field: 'vocab_recycling',
        message: `Target word "${v.word}" only recycled in ${v.appearances.length} stage(s).`,
      });
    }
  }

  // 6. Interaction balance — no single modality dominates > 45% of lesson.
  const dominance = checkDominance(interaction_distribution);
  if (dominance) {
    warnings.push({
      code: 'MODALITY_DOMINANCE',
      severity: 'warning',
      field: 'interaction_distribution',
      message: `Modality "${dominance.modality}" accounts for ${Math.round(dominance.share * 100)}% of slides — risks passive learning.`,
    });
  }

  // 7. Speaking presence.
  if ((interaction_distribution.speaking ?? 0) < 2) {
    errors.push({
      code: 'INSUFFICIENT_SPEAKING',
      severity: 'error',
      field: 'interaction_distribution.speaking',
      message: 'Lesson contains insufficient speaking — communicative principle violated.',
    });
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
  };
}

function checkDominance(d: InteractionDistribution): { modality: string; share: number } | null {
  const entries = Object.entries(d) as Array<[string, number]>;
  const total = entries.reduce((a, [, v]) => a + v, 0) || 1;
  const top = entries.sort((a, b) => b[1] - a[1])[0];
  const share = top[1] / total;
  return share > 0.45 ? { modality: top[0], share } : null;
}
