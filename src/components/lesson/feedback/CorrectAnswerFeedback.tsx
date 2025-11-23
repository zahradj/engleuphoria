import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CorrectAnswerFeedbackProps {
  message?: string;
  xpEarned?: number;
  showConfetti?: boolean;
}

const encouragingMessages = [
  'Excellent! 🌟',
  'Perfect! 🎉',
  'Amazing work! 💫',
  'You got it! ✨',
  'Fantastic! 🎊',
  'Brilliant! ⭐',
  'Great job! 👏',
  'Superb! 🏆'
];

export function CorrectAnswerFeedback({
  message,
  xpEarned = 10,
  showConfetti = true
}: CorrectAnswerFeedbackProps) {
  useEffect(() => {
    if (showConfetti) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0']
      });
    }
  }, [showConfetti]);

  const displayMessage = message || encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', bounce: 0.6 }}
      className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6"
    >
      <div className="flex items-center justify-center gap-4">
        {/* Success Icon */}
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
        >
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
        </motion.div>

        {/* Message */}
        <div className="flex-1">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-green-700"
          >
            {displayMessage}
          </motion.p>
          
          {/* XP Reward */}
          {xpEarned > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 mt-2"
            >
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-green-600 font-medium">+{xpEarned} XP</span>
            </motion.div>
          )}
        </div>

        {/* Celebration Emoji */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: 'spring', bounce: 0.7 }}
          className="text-5xl"
        >
          🎉
        </motion.div>
      </div>
    </motion.div>
  );
}
