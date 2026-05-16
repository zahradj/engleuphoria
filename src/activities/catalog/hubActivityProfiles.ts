// Hub-level bans and preferences. Selection hard-rejects banned types.

import type { Hub } from '@/governance/types';
import type { ActivityType } from '../types';

export interface HubActivityProfile {
  banned: ActivityType[];
  preferred: ActivityType[];
  max_consecutive_high_load: number;
  notes: string[];
}

export const HUB_ACTIVITY_PROFILES: Record<Hub, HubActivityProfile> = {
  playground: {
    banned: ['debate'],
    preferred: ['drag_drop', 'matching', 'storytelling', 'pronunciation', 'warmup'],
    max_consecutive_high_load: 1,
    notes: [
      'Short, visual, movement-oriented cycles.',
      'Avoid explicit grammar drills — implicit only.',
      'Tone: playful, positive, encouraging.',
    ],
  },
  academy: {
    banned: [],
    preferred: ['roleplay', 'opinion', 'collaborative', 'speaking_mission', 'poll'],
    max_consecutive_high_load: 2,
    notes: [
      'Identity-driven and socially interactive.',
      'Modern tone, communication-heavy.',
      'Challenge framing, not childish framing.',
    ],
  },
  success: {
    banned: [],
    preferred: ['roleplay', 'debate', 'speaking_mission', 'review_challenge', 'reflection'],
    max_consecutive_high_load: 2,
    notes: [
      'Realistic, workplace/life relevant scenarios.',
      'Premium, confidence-focused tone.',
      'Fluency over accuracy obsession.',
    ],
  },
};
