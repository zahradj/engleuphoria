import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { soundEffectsService } from '@/services/soundEffectsService';

interface Props {
  slide: GeneratedSlide;
  onCorrect: () => void;
  onIncorrect?: () => void;
}

interface WordCard {
  word: string;
  emoji: string;
  isOdd: boolean;
}

export default function OddOneOut({ slide, onCorrect, onIncorrect }: Props) {
  const phoneme = slide.content?.phonemeTarget || '/æ/';

  const cards: WordCard[] = slide.content?.oddOneOutCards || [
    { word: 'Apple', emoji: '🍎', isOdd: false },
    { word: 'Ant', emoji: '🐜', isOdd: false },
    { word: 'Axe', emoji: '🪓', isOdd: false },
    { word: 'Igloo', emoji: '🏠', isOdd: true },
  ];

  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleSelect = useCallback((word: string) => {
    if (completed) return;
    setSelected(word);

    const card = cards.find(c => c.word === word);
    if (card?.isOdd) {
      setIsCorrect(true);
      setCompleted(true);
      soundEffectsService.playCorrect();
      setTimeout(() => onCorrect(), 1000);
    } else {
      setIsCorrect(false);
      soundEffectsService.playIncorrect();
      setTimeout(() => { setSelected(null); setIsCorrect(null); }, 700);
    }
  }, [completed, cards, onCorrect]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center rounded-3xl p-8 bg-gradient-to-b from-background to-muted/30">
      <h2 className="text-2xl font-bold text-foreground mb-2">🔍 Odd One Out</h2>
      <p className="text-muted-foreground text-sm mb-2">
        Which word does NOT have the <span className="font-mono font-bold text-[#6B21A8]">{phoneme}</span> sound?
      </p>
      <p className="text-xs text-muted-foreground mb-8">Tap the word that doesn't belong</p>

      <div className="grid grid-cols-2 gap-4 max-w-sm">
        {cards.map((card, i) => {
          const isThis = selected === card.word;
          const bgClass = isThis
            ? isCorrect ? 'border-[#4CAF50] bg-[#4CAF50]/10 ring-2 ring-[#4CAF50]/30'
              : 'border-[#EF5350] bg-[#EF5350]/10 ring-2 ring-[#EF5350]/30'
            : 'border-border bg-card hover:border-[#6B21A8]/30';

          return (
            <motion.button
              key={card.word}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(card.word)}
              disabled={completed}
              className={`flex flex-col items-center gap-2 p-6 rounded-2xl border-2 transition-all ${bgClass}`}
            >
              <span className="text-4xl">{card.emoji}</span>
              <span className="text-lg font-bold text-foreground">{card.word}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {completed && (
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-lg font-bold text-[#2E7D32]">
            🎉 Correct! "{cards.find(c => c.isOdd)?.word}" doesn't have the {phoneme} sound!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
