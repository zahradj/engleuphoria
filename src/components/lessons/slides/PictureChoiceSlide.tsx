import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slide } from '@/types/slides';
import { motion } from 'framer-motion';

interface PictureChoiceSlideProps {
  slide: Slide;
  onComplete?: () => void;
  onNext?: () => void;
}

export function PictureChoiceSlide({ slide, onComplete, onNext }: PictureChoiceSlideProps) {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  const handleLeftClick = (pairId: string) => {
    setSelectedLeft(pairId);
  };

  const handleRightClick = (pairId: string) => {
    if (selectedLeft) {
      setMatches(prev => ({ ...prev, [selectedLeft]: pairId }));
      setSelectedLeft(null);
      
      // Check if all pairs are matched
      if (slide.matchPairs && Object.keys(matches).length === slide.matchPairs.length - 1) {
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">{slide.prompt}</h2>
        <p className="text-lg text-muted-foreground">{slide.instructions}</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - Sentences */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Sentences</h3>
            {slide.matchPairs?.map((pair) => (
              <motion.div
                key={pair.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all ${
                    selectedLeft === pair.id ? 'border-primary bg-primary/10' : ''
                  } ${matches[pair.id] ? 'opacity-50 border-green-500' : ''}`}
                  onClick={() => !matches[pair.id] && handleLeftClick(pair.id)}
                >
                  <CardContent className="p-4 text-center">
                    <h4 className="font-semibold text-lg">{pair.left}</h4>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Right Column - Pictures */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Pictures</h3>
            {slide.matchPairs?.map((pair) => (
              <motion.div
                key={pair.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all ${
                    Object.values(matches).includes(pair.id) ? 'border-green-500 bg-green-50' : ''
                  }`}
                  onClick={() => selectedLeft && handleRightClick(pair.id)}
                >
                  <CardContent className="p-4 text-center">
                    {pair.rightImage ? (
                      <img 
                        src={pair.rightImage} 
                        alt={pair.right}
                        className="w-32 h-32 mx-auto mb-2 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-32 h-32 mx-auto mb-2 bg-secondary/20 rounded-lg flex items-center justify-center">
                        <span className="text-4xl">🤝</span>
                      </div>
                    )}
                    <h4 className="font-semibold">{pair.right}</h4>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {Object.keys(matches).length === slide.matchPairs?.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8"
          >
            <div className="text-lg font-semibold text-green-600">
              🎉 Perfect matching! You understand the characters and phrases!
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}