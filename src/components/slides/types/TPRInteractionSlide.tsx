import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BENNY_THE_BEAR, getMascotEmotion } from '@/constants/mascots';
import { playSound } from '@/constants/soundEffects';

interface TPRInteractionSlideProps {
  slide: {
    title?: string;
    instructions?: string;
    action?: string;
    content?: {
      title?: string;
      instructions?: string;
      action?: string;
    };
  };
  slideNumber: number;
  onNext?: () => void;
}

export function TPRInteractionSlide({ slide, slideNumber, onNext }: TPRInteractionSlideProps) {
  const [isWaving, setIsWaving] = useState(true);
  const [hasHighFived, setHasHighFived] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const title = slide.content?.title || slide.title || 'Say Hello to Benny!';
  const instructions = slide.content?.instructions || slide.instructions || 'Give Benny a high five!';
  const action = slide.content?.action || slide.action || 'high_five';
  
  const handleHighFive = useCallback(() => {
    if (hasHighFived) return;
    
    setHasHighFived(true);
    setIsWaving(false);
    playSound('highFive');
    
    setTimeout(() => {
      setShowSuccess(true);
      playSound('cheer');
    }, 500);
  }, [hasHighFived]);
  
  const handleContinue = () => {
    playSound('whoosh');
    onNext?.();
  };
  
  const emotion = getMascotEmotion('benny', isWaving ? 'waving' : hasHighFived ? 'celebrating' : 'happy');
  
  return (
    <Card className="w-full h-full min-h-[500px] overflow-hidden relative bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-teal-950/20">
      {/* Success Stars Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-50"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: '50%',
                  y: '30%',
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  x: `${30 + Math.random() * 40}%`,
                  y: `${Math.random() * 60}%`,
                  scale: [0, 1.5, 1],
                  opacity: [1, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  delay: Math.random() * 0.3,
                  ease: 'easeOut'
                }}
                className="absolute text-4xl"
              >
                ⭐
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <CardContent className="p-8 flex flex-col items-center justify-center h-full relative z-10">
        {/* Title */}
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl md:text-4xl font-bold text-center mb-4 text-blue-800 dark:text-blue-200"
        >
          {title}
        </motion.h2>
        
        {/* Instructions */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-center mb-8 text-blue-700 dark:text-blue-300"
        >
          {hasHighFived ? '🎉 Great high five!' : instructions}
        </motion.p>
        
        {/* Benny Character */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            animate={isWaving ? {
              rotate: [0, -10, 10, -10, 10, 0],
            } : hasHighFived ? {
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{
              repeat: isWaving ? Infinity : 0,
              duration: isWaving ? 1.5 : 0.5,
              repeatDelay: 0.5
            }}
            className="text-9xl mb-4 relative"
          >
            {BENNY_THE_BEAR.emoji}
            
            {/* Waving hand indicator */}
            {isWaving && (
              <motion.span
                animate={{ rotate: [0, 20, 0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute -right-4 top-0 text-5xl"
              >
                👋
              </motion.span>
            )}
            
            {/* Celebration particles */}
            {hasHighFived && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-8 -top-4 text-4xl"
              >
                🎉
              </motion.span>
            )}
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg font-medium text-blue-600 dark:text-blue-300"
          >
            {hasHighFived ? `${BENNY_THE_BEAR.name} is so happy!` : `${BENNY_THE_BEAR.name} wants to be your friend!`}
          </motion.p>
        </div>
        
        {/* High Five Zone */}
        {!hasHighFived && (
          <motion.button
            onClick={handleHighFive}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="relative cursor-pointer group"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(59, 130, 246, 0.5)',
                  '0 0 40px rgba(59, 130, 246, 0.8)',
                  '0 0 20px rgba(59, 130, 246, 0.5)'
                ]
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center"
            >
              <span className="text-6xl transform group-hover:scale-110 transition-transform">
                ✋
              </span>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium text-blue-600"
            >
              Tap here for high five!
            </motion.p>
          </motion.button>
        )}
        
        {/* Success Message */}
        {hasHighFived && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-6xl mb-4"
            >
              🌟
            </motion.div>
            <p className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-2">
              You're friends now!
            </p>
            <p className="text-lg text-blue-600 dark:text-blue-300">
              {BENNY_THE_BEAR.name} will help you learn English!
            </p>
          </motion.div>
        )}
        
        {/* Continue Button */}
        {hasHighFived && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-8"
          >
            <Button
              onClick={handleContinue}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold px-8 py-6 text-xl rounded-full shadow-lg"
            >
              Let's Learn! 📚
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
