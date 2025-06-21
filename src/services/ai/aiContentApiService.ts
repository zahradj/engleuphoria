
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { AIContentRequest, AIGeneratedContent } from './types';
import { mockContentService } from './mockContentService';

export class AIContentApiService {
  async generateContent(request: AIContentRequest): Promise<AIGeneratedContent> {
    if (!isSupabaseConfigured()) {
      return mockContentService.generateMockContent(request);
    }

    const startTime = Date.now();

    try {
      let retries = 3;
      let delay = 1000;

      while (retries > 0) {
        try {
          const { data, error } = await supabase.functions.invoke('ai-content-generator', {
            body: request
          });

          if (error) {
            throw new Error(error.message || 'Failed to generate content');
          }

          const generatedContent = data.content;
          generatedContent.metadata.generationTime = Date.now() - startTime;
          return generatedContent;
        } catch (error) {
          retries--;
          if (retries === 0) throw error;
          
          console.log(`Retrying in ${delay}ms... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
        }
      }
    } catch (error) {
      console.error('Failed to generate AI content, falling back to mock:', error);
      return mockContentService.generateMockContent(request);
    }

    // This should never be reached, but TypeScript requires it
    return mockContentService.generateMockContent(request);
  }
}

export const aiContentApiService = new AIContentApiService();
