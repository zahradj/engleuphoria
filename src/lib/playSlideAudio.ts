/**
 * Resilient audio player for slides.
 *
 * Strategy:
 *   1. Try to play the provided remote audio URL (e.g. ElevenLabs).
 *   2. On ANY failure (network, decode, autoplay block, missing URL),
 *      fall back to the browser's built-in `window.speechSynthesis`.
 *
 * Returns a cleanup function that stops whichever channel is playing.
 */

export interface PlaySlideAudioOptions {
  /** Pre-generated audio URL (ElevenLabs, etc.). */
  audioUrl?: string | null;
  /** Plain text used for both the speech-synthesis fallback and aria. */
  text?: string | null;
  /** BCP-47 language tag for the fallback voice. Defaults to en-US. */
  lang?: string;
  /** Called once the audio (or fallback) actually starts. */
  onStart?: () => void;
  /** Called when the audio finishes naturally. */
  onEnd?: () => void;
  /** Called if BOTH channels fail. */
  onError?: (err: unknown) => void;
}

export function playSlideAudio(opts: PlaySlideAudioOptions): () => void {
  const { audioUrl, text, lang = 'en-US', onStart, onEnd, onError } = opts;

  let audio: HTMLAudioElement | null = null;
  let utterance: SpeechSynthesisUtterance | null = null;
  let cancelled = false;

  const speakFallback = () => {
    if (cancelled) return;
    if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onError?.(new Error('No audio URL and speechSynthesis unavailable'));
      return;
    }
    try {
      window.speechSynthesis.cancel();
      utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.onstart = () => onStart?.();
      utterance.onend = () => onEnd?.();
      utterance.onerror = (e) => onError?.(e);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      onError?.(e);
    }
  };

  if (audioUrl) {
    try {
      audio = new Audio(audioUrl);
      audio.preload = 'auto';
      audio.onplay = () => onStart?.();
      audio.onended = () => onEnd?.();
      audio.onerror = () => {
        // Network / decode failure → fall back to TTS
        speakFallback();
      };
      audio.play().catch(() => {
        // Autoplay blocked or other play() rejection → fall back
        speakFallback();
      });
    } catch {
      speakFallback();
    }
  } else {
    speakFallback();
  }

  return () => {
    cancelled = true;
    try {
      audio?.pause();
      if (audio) audio.src = '';
    } catch { /* noop */ }
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch { /* noop */ }
  };
}
