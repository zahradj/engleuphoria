// Hub profiles for pronunciation system. Drives layer selection, activity bans,
// and tone of phonics content.

import type { Hub } from '@/governance/types';
import type { PronunciationActivityType, PronunciationLayer } from './types';

export interface PronunciationHubProfile {
  allowed_layers: PronunciationLayer[];
  preferred_activities: PronunciationActivityType[];
  banned_activities: PronunciationActivityType[];
  tone: 'playful' | 'modern' | 'professional';
  use_ipa: 'minimal' | 'optional' | 'expected';
  notes: string[];
}

export const PRONUNCIATION_HUB_PROFILES: Record<Hub, PronunciationHubProfile> = {
  playground: {
    allowed_layers: ['integrated', 'standalone', 'micro'],
    preferred_activities: [
      'blending', 'syllable_counting', 'pronunciation_game',
      'sound_discrimination', 'repeat_after_audio', 'rhythm_drill',
    ],
    banned_activities: [
      'shadowing', 'connected_speech_training', 'intonation_practice',
    ],
    tone: 'playful',
    use_ipa: 'minimal',
    notes: [
      'Visual, movement, chant-driven.',
      'Standalone phonics lessons are essential.',
      'Avoid technical phonetic terminology.',
    ],
  },
  academy: {
    allowed_layers: ['integrated', 'booster', 'micro'],
    preferred_activities: [
      'stress_identification', 'rhythm_drill', 'minimal_pairs',
      'shadowing', 'fluency_repetition', 'speaking_mission_pron',
    ],
    banned_activities: ['blending', 'syllable_counting'], // childish for teens
    tone: 'modern',
    use_ipa: 'optional',
    notes: [
      'Challenge framing, identity-driven.',
      'Standalone phonics is NOT appropriate here.',
      'Pronunciation = confidence, not decoding.',
    ],
  },
  success: {
    allowed_layers: ['integrated', 'booster', 'micro'],
    preferred_activities: [
      'shadowing', 'connected_speech_training', 'intonation_practice',
      'stress_identification', 'fluency_repetition', 'speaking_mission_pron',
    ],
    banned_activities: ['blending', 'syllable_counting', 'pronunciation_game'],
    tone: 'professional',
    use_ipa: 'expected',
    notes: [
      'Intelligibility & professional clarity.',
      'No childish phonics activities ever.',
      'Booster lessons are the standalone format here.',
    ],
  },
};
