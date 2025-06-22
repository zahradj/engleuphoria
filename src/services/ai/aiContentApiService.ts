
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { AIContentRequest, AIGeneratedContent } from './types';
import { mockContentService } from './mockContentService';

export class AIContentApiService {
  async generateContent(request: AIContentRequest): Promise<AIGeneratedContent> {
    console.log('AIContentApiService: Starting content generation', {
      type: request.type,
      topic: request.topic,
      level: request.level,
      isSupabaseConfigured: isSupabaseConfigured()
    });

    if (!isSupabaseConfigured()) {
      console.log('AIContentApiService: Supabase not configured, using mock content');
      return mockContentService.generateMockContent(request);
    }

    const startTime = Date.now();

    try {
      let retries = 3;
      let delay = 1000;

      while (retries > 0) {
        try {
          console.log(`AIContentApiService: Attempting API call (${retries} retries left)`);
          
          const { data, error } = await supabase.functions.invoke('ai-content-generator', {
            body: request
          });

          if (error) {
            console.error('AIContentApiService: Supabase function error:', error);
            throw new Error(error.message || 'Failed to generate content via Supabase function');
          }

          if (!data || !data.content) {
            console.error('AIContentApiService: Invalid response structure:', data);
            throw new Error('Invalid response from content generation service');
          }

          const generatedContent = data.content;
          generatedContent.metadata = {
            ...generatedContent.metadata,
            generationTime: Date.now() - startTime
          };
          
          console.log('AIContentApiService: Content generated successfully', {
            id: generatedContent.id,
            type: generatedContent.type,
            generationTime: generatedContent.metadata.generationTime
          });
          
          return generatedContent;
        } catch (error) {
          retries--;
          console.error(`AIContentApiService: Attempt failed:`, error);
          
          if (retries === 0) {
            throw error;
          }
          
          console.log(`AIContentApiService: Retrying in ${delay}ms... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        }
      }
    } catch (error) {
      console.error('AIContentApiService: All attempts failed, falling back to mock content:', error);
      
      // Always provide fallback content so user gets something
      const mockContent = mockContentService.generateMockContent(request);
      
      // Add a note that this is fallback content
      mockContent.metadata = {
        ...mockContent.metadata,
        isFallback: true,
        fallbackReason: error.message || 'API generation failed'
      };
      
      return mockContent;
    }

    // This should never be reached, but TypeScript requires it
    console.log('AIContentApiService: Unexpected code path, returning mock content');
    return mockContentService.generateMockContent(request);
  }
}

export const aiContentApiService = new AIContentApiService();
