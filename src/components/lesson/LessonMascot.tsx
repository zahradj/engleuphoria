import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LessonMascotProps {
  emotion?: 'happy' | 'celebrate' | 'encourage' | 'thinking' | 'wave';
  message?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  showMessage?: boolean;
}

const emotionEmojis = {
  happy: '😊',
  celebrate: '🎉',
  encourage: '💪',
  thinking: '🤔',
  wave: '👋'
};

const emotionAnimations = {
  happy: {
    animate: { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] },
    transition: { duration: 0.5, repeat: Infinity, repeatDelay: 3 }
  },
  celebrate: {
    animate: { scale: [1, 1.2, 1], y: [0, -10, 0] },
    transition: { duration: 0.6, repeat: Infinity, repeatDelay: 2 }
  },
  encourage: {
    animate: { rotate: [0, 10, -10, 10, 0] },
    transition: { duration: 0.8, repeat: Infinity, repeatDelay: 4 }
  },
  thinking: {
    animate: { rotate: [0, -5, 5, 0] },
    transition: { duration: 1, repeat: Infinity, repeatDelay: 5 }
  },
  wave: {
    animate: { rotate: [0, 15, -15, 15, 0] },
    transition: { duration: 0.5, repeat: 2 }
  }
};

const positionClasses = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6'
};

export function LessonMascot({
  emotion = 'happy',
  message,
  position = 'bottom-right',
  showMessage = false
}: LessonMascotProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [displayMessage, setDisplayMessage] = useState(showMessage);

  useEffect(() => {
    if (message && showMessage) {
      setDisplayMessage(true);
      const timer = setTimeout(() => {
        setDisplayMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, showMessage]);

  const animation = emotionAnimations[emotion];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className={`fixed ${positionClasses[position]} z-50`}
        >
          <div className="relative">
            {/* Speech Bubble */}
            <AnimatePresence>
              {displayMessage && message && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute bottom-full mb-4 right-0 max-w-xs"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-primary relative">
                    <p className="text-sm font-medium">{message}</p>
                    {/* Pointer */}
                    <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r-2 border-b-2 border-primary transform rotate-45" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mascot */}
            <motion.div
              {...animation}
              className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-5xl shadow-lg cursor-pointer hover:scale-110 transition-transform"
              onClick={() => setDisplayMessage(!displayMessage)}
            >
              {emotionEmojis[emotion]}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
