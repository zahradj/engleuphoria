import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slide } from '@/types/slides';
import { motion } from 'framer-motion';

interface TargetLanguageSlideProps {
  slide: Slide;
  onComplete?: () => void;
  onNext?: () => void;
}

export function TargetLanguageSlide({ slide, onComplete, onNext }: TargetLanguageSlideProps) {
  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">{slide.prompt}</h2>
        <p className="text-lg text-muted-foreground">{slide.instructions}</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-6">
            <CardContent className="p-6">
              {slide.media?.url && (
                <img 
                  src={slide.media.url} 
                  alt={slide.media.alt}
                  className="w-full max-w-lg mx-auto rounded-lg mb-6"
                />
              )}
              
              {slide.clozeText && (
                <div className="bg-secondary/20 p-6 rounded-lg">
                  <pre className="text-lg leading-relaxed whitespace-pre-wrap font-sans">
                    {slide.clozeText}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="text-center">
          <Button onClick={onNext} size="lg" className="bg-primary hover:bg-primary/90">
            Continue Learning 📚
          </Button>
        </div>
      </div>
    </div>
  );
}