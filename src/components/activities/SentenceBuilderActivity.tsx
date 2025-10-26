import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, RotateCcw, Shuffle, Volume2 } from 'lucide-react';
import { soundEffectsService } from '@/services/soundEffectsService';
import { ConfettiEffect } from '@/components/gamification/ConfettiEffect';
import { useLessonAssets } from '@/hooks/useLessonAssets';

interface SentenceBuilderActivityProps {
  words: string[];
  correctSentence: string;
  title?: string;
  instructions?: string;
  hint?: string;
  onComplete?: () => void;
}

export function SentenceBuilderActivity({
  words,
  correctSentence,
  title,
  instructions,
  hint,
  onComplete
}: SentenceBuilderActivityProps) {
  const [availableWords, setAvailableWords] = useState<string[]>(
    [...words].sort(() => Math.random() - 0.5)
  );
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { generateAudio } = useLessonAssets();

  const handleWordClick = (word: string, fromAvailable: boolean) => {
    soundEffectsService.playButtonClick();
    
    if (fromAvailable) {
      setAvailableWords(availableWords.filter(w => w !== word));
      setSelectedWords([...selectedWords, word]);
    } else {
      setSelectedWords(selectedWords.filter(w => w !== word));
      setAvailableWords([...availableWords, word]);
    }
  };

  const handleCheck = () => {
    const userSentence = selectedWords.join(' ');
    const isCorrect = userSentence.toLowerCase().trim() === correctSentence.toLowerCase().trim();

    if (isCorrect) {
      soundEffectsService.playCorrect();
      setFeedback('correct');
      setShowConfetti(true);
      generateAudio(correctSentence);
      setTimeout(() => onComplete?.(), 2000);
    } else {
      soundEffectsService.playIncorrect();
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const handleReset = () => {
    soundEffectsService.playButtonClick();
    setAvailableWords([...words].sort(() => Math.random() - 0.5));
    setSelectedWords([]);
    setFeedback(null);
    setShowHint(false);
  };

  const handleShuffle = () => {
    soundEffectsService.playButtonClick();
    setAvailableWords([...availableWords].sort(() => Math.random() - 0.5));
  };

  return (
    <>
      <ConfettiEffect trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="space-y-6">
        {title && (
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
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

        {/* Sentence Building Area */}
        <div className="min-h-32 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl border-2 border-dashed border-green-300 dark:border-green-700">
          <div className="flex flex-wrap gap-2 justify-center items-center min-h-20">
            <AnimatePresence>
              {selectedWords.length === 0 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-muted-foreground italic"
                >
                  Tap words below to build your sentence...
                </motion.span>
              )}
              {selectedWords.map((word, index) => (
                <motion.button
                  key={`selected-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleWordClick(word, false)}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  {word}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Available Words */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground">Available Words:</span>
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
              {availableWords.map((word, index) => (
                <motion.button
                  key={`available-${word}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleWordClick(word, true)}
                  className="px-4 py-2 bg-card border-2 border-border hover:border-green-400 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all"
                >
                  {word}
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
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              💡 {showHint ? 'Hide' : 'Show'} Hint
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
              <span className="text-xl font-bold text-green-600">Perfect Sentence! 🎉</span>
              <Volume2 className="w-5 h-5 text-green-600 animate-pulse" />
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
              <span className="text-xl font-bold text-red-600">Not quite! Try again.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          {!feedback && selectedWords.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCheck}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Check Sentence
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-xl font-semibold transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </motion.button>
        </div>
      </div>
    </>
  );
}
