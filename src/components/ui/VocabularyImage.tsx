import React, { useState, useEffect } from 'react';
import { imageGenerationService } from '@/services/imageGeneration';
import { Loader2 } from 'lucide-react';

interface VocabularyImageProps {
  prompt: string;
  alt: string;
  style?: 'educational' | 'cartoon' | 'minimalist' | 'realistic' | 'hand-drawn' | 'flat2d';
  aspectRatio?: '1:1' | '16:9' | '4:3' | '3:4';
  className?: string;
  fallbackSrc?: string;
  /** Enable Picsart background removal + enhancement (default: true for flat2d/minimalist) */
  postProcess?: boolean;
}

export const VocabularyImage: React.FC<VocabularyImageProps> = ({
  prompt,
  alt,
  style = 'educational',
  aspectRatio = '1:1',
  className = '',
  fallbackSrc,
  postProcess,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-enable post-processing for flat2d and minimalist styles
  const shouldPostProcess = postProcess ?? (style === 'flat2d' || style === 'minimalist');

  useEffect(() => {
    const generateImage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await imageGenerationService.generateImage({
          prompt,
          style,
          aspectRatio,
          postProcess: shouldPostProcess,
        });
        
        setImageUrl(result.url);
      } catch (err) {
        console.error('Failed to generate vocabulary image:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate image');
        
        if (fallbackSrc) {
          setImageUrl(fallbackSrc);
        }
      } finally {
        setIsLoading(false);
      }
    };

    generateImage();
  }, [prompt, style, aspectRatio, fallbackSrc, shouldPostProcess]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-lg ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && !imageUrl) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-lg p-4 ${className}`}>
        <p className="text-sm text-muted-foreground text-center">
          Image unavailable
        </p>
      </div>
    );
  }

  return (
    <img
      src={imageUrl || ''}
      alt={alt}
      className={`rounded-lg object-cover ${className}`}
      onError={() => {
        console.error('Image failed to load:', imageUrl);
        if (fallbackSrc && imageUrl !== fallbackSrc) {
          setImageUrl(fallbackSrc);
        }
      }}
    />
  );
};
