// Per-activity and whole-set coherence validation.

import { effectiveCaps } from '@/governance/data/cefrCaps';
import type {
  ActivityIssue,
  ActivitySpec,
  ActivityValidationReport,
  GenerationContext,
} from '../types';

const PLACEHOLDER_RX = /(lorem ipsum|insert\s+\w+|todo[: ]|placeholder|example here|new sentence here)/i;

export function validateActivity(
  a: ActivitySpec,
  ctx: GenerationContext,
): ActivityValidationReport {
  const errors: ActivityIssue[] = [];
  const warnings: ActivityIssue[] = [];
  const text = JSON.stringify(a.content ?? {});

  if (!a.content || a.content.__error) {
    errors.push({ code: 'GENERATION_FAILED', severity: 'error', message: `Activity ${a.id} failed to generate.`, activityId: a.id });
    return { passed: false, errors, warnings };
  }
  if (PLACEHOLDER_RX.test(text)) {
    errors.push({ code: 'PLACEHOLDER_TEXT', severity: 'error', message: `Placeholder text detected in ${a.id}.`, activityId: a.id });
  }

  // Sentence-length cap from CEFR caps.
  const caps = effectiveCaps(ctx.state.cefr, ctx.state.hub);
  const sentences = extractSentences(a.content);
  for (const s of sentences) {
    const words = s.trim().split(/\s+/).filter(Boolean);
    if (words.length > caps.maxSentenceWords) {
      warnings.push({
        code: 'SENTENCE_TOO_LONG',
        severity: 'warning',
        message: `Sentence exceeds ${caps.maxSentenceWords} words in ${a.id}: "${s.slice(0, 60)}…"`,
        activityId: a.id,
      });
    }
  }

  // MCQ sanity: any { options, answer } pair must have answer ∈ options.
  walkMcq(a.content, (item, path) => {
    if (Array.isArray(item.options) && typeof item.answer === 'string') {
      if (!item.options.includes(item.answer)) {
        errors.push({
          code: 'MCQ_ANSWER_NOT_IN_OPTIONS',
          severity: 'error',
          message: `MCQ answer not in options at ${path} in ${a.id}.`,
          activityId: a.id,
        });
      }
    }
  });

  // Narrative anchor sanity.
  if (!a.narrative_anchor?.scene || a.narrative_anchor.scene === 'GENERATION_FAILED') {
    errors.push({ code: 'MISSING_NARRATIVE_ANCHOR', severity: 'error', message: `Missing narrative scene in ${a.id}.`, activityId: a.id });
  }

  return { passed: errors.length === 0, errors, warnings };
}

export function validateCoherence(
  activities: ActivitySpec[],
  ctx: GenerationContext,
): ActivityValidationReport {
  const errors: ActivityIssue[] = [];
  const warnings: ActivityIssue[] = [];

  // Vocab recycling: each target word must appear in >= 3 activities.
  for (const w of ctx.plan.blueprint.target_vocab) {
    const count = activities.filter((a) => a.target_vocab_used.includes(w)).length;
    if (count < 3) {
      errors.push({
        code: 'VOCAB_UNDER_RECYCLED',
        severity: 'error',
        message: `Target word "${w}" appears in ${count} activities (need 3).`,
      });
    }
  }

  // Adjacent same-type ban.
  for (let i = 1; i < activities.length; i++) {
    if (activities[i].type === activities[i - 1].type) {
      warnings.push({
        code: 'ADJACENT_SAME_TYPE',
        severity: 'warning',
        message: `Adjacent activities share type "${activities[i].type}" at index ${i}.`,
      });
    }
  }

  // Receptive streak cap.
  const cap = ctx.plan.cognitive_load.max_consecutive_receptive;
  let streak = 0;
  for (const a of activities) {
    const productive = a.modalities.some((m) => m === 'speaking' || m === 'writing');
    if (!productive) {
      streak++;
      if (streak > cap) {
        warnings.push({
          code: 'RECEPTIVE_STREAK_EXCEEDED',
          severity: 'warning',
          message: `Receptive streak ${streak} exceeds cap ${cap}.`,
        });
      }
    } else streak = 0;
  }

  // Theme drift: scenes must reference theme tokens (loose check).
  const themeTokens = ctx.state.theme.theme.toLowerCase().split(/\s+/).filter((t) => t.length > 3);
  if (themeTokens.length) {
    const drifters = activities.filter((a) => {
      const blob = (JSON.stringify(a.content) + ' ' + a.narrative_anchor.scene).toLowerCase();
      return !themeTokens.some((t) => blob.includes(t));
    });
    if (drifters.length > Math.ceil(activities.length / 3)) {
      warnings.push({
        code: 'THEME_DRIFT',
        severity: 'warning',
        message: `${drifters.length}/${activities.length} activities show no surface link to theme.`,
      });
    }
  }

  return { passed: errors.length === 0, errors, warnings };
}

function extractSentences(content: any): string[] {
  const out: string[] = [];
  const visit = (v: any) => {
    if (!v) return;
    if (typeof v === 'string') {
      v.split(/(?<=[.!?])\s+/).forEach((s) => out.push(s));
    } else if (Array.isArray(v)) {
      v.forEach(visit);
    } else if (typeof v === 'object') {
      Object.values(v).forEach(visit);
    }
  };
  visit(content);
  return out;
}

function walkMcq(node: any, cb: (item: any, path: string) => void, path = '$') {
  if (!node) return;
  if (Array.isArray(node)) {
    node.forEach((n, i) => walkMcq(n, cb, `${path}[${i}]`));
  } else if (typeof node === 'object') {
    cb(node, path);
    for (const k of Object.keys(node)) walkMcq(node[k], cb, `${path}.${k}`);
  }
}
