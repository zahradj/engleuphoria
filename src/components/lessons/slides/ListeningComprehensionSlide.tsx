import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slide } from '@/types/slides';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

interface ListeningComprehensionSlideProps {
  slide: Slide;
  onComplete?: () => void;
  onNext?: () => void;
}

export function ListeningComprehensionSlide({ slide, onComplete, onNext }: ListeningComprehensionSlideProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleOptionSelect = (optionId: string, correct: boolean) => {
    setSelectedOption(optionId);
    setIsCorrect(correct);
    
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 1000);
  };

  const playAudio = () => {
    // Audio playback simulation
    console.log('Playing audio:', slide.media?.url);
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">{slide.prompt}</h2>
        <p className="text-lg text-muted-foreground">{slide.instructions}</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <Button 
              onClick={playAudio}
              size="lg"
              className="mb-4 bg-primary hover:bg-primary/90"
            >
              <Volume2 className="h-5 w-5 mr-2" />
              Play Audio
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slide.options?.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all ${
                  selectedOption === option.id ? 'border-primary bg-primary/10' : ''
                }`}
                onClick={() => handleOptionSelect(option.id, option.isCorrect || false)}
              >
                <CardContent className="p-4 text-center">
                  {option.image && (
                    <img 
                      src={option.image} 
                      alt={option.text}
                      className="w-32 h-32 mx-auto mb-2 rounded-lg object-cover"
                    />
                  )}
                  <h3 className="font-semibold">{option.text}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {isCorrect !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-6"
          >
            <div className={`text-lg font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? '🎉 Perfect listening!' : '💡 Listen again and try!'}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}