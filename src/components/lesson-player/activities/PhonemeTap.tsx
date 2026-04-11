import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { soundEffectsService } from '@/services/soundEffectsService';
import { Volume2 } from 'lucide-react';

interface Props {
  slide: GeneratedSlide;
  onCorrect: () => void;
  onIncorrect?: () => void;
}

const PHONEME_SETS = [
  { target: '/æ/', options: ['/æ/', '/ɛ/', '/ɪ/', '/ʌ/', '/ɑː/', '/iː/'], label: 'short a' },
  { target: '/iː/', options: ['/ɪ/', '/iː/', '/eɪ/', '/ɛ/', '/æ/', '/ʌ/'], label: 'long e' },
  { target: '/ʃ/', options: ['/s/', '/ʃ/', '/tʃ/', '/θ/', '/z/', '/ʒ/'], label: 'sh' },
];

export default function PhonemeTap({ slide, onCorrect, onIncorrect }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);

  const phonemeTarget = slide.content?.phonemeTarget || '/æ/';
  const set = PHONEME_SETS.find(s => s.target === phonemeTarget) || PHONEME_SETS[0];
  const options = set.options;

  const handleTap = useCallback((phoneme: string) => {
    if (completed) return;
    setSelected(phoneme);

    if (phoneme === set.target) {
      setIsCorrect(true);
      setCompleted(true);
      soundEffectsService.playCorrect();
      setTimeout(() => onCorrect(), 1000);
    } else {
      setIsCorrect(false);
      soundEffectsService.playIncorrect();
      setTimeout(() => {
        setSelected(null);
        setIsCorrect(null);
      }, 800);
    }
  }, [completed, set.target, onCorrect]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center rounded-3xl p-8 bg-gradient-to-b from-background to-muted/30">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">👂 Phoneme Tap</h2>
        <p className="text-muted-foreground">Listen carefully and tap the matching sound</p>
      </motion.div>

      {/* Play Audio Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="h-20 w-20 rounded-full bg-[#1A237E] text-white flex items-center justify-center shadow-lg mb-8"
      >
        <Volume2 className="h-8 w-8" />
      </motion.button>

      <p className="text-sm text-muted-foreground mb-4">Which sound did you hear?</p>

      {/* Phoneme Grid */}
      <div className="grid grid-cols-3 gap-3 max-w-sm">
        {options.map((phoneme, i) => {
          const isThis = selected === phoneme;
          const bgClass = isThis
            ? isCorrect ? 'bg-[#4CAF50] text-white border-[#2E7D32]'
              : 'bg-[#EF5350] text-white border-[#C62828] animate-[wiggle_0.3s_ease-in-out]'
            : 'bg-card border-border hover:border-[#1A237E]/40';

          return (
            <motion.button
              key={phoneme + i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => handleTap(phoneme)}
              disabled={completed}
              className={`h-20 w-24 rounded-xl border-2 font-mono text-xl font-bold transition-colors ${bgClass}`}
            >
              {phoneme}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {completed && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-lg font-bold text-[#2E7D32]"
          >
            🎉 Correct! That's the "{set.label}" sound!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
