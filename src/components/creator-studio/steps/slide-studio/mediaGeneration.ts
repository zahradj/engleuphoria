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

/**
 * Hub-aware Prompt Interceptor (client mirror of the edge helper).
 * Appends the Hub's required Style Suffix and Color Palette Suffix
 * to the user's base prompt so the user's original target word/phrase
 * remains the focal point of the image. The edge function applies the
 * same suffix server-side; pre-enriching here keeps logs/preview accurate.
 */
export function enrichImagePrompt(basePrompt: string, hub?: string): string {
  const h = (hub || '').toLowerCase().trim();
  const cleaned = (basePrompt || '').trim().replace(/\s+/g, ' ');
  if (h === 'playground' || h === 'kids')
    return `${cleaned}, flat 2D animation style, cute and child-friendly, warm natural colors with subtle orange and yellow accents (do not make the image overwhelmingly orange), clean white background or light natural environment.`;
  if (h === 'success' || h === 'professional' || h === 'adults')
    return `${cleaned}, modern professional editorial photography, sleek and highly realistic, natural realistic colors with only subtle mint and emerald green accents (do not make the image overwhelmingly green), clean white background or light natural environment.`;
  // Default: academy
  return `${cleaned}, clean slice-of-life webcomic style, realistic everyday lifestyle situations. Use natural, realistic colors with only very subtle purple accents. Do not make the image overwhelmingly purple and do not use sci-fi or fantasy styles. Clean white background or light natural environment.`;
}

export const generateSlideVoiceover = (
  text: string,
  lessonId: string,
  slideId: string,
  voiceId?: string,
  mode?: 'phonetic',
) => invokeJson('generate-slide-voiceover', { text, lessonId, slideId, voiceId, mode });

export const generateSlideMusic = (
  prompt: string,
  lessonId: string,
  slideId: string,
  durationSeconds = 30,
) => invokeJson('generate-slide-music', { prompt, lessonId, slideId, durationSeconds });

export interface AllMediaPanelResult {
  index: number;
  image_url?: string;
  error?: string;
}

export interface AllMediaSlideResult {
  slideId: string;
  custom_image_url?: string;
  youtube_video_id?: string;
  youtube_embed_url?: string;
  youtube_title?: string;
  youtube_thumbnail?: string;
  panels?: AllMediaPanelResult[];
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
