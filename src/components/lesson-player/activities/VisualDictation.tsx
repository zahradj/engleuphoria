import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { soundEffectsService } from '@/services/soundEffectsService';

interface VisualDictationProps {
  slide: GeneratedSlide;
  onCorrect: () => void;
  onIncorrect?: () => void;
}

const ANIMAL_EMOJIS = ['🦁', '🐘', '🦋', '🐢'];

export default function VisualDictation({ slide, onCorrect, onIncorrect }: VisualDictationProps) {
  const options = slide.content?.options || slide.interaction?.data?.options || ['Lion', 'Elephant', 'Butterfly', 'Turtle'];
  const correctAnswer = slide.content?.correctAnswer || slide.interaction?.data?.correct_answer || options[0];

  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleTap = useCallback((opt: string) => {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);

    if (opt === correctAnswer) {
      soundEffectsService.playCorrect();
      onCorrect();
    } else {
      soundEffectsService.playIncorrect();
      onIncorrect?.();
    }
  }, [answered, correctAnswer, onCorrect, onIncorrect]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 w-full">
      <h3 className="text-lg font-bold uppercase tracking-widest opacity-60">🎧 Listen & Tap!</h3>

      <motion.div
        className="text-xl font-semibold py-4 px-6 rounded-2xl"
        style={{ background: 'linear-gradient(135deg, #FF9F1C, #FFBF00)', color: '#1a1a2e' }}
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        Which one is "<strong>{correctAnswer}</strong>"?
      </motion.div>

      <div className="grid grid-cols-2 gap-4 w-full mt-2">
        {options.map((opt, i) => {
          const isCorrect = opt === correctAnswer;
          const isSelected = selected === opt;
          const emoji = ANIMAL_EMOJIS[i % ANIMAL_EMOJIS.length];

          return (
            <motion.button
              key={opt}
              onClick={() => handleTap(opt)}
              disabled={answered}
              whileTap={{ scale: 0.92 }}
              animate={
                !answered
                  ? { y: [0, -4, 0], rotate: [0, i % 2 === 0 ? 2 : -2, 0] }
                  : {}
              }
              transition={!answered ? { repeat: Infinity, duration: 2 + i * 0.3 } : {}}
              className="flex flex-col items-center gap-2 py-6 rounded-3xl text-base font-bold transition-all border-4"
              style={{
                borderColor: answered
                  ? isSelected
                    ? isCorrect ? '#58CC02' : '#FF4B4B'
                    : isCorrect ? '#58CC02' : 'transparent'
                  : '#FFBF00',
                background: answered && isSelected
                  ? isCorrect ? '#dcfce7' : '#fee2e2'
                  : '#fffbeb',
                opacity: answered && !isSelected && !isCorrect ? 0.4 : 1,
              }}
            >
              <span className="text-4xl">{emoji}</span>
              <span>{opt}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
