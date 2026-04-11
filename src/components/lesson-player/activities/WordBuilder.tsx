import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { soundEffectsService } from '@/services/soundEffectsService';
import { RotateCcw } from 'lucide-react';

interface Props {
  slide: GeneratedSlide;
  onCorrect: () => void;
  onIncorrect?: () => void;
}

export default function WordBuilder({ slide, onCorrect, onIncorrect }: Props) {
  const targetWord = (slide.content?.title || 'Apple').toUpperCase();
  const imageUrl = slide.content?.imageUrl || slide.imageUrl;

  const shuffled = [...targetWord.split('')].sort(() => Math.random() - 0.5);
  const [availableLetters, setAvailableLetters] = useState(shuffled);
  const [builtLetters, setBuiltLetters] = useState<string[]>([]);
  const [wrongShake, setWrongShake] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleLetterTap = useCallback((letter: string, index: number) => {
    if (completed) return;

    const nextCorrectLetter = targetWord[builtLetters.length];
    if (letter === nextCorrectLetter) {
      const newBuilt = [...builtLetters, letter];
      setBuiltLetters(newBuilt);
      setAvailableLetters(prev => prev.filter((_, i) => i !== index));
      soundEffectsService.playCorrect();

      if (newBuilt.length === targetWord.length) {
        setCompleted(true);
        setTimeout(() => onCorrect(), 1200);
      }
    } else {
      setWrongShake(true);
      soundEffectsService.playIncorrect();
      setTimeout(() => setWrongShake(false), 500);
    }
  }, [builtLetters, targetWord, completed, onCorrect]);

  const handleReset = useCallback(() => {
    setBuiltLetters([]);
    setAvailableLetters([...targetWord.split('')].sort(() => Math.random() - 0.5));
  }, [targetWord]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center rounded-3xl p-8 bg-gradient-to-b from-background to-muted/30">
      <h2 className="text-2xl font-bold text-foreground mb-2">🧱 Word Builder</h2>
      <p className="text-muted-foreground text-sm mb-4">Build the word letter by letter!</p>

      {imageUrl && (
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          src={imageUrl}
          alt={targetWord}
          className="h-28 w-28 object-contain mb-4 rounded-2xl"
        />
      )}

      {/* Built word slots */}
      <motion.div
        animate={wrongShake ? { x: [-4, 4, -4, 4, 0] } : {}}
        transition={{ duration: 0.3 }}
        className="flex gap-1 mb-8"
      >
        {targetWord.split('').map((_, i) => (
          <div
            key={i}
            className={`h-14 w-12 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
              builtLetters[i]
                ? 'border-[#4CAF50] bg-[#4CAF50]/10 text-[#2E7D32]'
                : 'border-dashed border-[#1A237E]/30 bg-muted/20 text-muted-foreground'
            }`}
          >
            {builtLetters[i] || ''}
          </div>
        ))}
      </motion.div>

      {/* Available letters */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {availableLetters.map((letter, i) => (
          <motion.button
            key={`${letter}-${i}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleLetterTap(letter, i)}
            className="h-12 w-12 rounded-xl border-2 border-[#1A237E]/20 bg-card text-xl font-bold text-[#1A237E] hover:bg-[#1A237E]/5 transition-colors"
          >
            {letter}
          </motion.button>
        ))}
      </div>

      {builtLetters.length > 0 && !completed && (
        <button onClick={handleReset} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      )}

      <AnimatePresence>
        {completed && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 text-xl font-bold text-[#2E7D32]"
          >
            🎉 You spelled "{targetWord}"! +10 XP
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
