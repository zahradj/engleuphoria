import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLessonAssets } from '@/hooks/useLessonAssets';
import { soundEffectsService } from '@/services/soundEffectsService';
import { Logo } from '@/components/Logo';
import familyBackground from '@/assets/family-background.png';

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
      className="relative w-full h-screen overflow-hidden"
      style={{ 
        backgroundImage: `url(${familyBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-900/50 via-orange-600/30 to-yellow-400/20" />
      
      {/* Logo in top-left corner */}
      <motion.div
        className="absolute top-4 left-4 sm:top-8 sm:left-8 bg-white/95 rounded-2xl p-3 sm:p-4 shadow-2xl"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Logo size="medium" onClick={() => {}} />
      </motion.div>

      {/* Lesson Title - Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8">
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)] text-center mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {slide.prompt || slide.title || 'Welcome!'}
        </motion.h1>
        
        {slide.content && (
          <motion.p
            className="text-lg sm:text-xl lg:text-2xl text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] text-center max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {slide.content}
          </motion.p>
        )}
      </div>

      {/* Interactive controls - Bottom overlay card */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-4 sm:p-8"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-0 max-w-4xl mx-auto">
          <CardContent className="p-4 sm:p-8 space-y-4 sm:space-y-6">
            {slide.instructions && (
              <p className="text-lg sm:text-xl text-center font-medium text-gray-800">
                {slide.instructions}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleListen}
                disabled={audioPlaying}
                className="text-base sm:text-lg font-semibold"
              >
                {audioPlaying ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Volume2 className="mr-2 h-5 w-5" />}
                {audioPlaying ? 'Playing...' : 'Listen 👂'}
              </Button>
              
              {onNext && (
                <Button
                  onClick={() => {
                    soundEffectsService.playCorrect();
                    onNext();
                  }}
                  className="text-lg sm:text-xl font-bold px-8 sm:px-12 py-4 sm:py-6"
                  size="lg"
                >
                  Let's Start! 🚀
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
