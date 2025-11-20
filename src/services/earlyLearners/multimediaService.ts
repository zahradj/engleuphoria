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
    const results = [];
    
    // Generate images in batches of 5
    for (let i = 0; i < prompts.length; i += 5) {
      const batch = prompts.slice(i, i + 5);
      const batchResults = await Promise.all(
        batch.map(async (item) => {
          try {
            const { data, error } = await supabase.functions.invoke('generate-lesson-image', {
              body: { 
                prompt: item.prompt,
                lessonId,
                assetId: item.id,
                purpose: item.purpose
              }
            });
            
            if (error) throw error;
            return { ...item, status: 'complete', url: data.imageUrl };
          } catch (error: any) {
            console.error(`Failed to generate image ${item.id}:`, error);
            return { ...item, status: 'failed', error: error.message };
          }
        })
      );
      
      results.push(...batchResults);
      
      // Small delay between batches to avoid rate limits
      if (i + 5 < prompts.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }

  async generateAudio(lessonId: string, scripts: Array<{id: string; text: string; type: string}>) {
    const results = [];
    
    // Generate audio in batches of 5
    for (let i = 0; i < scripts.length; i += 5) {
      const batch = scripts.slice(i, i + 5);
      const batchResults = await Promise.all(
        batch.map(async (item) => {
          try {
            const { data, error } = await supabase.functions.invoke('generate-lesson-audio', {
              body: { 
                text: item.text,
                type: item.type,
                lessonId,
                assetId: item.id
              }
            });
            
            if (error) throw error;
            return { ...item, status: 'complete', url: data.audioUrl };
          } catch (error: any) {
            console.error(`Failed to generate audio ${item.id}:`, error);
            return { ...item, status: 'failed', error: error.message };
          }
        })
      );
      
      results.push(...batchResults);
      
      // Small delay between batches
      if (i + 5 < scripts.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
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
