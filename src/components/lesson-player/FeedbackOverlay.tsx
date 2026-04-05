import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HubType } from '@/components/admin/lesson-builder/ai-wizard/types';

interface FeedbackOverlayProps {
  visible: boolean;
  correct: boolean;
  solution?: string;
  hub: HubType;
  onContinue: () => void;
}

const MESSAGES_CORRECT = [
  "You're brilliant!",
  'Amazing work!',
  'Nailed it!',
  'Perfect!',
  'Superstar!',
];

const MESSAGES_WRONG = [
  'Almost there!',
  'Not quite — keep going!',
  "Don't give up!",
];

export default function FeedbackOverlay({ visible, correct, solution, hub, onContinue }: FeedbackOverlayProps) {
  const message = correct
    ? MESSAGES_CORRECT[Math.floor(Math.random() * MESSAGES_CORRECT.length)]
    : MESSAGES_WRONG[Math.floor(Math.random() * MESSAGES_WRONG.length)];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 140 }}
          animate={{ y: 0 }}
          exit={{ y: 140 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <div
            className="w-full px-4 py-5"
            style={{
              background: correct ? '#58CC02' : '#FF4B4B',
            }}
          >
            <div className="max-w-[600px] mx-auto flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{correct ? '🎉' : '😬'}</span>
                <span className="text-white font-bold text-lg">{message}</span>
              </div>

              {!correct && solution && (
                <p className="text-white/90 text-sm">
                  Correct answer: <strong>{solution}</strong>
                </p>
              )}

              <button
                onClick={onContinue}
                className="mt-2 w-full py-3 rounded-2xl font-bold text-base uppercase tracking-wide transition-all"
                style={{
                  background: 'rgba(255,255,255,0.25)',
                  color: '#fff',
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
