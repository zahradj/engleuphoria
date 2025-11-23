import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Lightbulb } from 'lucide-react';

interface IncorrectAnswerFeedbackProps {
  message?: string;
  hint?: string;
  showEncouragement?: boolean;
}

const encouragingMessages = [
  "Not quite! Let's try again! 🌟",
  "Almost there! Keep going! 💪",
  "Good try! You're learning! 🎯",
  "Don't worry, mistakes help us learn! 😊",
  "Close! One more time! ✨",
  "Nice effort! Try again! 🚀"
];

export function IncorrectAnswerFeedback({
  message,
  hint,
  showEncouragement = true
}: IncorrectAnswerFeedbackProps) {
  const displayMessage = message || encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, x: -5 }}
      animate={{
        scale: 1,
        opacity: 1,
        x: [0, -5, 5, -5, 5, 0]
      }}
      transition={{
        scale: { duration: 0.3 },
        x: { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }
      }}
      className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300 rounded-xl p-6"
    >
      <div className="flex items-start gap-4">
        {/* Alert Icon */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
        </motion.div>

        {/* Message */}
        <div className="flex-1">
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-bold text-orange-700 mb-1"
          >
            {displayMessage}
          </motion.p>

          {showEncouragement && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-orange-600"
            >
              Every mistake is a step closer to success! 🌱
            </motion.p>
          )}

          {/* Hint */}
          {hint && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-3 p-3 bg-yellow-100 rounded-lg border border-yellow-300"
            >
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-yellow-700 mb-1">💡 Hint:</p>
                  <p className="text-sm text-yellow-700">{hint}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Encouraging Emoji */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', bounce: 0.6 }}
          className="text-4xl"
        >
          💪
        </motion.div>
      </div>
    </motion.div>
  );
}
