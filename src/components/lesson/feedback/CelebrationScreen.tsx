import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface CelebrationScreenProps {
  title: string;
  message?: string;
  duration?: number;
  onComplete?: () => void;
}

export function CelebrationScreen({
  title,
  message,
  duration = 3000,
  onComplete
}: CelebrationScreenProps) {
  useEffect(() => {
    // Massive confetti burst
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#9370DB', '#32CD32'];

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Auto-dismiss
    if (onComplete) {
      const timer = setTimeout(onComplete, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 z-50 flex items-center justify-center"
    >
      <div className="text-center px-8">
        {/* Animated Stars */}
        <div className="relative mb-8">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{
                scale: [0, 1.5, 1],
                rotate: 0,
                opacity: 1
              }}
              transition={{
                delay: i * 0.1,
                duration: 0.6,
                type: 'spring',
                bounce: 0.6
              }}
              className="inline-block text-6xl mx-2"
            >
              ⭐
            </motion.div>
          ))}
        </div>

        {/* Title */}
        <motion.h1
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.5, type: 'spring', bounce: 0.5 }}
          className="text-7xl font-bold text-white mb-6 drop-shadow-2xl"
        >
          {title}
        </motion.h1>

        {/* Message */}
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-3xl text-white/90 drop-shadow-lg"
          >
            {message}
          </motion.p>
        )}

        {/* Celebration Emojis */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: 'spring', bounce: 0.7 }}
          className="mt-8 text-8xl"
        >
          🎉🎊🏆
        </motion.div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 100,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{
                y: -100,
                rotate: Math.random() * 360
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              className="absolute text-4xl"
            >
              {['✨', '🌟', '💫', '⭐', '🎊'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
