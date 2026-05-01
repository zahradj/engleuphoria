import { supabase } from '@/integrations/supabase/client';

export interface GeneratedAsset {
  url: string;
  path: string;
}

async function invokeJson(fn: string, body: Record<string, unknown>): Promise<GeneratedAsset> {
  const { data, error } = await supabase.functions.invoke(fn, { body });
  if (error) {
    // Try to extract a useful message from the response context.
    const ctx = (error as { context?: Response }).context;
    let detail = error.message;
    if (ctx && typeof ctx.text === 'function') {
      try {
        const txt = await ctx.text();
        const parsed = JSON.parse(txt);
        detail = parsed.error || parsed.details || txt || detail;
      } catch {
        /* keep default */
      }
    }
    throw new Error(detail);
  }
  if (!data || typeof (data as GeneratedAsset).url !== 'string') {
    throw new Error('Generation succeeded but no asset URL was returned.');
  }
  return data as GeneratedAsset;
}

export const generateSlideImage = (
  prompt: string,
  lessonId: string,
  slideId: string,
  hub?: string,
) => invokeJson('generate-slide-image', { prompt, lessonId, slideId, hub });

export const generateSlideVoiceover = (
  text: string,
  lessonId: string,
  slideId: string,
  voiceId?: string,
) => invokeJson('generate-slide-voiceover', { text, lessonId, slideId, voiceId });

export const generateSlideMusic = (
  prompt: string,
  lessonId: string,
  slideId: string,
  durationSeconds = 30,
) => invokeJson('generate-slide-music', { prompt, lessonId, slideId, durationSeconds });

export interface AllMediaSlideResult {
  slideId: string;
  custom_image_url?: string;
  youtube_video_id?: string;
  youtube_embed_url?: string;
  youtube_title?: string;
  youtube_thumbnail?: string;
  skipped?: boolean;
  error?: string;
}

export interface AllMediaResponse {
  results: AllMediaSlideResult[];
  summary: { total: number; images: number; videos: number; skipped: number; errors: number };
}

export async function generateAllMedia(
  lessonId: string,
  hub: string,
  slides: Array<Record<string, unknown>>,
  overwrite = false,
): Promise<AllMediaResponse> {
  const { data, error } = await supabase.functions.invoke('generate-all-media', {
    body: { lessonId, hub, slides, overwrite },
  });
  if (error) {
    const ctx = (error as { context?: Response }).context;
    let detail = error.message;
    if (ctx && typeof ctx.text === 'function') {
      try {
        const txt = await ctx.text();
        const parsed = JSON.parse(txt);
        detail = parsed.error || parsed.details || txt || detail;
      } catch { /* keep default */ }
    }
    throw new Error(detail);
  }
  return data as AllMediaResponse;
}
