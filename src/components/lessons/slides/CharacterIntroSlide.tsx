import React from 'react';
import { Slide } from '@/types/slides';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

interface CharacterIntroSlideProps {
  slide: Slide;
  onComplete?: () => void;
  onNext?: () => void;
}

export function CharacterIntroSlide({ slide, onComplete, onNext }: CharacterIntroSlideProps) {
  const playAudio = () => {
    if (slide.audio) {
      const audioUrl = typeof slide.audio === 'string' ? slide.audio : slide.audio.url;
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleContinue = () => {
    onComplete?.();
    onNext?.();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        {slide.media?.url && (
          <motion.img
            src={slide.media.url}
            alt={slide.media.alt || 'Character'}
            className="w-80 h-80 object-contain mb-6"
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="bg-white rounded-3xl p-6 shadow-xl relative mb-6"
        >
          <div className="absolute -left-4 top-8 w-8 h-8 bg-white transform rotate-45"></div>
          <h2 className="text-3xl font-bold text-foreground mb-2">{slide.prompt}</h2>
          <p className="text-xl text-muted-foreground">{slide.instructions}</p>
        </motion.div>

        <div className="flex gap-4">
          <Button
            onClick={playAudio}
            size="lg"
            variant="outline"
            className="gap-2"
          >
            <Volume2 className="w-5 h-5" />
            Hear Again
          </Button>
          <Button
            onClick={handleContinue}
            size="lg"
          >
            Continue
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
