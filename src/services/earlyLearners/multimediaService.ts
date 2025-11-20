import { supabase } from '@/integrations/supabase/client';

export interface MultimediaGenerationRequest {
  lessonId: string;
  imagePrompts: Array<{ id: string; prompt: string; purpose: string }>;
  audioScripts: Array<{ id: string; text: string; type: string; purpose: string }>;
}

export interface GenerationProgress {
  total: number;
  complete: number;
  failed: number;
  pending: number;
  progress: number;
}

export class MultimediaGenerationService {
  async generateAllAssets(lessonId: string, imagePrompts: any[], audioScripts: any[]) {
    try {
      // Start parallel generation of images and audio
      const [imageResults, audioResults] = await Promise.all([
        this.generateImages(lessonId, imagePrompts),
        this.generateAudio(lessonId, audioScripts)
      ]);

      return {
        images: imageResults,
        audio: audioResults,
        success: true
      };
    } catch (error) {
      console.error('Multimedia generation error:', error);
      throw error;
    }
  }

  async generateImages(lessonId: string, prompts: Array<{id: string; prompt: string; purpose: string}>) {
    try {
      // Prepare batch request
      const imagePrompts = prompts.reduce((acc, item) => {
        acc[item.id] = item.prompt;
        return acc;
      }, {} as Record<string, string>);

      console.log(`Generating ${prompts.length} images in batch for lesson ${lessonId}`);
      
      const { data, error } = await supabase.functions.invoke('batch-generate-lesson-images', {
        body: { 
          lessonId,
          imagePrompts
        }
      });
      
      if (error) {
        console.error('Batch image generation error:', error);
        throw error;
      }
      
      // Map results back to expected format
      const results = prompts.map(item => {
        const url = data.results?.[item.id];
        const errorMsg = data.errors?.[item.id];
        
        return {
          ...item,
          status: url ? 'complete' as const : 'failed' as const,
          url: url || undefined,
          error: errorMsg
        };
      });
      
      console.log(`Image generation complete: ${data.totalGenerated} succeeded, ${data.totalFailed} failed`);
      return results;
    } catch (error) {
      console.error('Batch image generation failed:', error);
      throw error;
    }
  }

  async generateAudio(lessonId: string, scripts: Array<{id: string; text: string; type: string}>) {
    try {
      // Prepare batch request
      const audioTexts = scripts.reduce((acc, item) => {
        acc[item.id] = item.text;
        return acc;
      }, {} as Record<string, string>);

      console.log(`Generating ${scripts.length} audio files in batch for lesson ${lessonId}`);
      
      const { data, error } = await supabase.functions.invoke('batch-generate-lesson-audio', {
        body: { 
          lessonId,
          audioTexts
        }
      });
      
      if (error) {
        console.error('Batch audio generation error:', error);
        throw error;
      }
      
      // Map results back to expected format
      const results = scripts.map(item => {
        const url = data.results?.[item.id];
        const errorMsg = data.errors?.[item.id];
        
        return {
          ...item,
          status: url ? 'complete' as const : 'failed' as const,
          url: url || undefined,
          error: errorMsg
        };
      });
      
      console.log(`Audio generation complete: ${data.totalGenerated} succeeded, ${data.totalFailed} failed`);
      return results;
    } catch (error) {
      console.error('Batch audio generation failed:', error);
      throw error;
    }
  }

  async getProgress(lessonId: string): Promise<GenerationProgress> {
    try {
      const { data, error } = await supabase
        .from('multimedia_generation_queue')
        .select('*')
        .eq('lesson_id', lessonId);
      
      if (error) throw error;
      
      const total = data?.length || 0;
      const complete = data?.filter(d => d.status === 'complete').length || 0;
      const failed = data?.filter(d => d.status === 'failed').length || 0;
      const pending = total - complete - failed;
      
      return {
        total,
        complete,
        failed,
        pending,
        progress: total > 0 ? Math.round((complete / total) * 100) : 0
      };
    } catch (error) {
      console.error('Failed to get generation progress:', error);
      return { total: 0, complete: 0, failed: 0, pending: 0, progress: 0 };
    }
  }
}

export const multimediaService = new MultimediaGenerationService();
