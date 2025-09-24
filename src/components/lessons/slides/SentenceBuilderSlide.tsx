import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slide } from '@/types/slides';
import { motion } from 'framer-motion';

interface SentenceBuilderSlideProps {
  slide: Slide;
  onComplete?: () => void;
  onNext?: () => void;
}

export function SentenceBuilderSlide({ slide, onComplete, onNext }: SentenceBuilderSlideProps) {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      setIsSubmitted(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1000);
    }
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">{slide.prompt}</h2>
        <p className="text-lg text-muted-foreground">{slide.instructions}</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="text-2xl mb-6">
                My name is{' '}
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter your name"
                  className="inline-block w-48 mx-2"
                  disabled={isSubmitted}
                />
              </div>
              
              {!isSubmitted && (
                <Button 
                  onClick={handleSubmit}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                  disabled={!inputValue.trim()}
                >
                  Complete Sentence ✏️
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-green-700 mb-2">
                  🎉 Perfect!
                </div>
                <div className="text-lg">
                  "My name is {inputValue}" - Great introduction!
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}