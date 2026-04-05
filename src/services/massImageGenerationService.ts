/**
 * Mass Image Generation Service
 * 
 * Takes slide skeletons and generates all images via the AI Gateway
 * using Midjourney-tier cinematic prompts. Supports progress tracking
 * and automatic Supabase storage upload.
 */

import { supabase } from '@/integrations/supabase/client';
import { SlideSkeleton, LessonSkeletonPlan } from './slideSkeletonEngine';
import { runPicsartPipeline, PicsartSlideResult, PicsartPipelineResult, HubFilter } from './picsartPipelineService';

export type SlideImageStatus = 'pending' | 'generating' | 'done' | 'error';

export interface SlideImageProgress {
  slideNumber: number;
  status: SlideImageStatus;
  imageUrl: string | null;
  error: string | null;
}

export interface MassGenerationResult {
  lessonId: string;
  totalSlides: number;
  successCount: number;
  failedCount: number;
  images: SlideImageProgress[];
  durationMs: number;
}

/**
 * Generate a single image via the AI Gateway (Gemini image model)
 */
async function generateSingleImage(
  prompt: string,
  slideNumber: number,
  lessonId: string,
): Promise<{ imageUrl: string | null; error: string | null }> {
  try {
    const response = await supabase.functions.invoke('ai-image-generation', {
      body: {
        prompt,
        style: 'cinematic',
        width: 1920,
        height: 1080,
        lessonId,
        slideNumber,
      },
    });

    if (response.error) {
      throw new Error(response.error.message || 'Image generation failed');
    }

    const imageUrl = response.data?.imageUrl || response.data?.url || null;
    return { imageUrl, error: null };
  } catch (err: any) {
    console.error(`Slide ${slideNumber} image generation failed:`, err);
    return { imageUrl: null, error: err.message || 'Unknown error' };
  }
}

/**
 * Mass-generate all images for a lesson's slide skeletons.
 * Calls the AI image generator for each slide with progress callbacks.
 */
export async function massGenerateImages(
  plan: LessonSkeletonPlan,
  onProgress: (progress: SlideImageProgress[]) => void,
): Promise<MassGenerationResult> {
  const startTime = Date.now();

  // Initialize progress for all slides
  const progress: SlideImageProgress[] = plan.skeletons.map((s) => ({
    slideNumber: s.slideNumber,
    status: 'pending' as SlideImageStatus,
    imageUrl: null,
    error: null,
  }));

  onProgress([...progress]);

  let successCount = 0;
  let failedCount = 0;

  // Generate images sequentially (to avoid rate limits, 2 at a time)
  const CONCURRENCY = 2;
  for (let i = 0; i < plan.skeletons.length; i += CONCURRENCY) {
    const batch = plan.skeletons.slice(i, i + CONCURRENCY);

    // Mark batch as generating
    batch.forEach((skeleton) => {
      const idx = skeleton.slideNumber - 1;
      progress[idx].status = 'generating';
    });
    onProgress([...progress]);

    // Generate batch in parallel
    const results = await Promise.all(
      batch.map((skeleton) =>
        generateSingleImage(skeleton.imagePrompt, skeleton.slideNumber, plan.lessonId)
      )
    );

    // Update progress with results
    results.forEach((result, batchIdx) => {
      const skeleton = batch[batchIdx];
      const idx = skeleton.slideNumber - 1;

      if (result.imageUrl) {
        progress[idx].status = 'done';
        progress[idx].imageUrl = result.imageUrl;
        successCount++;
      } else {
        progress[idx].status = 'error';
        progress[idx].error = result.error;
        failedCount++;
      }
    });

    onProgress([...progress]);

    // Brief delay between batches to avoid rate limiting
    if (i + CONCURRENCY < plan.skeletons.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  // Save generated image URLs to the lesson content in Supabase
  if (successCount > 0) {
    try {
      const { data: lessonData } = await supabase
        .from('curriculum_lessons')
        .select('content')
        .eq('id', plan.lessonId)
        .single();

      if (lessonData) {
        const existingContent = (lessonData.content as any) || {};
        const slideImages = progress
          .filter((p) => p.status === 'done' && p.imageUrl)
          .map((p) => ({
            slideNumber: p.slideNumber,
            imageUrl: p.imageUrl,
          }));

        const updatedContent = {
          ...existingContent,
          generatedImages: slideImages,
          imageGeneratedAt: new Date().toISOString(),
          duration_minutes: plan.totalMinutes,
        };

        await supabase
          .from('curriculum_lessons')
          .update({ content: updatedContent, duration_minutes: plan.totalMinutes } as any)
          .eq('id', plan.lessonId);
      }
    } catch (err) {
      console.error('Failed to save image URLs to lesson:', err);
    }
  }

  return {
    lessonId: plan.lessonId,
    totalSlides: plan.totalSlides,
    successCount,
    failedCount,
    images: progress,
    durationMs: Date.now() - startTime,
  };
}
