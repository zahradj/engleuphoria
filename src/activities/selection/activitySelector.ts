// Per-stage activity type selection — deterministic, explainable.

import type { PedagogicalStage, PedagogicalStageSpec } from '@/planning/types';
import { rankForStage } from './fitScorer';
import type {
  ActivityPurpose,
  ActivityType,
  GenerationContext,
} from '../types';

const STAGE_TO_PURPOSE: Record<PedagogicalStage, ActivityPurpose> = {
  hook: 'hook',
  context: 'input',
  input: 'input',
  discovery: 'discovery',
  controlled: 'controlled',
  communicative: 'communicative',
  production: 'production',
  reflection: 'reflection',
};

export interface SelectedSlot {
  stage: PedagogicalStage;
  purpose: ActivityPurpose;
  type: ActivityType;
  stageSpec: PedagogicalStageSpec;
}

/** Picks one activity type per slide in each stage. */
export function selectActivityTypes(ctx: GenerationContext): SelectedSlot[] {
  const slots: SelectedSlot[] = [];

  for (const stageSpec of ctx.plan.flow_map) {
    for (let i = 0; i < stageSpec.slide_count; i++) {
      const ranking = rankForStage(stageSpec, ctx);
      const winner = ranking.find((r) => !r.rejected);
      if (!winner) continue; // no compatible type — skip slot
      slots.push({
        stage: stageSpec.stage,
        purpose: STAGE_TO_PURPOSE[stageSpec.stage],
        type: winner.type,
        stageSpec,
      });
      // Push a lightweight placeholder so subsequent scoring sees recency.
      ctx.previous.push({
        id: `__plan_${slots.length}`,
        type: winner.type,
        purpose: STAGE_TO_PURPOSE[stageSpec.stage],
        stage: stageSpec.stage,
        modalities: stageSpec.modalities,
        target_vocab_used: [],
        grammar_targets_used: [],
        narrative_anchor: { characters: [], setting: '', scene: '' },
        content: null,
        estimated_load: 'medium',
      });
    }
  }

  // Clear placeholders — generation will append real specs.
  ctx.previous = [];
  return slots;
}
