import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slide } from '@/types/slides';
import { motion } from 'framer-motion';

interface FastMatchSlideProps {
  slide: Slide;
  onComplete?: () => void;
  onNext?: () => void;
}

export function FastMatchSlide({ slide, onComplete, onNext }: FastMatchSlideProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSpun, setHasSpun] = useState(false);

  const spinWheel = () => {
    setIsSpinning(true);
    setHasSpun(true);
    
    // Simulate spinning animation
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * (slide.options?.length || 4));
      const selected = slide.options?.[randomIndex];
      setSelectedOption(selected?.text || 'Hello');
      setIsSpinning(false);
      
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 2000);
    }, 2000);
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">{slide.prompt}</h2>
        <p className="text-lg text-muted-foreground">{slide.instructions}</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardContent className="p-8 text-center">
            <motion.div
              animate={isSpinning ? { rotate: 360 } : {}}
              transition={isSpinning ? { duration: 2, ease: "easeOut" } : {}}
              className="relative"
            >
              <div className="w-64 h-64 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center relative">
                <div className="w-56 h-56 bg-white rounded-full flex items-center justify-center">
                  <div className="text-6xl">🎯</div>
                </div>
                
                {/* Wheel sections */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white font-bold text-sm">
                  {slide.options?.map((option, index) => (
                    <div
                      key={option.id}
                      className={`absolute ${index === 0 ? 'top-4' : index === 1 ? 'right-4' : index === 2 ? 'bottom-4' : 'left-4'}`}
                    >
                      {option.text}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {!hasSpun && (
              <Button 
                onClick={spinWheel}
                size="lg"
                className="bg-primary hover:bg-primary/90"
                disabled={isSpinning}
              >
                {isSpinning ? 'Spinning...' : 'Spin the Wheel!'} 🎡
              </Button>
            )}
          </CardContent>
        </Card>

        {selectedOption && !isSpinning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-yellow-700 mb-4">
                  🎉 You got: "{selectedOption}"
                </div>
                <div className="text-lg mb-4">
                  Now say it out loud with confidence!
                </div>
                <div className="text-4xl animate-bounce">
                  🗣️
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}