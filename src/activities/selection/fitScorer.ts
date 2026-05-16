// Deterministic scoring of catalog entries against a stage slot + context.

import type { Cefr } from '@/governance/types';
import { ACTIVITY_CATALOG } from '../catalog/activityCatalog';
import { HUB_ACTIVITY_PROFILES } from '../catalog/hubActivityProfiles';
import type {
  ActivityCatalogEntry,
  ActivitySpec,
  ActivityType,
  GenerationContext,
} from '../types';
import type { PedagogicalStageSpec } from '@/planning/types';

const CEFR_ORDER: Cefr[] = ['Pre-A1', 'A1', 'A2', 'B1', 'B2', 'C1'];
const cefrIdx = (c: Cefr) => CEFR_ORDER.indexOf(c);

function cefrInRange(target: Cefr, entry: ActivityCatalogEntry): boolean {
  const t = cefrIdx(target);
  return t >= cefrIdx(entry.min_cefr) && t <= cefrIdx(entry.max_cefr);
}

export interface ScoreBreakdown {
  type: ActivityType;
  score: number;
  rejected: boolean;
  reason?: string;
}

export function scoreActivity(
  entry: ActivityCatalogEntry,
  stageSpec: PedagogicalStageSpec,
  ctx: GenerationContext,
): ScoreBreakdown {
  const hub = ctx.state.hub;
  const cefr = ctx.state.cefr;
  const profile = HUB_ACTIVITY_PROFILES[hub];

  if (profile.banned.includes(entry.type)) {
    return { type: entry.type, score: -Infinity, rejected: true, reason: 'hub_banned' };
  }
  if (!cefrInRange(cefr, entry)) {
    return { type: entry.type, score: -Infinity, rejected: true, reason: 'cefr_out_of_range' };
  }
  if (!entry.fits_stages.includes(stageSpec.stage)) {
    return { type: entry.type, score: -Infinity, rejected: true, reason: 'stage_mismatch' };
  }

  let score = 0;
  score += 4; // base stage fit
  score += entry.hub_fit[hub] * 3;
  if (profile.preferred.includes(entry.type)) score += 1.5;

  // Anti-repetition: penalize types used in the last 3 activities.
  const recent = ctx.previous.slice(-3);
  const sameTypeRecent = recent.filter((a) => a.type === entry.type).length;
  score -= sameTypeRecent * 2.5;

  // Anti-fatigue: penalize same dominant modality streak.
  const lastModalities = recent.flatMap((a) => a.modalities);
  const overlap = entry.modalities.filter((m) => lastModalities.includes(m)).length;
  score -= overlap * 0.4;

  // Cognitive load budget vs planner max_consecutive_high_load.
  if (entry.load === 'high') {
    const highStreak = recent.filter((a) => a.estimated_load === 'high').length;
    if (highStreak >= profile.max_consecutive_high_load) score -= 3;
  }

  // Vocab recycling debt: reward productive types when debt is high.
  const debt = vocabDebt(ctx);
  if (debt > 0 && entry.productive) score += Math.min(debt, 3);

  // Speaking cadence: if planner says speaking_every_n and we've drifted, boost speaking types.
  const speakingEveryN = ctx.plan.cognitive_load.speaking_every_n_slides;
  if (entry.modalities.includes('speaking')) {
    const sinceSpeaking = sinceLastSpeaking(ctx.previous);
    if (sinceSpeaking >= speakingEveryN) score += 2;
  }

  // Modality target alignment with stage spec.
  const modalityAlign = entry.modalities.filter((m) => stageSpec.modalities.includes(m)).length;
  score += modalityAlign * 0.6;

  return { type: entry.type, score, rejected: false };
}

function vocabDebt(ctx: GenerationContext): number {
  const targets = ctx.plan.blueprint.target_vocab;
  if (!targets.length) return 0;
  let debt = 0;
  for (const w of targets) {
    const seen = ctx.vocabAppearances[w] ?? 0;
    if (seen < 3) debt += (3 - seen) * 0.5;
  }
  return debt;
}

function sinceLastSpeaking(previous: ActivitySpec[]): number {
  for (let i = previous.length - 1; i >= 0; i--) {
    if (previous[i].modalities.includes('speaking')) return previous.length - 1 - i;
  }
  return previous.length;
}

export function rankForStage(
  stageSpec: PedagogicalStageSpec,
  ctx: GenerationContext,
): ScoreBreakdown[] {
  return Object.values(ACTIVITY_CATALOG)
    .map((e) => scoreActivity(e, stageSpec, ctx))
    .sort((a, b) => b.score - a.score);
}
