import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slide } from '@/types/slides';
import { motion } from 'framer-motion';

interface ClozeSlideProps {
  slide: Slide;
  onComplete?: () => void;
  onNext?: () => void;
}

export function ClozeSlide({ slide, onComplete, onNext }: ClozeSlideProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerSelect = (gapId: string, answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [gapId]: answer }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 1000);
  };

  const renderClozeText = () => {
    if (!slide.clozeText || !slide.clozeGaps) return slide.clozeText;
    
    let text = slide.clozeText;
    slide.clozeGaps.forEach((gap) => {
      const placeholder = `{${gap.id}}`;
      const selectedAnswer = selectedAnswers[gap.id];
      const replacement = selectedAnswer || '_____';
      text = text.replace(placeholder, replacement);
    });
    
    return text;
  };

  const allGapsFilled = slide.clozeGaps?.every(gap => selectedAnswers[gap.id]);

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">{slide.prompt}</h2>
        <p className="text-lg text-muted-foreground">{slide.instructions}</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="bg-secondary/20 p-6 rounded-lg mb-6">
              <pre className="text-lg leading-relaxed whitespace-pre-wrap font-sans">
                {renderClozeText()}
              </pre>
            </div>

            {/* Options for each gap */}
            {slide.clozeGaps?.map((gap) => (
              <div key={gap.id} className="mb-4">
                <h4 className="font-semibold mb-2">Choose the correct word for blank {gap.id.split('-')[1]}:</h4>
                <div className="flex flex-wrap gap-2">
                  {gap.options?.map((option) => (
                    <Button
                      key={option}
                      variant={selectedAnswers[gap.id] === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAnswerSelect(gap.id, option)}
                      disabled={isSubmitted}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            ))}

            {allGapsFilled && !isSubmitted && (
              <div className="text-center mt-6">
                <Button 
                  onClick={handleSubmit}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  Check Answers ✓
                </Button>
              </div>
            )}
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
                  🎉 Excellent work!
                </div>
                <div className="text-lg">
                  You completed the dialogue perfectly!
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}