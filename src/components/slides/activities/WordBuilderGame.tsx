import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Type, ArrowRight, RotateCcw } from 'lucide-react';
import { soundEffectsService } from '@/services/soundEffectsService';
import { useToast } from '@/hooks/use-toast';

interface WordBuilderGameProps {
  slide: any;
  slideNumber: number;
  onNext?: () => void;
}

export function WordBuilderGame({ slide, slideNumber, onNext }: WordBuilderGameProps) {
  const { toast } = useToast();
  const targetWord = slide.activityData?.targetWord || 'ENGLISH';
  const hint = slide.activityData?.hint || 'Build the word!';
  const letters = targetWord.split('').sort(() => Math.random() - 0.5);
  
  const [availableLetters, setAvailableLetters] = useState(letters);
  const [builtWord, setBuiltWord] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleLetterClick = (letter: string, index: number) => {
    soundEffectsService.playButtonClick();
    setBuiltWord([...builtWord, letter]);
    setAvailableLetters(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveLastLetter = () => {
    if (builtWord.length === 0) return;
    
    soundEffectsService.playButtonClick();
    const lastLetter = builtWord[builtWord.length - 1];
    setBuiltWord(prev => prev.slice(0, -1));
    setAvailableLetters([...availableLetters, lastLetter]);
  };

  const handleCheck = () => {
    const userWord = builtWord.join('');
    const correct = userWord.toUpperCase() === targetWord.toUpperCase();
    
    setIsCorrect(correct);
    setShowResults(true);

    if (correct) {
      soundEffectsService.playCorrect();
      toast({
        title: "Perfect! 🎉",
        description: "You built the word correctly!",
      });
    } else {
      soundEffectsService.playIncorrect();
      toast({
        title: "Not quite! 🤔",
        description: `The word is "${targetWord}". Try again!`,
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setBuiltWord([]);
    setAvailableLetters(targetWord.split('').sort(() => Math.random() - 0.5));
    setShowResults(false);
    soundEffectsService.playButtonClick();
  };

  return (
    <Card className="border-2 border-orange-500/20 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-orange-500/10 to-amber-500/10">
        <div className="flex items-center gap-2 mb-2">
          <Type className="h-5 w-5 text-orange-500" />
          <div className="text-xs text-muted-foreground font-medium">
            Slide {slideNumber} • 🔤 Word Builder
          </div>
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
          {slide.prompt || 'Build the Word'}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8 space-y-6">
        {slide.instructions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border-2 border-orange-200"
          >
            <p className="font-medium text-orange-900">🎯 {slide.instructions}</p>
          </motion.div>
        )}

        {/* Hint */}
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
          <p className="text-sm font-semibold text-blue-900">💡 Hint: {hint}</p>
          <p className="text-xs text-blue-700 mt-1">{targetWord.length} letters</p>
        </div>

        {/* Built Word Area */}
        <div className="min-h-[120px] bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border-3 border-dashed border-orange-300">
          <div className="flex justify-center items-center gap-2 flex-wrap min-h-[80px]">
            {builtWord.length === 0 ? (
              <p className="text-gray-400 text-lg">Tap letters below to build your word...</p>
            ) : (
              <AnimatePresence>
                {builtWord.map((letter, index) => (
                  <motion.div
                    key={`built-${index}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ type: 'spring', bounce: 0.6 }}
                  >
                    <div className={`w-16 h-16 flex items-center justify-center text-2xl font-bold rounded-xl shadow-lg ${
                      showResults
                        ? isCorrect
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-white text-orange-900 border-2 border-orange-400'
                    }`}>
                      {letter}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {builtWord.length > 0 && !showResults && (
            <div className="flex justify-center mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={handleRemoveLastLetter}
                className="gap-2 border-orange-300"
              >
                <RotateCcw className="h-4 w-4" />
                Remove Last Letter
              </Button>
            </div>
          )}
        </div>

        {/* Available Letters */}
        <div>
          <h3 className="font-semibold text-sm mb-3 text-center text-gray-700">Available Letters:</h3>
          <div className="flex justify-center flex-wrap gap-2">
            <AnimatePresence>
              {availableLetters.map((letter, index) => (
                <motion.button
                  key={`available-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  whileHover={{ scale: 1.1, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLetterClick(letter, index)}
                  disabled={showResults}
                  className="w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-500 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {letter}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Results */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-xl border-2 flex items-center justify-center gap-3 ${
              isCorrect
                ? 'bg-green-50 border-green-500'
                : 'bg-red-50 border-red-500'
            }`}
          >
            {isCorrect ? (
              <>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-bold text-green-900 text-lg">Correct! 🎉</p>
                  <p className="text-sm text-green-700">You built the word perfectly!</p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="font-bold text-red-900 text-lg">Not quite!</p>
                  <p className="text-sm text-red-700">The correct word is: <span className="font-bold">{targetWord}</span></p>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-3 pt-4">
          {!showResults && builtWord.length > 0 && (
            <Button 
              size="lg" 
              onClick={handleCheck}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg px-8"
            >
              Check Word ✨
            </Button>
          )}
          {showResults && (
            <>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleReset}
                className="border-2"
              >
                Try Again
              </Button>
              {onNext && (
                <Button 
                  size="lg" 
                  onClick={onNext}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg px-8"
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
