// Unified Lesson Generator
// ------------------------
// Single entry point for all three creators (Playground, Academy, Success).
// Wraps runLessonGeneration() with hub-specific config and emits the
// structured lesson object specified in the Creator Dashboard contract.

import { runLessonGeneration } from '@/orchestrator';
import type { OrchestrationInput, LessonContext } from '@/orchestrator/types';
import type { ActivityAIClient } from '@/activities/types';
import { supabase } from '@/integrations/supabase/client';
import { getHubConfig, type HubCreatorConfig } from './hubConfigurations';
import type { Hub, Cefr } from '@/governance/types';

export interface UnifiedLessonInput {
  hub: Hub;
  cefr?: Cefr;
  unitId: string;
  lessonId: string;
  studentId?: string;
  ai: ActivityAIClient;
  blueprint: {
    title: string;
    theme: string;
    grammarFocus: string[];
    targetVocab: string[];
    communicationGoal: string;
    reviewTargets?: string[];
  };
}

export type SlideType =
  | 'hook_warmup'
  | 'context_intro'
  | 'input_vocab'
  | 'input_grammar'
  | 'input_reading'
  | 'guided_practice'
  | 'interactive_practice'
  | 'production'
  | 'review_reinforcement'
  | 'gamification_reward';

export interface UnifiedSlide {
  id: string;
  type: SlideType;
  content: Record<string, unknown>;
  teacher_notes?: string;
  interaction_type?: string;
}

export interface UnifiedLessonOutput {
  lesson_metadata: {
    lesson_id: string;
    unit_id: string;
    title: string;
    cefr: Cefr;
    hub: Hub;
    generated_at: string;
    orchestrator_version: string;
    state_hash: string;
  };
  hub: Hub;
  hub_config: HubCreatorConfig;
  blueprint: UnifiedLessonInput['blueprint'];
  lesson_state: unknown;
  slides: UnifiedSlide[];
  pronunciation_layer: unknown;
  phonics_layer: unknown;
  adaptive_layer: unknown;
  gamification_layer: unknown;
  validation_report: {
    qa: unknown;
    stabilization: unknown;
    verdict: 'publish' | 'repair' | 'block';
    passed: boolean;
  };
}

const STAGE_TO_SLIDE: Record<string, SlideType> = {
  warmup: 'hook_warmup',
  prime: 'context_intro',
  mimic: 'guided_practice',
  practice: 'interactive_practice',
  produce: 'production',
  cooloff: 'review_reinforcement',
};

function mapPurposeToSlide(stage: string, type: string): SlideType {
  const base = STAGE_TO_SLIDE[String(stage).toLowerCase()];
  if (base) return base;
  if (String(type).toLowerCase().includes('vocab')) return 'input_vocab';
  if (String(type).toLowerCase().includes('grammar')) return 'input_grammar';
  if (String(type).toLowerCase().includes('reading')) return 'input_reading';
  return 'interactive_practice';
}

function compileSlides(ctx: LessonContext): UnifiedSlide[] {
  const slides: UnifiedSlide[] = ctx.activities.map((a, idx) => ({
    id: `slide_${idx + 1}_${a.id}`,
    type: mapPurposeToSlide(String(a.stage), String(a.type)),
    content: {
      activity_type: a.type,
      stage: a.stage,
      modalities: a.modalities,
      target_vocab: a.target_vocab_used,
      grammar_targets: a.grammar_targets_used,
      payload: a.content,
    },
    teacher_notes: (a.content as Record<string, unknown> | undefined)?.teacher_notes as
      | string
      | undefined,
    interaction_type: (a.modalities ?? []).join('+') || undefined,
  }));

  // Append gamification/reward closing slide.
  if (ctx.gamification) {
    slides.push({
      id: `slide_${slides.length + 1}_reward`,
      type: 'gamification_reward',
      content: {
        xp: (ctx.gamification as any)?.xpAwards ?? [],
        missions: (ctx.gamification as any)?.missions ?? [],
        achievements: (ctx.gamification as any)?.achievements ?? [],
      },
      interaction_type: 'celebration',
    });
  }
  return slides;
}

async function persistReport(
  lessonId: string,
  studentId: string | undefined,
  ctx: LessonContext,
  finalVerdict: 'pass' | 'repair' | 'block',
) {
  const stab = (ctx.qa as any)?.stabilization;
  if (!stab) return;
  try {
    await supabase.from('pedagogical_quality_reports' as any).insert({
      lesson_id: lessonId,
      student_id: studentId ?? null,
      verdicts: stab.validators ?? [],
      metrics: stab.validators?.reduce(
        (acc: Record<string, unknown>, v: any) => ({ ...acc, [v.validator]: v.metrics }),
        {},
      ) ?? {},
      repairs_applied: stab.repairsApplied ?? [],
      final_verdict: finalVerdict,
    });
  } catch {
    // Non-fatal — telemetry only.
  }
}

export async function generateUnifiedLesson(
  input: UnifiedLessonInput,
): Promise<UnifiedLessonOutput> {
  const cfg = getHubConfig(input.hub);
  const cefr = input.cefr ?? cfg.defaultCefr;

  const orchestratorInput: OrchestrationInput = {
    hub: input.hub,
    cefr,
    unitId: input.unitId,
    lessonId: input.lessonId,
    studentId: input.studentId,
    ai: input.ai,
    blueprintOverrides: {
      lesson_title: input.blueprint.title,
      theme: input.blueprint.theme,
      grammar_focus: input.blueprint.grammarFocus,
      target_vocab: input.blueprint.targetVocab,
      communication_goal: input.blueprint.communicationGoal,
      review_targets: input.blueprint.reviewTargets ?? [],
    },
  };

  const result = await runLessonGeneration(orchestratorInput);
  const { context, verdict } = result;

  const stabVerdict =
    (context.qa as any)?.stabilization?.finalVerdict ?? (verdict === 'publish' ? 'pass' : verdict);
  await persistReport(input.lessonId, input.studentId, context, stabVerdict);

  const slides = compileSlides(context);

  return {
    lesson_metadata: {
      lesson_id: input.lessonId,
      unit_id: input.unitId,
      title: input.blueprint.title,
      cefr,
      hub: input.hub,
      generated_at: context.meta.generatedAt,
      orchestrator_version: context.meta.orchestratorVersion,
      state_hash: context.meta.stateHash,
    },
    hub: input.hub,
    hub_config: cfg,
    blueprint: input.blueprint,
    lesson_state: context.lessonState,
    slides,
    pronunciation_layer: context.pronunciation,
    phonics_layer: (context.pronunciation as any)?.layers?.phonics ?? null,
    adaptive_layer: context.adaptive,
    gamification_layer: context.gamification,
    validation_report: {
      qa: context.qa,
      stabilization: (context.qa as any)?.stabilization ?? null,
      verdict,
      passed: result.passed,
    },
  };
}
