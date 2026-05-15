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

export interface StarringCharacterRef {
  name: string;
  visual_blueprint: string;
  personality_traits?: string;
}

export const generateSlideImage = (
  prompt: string,
  lessonId: string,
  slideId: string,
  hub?: string,
  starring_character?: StarringCharacterRef,
  opts?: { slideKind?: 'vocabulary' | 'story' | 'scene' | string; vocabulary_word?: string; example_sentence?: string },
) => invokeJson('generate-slide-image', {
  prompt,
  lessonId,
  slideId,
  hub,
  starring_character,
  slideKind: opts?.slideKind,
  vocabulary_word: opts?.vocabulary_word,
  example_sentence: opts?.example_sentence,
});

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
  if (h === 'playground' || h === 'kids' || h === 'children')
    return `${cleaned}, flat 2D animation style, cute and child-friendly, predominantly natural realistic colors with just a hint of the Playground brand palette (warm orange and sunny yellow) used as small accents only — never let these colors dominate the image, clean white background or light natural environment. Apply the EnglEuphoria Playground signature: bright, welcoming colors, but ensure subtle hints of sunny yellow and vibrant orange are present in playful objects (like a toy block, a button, a backpack detail, or a hat). Keep the scene natural, not heavily saturated, never cartoony-overwhelming, and limit the brand accents to small props only.`;
  if (h === 'success' || h === 'professional' || h === 'adults' || h === 'adult')
    return `${cleaned}, modern professional editorial photography, sleek and highly realistic, predominantly natural realistic colors with just a hint of the Success brand palette (mint and emerald green) used as small accents only — never let these colors dominate the image, clean white background or light natural environment. Apply the EnglEuphoria Success signature: professional and sleek lighting in a sophisticated setting with natural and corporate colors, but ensure subtle hints of mint green are present in a clear detail (like a potted plant with mint leaves, a notebook corner, a tie pattern, or a subtle light reflection). Maintain high-end realism — the mint accent must not dominate the scene.`;
  // Default: academy
  return `${cleaned}, clean slice-of-life webcomic style, realistic everyday lifestyle situations, predominantly natural realistic colors with just a hint of the Academy brand palette (purple, blue, and bluish-purple) used as small accents only — never let these colors dominate the image. Do not use sci-fi, superhero, or fantasy styles. Clean white background or light natural environment. Apply the EnglEuphoria Academy signature: natural, realistic base lighting and colors, but ensure subtle hints of vibrant electric purplish-blue are present in a single small object (like a phone case, a pen, a coffee cup, an architectural detail, or a clothing accent). Do not allow the entire scene to turn purple — the accent must be small and must not dominate the scene.`;
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
