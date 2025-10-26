import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEffectsService } from '@/services/soundEffectsService';
import { ConfettiEffect } from '@/components/gamification/ConfettiEffect';

interface InteractiveSlideProps {
  slide: any;
  slideNumber: number;
  onNext?: () => void;
}

export function InteractiveSlide({ slide, slideNumber, onNext }: InteractiveSlideProps) {
  const { toast } = useToast();
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleCheck = () => {
    setShowResults(true);
    
    // Find correct answer
    const correctIndex = slide.options?.findIndex((opt: any, idx: number) => 
      slide.correctAnswer === idx || opt.correct
    );
    
    const isCorrect = selectedAnswers.includes(correctIndex);
    
    if (isCorrect) {
      soundEffectsService.playCorrect();
      setShowConfetti(true);
      toast({
        title: "Perfect! 🎉",
        description: "You got it right!",
      });
    } else {
      soundEffectsService.playIncorrect();
      toast({
        title: "Not quite! 🤔",
        description: "Give it another try!",
        variant: "destructive",
      });
    }
  };

  const handleOptionClick = (index: number) => {
    if (!showResults) {
      soundEffectsService.playButtonClick();
      setSelectedAnswers([index]);
    }
  };

  return (
    <>
      <ConfettiEffect trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <Card className="border-2 border-purple-500/20 shadow-xl backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Gamepad2 className="h-5 w-5 text-purple-500" />
            <div className="text-xs text-muted-foreground font-medium">Slide {slideNumber} • 🎮 Interactive Game</div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {slide.prompt || slide.question || 'Interactive Activity'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          {slide.instructions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200"
            >
              <p className="font-medium text-purple-900">🎯 {slide.instructions}</p>
            </motion.div>
          )}

          {slide.options && Array.isArray(slide.options) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {slide.options.map((option: any, index: number) => {
                  const isSelected = selectedAnswers.includes(index);
                  const isCorrect = slide.correctAnswer === index || option.correct;
                  
                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={!showResults ? { scale: 1.03, y: -2 } : {}}
                      whileTap={!showResults ? { scale: 0.98 } : {}}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleOptionClick(index)}
                      disabled={showResults}
                      className={`p-6 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
                        isSelected 
                          ? showResults
                            ? isCorrect 
                              ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg shadow-green-500/20' 
                              : 'border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-lg shadow-red-500/20'
                            : 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                      }`}
                    >
                      {/* Sparkle effect for selected */}
                      {isSelected && !showResults && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          className="absolute top-2 right-2"
                        >
                          <Sparkles className="h-5 w-5 text-purple-500" />
                        </motion.div>
                      )}
                      
                      <div className="flex items-start gap-3 relative z-10">
                        {showResults && isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', bounce: 0.6 }}
                          >
                            {isCorrect ? (
                              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                            ) : (
                              <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                            )}
                          </motion.div>
                        )}
                        <div className="flex-1">
                          <div className="font-semibold text-lg">{option.text || option}</div>
                          {option.image && (
                            <div className="mt-2 text-3xl">{option.image}</div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {slide.content && !slide.options && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <p className="text-lg">{slide.content}</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-3 pt-4"
          >
            {!showResults && selectedAnswers.length > 0 && (
              <Button 
                size="lg" 
                onClick={handleCheck}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg text-lg px-8"
              >
                Check Answer ✨
              </Button>
            )}
            {(showResults || !slide.options) && onNext && (
              <Button 
                size="lg" 
                onClick={() => {
                  soundEffectsService.playButtonClick();
                  onNext();
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg text-lg px-8"
              >
                {showResults ? 'Continue ➡️' : 'Next'}
              </Button>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </>
  );
}
