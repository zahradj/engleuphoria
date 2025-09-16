import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Loader2, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Media } from '@/types/slides';
import { imageGenerationService, ImageGenerationOptions } from '@/services/imageGeneration';
import { AnimatedElement } from '../animations/SlideElements';

interface EnhancedMediaRendererProps {
  media?: Media;
  slideContent?: {
    prompt: string;
    type: string;
    level: string;
    topic?: string;
  };
  className?: string;
  autoGenerate?: boolean;
  imageStyle?: 'educational' | 'cartoon' | 'minimalist' | 'realistic' | 'hand-drawn';
}

export function EnhancedMediaRenderer({
  media,
  slideContent,
  className,
  autoGenerate = true,
  imageStyle = 'educational'
}: EnhancedMediaRendererProps) {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!media && autoGenerate && slideContent) {
      generateContextualImage();
    }
  }, [media, autoGenerate, slideContent]);

  const generateContextualImage = async () => {
    if (!slideContent) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const prompt = imageGenerationService.generateContextualPrompt(slideContent);
      const options: ImageGenerationOptions = {
        prompt,
        style: imageStyle,
        aspectRatio: '16:9',
        quality: 'medium',
        background: 'white'
      };
      
      const result = await imageGenerationService.generateImage(options);
      setGeneratedImage(result.url);
    } catch (err) {
      console.error('Failed to generate image:', err);
      setError('Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderMedia = () => {
    if (media) {
      const { type, url, alt, autoplay } = media;
      
      switch (type) {
        case 'image':
          return (
            <AnimatedElement animationType="scaleIn" delay={0.2}>
              <div className="relative group overflow-hidden rounded-xl shadow-lg">
                <motion.img
                  src={url}
                  alt={alt || 'Lesson image'}
                  className="w-full max-h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </AnimatedElement>
          );
          
        case 'video':
          return (
            <AnimatedElement animationType="scaleIn" delay={0.2}>
              <div className="relative rounded-xl overflow-hidden shadow-lg bg-surface">
                <video
                  src={url}
                  controls
                  autoPlay={autoplay}
                  className="w-full max-h-80 object-cover"
                  aria-label={alt || 'Lesson video'}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </AnimatedElement>
          );
          
        case 'audio':
          return (
            <AnimatedElement animationType="slideUp" delay={0.2}>
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl shadow-sm border border-primary-200">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="flex-shrink-0"
                >
                  <Volume2 className="h-8 w-8 text-primary-600" />
                </motion.div>
                <audio
                  src={url}
                  controls
                  autoPlay={autoplay}
                  className="flex-1 h-10"
                  aria-label={alt || 'Lesson audio'}
                >
                  Your browser does not support the audio tag.
                </audio>
              </div>
            </AnimatedElement>
          );
          
        default:
          return null;
      }
    }

    // Render generated or loading content
    if (isGenerating) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-surface-2 rounded-xl border-2 border-dashed border-primary-300">
          <Loader2 className="h-8 w-8 text-primary-600 animate-spin mb-3" />
          <p className="text-sm text-text-muted">Generating illustration...</p>
        </div>
      );
    }

    if (generatedImage) {
      return (
        <AnimatedElement animationType="scaleIn" delay={0.2}>
          <div className="relative group overflow-hidden rounded-xl shadow-lg">
            <motion.img
              src={generatedImage}
              alt={`Generated illustration: ${slideContent?.prompt}`}
              className="w-full max-h-80 object-cover transition-transform duration-300 group-hover:scale-105"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              loading="lazy"
            />
            <div className="absolute top-3 right-3 bg-success/90 text-white px-2 py-1 rounded-full text-xs font-medium">
              AI Generated
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </AnimatedElement>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-error-soft rounded-xl border border-error">
          <ImageIcon className="h-8 w-8 text-error mb-2" />
          <p className="text-sm text-error">{error}</p>
        </div>
      );
    }

    return null;
  };

  if (!media && !autoGenerate) {
    return null;
  }

  return (
    <div className={cn("w-full flex justify-center", className)}>
      {renderMedia()}
    </div>
  );
}