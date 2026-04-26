/**
 * elevenLabsSfxBank
 *
 * Client-side cache + player for ElevenLabs-generated reward sound effects.
 *
 * - Each "key" maps to a short SFX prompt (≤ 2s).
 * - First play hits the `elevenlabs-sfx` edge function, caches the MP3 in
 *   IndexedDB-like localStorage (base64) so subsequent plays are instant and
 *   offline-friendly.
 * - All HTMLAudio nodes are pooled per-key and reused so rapid re-triggers
 *   restart from 0 instead of stacking.
 *
 * IMPORTANT: clip generation is async — the first time a sound is requested it
 * may take ~1-2s to download. We trigger background `prefetch()` on init to
 * warm the cache so reward stingers feel instant.
 */
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";

export type SfxKey =
  | "click"
  | "star"
  | "badge"
  | "reward_small"
  | "reward_medium"
  | "reward_big"
  | "celebration"
  | "success"
  | "error";

interface SfxSpec {
  prompt: string;
  duration: number;
  influence?: number;
  volume?: number;
}

// Tightly-scoped prompts keep generations consistent and short.
const SFX_PROMPTS: Record<SfxKey, SfxSpec> = {
  click: {
    prompt:
      "Soft, crisp UI button click, single short pop, clean digital, no reverb",
    duration: 0.5,
    influence: 0.7,
    volume: 0.6,
  },
  star: {
    prompt:
      "Bright magical star sparkle chime, short cheerful glittery ding, game reward",
    duration: 1.0,
    influence: 0.6,
    volume: 0.9,
  },
  badge: {
    prompt:
      "Triumphant badge unlocked fanfare, short shimmering achievement chime, video game",
    duration: 1.5,
    influence: 0.6,
    volume: 0.95,
  },
  reward_small: {
    prompt:
      "Pleasant single coin pickup ding, short positive reward chime, game UI",
    duration: 0.8,
    influence: 0.6,
    volume: 0.85,
  },
  reward_medium: {
    prompt:
      "Cheerful multi-note reward jingle, ascending bells, short, kids game",
    duration: 1.5,
    influence: 0.6,
    volume: 0.9,
  },
  reward_big: {
    prompt:
      "Big celebratory reward fanfare with sparkles and bells, short triumphant burst",
    duration: 2.0,
    influence: 0.6,
    volume: 1.0,
  },
  celebration: {
    prompt:
      "Joyful kids celebration with confetti pop, cheerful chimes, short and bright",
    duration: 2.5,
    influence: 0.6,
    volume: 1.0,
  },
  success: {
    prompt:
      "Positive success confirmation chime, two ascending notes, clean, short",
    duration: 0.9,
    influence: 0.65,
    volume: 0.85,
  },
  error: {
    prompt:
      "Soft polite error buzz, short low gentle tone, not harsh, UI feedback",
    duration: 0.7,
    influence: 0.7,
    volume: 0.7,
  },
};

const STORAGE_PREFIX = "ee_sfx_v1::";
const audioPool = new Map<SfxKey, HTMLAudioElement>();
const inflight = new Map<SfxKey, Promise<string | null>>();

function readCachedDataUrl(key: SfxKey): string | null {
  try {
    return localStorage.getItem(STORAGE_PREFIX + key);
  } catch {
    return null;
  }
}

function writeCachedDataUrl(key: SfxKey, dataUrl: string) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, dataUrl);
  } catch (err) {
    // Quota exceeded — silently ignore; we can re-fetch next time.
    logger.debug("SFX cache write failed", err);
  }
}

async function arrayBufferToDataUrl(buf: ArrayBuffer): Promise<string> {
  // Use FileReader to avoid btoa stack-overflow on large buffers.
  const blob = new Blob([buf], { type: "audio/mpeg" });
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function fetchAndCache(key: SfxKey): Promise<string | null> {
  const cached = readCachedDataUrl(key);
  if (cached) return cached;
  if (inflight.has(key)) return inflight.get(key)!;

  const spec = SFX_PROMPTS[key];
  const promise = (async () => {
    try {
      const { data, error } = await supabase.functions.invoke("elevenlabs-sfx", {
        body: {
          prompt: spec.prompt,
          durationSeconds: spec.duration,
          promptInfluence: spec.influence ?? 0.5,
        },
      });
      if (error) throw error;

      // supabase-js returns Blob for binary responses
      let buf: ArrayBuffer;
      if (data instanceof Blob) {
        buf = await data.arrayBuffer();
      } else if (data instanceof ArrayBuffer) {
        buf = data;
      } else {
        throw new Error("Unexpected SFX response type");
      }

      const dataUrl = await arrayBufferToDataUrl(buf);
      writeCachedDataUrl(key, dataUrl);
      return dataUrl;
    } catch (err) {
      logger.warn(`Failed to generate SFX "${key}"`, err);
      return null;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, promise);
  return promise;
}

function getOrCreateAudio(key: SfxKey, src: string): HTMLAudioElement {
  let el = audioPool.get(key);
  if (!el) {
    el = new Audio(src);
    el.preload = "auto";
    el.volume = SFX_PROMPTS[key].volume ?? 1.0;
    audioPool.set(key, el);
  } else if (el.src !== src) {
    el.src = src;
  }
  return el;
}

export const elevenLabsSfxBank = {
  /** Pre-warm cache for the most common stingers. Fire-and-forget. */
  prefetch(keys: SfxKey[] = ["click", "star", "badge", "reward_medium"]) {
    keys.forEach((k) => {
      // Don't await — background.
      fetchAndCache(k).then((url) => {
        if (url) getOrCreateAudio(k, url);
      });
    });
  },

  /** Play a cached or freshly-generated SFX. Resolves once playback starts. */
  async play(key: SfxKey): Promise<boolean> {
    const src = await fetchAndCache(key);
    if (!src) return false;
    try {
      const el = getOrCreateAudio(key, src);
      el.currentTime = 0;
      await el.play();
      return true;
    } catch (err) {
      logger.debug(`SFX "${key}" play failed`, err);
      return false;
    }
  },

  /** Drop the local cache (e.g. for "regenerate sounds" admin action). */
  clearCache() {
    Object.keys(SFX_PROMPTS).forEach((k) => {
      try {
        localStorage.removeItem(STORAGE_PREFIX + k);
      } catch {
        /* noop */
      }
    });
    audioPool.clear();
  },
};
