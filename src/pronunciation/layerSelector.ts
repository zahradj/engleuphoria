// Decides which pronunciation layers are appropriate for the current request.

import type { Hub } from '@/governance/types';
import type { LessonPlan } from '@/planning/types';
import { PRONUNCIATION_HUB_PROFILES } from './hubProfiles';
import type { PronunciationLayer } from './types';

export interface LayerDecision {
  hub: Hub;
  active_layers: PronunciationLayer[];
  reason: string;
}

export function decideLayers(plan: LessonPlan, lessonKind: 'normal' | 'standalone_phonics' | 'booster'): LayerDecision {
  const hub = plan.lesson_state.hub;
  const profile = PRONUNCIATION_HUB_PROFILES[hub];

  if (lessonKind === 'standalone_phonics') {
    if (!profile.allowed_layers.includes('standalone')) {
      return { hub, active_layers: [], reason: `Standalone phonics is not allowed in the ${hub} hub.` };
    }
    return { hub, active_layers: ['standalone'], reason: 'Dedicated phonics lesson.' };
  }

  if (lessonKind === 'booster') {
    if (!profile.allowed_layers.includes('booster')) {
      return { hub, active_layers: [], reason: `Booster lessons are not available in the ${hub} hub.` };
    }
    return { hub, active_layers: ['booster'], reason: 'Pronunciation/fluency workshop.' };
  }

  // Normal lesson — always integrated + micro when allowed.
  const layers: PronunciationLayer[] = [];
  if (profile.allowed_layers.includes('integrated')) layers.push('integrated');
  if (profile.allowed_layers.includes('micro')) layers.push('micro');
  return { hub, active_layers: layers, reason: 'Embedded pronunciation support for a normal lesson.' };
}
