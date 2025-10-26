import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ImageLoader } from '../ImageLoader';
import { useLessonAssets } from '@/hooks/useLessonAssets';
import { soundEffectsService } from '@/services/soundEffectsService';
import { BookOpen } from 'lucide-react';

interface DefaultSlideProps {
  slide: any;
  slideNumber: number;
  onNext?: () => void;
}

export function DefaultSlide({ slide, slideNumber, onNext }: DefaultSlideProps) {
  const { generateImage } = useLessonAssets();
  
  return (
    <Card className="border-2 shadow-xl backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-slate-100 to-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-5 w-5 text-slate-600" />
          <div className="text-xs text-muted-foreground font-medium">Slide {slideNumber}</div>
        </div>
        <CardTitle className="text-3xl font-bold text-slate-800">
          {slide.title || slide.prompt || `Slide ${slideNumber}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        {slide.instructions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200"
          >
            <p className="text-sm font-medium text-slate-700">💡 {slide.instructions}</p>
          </motion.div>
        )}

        {slide.content && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <p className="text-base leading-relaxed text-slate-700">{slide.content}</p>
          </motion.div>
        )}

        {slide.media?.imagePrompt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <ImageLoader
              prompt={slide.media.imagePrompt}
              alt={slide.title || 'Slide image'}
              className="w-full max-w-2xl aspect-video"
              generateImage={generateImage}
            />
          </motion.div>
        )}

        {!slide.content && !slide.instructions && !slide.media?.imagePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-muted-foreground"
          >
            <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Slide content will appear here</p>
          </motion.div>
        )}

        {onNext && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center pt-4"
          >
            <Button 
              size="lg" 
              onClick={() => {
                soundEffectsService.playButtonClick();
                onNext();
              }}
              className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 shadow-lg text-lg px-8"
            >
              Continue ➡️
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
