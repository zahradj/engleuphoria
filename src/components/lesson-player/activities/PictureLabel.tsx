import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { soundEffectsService } from '@/services/soundEffectsService';

interface Props {
  slide: GeneratedSlide;
  onCorrect: () => void;
  onIncorrect?: () => void;
}

export default function PictureLabel({ slide, onCorrect, onIncorrect }: Props) {
  const correctWord = slide.content?.title || 'Apple';
  const imageUrl = slide.content?.imageUrl || slide.imageUrl;
  const distractors = slide.content?.distractors || ['Banana', 'Orange', 'Grape'];
  const options = [...distractors.slice(0, 3), correctWord].sort(() => Math.random() - 0.5);

  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleSelect = useCallback((word: string) => {
    if (completed) return;
    setSelected(word);

    if (word === correctWord) {
      setIsCorrect(true);
      setCompleted(true);
      soundEffectsService.playCorrect();
      setTimeout(() => onCorrect(), 1000);
    } else {
      setIsCorrect(false);
      soundEffectsService.playIncorrect();
      setTimeout(() => { setSelected(null); setIsCorrect(null); }, 600);
    }
  }, [completed, correctWord, onCorrect]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center rounded-3xl p-8 bg-gradient-to-b from-background to-muted/30">
      <h2 className="text-2xl font-bold text-foreground mb-2">🏷 Picture Label</h2>
      <p className="text-muted-foreground text-sm mb-6">What do you see? Choose the correct word!</p>

      {/* Image */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="h-44 w-44 rounded-2xl border-4 border-[#6B21A8]/10 bg-white flex items-center justify-center mb-8 overflow-hidden shadow-sm"
      >
        {imageUrl ? (
          <img src={imageUrl} alt="mystery" className="h-full w-full object-contain p-2" />
        ) : (
          <span className="text-6xl">🍎</span>
        )}
      </motion.div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 max-w-sm w-full">
        {options.map((word, i) => {
          const isThis = selected === word;
          const bgClass = isThis
            ? isCorrect ? 'bg-[#4CAF50] text-white border-[#2E7D32]'
              : 'bg-[#EF5350] text-white border-[#C62828]'
            : 'bg-card border-border hover:border-[#6B21A8]/30 text-foreground';

          return (
            <motion.button
              key={word}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(word)}
              disabled={completed}
              className={`py-3 px-4 rounded-xl border-2 text-lg font-bold transition-all ${bgClass}`}
            >
              {word}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {completed && (
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-lg font-bold text-[#2E7D32]">
            🎉 Correct! It's "{correctWord}"! +10 XP
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
