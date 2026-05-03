import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * usePlaygroundAudio — universal audio hook for the Playground Engine.
 *
 * Wraps the existing `elevenlabs-tts` Edge Function (which already securely
 * uses ELEVENLABS_API_KEY from Supabase secrets) so every Playground slide
 * can speak text + play cheerful correct/wrong feedback.
 *
 * Cheerful child-friendly voice: Lily (pFZP5JQG7iQjIQuC4Bku) by default.
 */

const PLAYGROUND_VOICE_ID = 'pFZP5JQG7iQjIQuC4Bku'; // Lily — warm, kid-friendly
const cache = new Map<string, string>(); // text → blob URL

async function fetchAudioUrl(text: string, voiceId = PLAYGROUND_VOICE_ID): Promise<string | null> {
  const key = `${voiceId}::${text}`;
  if (cache.has(key)) return cache.get(key)!;
  try {
    const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
      body: { text, voiceId, speed: 0.95 },
    });
    if (error || !data) return null;
    // supabase-js returns the blob for binary responses
    const blob = data instanceof Blob ? data : new Blob([data], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    cache.set(key, url);
    return url;
  } catch {
    return null;
  }
}

export function usePlaygroundAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setIsPlaying(false);
  }, []);

  const playVoice = useCallback(async (text: string, voiceId?: string) => {
    if (!text?.trim()) return;
    stop();
    const url = await fetchAudioUrl(text, voiceId);
    if (!url) {
      // Fallback to browser speech synthesis
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.95;
        u.pitch = 1.1;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
      } catch { /* noop */ }
      return;
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onplay = () => setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => setIsPlaying(false);
    audio.play().catch(() => setIsPlaying(false));
  }, [stop]);

  const playCorrect = useCallback((custom?: string) => {
    return playVoice(custom || 'Great job! Well done!');
  }, [playVoice]);

  const playWrong = useCallback((custom?: string) => {
    return playVoice(custom || 'Try again! You can do it!');
  }, [playVoice]);

  useEffect(() => () => stop(), [stop]);

  return { playVoice, playCorrect, playWrong, stop, isPlaying };
}
