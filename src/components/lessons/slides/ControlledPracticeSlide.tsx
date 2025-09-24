import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slide } from '@/types/slides';
import { motion } from 'framer-motion';

interface ControlledPracticeSlideProps {
  slide: Slide;
  onComplete?: () => void;
  onNext?: () => void;
}

export function ControlledPracticeSlide({ slide, onComplete, onNext }: ControlledPracticeSlideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleStepComplete = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    
    if (currentStep < (slide.options?.length || 4) - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1000);
    }
  };

  const totalSteps = slide.options?.length || 4;
  const progress = ((completedSteps.size) / totalSteps) * 100;

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">{slide.prompt}</h2>
        <p className="text-lg text-muted-foreground">{slide.instructions}</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">{completedSteps.size}/{totalSteps}</span>
          </div>
          <div className="w-full bg-secondary/20 rounded-full h-3">
            <motion.div 
              className="bg-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Game Board */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎲</div>
              <h3 className="text-2xl font-bold mb-2">Greeting Journey</h3>
              <p className="text-muted-foreground">Say each phrase to move forward!</p>
            </div>

            {/* Board Path */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {slide.options?.map((option, index) => (
                <motion.div
                  key={option.id}
                  className={`relative ${index === currentStep ? 'z-10' : ''}`}
                  initial={{ scale: 0.9 }}
                  animate={{ 
                    scale: index === currentStep ? 1.1 : 0.9,
                    opacity: completedSteps.has(index) ? 0.6 : 1
                  }}
                >
                  <Card className={`border-2 ${
                    index === currentStep 
                      ? 'border-primary bg-primary/10' 
                      : completedSteps.has(index)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200'
                  }`}>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">
                        {completedSteps.has(index) ? '✅' : index === currentStep ? '🚶' : '⭕'}
                      </div>
                      <div className="text-sm font-semibold">
                        {option.text}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Current Action */}
            {currentStep < totalSteps && (
              <div className="text-center">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="text-lg font-semibold text-yellow-800">
                    Say: "{slide.options?.[currentStep]?.text}"
                  </div>
                </div>
                
                <Button 
                  onClick={handleStepComplete}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  I said it! Move forward 🚀
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {completedSteps.size === totalSteps && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-700 mb-2">
                  🏆 Journey Complete!
                </div>
                <div className="text-lg">
                  You've mastered all the greeting phrases! Amazing work!
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}