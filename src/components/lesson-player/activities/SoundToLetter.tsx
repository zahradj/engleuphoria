import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { soundEffectsService } from '@/services/soundEffectsService';

interface Props {
  slide: GeneratedSlide;
  onCorrect: () => void;
  onIncorrect?: () => void;
}

export default function SoundToLetter({ slide, onCorrect, onIncorrect }: Props) {
  const word = slide.content?.title || 'Apple';
  const targetIndex = slide.content?.targetLetterIndex ?? 0;
  const phoneme = slide.content?.phonemeTarget || '/æ/';
  const imageUrl = slide.content?.imageUrl || slide.imageUrl;

  const letters = word.split('');
  const [tapped, setTapped] = useState<number | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleLetterTap = useCallback((index: number) => {
    if (completed) return;
    setTapped(index);

    if (index === targetIndex) {
      setCorrect(true);
      setCompleted(true);
      soundEffectsService.playCorrect();
      setTimeout(() => onCorrect(), 1200);
    } else {
      setCorrect(false);
      soundEffectsService.playIncorrect();
      setTimeout(() => { setTapped(null); setCorrect(null); }, 800);
    }
  }, [completed, targetIndex, onCorrect]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center rounded-3xl p-8 bg-gradient-to-b from-background to-muted/30">
      <h2 className="text-2xl font-bold text-foreground mb-2">🔤 Sound to Letter</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Tap the letter that makes the <span className="font-mono font-bold text-[#1A237E]">{phoneme}</span> sound
      </p>

      {/* Flat 2.0 Image */}
      {imageUrl && (
        <motion.img
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          src={imageUrl}
          alt={word}
          className="h-32 w-32 object-contain mb-6 rounded-2xl"
        />
      )}

      {/* Letter Segments */}
      <div className="flex gap-1 mb-6">
        {letters.map((letter, i) => {
          const isSelected = tapped === i;
          const bgClass = isSelected
            ? correct ? 'bg-[#4CAF50] text-white border-[#2E7D32] scale-110'
              : 'bg-[#EF5350] text-white border-[#C62828]'
            : 'bg-card border-border hover:border-[#1A237E]/40 text-foreground';

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLetterTap(i)}
              disabled={completed}
              className={`h-16 w-14 rounded-xl border-2 text-3xl font-bold transition-all ${bgClass}`}
            >
              {letter}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {completed && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-bold text-[#2E7D32]"
          >
            🎉 "{letters[targetIndex]}" makes the {phoneme} sound in "{word}"!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
