// Main entry — generates a coherent, validated activity set for a LessonPlan.

import { buildGovernanceSystemPrompt } from '@/governance/promptInjector';
import { buildPlannerSystemPrompt } from '@/planning/promptInjector';
import type { LessonPlan } from '@/planning/types';

import { ACTIVITY_CATALOG } from '../catalog/activityCatalog';
import { selectActivityTypes } from '../selection/activitySelector';
import { enforcePacing } from '../selection/sequencer';
import {
  validateActivity,
  validateCoherence,
} from '../validation/activityValidator';
import { buildActivityPrompt } from './activityPromptBuilder';
import { buildGrammarDirectives } from './grammarContextualizer';
import { buildNarrativeBinder } from './narrativeBinder';
import { buildVocabDirectives, vocabAppearancesFrom } from './vocabRecycler';

import type {
  ActivityAIClient,
  ActivityGenerationResult,
  ActivitySpec,
  GenerationContext,
} from '../types';

const MAX_REPAIR_PASSES = 2;

export interface GenerateActivitiesOptions {
  plan: LessonPlan;
  ai: ActivityAIClient;
}

export async function generateActivities(
  opts: GenerateActivitiesOptions,
): Promise<ActivityGenerationResult> {
  const { plan, ai } = opts;
  const state = plan.lesson_state;

  const ctx: GenerationContext = {
    plan,
    state,
    previous: [],
    vocabAppearances: {},
  };

  const slots = enforcePacing(selectActivityTypes(ctx), ctx);

  const activities: ActivitySpec[] = [];
  const perActivity: ActivityGenerationResult['perActivity'] = [];

  const baseSystem =
    buildPlannerSystemPrompt(plan) +
    '\n\n' +
    buildGovernanceSystemPrompt(state);

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const narrative = buildNarrativeBinder(ctx, activities);
    const vocab = buildVocabDirectives(ctx);
    const grammar = buildGrammarDirectives(ctx);
    const userPrompt = narrative + '\n' + buildActivityPrompt(slot, ctx, vocab, grammar);

    let spec: ActivitySpec | null = null;
    let report = null as ReturnType<typeof validateActivity> | null;

    for (let pass = 0; pass <= MAX_REPAIR_PASSES; pass++) {
      const raw = await ai({ systemPrompt: baseSystem, userPrompt });
      const parsed = safeParseActivity(raw, slot, i);
      if (!parsed) {
        if (pass === MAX_REPAIR_PASSES) {
          spec = placeholderSpec(slot, i);
        }
        continue;
      }
      const r = validateActivity(parsed, ctx);
      if (r.passed) {
        spec = parsed;
        report = r;
        break;
      }
      report = r;
      if (pass === MAX_REPAIR_PASSES) {
        spec = parsed; // keep last attempt; coherence/per-activity errors surface in report
      }
    }

    if (!spec) spec = placeholderSpec(slot, i);
    if (!report) report = validateActivity(spec, ctx);

    activities.push(spec);
    perActivity.push(report);
    ctx.previous = activities;
    ctx.vocabAppearances = vocabAppearancesFrom(activities);
  }

  const coherence = validateCoherence(activities, ctx);
  const passed = perActivity.every((r) => r.passed) && coherence.passed;

  return { activities, perActivity, coherence, passed };
}

function safeParseActivity(
  raw: string,
  slot: ReturnType<typeof selectActivityTypes>[number],
  index: number,
): ActivitySpec | null {
  try {
    const cleaned = raw.trim().replace(/^```json/i, '').replace(/```$/, '').trim();
    const obj = JSON.parse(cleaned);
    const entry = ACTIVITY_CATALOG[slot.type];
    return {
      id: `act_${index + 1}_${slot.type}`,
      type: slot.type,
      purpose: slot.purpose,
      stage: slot.stage,
      modalities: entry.modalities,
      target_vocab_used: Array.isArray(obj.target_vocab_used) ? obj.target_vocab_used : [],
      grammar_targets_used: Array.isArray(obj.grammar_targets_used) ? obj.grammar_targets_used : [],
      narrative_anchor: obj.narrative_anchor ?? { characters: [], setting: '', scene: '' },
      content: obj,
      estimated_load: entry.load,
    };
  } catch {
    return null;
  }
}

function placeholderSpec(
  slot: ReturnType<typeof selectActivityTypes>[number],
  index: number,
): ActivitySpec {
  const entry = ACTIVITY_CATALOG[slot.type];
  return {
    id: `act_${index + 1}_${slot.type}_failed`,
    type: slot.type,
    purpose: slot.purpose,
    stage: slot.stage,
    modalities: entry.modalities,
    target_vocab_used: [],
    grammar_targets_used: [],
    narrative_anchor: { characters: [], setting: '', scene: 'GENERATION_FAILED' },
    content: { __error: 'generation_failed', type: slot.type },
    estimated_load: entry.load,
  };
}
