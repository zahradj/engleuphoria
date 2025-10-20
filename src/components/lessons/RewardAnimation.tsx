import { motion } from 'framer-motion';
import { Star, Sparkles, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RewardAnimationProps {
  stars?: number;
  message?: string;
  confetti?: boolean;
  onComplete?: () => void;
}

export function RewardAnimation({ 
  stars = 1, 
  message = 'Great job!', 
  confetti = false,
  onComplete 
}: RewardAnimationProps) {
  const [showConfetti, setShowConfetti] = useState(confetti);

  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      {/* Confetti particles */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: -20,
                rotate: 0,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                y: window.innerHeight + 20,
                rotate: Math.random() * 720,
              }}
              transition={{ 
                duration: Math.random() * 2 + 2,
                ease: 'linear',
                delay: Math.random() * 0.5
              }}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: ['#fbbf24', '#f97316', '#a855f7', '#3b82f6'][i % 4]
              }}
            />
          ))}
        </div>
      )}

      {/* Main reward card */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="bg-card rounded-3xl p-12 text-center shadow-2xl max-w-md relative"
      >
        {/* Sparkles decoration */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity }
          }}
          className="absolute -top-6 -right-6 text-yellow-400"
        >
          <Sparkles className="h-12 w-12" />
        </motion.div>

        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, delay: 1 }
          }}
          className="absolute -bottom-6 -left-6 text-purple-400"
        >
          <Sparkles className="h-12 w-12" />
        </motion.div>

        {/* Trophy or stars */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          {stars >= 5 ? (
            <Trophy className="h-24 w-24 mx-auto fill-yellow-400 text-yellow-500" />
          ) : (
            <div className="flex justify-center gap-2">
              {Array.from({ length: stars }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                >
                  <Star className="h-12 w-12 fill-yellow-400 text-yellow-500" />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Message */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
        >
          {message}
        </motion.h2>

        {stars > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-muted-foreground"
          >
            You earned {stars} {stars === 1 ? 'star' : 'stars'}!
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}
