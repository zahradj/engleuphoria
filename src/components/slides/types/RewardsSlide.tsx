import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Award, Trophy, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface RewardsSlideProps {
  slide: {
    prompt: string;
    instructions?: string;
    xpEarned?: number;
    starsEarned?: number;
    badgesUnlocked?: Badge[];
    completionMessage?: string;
  };
  slideNumber: number;
  onNext?: () => void;
}

export function RewardsSlide({ slide, slideNumber, onNext }: RewardsSlideProps) {
  const [showRewards, setShowRewards] = useState(false);

  const xpEarned = slide.xpEarned || 100;
  const starsEarned = slide.starsEarned || 3;
  const badgesUnlocked = slide.badgesUnlocked || [];

  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#9370DB']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#9370DB']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Show rewards after animation
    setTimeout(() => setShowRewards(true), 500);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.h2
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="text-5xl font-bold text-primary mb-4"
        >
          🎉 {slide.prompt} 🎉
        </motion.h2>
        {slide.completionMessage && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-muted-foreground"
          >
            {slide.completionMessage}
          </motion.p>
        )}
      </div>

      {showRewards && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* XP and Stars */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* XP Card */}
            <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300">
              <CardContent className="p-6 text-center">
                <motion.div
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-5xl font-bold text-purple-700 mb-2"
                >
                  +{xpEarned}
                </motion.div>
                <p className="text-purple-600 font-medium">XP Earned!</p>
              </CardContent>
            </Card>

            {/* Stars Card */}
            <Card className="bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-300">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center gap-2 mb-3">
                  {[...Array(3)].map((_, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: idx < starsEarned ? 1 : 0.5, rotate: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1, type: 'spring' }}
                    >
                      <Star
                        className={`w-10 h-10 ${
                          idx < starsEarned
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-5xl font-bold text-yellow-700 mb-2"
                >
                  {starsEarned}/3
                </motion.div>
                <p className="text-yellow-600 font-medium">Stars Earned!</p>
              </CardContent>
            </Card>
          </div>

          {/* Badges Unlocked */}
          {badgesUnlocked.length > 0 && (
            <Card className="bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-300">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Trophy className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-blue-700">New Badges Unlocked!</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {badgesUnlocked.map((badge, idx) => (
                    <motion.div
                      key={badge.id}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.8 + idx * 0.2, type: 'spring', bounce: 0.6 }}
                    >
                      <Card className="bg-white">
                        <CardContent className="p-4 text-center">
                          <div className="text-4xl mb-2">{badge.icon}</div>
                          <h4 className="font-bold text-lg">{badge.name}</h4>
                          <p className="text-sm text-muted-foreground">{badge.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Character Celebration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">🎊</div>
            <p className="text-2xl font-bold text-primary mb-2">
              Amazing work!
            </p>
            <p className="text-muted-foreground">
              You're making great progress! Keep up the excellent work!
            </p>
          </motion.div>

          {/* Continue Button */}
          {onNext && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 }}
            >
              <Button
                onClick={onNext}
                size="lg"
                className="w-full text-xl py-6"
              >
                Continue Learning! 🚀
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
