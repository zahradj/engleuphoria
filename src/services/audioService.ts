/**
 * audioService — routes every classroom reward / UI sound through the
 * ElevenLabs SFX bank (cached MP3 stingers). Falls back to the local WebAudio
 * synth (`soundEffectsService`) if the network/edge function is unavailable so
 * the UI is never silent.
 *
 * A single mute flag controls both backends and is exposed via Sound Settings.
 */

import { logger } from '@/utils/logger';
import { soundEffectsService } from '@/services/soundEffectsService';
import { elevenLabsSfxBank, type SfxKey } from '@/services/elevenLabsSfxBank';

let isMuted = false;

// Warm the most-used stingers once the module loads.
elevenLabsSfxBank.prefetch(['click', 'star', 'badge', 'reward_medium', 'success']);

function play(key: SfxKey, fallback: () => void) {
  if (isMuted) return;
  elevenLabsSfxBank
    .play(key)
    .then((ok) => {
      if (!ok) {
        try { fallback(); } catch (err) { logger.debug('audio fallback failed', err); }
      }
    })
    .catch((err) => {
      logger.debug(`SFX "${key}" failed, using fallback`, err);
      try { fallback(); } catch {/* noop */}
    });
}

export const audioService = {
  playButtonClick: () =>
    play('click', () => soundEffectsService.playButtonClick()),

  playSuccessSound: () =>
    play('success', () => soundEffectsService.playCorrect()),

  playErrorSound: () =>
    play('error', () => soundEffectsService.playIncorrect()),

  /** Tier-aware reward sound — louder + more triumphant the more points awarded. */
  playRewardSound: (points: number = 10) => {
    if (points <= 5) play('reward_small', () => soundEffectsService.playDing());
    else if (points <= 15) play('reward_medium', () => soundEffectsService.playStarEarned());
    else if (points <= 30) play('reward_big', () => soundEffectsService.playPerfectStreak());
    else play('celebration', () => soundEffectsService.playCelebration());
  },

  playCelebrationSound: () =>
    play('celebration', () => soundEffectsService.playCelebration()),

  /** Sticker / badge reveal stinger. */
  playStickerSound: () =>
    play('badge', () => soundEffectsService.playPowerUp()),

  /** Single-star earned (top bar pop). */
  playStarSound: () =>
    play('star', () => soundEffectsService.playStarEarned()),

  playPronunciation: (word: string) => {
    if (isMuted) return;
    logger.debug('Playing pronunciation for:', word);
  },

  // Voice generation (ElevenLabs TTS) — handled by elevenlabs-tts function elsewhere.
  hasElevenLabsKey: (): boolean => true,
  setElevenLabsApiKey: (_key: string) => {
    logger.debug('ElevenLabs API key set (server-managed, no-op)');
  },
  generateVoiceMessage: async (message: string, voiceId?: string | number): Promise<void> => {
    logger.debug('Generating voice for (stub):', message, voiceId);
  },

  isSoundMuted: (): boolean => isMuted,

  setMuted: (muted: boolean) => {
    isMuted = muted;
    soundEffectsService.setMuted(muted);
  },

  /** Re-warm the ElevenLabs SFX cache (used by Sound Settings test panel). */
  prefetchSfx: () =>
    elevenLabsSfxBank.prefetch([
      'click', 'star', 'badge', 'reward_small',
      'reward_medium', 'reward_big', 'celebration', 'success', 'error',
    ]),

  /** Wipe the local SFX cache (forces regeneration on next play). */
  clearSfxCache: () => elevenLabsSfxBank.clearCache(),
};
