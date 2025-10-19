import React, { useEffect, useState } from 'react';
import { Slide } from '@/types/slides';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, Star, Award, Sparkles } from 'lucide-react';

interface CelebrationSlideProps {
  slide: Slide;
  onComplete?: () => void;
  onNext?: () => void;
}

export function CelebrationSlide({ slide, onComplete, onNext }: CelebrationSlideProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; color: string }>>([]);

  useEffect(() => {
    onComplete?.();
    
    // Generate confetti
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8ED4'][Math.floor(Math.random() * 5)]
    }));
    setConfetti(confettiPieces);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden"
         style={{ backgroundImage: `url(${slide.media?.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      
      {/* Confetti */}
      {confetti.map(piece => (
        <motion.div
          key={piece.id}
          className="absolute w-3 h-3 rounded-full"
          style={{ 
            backgroundColor: piece.color,
            left: `${piece.x}%`
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ 
            y: '100vh', 
            opacity: 0,
            rotate: 360
          }}
          transition={{ 
            duration: 3 + Math.random() * 2, 
            ease: 'linear',
            delay: Math.random() * 0.5
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
        className="mb-8"
      >
        <Trophy className="w-32 h-32 text-yellow-500 drop-shadow-2xl" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-6xl font-bold text-white drop-shadow-lg mb-4 text-center"
      >
        {slide.prompt || '🎉 Congratulations! 🎉'}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-2xl text-white drop-shadow-md mb-8 text-center"
      >
        {slide.instructions || 'You completed the lesson!'}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="p-8 bg-white/95 backdrop-blur-sm">
          <div className="flex justify-center gap-8 mb-6">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="flex flex-col items-center"
            >
              <Star className="w-16 h-16 text-yellow-500 mb-2" />
              <p className="text-sm font-semibold">100% Complete</p>
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="flex flex-col items-center"
            >
              <Award className="w-16 h-16 text-purple-500 mb-2" />
              <p className="text-sm font-semibold">All Badges</p>
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center"
            >
              <Sparkles className="w-16 h-16 text-pink-500 mb-2" />
              <p className="text-sm font-semibold">Max XP</p>
            </motion.div>
          </div>

          <Button 
            onClick={onNext} 
            size="lg" 
            className="w-full text-xl py-6"
          >
            Continue Your Journey
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}
