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
) => invokeJson('generate-slide-image', { prompt, lessonId, slideId });

export const generateSlideVoiceover = (
  text: string,
  lessonId: string,
  slideId: string,
) => invokeJson('generate-slide-voiceover', { text, lessonId, slideId });

export const generateSlideMusic = (
  prompt: string,
  lessonId: string,
  slideId: string,
  durationSeconds = 30,
) => invokeJson('generate-slide-music', { prompt, lessonId, slideId, durationSeconds });

export const generateSlideVideo = (
  prompt: string,
  lessonId: string,
  slideId: string,
) => invokeJson('generate-slide-video', { prompt, lessonId, slideId });
