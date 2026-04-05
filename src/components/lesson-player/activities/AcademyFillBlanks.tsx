import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { soundEffectsService } from '@/services/soundEffectsService';

interface Props {
  slide: GeneratedSlide;
  onCorrect: () => void;
  onIncorrect?: () => void;
}

export default function AcademyFillBlanks({ slide, onCorrect, onIncorrect }: Props) {
  const sentence = slide.content?.sentence || 'She ___ a student.';
  const correctWord = slide.content?.blankWord || slide.content?.correctAnswer || 'is';

  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [verifying, setVerifying] = useState(false);

  const handleSubmit = () => {
    if (!answer.trim() || result) return;
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      const isCorrect = answer.trim().toLowerCase() === correctWord.toLowerCase();
      setResult(isCorrect ? 'correct' : 'incorrect');
      if (isCorrect) {
        soundEffectsService.playCorrect();
        onCorrect();
      } else {
        soundEffectsService.playIncorrect();
        onIncorrect?.();
      }
    }, 800);
  };

  const parts = sentence.split('___');

  return (
    <div className="flex flex-col items-center gap-8 p-8 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold" style={{ color: '#e2e8f0' }}>✍️ Fill in the Blank</h2>

      <div className="text-xl flex items-center gap-2 flex-wrap justify-center" style={{ color: '#cbd5e1' }}>
        <span>{parts[0]}</span>
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={result !== null}
          className="px-4 py-2 rounded-lg text-center text-lg font-bold w-36 outline-none"
          style={{
            background: '#1e1b4b',
            color: '#e2e8f0',
            border: `2px solid ${result === 'correct' ? '#22c55e' : result === 'incorrect' ? '#ef4444' : '#6366f1'}`,
          }}
          placeholder="..."
          autoFocus
        />
        <span>{parts[1] || ''}</span>
      </div>

      {!result && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={verifying}
          className="px-8 py-3 rounded-xl font-bold text-lg"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff' }}
        >
          {verifying ? 'Verifying...' : 'Check'}
        </motion.button>
      )}

      {result === 'correct' && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-bold" style={{ color: '#22c55e' }}>
          ✨ Correct! +10 XP
        </motion.p>
      )}
      {result === 'incorrect' && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg" style={{ color: '#f87171' }}>
          The answer was: <strong>{correctWord}</strong>
        </motion.p>
      )}
    </div>
  );
}
