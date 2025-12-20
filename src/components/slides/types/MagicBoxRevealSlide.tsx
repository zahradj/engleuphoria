import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BENNY_THE_BEAR } from '@/constants/mascots';
import { playSound } from '@/constants/soundEffects';

interface MagicBoxRevealSlideProps {
  slide: {
    title?: string;
    instructions?: string;
    knocksRequired?: number;
    content?: {
      title?: string;
      instructions?: string;
      knocksRequired?: number;
    };
  };
  slideNumber: number;
  onNext?: () => void;
}

export function MagicBoxRevealSlide({ slide, slideNumber, onNext }: MagicBoxRevealSlideProps) {
  const [knockCount, setKnockCount] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const title = slide.content?.title || slide.title || 'Magic Box!';
  const instructions = slide.content?.instructions || slide.instructions || 'Knock on the box 3 times!';
  const knocksRequired = slide.content?.knocksRequired || slide.knocksRequired || 3;
  
  const handleKnock = useCallback(() => {
    if (isRevealed) return;
    
    const newCount = knockCount + 1;
    setKnockCount(newCount);
    playSound('knock');
    
    if (newCount >= knocksRequired) {
      setTimeout(() => {
        setIsRevealed(true);
        setShowConfetti(true);
        playSound('pop');
        playSound('cheer');
        
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
      }, 300);
    }
  }, [knockCount, knocksRequired, isRevealed]);
  
  const handleContinue = () => {
    playSound('whoosh');
    onNext?.();
  };
  
  return (
    <Card className="w-full h-full min-h-[500px] overflow-hidden relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-yellow-950/20">
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-50"
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                  rotate: 0
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: [0, 1, 1, 0],
                  rotate: Math.random() * 720
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 0.3,
                  ease: 'easeOut'
                }}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 6)]
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <CardContent className="p-8 flex flex-col items-center justify-center h-full relative z-10">
        {/* Title */}
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl md:text-4xl font-bold text-center mb-4 text-amber-800 dark:text-amber-200"
        >
          {title}
        </motion.h2>
        
        {/* Instructions */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-center mb-8 text-amber-700 dark:text-amber-300"
        >
          {isRevealed ? '🎉 You did it!' : instructions}
        </motion.p>
        
        {/* Knock Counter */}
        {!isRevealed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex gap-2 mb-6"
          >
            {[...Array(knocksRequired)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: i < knockCount ? 1.2 : 1,
                  backgroundColor: i < knockCount ? '#FFD700' : '#E5E7EB'
                }}
                className="w-4 h-4 rounded-full"
              />
            ))}
          </motion.div>
        )}
        
        {/* Magic Box or Benny */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!isRevealed ? (
              <motion.button
                key="box"
                onClick={handleKnock}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, rotate: [-2, 2, -2, 0] }}
                animate={{
                  boxShadow: knockCount > 0 
                    ? ['0 0 20px #FFD700', '0 0 40px #FFD700', '0 0 20px #FFD700']
                    : '0 10px 30px rgba(0,0,0,0.2)'
                }}
                transition={{
                  boxShadow: { repeat: Infinity, duration: 1 }
                }}
                className="w-48 h-48 bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center cursor-pointer border-4 border-amber-600 shadow-xl relative overflow-hidden"
              >
                {/* Sparkle overlay */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: 'linear-gradient(45deg, transparent 40%, white 50%, transparent 60%)'
                  }}
                />
                
                <span className="text-6xl z-10">📦</span>
                
                {/* Knock ripple effect */}
                {knockCount > 0 && (
                  <motion.div
                    key={knockCount}
                    initial={{ scale: 0.5, opacity: 0.8 }}
                    animate={{ scale: 2, opacity: 0 }}
                    className="absolute inset-0 border-4 border-white rounded-2xl"
                  />
                )}
              </motion.button>
            ) : (
              <motion.div
                key="benny"
                initial={{ scale: 0, rotate: -180, y: 50 }}
                animate={{ scale: 1, rotate: 0, y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15
                }}
                className="text-center"
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [-5, 5, -5]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2
                  }}
                  className="text-8xl mb-4"
                >
                  {BENNY_THE_BEAR.emoji}
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl font-bold text-amber-800 dark:text-amber-200"
                >
                  Hi! I'm {BENNY_THE_BEAR.name}! 👋
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-lg text-amber-700 dark:text-amber-300 mt-2"
                >
                  {BENNY_THE_BEAR.catchphrase}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Continue Button */}
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-8"
          >
            <Button
              onClick={handleContinue}
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-8 py-6 text-xl rounded-full shadow-lg"
            >
              Let's Go! 🚀
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
