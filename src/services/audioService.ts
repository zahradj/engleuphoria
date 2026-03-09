/**
 * @stub
 * Audio service stubs for sound effects and game sounds.
 *
 * Status: Stub. All sound-effect methods are no-ops.
 * Pending: Integration with a real audio engine or Web Audio API.
 *
 * Voice generation methods (ElevenLabs) are also stubbed.
 * See src/services/audioPlaceholderService.ts for audio manifest helpers.
 */

import { logger } from '@/utils/logger';

let isMuted = false;

export const audioService = {
  playButtonClick: () => {
    if (isMuted) return;
    // TODO: Implement click sound
  },

  playSuccessSound: () => {
    if (isMuted) return;
    // TODO: Implement success sound
  },

  playErrorSound: () => {
    if (isMuted) return;
    // TODO: Implement error sound
  },

  playRewardSound: (_points: number = 10) => {
    if (isMuted) return;
    // TODO: Implement reward sound
  },

  playCelebrationSound: () => {
    if (isMuted) return;
    // TODO: Implement celebration sound
  },

  playPronunciation: (word: string) => {
    if (isMuted) return;
    logger.debug('Playing pronunciation for:', word);
    // TODO: Implement pronunciation via TTS
  },

  // Voice generation (ElevenLabs) — @stub
  hasElevenLabsKey: (): boolean => {
    return false;
  },

  setElevenLabsApiKey: (_key: string) => {
    logger.debug('ElevenLabs API key set (stub)');
  },

  generateVoiceMessage: async (message: string, voiceId?: string | number): Promise<void> => {
    logger.debug('Generating voice for (stub):', message, voiceId);
    // TODO: Implement ElevenLabs TTS call
  },

  isSoundMuted: (): boolean => isMuted,

  setMuted: (muted: boolean) => {
    isMuted = muted;
  }
};
