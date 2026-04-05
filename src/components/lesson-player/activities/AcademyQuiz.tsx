import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { soundEffectsService } from '@/services/soundEffectsService';

interface Props {
  slide: GeneratedSlide;
  onCorrect: () => void;
  onIncorrect?: () => void;
}

export default function AcademyQuiz({ slide, onCorrect, onIncorrect }: Props) {
  const question = slide.content?.quizQuestion || slide.content?.prompt || slide.title;
  const options = slide.content?.quizOptions || slide.content?.options?.map((o, i) => ({
    text: o,
    isCorrect: o === slide.content?.correctAnswer || i === 0,
  })) || [];

  const [selected, setSelected] = useState<number | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setVerifying(true);

    setTimeout(() => {
      setVerifying(false);
      const isCorrect = options[idx]?.isCorrect;
      setResult(isCorrect ? 'correct' : 'incorrect');
      if (isCorrect) {
        soundEffectsService.playCorrect();
        onCorrect();
      } else {
        soundEffectsService.playIncorrect();
        onIncorrect?.();
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center" style={{ color: '#e2e8f0' }}>
        ⚡ {question}
      </h2>

      <div className="w-full flex flex-col gap-3">
        {options.map((opt: any, idx: number) => {
          const optText = typeof opt === 'string' ? opt : opt.text;
          const isCorrect = typeof opt === 'string' ? opt === slide.content?.correctAnswer : opt.isCorrect;
          let borderColor = '#6366f1';
          if (result && idx === selected) {
            borderColor = result === 'correct' ? '#22c55e' : '#ef4444';
          }

          return (
            <motion.button
              key={idx}
              whileHover={selected === null ? { scale: 1.02, boxShadow: '0 0 20px rgba(99,102,241,0.5)' } : {}}
              whileTap={selected === null ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(idx)}
              disabled={selected !== null}
              className="py-4 px-6 rounded-xl text-left text-lg font-medium transition-all relative overflow-hidden"
              style={{
                background: idx === selected ? (result === 'correct' ? '#064e3b' : result === 'incorrect' ? '#450a0a' : '#1e1b4b') : '#1e1b4b',
                color: '#e2e8f0',
                border: `2px solid ${idx === selected ? borderColor : '#4338ca'}`,
              }}
            >
              <span className="relative z-10">{optText}</span>
              {idx === selected && verifying && (
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, ease: 'linear' }}
                  className="absolute bottom-0 left-0 h-1"
                  style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)' }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {result === 'correct' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-3xl font-bold"
            style={{ color: '#22c55e' }}
          >
            ✨ Correct! +10 XP
          </motion.div>
        )}
        {result === 'incorrect' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xl"
            style={{ color: '#f87171' }}
          >
            ❌ Not quite. The answer was: {options.find((o: any) => (typeof o === 'string' ? false : o.isCorrect))?.text || slide.content?.correctAnswer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
