/**
 * Audio service — thin façade over `soundEffectsService` so every call site
 * (rewards, stars, stickers, button clicks) actually plays a sound. Honors a
 * single mute flag that is mirrored into the underlying WebAudio engine so the
 * Sound Settings toggle continues to work end-to-end.
 */

import { logger } from '@/utils/logger';
import { soundEffectsService } from '@/services/soundEffectsService';

let isMuted = false;

const guard = (fn: () => void) => {
  if (isMuted) return;
  try {
    fn();
  } catch (err) {
    logger.debug('audioService SFX failed', err);
  }
};

export const audioService = {
  playButtonClick: () => guard(() => soundEffectsService.playButtonClick()),

  playSuccessSound: () => guard(() => soundEffectsService.playCorrect()),

  playErrorSound: () => guard(() => soundEffectsService.playIncorrect()),

  /**
   * Tier-aware reward sound — louder + more triumphant the more points awarded.
   * Tiers: ≤5 ding, ≤15 star, ≤30 streak, >30 full celebration.
   */
  playRewardSound: (points: number = 10) => guard(() => {
    if (points <= 5) soundEffectsService.playDing();
    else if (points <= 15) soundEffectsService.playStarEarned();
    else if (points <= 30) soundEffectsService.playPerfectStreak();
    else soundEffectsService.playCelebration();
  }),

  playCelebrationSound: () => guard(() => soundEffectsService.playCelebration()),

  /** Sticker / badge reveal stinger. */
  playStickerSound: () => guard(() => soundEffectsService.playPowerUp()),

  /** Single-star earned (top bar pop). */
  playStarSound: () => guard(() => soundEffectsService.playStarEarned()),

  playPronunciation: (word: string) => {
    if (isMuted) return;
    logger.debug('Playing pronunciation for:', word);
    // TTS handled elsewhere (ElevenLabs path) — kept as no-op here.
  },

  // Voice generation (ElevenLabs) — still stubbed; rewards use WebAudio above.
  hasElevenLabsKey: (): boolean => false,
  setElevenLabsApiKey: (_key: string) => {
    logger.debug('ElevenLabs API key set (stub)');
  },
  generateVoiceMessage: async (message: string, voiceId?: string | number): Promise<void> => {
    logger.debug('Generating voice for (stub):', message, voiceId);
  },

  isSoundMuted: (): boolean => isMuted,

  setMuted: (muted: boolean) => {
    isMuted = muted;
    soundEffectsService.setMuted(muted);
  },
};
