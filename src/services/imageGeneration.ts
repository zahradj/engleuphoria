import { supabase } from '@/integrations/supabase/client';

export interface ImageGenerationOptions {
  prompt: string;
  style?: 'educational' | 'cartoon' | 'minimalist' | 'realistic' | 'hand-drawn';
  aspectRatio?: '1:1' | '16:9' | '4:3' | '3:4';
  quality?: 'high' | 'medium' | 'low';
  background?: 'transparent' | 'white' | 'colored';
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  style: string;
  cached?: boolean;
}

class ImageGenerationService {
  private cache = new Map<string, GeneratedImage>();
  
  private getStylePrompt(style: string): string {
    const styleMap = {
      educational: 'clean educational illustration, simple and clear, perfect for learning',
      cartoon: 'colorful cartoon style, friendly and engaging, suitable for children',
      minimalist: 'minimal line art, clean and simple, modern design',
      realistic: 'photorealistic style, high quality and detailed',
      'hand-drawn': 'hand-drawn sketch style, artistic and creative'
    };
    return styleMap[style as keyof typeof styleMap] || '';
  }

  private generateCacheKey(options: ImageGenerationOptions): string {
    return `${options.prompt}-${options.style}-${options.aspectRatio}`;
  }

  async generateImage(options: ImageGenerationOptions): Promise<GeneratedImage> {
    const cacheKey = this.generateCacheKey(options);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return { ...this.cache.get(cacheKey)!, cached: true };
    }

    try {
      const stylePrompt = this.getStylePrompt(options.style || 'educational');
      const fullPrompt = `${options.prompt}, ${stylePrompt}, high quality illustration`;

      const { data, error } = await supabase.functions.invoke('ai-image-generator', {
        body: { 
          prompt: fullPrompt,
          aspectRatio: options.aspectRatio || '1:1',
          quality: options.quality || 'medium',
          background: options.background || 'white'
        }
      });

      if (error) throw error;

      const result: GeneratedImage = {
        url: data.imageUrl,
        prompt: options.prompt,
        style: options.style || 'educational',
        cached: false
      };

      // Cache the result
      this.cache.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Image generation failed:', error);
      // Return placeholder
      return {
        url: `https://via.placeholder.com/400x400/e3e3e3/666666?text=${encodeURIComponent(options.prompt)}`,
        prompt: options.prompt,
        style: options.style || 'educational',
        cached: false
      };
    }
  }

  generateContextualPrompt(slideContent: {
    prompt: string;
    type: string;
    level: string;
    topic?: string;
  }): string {
    const { prompt, type, level } = slideContent;
    
    // Base educational context
    let contextPrompt = `Educational illustration for ${level} level English learning: `;
    
    // Add type-specific context
    switch (type) {
      case 'vocabulary':
        contextPrompt += `Visual representation of "${prompt}" for vocabulary learning`;
        break;
      case 'grammar':
        contextPrompt += `Grammar concept illustration showing "${prompt}"`;
        break;
      case 'reading':
        contextPrompt += `Reading comprehension visual aid for "${prompt}"`;
        break;
      case 'listening':
        contextPrompt += `Audio/listening activity illustration for "${prompt}"`;
        break;
      default:
        contextPrompt += prompt;
    }
    
    return contextPrompt;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const imageGenerationService = new ImageGenerationService();