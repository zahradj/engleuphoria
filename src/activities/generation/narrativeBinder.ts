// Narrative binder — injects theme, characters, setting, scene continuity.

import type { GenerationContext, ActivitySpec } from '../types';

export function buildNarrativeBinder(
  ctx: GenerationContext,
  previousActivities: ActivitySpec[],
): string {
  const t = ctx.state.theme;
  const lastScene = previousActivities.length
    ? previousActivities[previousActivities.length - 1].narrative_anchor.scene
    : `Opening moment of the "${t.theme}" scenario.`;

  const lines: string[] = [];
  lines.push('## NARRATIVE BINDER (binding)');
  lines.push(`Theme: ${t.theme}`);
  lines.push(`Setting: ${t.setting}`);
  lines.push(`Characters: ${(t.characters || []).join(', ') || '(use lesson-consistent named characters; do not invent unrelated ones)'}`);
  lines.push(`Tone: ${t.tone}`);
  lines.push(`Communication goal: ${t.communication_goal}`);
  lines.push('');
  lines.push(`Scene continuity — previous beat: "${lastScene}"`);
  lines.push('Continue from this beat. Do not reset the scenario. Do not switch settings or characters.');
  lines.push('');
  return lines.join('\n');
}
