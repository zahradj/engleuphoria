import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { soundEffectsService } from '@/services/soundEffectsService';

interface WordBankProps {
  slide: GeneratedSlide;
  onCorrect: () => void;
  onIncorrect?: () => void;
}

export default function WordBank({ slide, onCorrect, onIncorrect }: WordBankProps) {
  const sentence = slide.content?.sentence || slide.interaction?.data?.question || 'The ___ is red.';
  const options = slide.content?.options || slide.interaction?.data?.options || [];
  const correctAnswer = slide.content?.correctAnswer || slide.interaction?.data?.correct_answer || '';

  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const parts = sentence.split(/___+|____+|\*\*\*+/);
  const hasBlanks = parts.length > 1;

  const handleSelect = useCallback((word: string) => {
    if (answered) return;
    if (selected === word) {
      setSelected(null);
      return;
    }
    setSelected(word);

    // Auto-check on selection
    setTimeout(() => {
      setAnswered(true);
      if (word.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) {
        soundEffectsService.playCorrect();
        onCorrect();
      } else {
        soundEffectsService.playIncorrect();
        onIncorrect?.();
      }
    }, 400);
  }, [selected, answered, correctAnswer, onCorrect, onIncorrect]);

  return (
    <div className="flex flex-col items-center gap-8 p-8 w-full">
      <h3 className="text-lg font-bold opacity-60 uppercase tracking-widest">Complete the sentence</h3>

      {/* Sentence with blank */}
      <div className="text-2xl font-medium text-center leading-relaxed">
        {hasBlanks ? (
          <>
            {parts[0]}
            <span
              className="inline-block min-w-[100px] mx-1 border-b-2 text-center align-bottom pb-1 transition-all"
              style={{
                borderColor: answered
                  ? selected === correctAnswer ? '#58CC02' : '#FF4B4B'
                  : '#94a3b8',
                color: answered
                  ? selected === correctAnswer ? '#58CC02' : '#FF4B4B'
                  : 'inherit',
              }}
            >
              <AnimatePresence mode="wait">
                {selected && (
                  <motion.span
                    key={selected}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    className="font-bold"
                  >
                    {selected}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            {parts.slice(1).join('')}
          </>
        ) : (
          <span>{sentence}</span>
        )}
      </div>

      {/* Word Pills */}
      <div className="flex flex-wrap gap-3 justify-center">
        {options.map((word) => {
          const isSelected = selected === word;
          return (
            <motion.button
              key={word}
              onClick={() => handleSelect(word)}
              disabled={answered}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 rounded-xl text-base font-semibold transition-all border-2"
              style={{
                background: isSelected ? '#e0f2fe' : '#fff',
                borderColor: isSelected ? '#0ea5e9' : '#e2e8f0',
                opacity: answered && !isSelected ? 0.4 : 1,
                boxShadow: isSelected ? '0 2px 0 #0284c7' : '0 2px 0 #cbd5e1',
                color: isSelected ? '#0369a1' : '#334155',
              }}
            >
              {word}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
