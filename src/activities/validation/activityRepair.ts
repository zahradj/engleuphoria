// Targeted repair prompt for a single failing activity.

import type { ActivitySpec, ActivityValidationReport } from '../types';

export function buildRepairPrompt(
  spec: ActivitySpec,
  report: ActivityValidationReport,
): string {
  const issues = [...report.errors, ...report.warnings]
    .map((i) => `- [${i.severity}] ${i.code}: ${i.message}`)
    .join('\n');
  return [
    '## ACTIVITY REPAIR',
    `The previous attempt for activity "${spec.id}" (type: ${spec.type}, stage: ${spec.stage}) failed validation:`,
    issues || '- (no detail)',
    '',
    'Regenerate the SAME activity type and purpose, fixing the issues above.',
    'Stay inside the same scenario, characters, and setting.',
    'Return strict JSON only.',
  ].join('\n');
}
