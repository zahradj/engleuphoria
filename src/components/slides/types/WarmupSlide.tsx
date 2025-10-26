import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ImageLoader } from '../ImageLoader';
import { useLessonAssets } from '@/hooks/useLessonAssets';
import { soundEffectsService } from '@/services/soundEffectsService';

interface WarmupSlideProps {
  slide: any;
  slideNumber: number;
  onNext?: () => void;
}

export function WarmupSlide({ slide, slideNumber, onNext }: WarmupSlideProps) {
  const { generateImage, generateAudio } = useLessonAssets();
  const [audioPlaying, setAudioPlaying] = useState(false);

  const handleListen = async () => {
    const text = slide.instructions || slide.prompt || slide.title || 'Welcome!';
    soundEffectsService.playButtonClick();
    setAudioPlaying(true);
    await generateAudio(text);
    setAudioPlaying(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full border-4 border-white/60 shadow-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <CardTitle className="text-5xl font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
              🎵 {slide.prompt || slide.title || 'Welcome!'}
            </CardTitle>
          </motion.div>
          <p className="text-sm text-muted-foreground mt-2">Slide {slideNumber}</p>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl text-center font-medium leading-relaxed"
          >
            {slide.instructions}
          </motion.p>
          
          {slide.media?.imagePrompt && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <ImageLoader
                prompt={slide.media.imagePrompt}
                alt={slide.media.alt || 'Warmup activity'}
                generateImage={generateImage}
                className="aspect-video max-w-3xl mx-auto"
              />
            </motion.div>
          )}
          
          {slide.content && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-lg leading-relaxed"
            >
              {slide.content}
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4 justify-center pt-4"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={handleListen}
              disabled={audioPlaying}
              className="text-lg font-semibold hover:scale-105 transition-transform shadow-lg"
            >
              {audioPlaying ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Volume2 className="mr-2 h-5 w-5" />
              )}
              {audioPlaying ? 'Playing...' : 'Listen 👂'}
            </Button>
          </motion.div>
          
          {onNext && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-2"
            >
              <Button
                onClick={() => {
                  soundEffectsService.playCorrect();
                  onNext();
                }}
                className="w-full text-xl font-bold py-6 shadow-xl hover:scale-105 transition-transform"
                size="lg"
              >
                Let's Start! 🚀
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
