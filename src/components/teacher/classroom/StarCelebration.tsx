import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, PartyPopper, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StarCelebrationProps {
  isVisible: boolean;
  starCount: number;
  studentName: string;
  isMilestone?: boolean;
  onComplete: () => void;
}

export const StarCelebration: React.FC<StarCelebrationProps> = ({
  isVisible,
  starCount,
  studentName,
  isMilestone = false,
  onComplete
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowContent(true);
      
      // Fire confetti
      const duration = isMilestone ? 4000 : 2000;
      const end = Date.now() + duration;

      const colors = isMilestone 
        ? ['#ffd700', '#ff6b6b', '#4ecdc4', '#ff9ff3', '#54a0ff', '#5f27cd']
        : ['#ffd700', '#ffed4a', '#ffc107'];

      if (isMilestone) {
        // Big celebration for milestone (5 stars)
        const interval = setInterval(() => {
          if (Date.now() > end) {
            clearInterval(interval);
            return;
          }

          // Multiple confetti bursts
          confetti({
            particleCount: 100,
            spread: 160,
            origin: { x: Math.random(), y: Math.random() * 0.5 },
            colors,
            startVelocity: 45,
            gravity: 0.8,
            scalar: 1.2
          });

          // Star shapes
          confetti({
            particleCount: 20,
            spread: 60,
            origin: { x: 0.5, y: 0.5 },
            colors: ['#ffd700'],
            shapes: ['star'],
            scalar: 2
          });
        }, 200);

        // Fireworks effect
        setTimeout(() => {
          confetti({
            particleCount: 150,
            spread: 180,
            origin: { y: 0.6 },
            colors,
            startVelocity: 55
          });
        }, 500);

      } else {
        // Regular star celebration
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors,
          startVelocity: 30
        });
      }

      // Auto-hide after animation
      const timer = setTimeout(() => {
        setShowContent(false);
        setTimeout(onComplete, 300);
      }, isMilestone ? 4500 : 2500);

      return () => clearTimeout(timer);
    }
  }, [isVisible, isMilestone, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          {/* Background overlay for milestone */}
          {isMilestone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-pink-900/80 to-yellow-900/80"
            />
          )}

          {/* Main celebration content */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: [0, 1.2, 1], 
              rotate: [0, 10, -10, 0]
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              duration: 0.6, 
              type: "spring", 
              stiffness: 200 
            }}
            className="relative flex flex-col items-center"
          >
            {/* Star burst background */}
            <div className="absolute inset-0 -m-20">
              {[...Array(isMilestone ? 12 : 6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0.5, 1.5, 0.5],
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    duration: 2, 
                    delay: i * 0.1,
                    repeat: isMilestone ? 2 : 1
                  }}
                  className="absolute"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * (isMilestone ? 30 : 60)}deg) translateY(-80px)`
                  }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
              ))}
            </div>

            {/* Main star icon */}
            <motion.div
              animate={isMilestone ? {
                scale: [1, 1.3, 1],
                rotate: [0, 15, -15, 0]
              } : {
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 0.5, 
                repeat: isMilestone ? 3 : 1,
                repeatType: "reverse"
              }}
              className={`relative ${isMilestone ? 'mb-6' : 'mb-4'}`}
            >
              <Star 
                className={`${isMilestone ? 'w-32 h-32' : 'w-24 h-24'} text-yellow-400 fill-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.8)]`}
              />
              {isMilestone && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="absolute w-40 h-40 border-4 border-dashed border-yellow-400/50 rounded-full" />
                </motion.div>
              )}
            </motion.div>

            {/* Party icons for milestone */}
            {isMilestone && (
              <div className="flex gap-8 mb-4">
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [-15, 15, -15]
                  }}
                  transition={{ duration: 0.5, repeat: 4 }}
                >
                  <PartyPopper className="w-12 h-12 text-pink-400" />
                </motion.div>
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [15, -15, 15]
                  }}
                  transition={{ duration: 0.5, repeat: 4, delay: 0.2 }}
                >
                  <PartyPopper className="w-12 h-12 text-cyan-400 scale-x-[-1]" />
                </motion.div>
              </div>
            )}

            {/* Star count display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              {isMilestone ? (
                <>
                  <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                    🎉 AMAZING! 🎉
                  </h2>
                  <p className="text-2xl font-semibold text-yellow-300 mb-2">
                    {studentName} earned {starCount} stars!
                  </p>
                  <motion.p
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: 2 }}
                    className="text-xl text-white/90"
                  >
                    🌟 Superstar Achievement! 🌟
                  </motion.p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    ⭐ Great Job! ⭐
                  </h2>
                  <p className="text-xl font-semibold text-yellow-300">
                    {studentName} earned a star!
                  </p>
                  <p className="text-lg text-white/80 mt-1">
                    Total: {starCount} {starCount === 1 ? 'star' : 'stars'}
                  </p>
                </>
              )}
            </motion.div>

            {/* Floating stars for milestone */}
            {isMilestone && (
              <div className="absolute inset-0 -m-32 overflow-visible pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      opacity: 0,
                      x: Math.random() * 400 - 200,
                      y: 100 + Math.random() * 100
                    }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      y: -200 - Math.random() * 200,
                      rotate: Math.random() * 360
                    }}
                    transition={{ 
                      duration: 2 + Math.random() * 2,
                      delay: Math.random() * 2,
                      repeat: 1
                    }}
                    className="absolute left-1/2 top-1/2"
                  >
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
