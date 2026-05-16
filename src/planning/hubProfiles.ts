// Hub-specific planning profiles.
// Drives blueprint defaults, cognitive load, and interaction balance per hub.

import type { Hub } from '@/governance/types';
import type {
  CognitiveLoadPlan,
  EmotionalTone,
  InteractionStyle,
  PedagogicalStage,
} from './types';

export interface HubPlanningProfile {
  default_tone: EmotionalTone;
  default_style: InteractionStyle;
  default_duration: string;
  default_slide_count: number;
  cognitive_load: CognitiveLoadPlan;
  // Slide allocation per pedagogical stage (must sum to default_slide_count).
  stage_allocation: Record<PedagogicalStage, number>;
  // Soft guidance for prompt injection.
  planning_notes: string[];
}

export const HUB_PLANNING_PROFILES: Record<Hub, HubPlanningProfile> = {
  playground: {
    default_tone: 'playful',
    default_style: 'story-driven',
    default_duration: '30min',
    default_slide_count: 20,
    cognitive_load: {
      max_consecutive_receptive: 2,
      max_consecutive_same_modality: 2,
      speaking_every_n_slides: 3,
      grammar_explanation_budget_slides: 1,
      difficulty_curve: ['warmup', 'rising', 'peak', 'cooldown'],
    },
    stage_allocation: {
      hook: 2,
      context: 2,
      input: 3,
      discovery: 2,
      controlled: 3,
      communicative: 3,
      production: 3,
      reflection: 2,
    },
    planning_notes: [
      'Keep activity cycles short (under 90s of attention each).',
      'Use visual + movement-based interactions where possible.',
      'Grammar must remain implicit and contextualized — no explicit rule slides.',
      'Every 3 slides include a speaking or chant moment.',
    ],
  },
  academy: {
    default_tone: 'adventurous',
    default_style: 'identity-driven',
    default_duration: '30min',
    default_slide_count: 22,
    cognitive_load: {
      max_consecutive_receptive: 3,
      max_consecutive_same_modality: 2,
      speaking_every_n_slides: 4,
      grammar_explanation_budget_slides: 2,
      difficulty_curve: ['warmup', 'rising', 'peak', 'cooldown'],
    },
    stage_allocation: {
      hook: 2,
      context: 3,
      input: 4,
      discovery: 2,
      controlled: 3,
      communicative: 3,
      production: 3,
      reflection: 2,
    },
    planning_notes: [
      'Frame lessons around teen identity, social dynamics, and challenge.',
      'Use modern, age-relevant references — never childish or corporate.',
      'Communication tasks should feel like real teen conversations.',
    ],
  },
  success: {
    default_tone: 'professional',
    default_style: 'task-based',
    default_duration: '30min',
    default_slide_count: 22,
    cognitive_load: {
      max_consecutive_receptive: 3,
      max_consecutive_same_modality: 3,
      speaking_every_n_slides: 4,
      grammar_explanation_budget_slides: 2,
      difficulty_curve: ['warmup', 'rising', 'peak', 'cooldown'],
    },
    stage_allocation: {
      hook: 1,
      context: 3,
      input: 4,
      discovery: 2,
      controlled: 3,
      communicative: 4,
      production: 3,
      reflection: 2,
    },
    planning_notes: [
      'Anchor every lesson in a realistic professional or life-fluency scenario.',
      'Tone is premium, confident, and respectful — never patronizing.',
      'Production tasks should mirror real workplace or social communication.',
    ],
  },
};
