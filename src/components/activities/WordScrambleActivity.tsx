import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, RotateCcw, Shuffle, Lightbulb } from 'lucide-react';
import { soundEffectsService } from '@/services/soundEffectsService';
import { ConfettiEffect } from '@/components/gamification/ConfettiEffect';

interface WordScrambleActivityProps {
  word: string;
  hint?: string;
  title?: string;
  instructions?: string;
  onComplete?: () => void;
}

export function WordScrambleActivity({
  word,
  hint,
  title,
  instructions,
  onComplete
}: WordScrambleActivityProps) {
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    scrambleWord();
  }, [word]);

  const scrambleWord = () => {
    const letters = word.split('');
    const scrambled = [...letters].sort(() => Math.random() - 0.5);
    setScrambledLetters(scrambled);
    setSelectedLetters([]);
    setFeedback(null);
    setShowHint(false);
  };

  const handleLetterClick = (letter: string, index: number, fromScrambled: boolean) => {
    soundEffectsService.playButtonClick();
    
    if (fromScrambled) {
      setScrambledLetters(scrambledLetters.filter((_, i) => i !== index));
      setSelectedLetters([...selectedLetters, letter]);
    } else {
      setSelectedLetters(selectedLetters.filter((_, i) => i !== index));
      setScrambledLetters([...scrambledLetters, letter]);
    }
  };

  const handleCheck = () => {
    const userWord = selectedLetters.join('').toLowerCase();
    const correctWord = word.toLowerCase();
    
    if (userWord === correctWord) {
      soundEffectsService.playCorrect();
      setFeedback('correct');
      setShowConfetti(true);
      setTimeout(() => onComplete?.(), 2000);
    } else {
      soundEffectsService.playIncorrect();
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const handleReset = () => {
    soundEffectsService.playButtonClick();
    scrambleWord();
  };

  const handleShuffle = () => {
    soundEffectsService.playButtonClick();
    setScrambledLetters([...scrambledLetters].sort(() => Math.random() - 0.5));
  };

  return (
    <>
      <ConfettiEffect trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="space-y-6">
        {title && (
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"
          >
            {title}
          </motion.h3>
        )}

        {instructions && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground"
          >
            {instructions}
          </motion.p>
        )}

        {/* Answer Area */}
        <div className="min-h-24 p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-700">
          <div className="flex flex-wrap gap-2 justify-center items-center min-h-16">
            <AnimatePresence>
              {selectedLetters.length === 0 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-muted-foreground italic"
                >
                  Tap letters below to spell the word...
                </motion.span>
              )}
              {selectedLetters.map((letter, index) => (
                <motion.button
                  key={`selected-${index}`}
                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleLetterClick(letter, index, false)}
                  className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-amber-500 to-orange-500 text-white text-2xl font-bold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                >
                  {letter}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Scrambled Letters */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground">Available Letters:</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShuffle}
              className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-all"
            >
              <Shuffle className="w-4 h-4" />
            </motion.button>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <AnimatePresence>
              {scrambledLetters.map((letter, index) => (
                <motion.button
                  key={`scrambled-${index}`}
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleLetterClick(letter, index, true)}
                  className="w-12 h-12 md:w-16 md:h-16 bg-card border-2 border-border hover:border-amber-400 text-2xl font-bold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center"
                >
                  {letter}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Hint Section */}
        {hint && (
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundEffectsService.playButtonClick();
                setShowHint(!showHint);
              }}
              className="flex items-center gap-2 mx-auto px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 rounded-lg font-medium transition-all"
            >
              <Lightbulb className="w-4 h-4" />
              {showHint ? 'Hide' : 'Show'} Hint
            </motion.button>
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800"
                >
                  <p className="text-sm text-foreground">{hint}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Feedback */}
        <AnimatePresence mode="wait">
          {feedback === 'correct' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center justify-center gap-2 p-4 bg-green-500/20 border-2 border-green-500 rounded-xl"
            >
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <span className="text-xl font-bold text-green-600">You Got It! 🎉</span>
            </motion.div>
          )}

          {feedback === 'incorrect' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center justify-center gap-2 p-4 bg-red-500/20 border-2 border-red-500 rounded-xl"
            >
              <XCircle className="w-6 h-6 text-red-600" />
              <span className="text-xl font-bold text-red-600">Not quite! Keep trying!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          {!feedback && selectedLetters.length === word.length && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCheck}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Check Word
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-xl font-semibold transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            New Word
          </motion.button>
        </div>
      </div>
    </>
  );
}
