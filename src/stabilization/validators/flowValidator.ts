import type { LessonContext } from '@/orchestrator/types';
import type { ValidatorResult } from '../types';
import { resolvePolicy } from '../policy';

const STAGE_ORDER = ['warmup', 'prime', 'mimic', 'practice', 'produce', 'cooloff'] as const;

export function flowValidator(ctx: LessonContext): ValidatorResult {
  const policy = resolvePolicy(ctx.hub, ctx.cefr).flow;
  const issues: ValidatorResult['issues'] = [];

  const stages = ctx.activities.map((a) => String(a.stage ?? '').toLowerCase());
  const present = new Set(stages);

  const missing = policy.requiredStages.filter((s) => !present.has(s));
  if (missing.length) {
    issues.push({
      code: 'flow.missing_stages',
      message: `Missing stages: ${missing.join(', ')}`,
      severity: missing.includes('produce') || missing.includes('cooloff') ? 'error' : 'warning',
      repairHint: missing.includes('produce') ? 'add_speaking_opportunity' : 'inject_reflection',
    });
  }

  // Monotonicity: stages should not regress significantly.
  let regressions = 0;
  let lastRank = -1;
  for (const s of stages) {
    const r = STAGE_ORDER.indexOf(s as (typeof STAGE_ORDER)[number]);
    if (r === -1) continue;
    if (r < lastRank) regressions++;
    lastRank = Math.max(lastRank, r);
  }
  if (regressions > 1) {
    issues.push({
      code: 'flow.scaffolding_regression',
      message: `GRR regressions: ${regressions}`,
      severity: 'warning',
      repairHint: 'resequence_activities',
    });
  }

  if (policy.requireReflection && !stages.includes('cooloff')) {
    issues.push({
      code: 'flow.no_reflection',
      message: 'Reflection / cool-off missing.',
      severity: 'warning',
      repairHint: 'inject_reflection',
    });
  }

  const hasError = issues.some((i) => i.severity === 'error');
  return {
    validator: 'flow',
    verdict: hasError ? 'repair' : issues.length ? 'repair' : 'pass',
    issues,
    metrics: { stagesPresent: present.size, regressions },
  };
}
