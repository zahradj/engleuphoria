import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slide } from '@/types/slides';
import { motion } from 'framer-motion';

interface MatchSlideProps {
  slide: Slide;
  onComplete?: () => void;
  onNext?: () => void;
}

export function MatchSlide({ slide, onComplete, onNext }: MatchSlideProps) {
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
          {/* Left Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Words</h3>
            {slide.matchPairs?.map((pair) => (
              <motion.div
                key={pair.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all ${
                    selectedLeft === pair.id ? 'border-primary bg-primary/10' : ''
                  } ${matches[pair.id] ? 'opacity-50' : ''}`}
                  onClick={() => !matches[pair.id] && handleLeftClick(pair.id)}
                >
                  <CardContent className="p-4 text-center">
                    {pair.leftImage && (
                      <img 
                        src={pair.leftImage} 
                        alt={pair.left}
                        className="w-24 h-24 mx-auto mb-2 rounded-lg object-cover"
                      />
                    )}
                    <h4 className="font-semibold">{pair.left}</h4>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Actions</h3>
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
                    {pair.rightImage && (
                      <img 
                        src={pair.rightImage} 
                        alt={pair.right}
                        className="w-24 h-24 mx-auto mb-2 rounded-lg object-cover"
                      />
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
              🎉 Excellent matching! You understand greetings perfectly!
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}