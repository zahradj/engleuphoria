// Composes the fixed system-prompt chain for every Gemini call.
// Order: planner → governance → adaptive → pronunciation → gamification.
// Narrative + per-activity prompts are appended by the activities engine.

import { buildPlannerSystemPrompt } from '@/planning/promptInjector';
import { buildGovernanceSystemPrompt } from '@/governance/promptInjector';
import { buildAdaptationSystemPrompt } from '@/adaptive/promptInjector';
import { buildGamificationSystemPrompt } from '@/gamification/promptInjector';
import type { LessonContext } from './types';

export interface PromptChainResult {
  systemPrompt: string;
  hash: string;
}

function stableHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return `pc_${(h >>> 0).toString(16)}`;
}

export function composePromptChain(ctx: Omit<LessonContext, 'meta' | 'activities' | 'qa'>): PromptChainResult {
  const parts: string[] = [];

  // 1. Planner
  parts.push(buildPlannerSystemPrompt(ctx.plan));

  // 2. Governance (LessonState contract)
  parts.push(buildGovernanceSystemPrompt(ctx.lessonState));

  // 3. Adaptive
  parts.push(buildAdaptationSystemPrompt(ctx.adaptive));

  // 4. Pronunciation (only if a system prompt was produced)
  if (ctx.pronunciation?.system_prompt) {
    parts.push(ctx.pronunciation.system_prompt);
  }

  // 5. Gamification
  if (ctx.gamification?.mission) {
    parts.push(
      buildGamificationSystemPrompt({
        hub: ctx.hub,
        profile: (ctx.gamification as any).motivationProfile ?? {
          profileType: 'balanced',
          encouragementStyle: 'warm',
          rewardDensity: 'medium',
          signals: {},
          lastRecomputedAt: new Date().toISOString(),
        },
        mission: ctx.gamification.mission.narrative,
      }),
    );
  }

  const systemPrompt = parts.filter(Boolean).join('\n\n');
  return { systemPrompt, hash: stableHash(systemPrompt) };
}
