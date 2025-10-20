import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InteractiveSlideProps {
  slide: any;
  slideNumber: number;
  onNext?: () => void;
}

export function InteractiveSlide({ slide, slideNumber, onNext }: InteractiveSlideProps) {
  const { toast } = useToast();
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleCheck = () => {
    setShowResults(true);
    const isCorrect = selectedAnswers.length > 0;
    
    toast({
      title: isCorrect ? "Great job! 🎉" : "Try again!",
      description: isCorrect ? "You got it right!" : "Keep practicing!",
    });
  };

  const handleOptionClick = (index: number) => {
    if (!showResults) {
      setSelectedAnswers([index]);
    }
  };

  return (
    <Card className="border-2 border-green-500/20 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10">
        <div className="flex items-center gap-2 mb-2">
          <Gamepad2 className="h-4 w-4" />
          <div className="text-xs text-muted-foreground">Slide {slideNumber} • Interactive</div>
        </div>
        <CardTitle className="text-2xl">{slide.prompt || slide.question || 'Interactive Activity'}</CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        {slide.instructions && (
          <div className="text-center bg-muted/50 rounded-lg p-4">
            <p className="font-medium">{slide.instructions}</p>
          </div>
        )}

        {slide.options && Array.isArray(slide.options) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {slide.options.map((option: any, index: number) => {
              const isSelected = selectedAnswers.includes(index);
              const isCorrect = slide.correctAnswer === index || option.correct;
              
              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  disabled={showResults}
                  className={`p-6 rounded-lg border-2 transition-all text-left ${
                    isSelected 
                      ? showResults
                        ? isCorrect 
                          ? 'border-green-500 bg-green-500/10' 
                          : 'border-red-500 bg-red-500/10'
                        : 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {showResults && isSelected && (
                      isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                      )
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{option.text || option}</div>
                      {option.image && (
                        <div className="mt-2 text-2xl">{option.image}</div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {slide.content && !slide.options && (
          <div className="text-center py-8">
            <p className="text-lg">{slide.content}</p>
          </div>
        )}

        <div className="flex justify-center gap-3 pt-4">
          {!showResults && selectedAnswers.length > 0 && (
            <Button size="lg" onClick={handleCheck} variant="default">
              Check Answer
            </Button>
          )}
          {(showResults || !slide.options) && onNext && (
            <Button size="lg" onClick={onNext}>
              {showResults ? 'Continue' : 'Next'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
