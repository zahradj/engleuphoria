import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slide } from '@/types/slides';
import { motion } from 'framer-motion';

interface VocabularyPreviewSlideProps {
  slide: Slide;
  onComplete?: () => void;
  onNext?: () => void;
}

export function VocabularyPreviewSlide({ slide, onComplete, onNext }: VocabularyPreviewSlideProps) {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const handleCardFlip = (optionId: string) => {
    setFlippedCards(prev => new Set([...prev, optionId]));
    
    // If all cards are flipped, mark as complete
    if (slide.options && flippedCards.size === slide.options.length - 1) {
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
    }
  };

  if (slide.id === 'slide-2') {
    // Topic introduction slide
    return (
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">{slide.prompt}</h2>
          <p className="text-lg text-muted-foreground">{slide.instructions}</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="p-6">
                <img 
                  src={slide.media?.url} 
                  alt={slide.media?.alt}
                  className="w-full max-w-lg mx-auto rounded-lg"
                />
              </CardContent>
            </Card>
          </motion.div>

          <div className="text-center mt-6">
            <Button onClick={onNext} size="lg" className="bg-primary hover:bg-primary/90">
              Let's Learn Greetings! 🌟
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Flashcard slide
  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">{slide.prompt}</h2>
        <p className="text-lg text-muted-foreground">{slide.instructions}</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {slide.options?.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  flippedCards.has(option.id) ? 'bg-primary/10 border-primary' : ''
                }`}
                onClick={() => handleCardFlip(option.id)}
              >
                <CardContent className="p-6 text-center">
                  {flippedCards.has(option.id) ? (
                    <div>
                      <img 
                        src={option.image} 
                        alt={option.text}
                        className="w-32 h-32 mx-auto mb-4 rounded-lg object-cover"
                      />
                      <h3 className="text-xl font-bold text-primary">{option.text}</h3>
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center">
                      <div className="text-6xl">❓</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {flippedCards.size === slide.options?.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8"
          >
            <div className="text-lg font-semibold text-green-600">
              🎉 Excellent! You've learned all the greetings!
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}