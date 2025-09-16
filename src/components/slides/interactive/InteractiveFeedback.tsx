import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Star, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InteractiveFeedbackProps {
  isVisible: boolean;
  isCorrect: boolean;
  message?: string;
  score?: number;
  showConfetti?: boolean;
  onComplete?: () => void;
}

export function InteractiveFeedback({
  isVisible,
  isCorrect,
  message,
  score,
  showConfetti = true,
  onComplete
}: InteractiveFeedbackProps) {
  useEffect(() => {
    if (isVisible && onComplete) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  const confettiElements = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: ['text-yellow-400', 'text-blue-400', 'text-green-400', 'text-pink-400', 'text-purple-400'][i % 5]
  }));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
        >
          {/* Confetti Animation */}
          {isCorrect && showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {confettiElements.map((element) => (
                <motion.div
                  key={element.id}
                  initial={{ 
                    y: -20, 
                    x: `${element.x}vw`,
                    opacity: 0,
                    rotate: 0
                  }}
                  animate={{ 
                    y: '100vh', 
                    opacity: [0, 1, 0],
                    rotate: 360
                  }}
                  transition={{ 
                    duration: 2,
                    delay: element.delay,
                    ease: "easeOut"
                  }}
                  className={cn("absolute", element.color)}
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Feedback Card */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={cn(
              "relative p-8 rounded-2xl shadow-2xl border-2 text-center max-w-md mx-4",
              isCorrect 
                ? "bg-success-soft border-success text-success-foreground" 
                : "bg-error-soft border-error text-error-foreground"
            )}
          >
            {/* Glow Effect */}
            <div className={cn(
              "absolute inset-0 -z-10 rounded-2xl blur-2xl opacity-30",
              isCorrect ? "bg-success" : "bg-error"
            )} />

            {/* Icon with Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.2,
                type: "spring",
                bounce: 0.6
              }}
              className="flex justify-center mb-4"
            >
              {isCorrect ? (
                <div className="relative">
                  <CheckCircle className="h-16 w-16 text-success" />
                  {/* Pulse effect */}
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-success"
                  />
                </div>
              ) : (
                <XCircle className="h-16 w-16 text-error" />
              )}
            </motion.div>

            {/* Title */}
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold mb-2"
            >
              {isCorrect ? "Excellent!" : "Try Again!"}
            </motion.h3>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg opacity-90 mb-4"
            >
              {message || (isCorrect 
                ? "Great job! You got it right." 
                : "Don't worry, keep practicing!")}
            </motion.p>

            {/* Score Display */}
            {score !== undefined && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-2 text-lg font-semibold"
              >
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span>{score} points</span>
              </motion.div>
            )}

            {/* Auto-dismiss indicator */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 2, ease: "linear" }}
              className={cn(
                "absolute bottom-0 left-0 h-1 rounded-b-2xl",
                isCorrect ? "bg-success" : "bg-error"
              )}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}