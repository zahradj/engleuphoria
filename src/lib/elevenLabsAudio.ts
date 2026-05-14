/**
 * Unified ElevenLabs audio playback.
 * Per architecture lock: NO native browser TTS fallback. ElevenLabs is the
 * exclusive source of spoken audio across the app.
 */
import { supabase } from '@/integrations/supabase/client';

export interface PlayElevenLabsOptions {
  voiceId?: string;
  speed?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (e: unknown) => void;
}

let currentAudio: HTMLAudioElement | null = null;

export function stopElevenLabs() {
  try {
    currentAudio?.pause();
    currentAudio = null;
  } catch { /* noop */ }
}

export async function playElevenLabs(
  text: string,
  opts: PlayElevenLabsOptions = {}
): Promise<HTMLAudioElement | null> {
  const { voiceId = 'Xb7hH8MSUJpSbSDYk0k2', speed, onStart, onEnd, onError } = opts;
  if (!text || !text.trim()) return null;

  stopElevenLabs();

  try {
    const { data, error } = await supabase.functions.invoke('generate-elevenlabs-audio', {
      body: { text, voiceId, speed },
    });
    if (error) throw error;
    if (!data) throw new Error('No audio data returned from generate-elevenlabs-audio');

    const blob = data instanceof Blob ? data : new Blob([data as ArrayBuffer], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    currentAudio = audio;
    audio.onplay = () => onStart?.();
    audio.onended = () => { onEnd?.(); URL.revokeObjectURL(url); };
    audio.onerror = (e) => { onError?.(e); URL.revokeObjectURL(url); };
    await audio.play();
    return audio;
  } catch (e) {
    console.error('[ElevenLabs] playback failed:', e);
    onError?.(e);
    return null;
  }
}

/** Plays a remote audio URL if provided, else generates via ElevenLabs. No native TTS. */
export async function playAudioUrlOrTts(
  audioUrl: string | null | undefined,
  text: string,
  opts: PlayElevenLabsOptions = {}
): Promise<HTMLAudioElement | null> {
  if (audioUrl) {
    stopElevenLabs();
    try {
      const audio = new Audio(audioUrl);
      currentAudio = audio;
      audio.onplay = () => opts.onStart?.();
      audio.onended = () => opts.onEnd?.();
      audio.onerror = (e) => opts.onError?.(e);
      await audio.play();
      return audio;
    } catch (e) {
      console.warn('[ElevenLabs] remote URL failed, generating fresh audio:', e);
    }
  }
  return playElevenLabs(text, opts);
}
