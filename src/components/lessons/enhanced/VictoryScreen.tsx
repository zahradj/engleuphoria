import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Zap, Clock, Target, Award } from 'lucide-react';
import { ConfettiEffect } from '@/components/gamification/ConfettiEffect';

interface VictoryScreenProps {
  score: number;
  totalXP: number;
  accuracy: number;
  timeSpent: number; // in seconds
  streak: number;
  hearts: number;
  onContinue?: () => void;
}

export function VictoryScreen({
  score,
  totalXP,
  accuracy,
  timeSpent,
  streak,
  hearts,
  onContinue
}: VictoryScreenProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isPerfect = accuracy >= 100 && hearts === 5;
  const isExcellent = accuracy >= 90;
  const isGood = accuracy >= 70;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ConfettiEffect trigger={showConfetti} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8 space-y-8">
          {/* Trophy */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-center"
          >
            <Trophy className={`w-24 h-24 mx-auto mb-4 ${
              isPerfect ? 'text-yellow-500' : 
              isExcellent ? 'text-blue-500' : 
              isGood ? 'text-green-500' : 'text-gray-500'
            }`} />
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {isPerfect ? 'Perfect Score!' : 
               isExcellent ? 'Excellent Work!' : 
               isGood ? 'Great Job!' : 
               'Lesson Complete!'}
            </h1>
            <p className="text-xl text-muted-foreground">
              {isPerfect ? 'You are amazing! 🌟' : 
               isExcellent ? 'Outstanding performance! 🎉' : 
               isGood ? 'Keep up the good work! 👏' : 
               'Nice effort! Keep practicing! 💪'}
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Total XP */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-4 text-center bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300">
                <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-600 fill-yellow-600" />
                <div className="text-3xl font-bold text-yellow-700">{totalXP}</div>
                <div className="text-sm text-yellow-600">XP Earned</div>
              </Card>
            </motion.div>

            {/* Accuracy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-green-100 border-green-300">
                <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-3xl font-bold text-green-700">{accuracy}%</div>
                <div className="text-sm text-green-600">Accuracy</div>
              </Card>
            </motion.div>

            {/* Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300">
                <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-3xl font-bold text-blue-700">{formatTime(timeSpent)}</div>
                <div className="text-sm text-blue-600">Time Spent</div>
              </Card>
            </motion.div>

            {/* Best Streak */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-4 text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300">
                <Star className="w-8 h-8 mx-auto mb-2 text-orange-600 fill-orange-600" />
                <div className="text-3xl font-bold text-orange-700">{streak}</div>
                <div className="text-sm text-orange-600">Best Streak</div>
              </Card>
            </motion.div>

            {/* Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300">
                <Award className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="text-3xl font-bold text-purple-700">{score}</div>
                <div className="text-sm text-purple-600">Total Score</div>
              </Card>
            </motion.div>

            {/* Hearts Left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="p-4 text-center bg-gradient-to-br from-red-50 to-red-100 border-red-300">
                <div className="text-3xl mb-2">❤️</div>
                <div className="text-3xl font-bold text-red-700">{hearts}/5</div>
                <div className="text-sm text-red-600">Hearts Left</div>
              </Card>
            </motion.div>
          </div>

          {/* Achievements */}
          {(isPerfect || streak >= 5) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-3"
            >
              <h3 className="text-lg font-semibold text-center text-foreground">
                Achievements Unlocked! 🏆
              </h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {isPerfect && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2">
                    ⭐ Perfect Score
                  </Badge>
                )}
                {streak >= 5 && (
                  <Badge className="bg-gradient-to-r from-orange-400 to-red-600 text-white px-4 py-2">
                    🔥 Hot Streak
                  </Badge>
                )}
              </div>
            </motion.div>
          )}

          {/* Continue Button */}
          {onContinue && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex justify-center"
            >
              <Button size="lg" onClick={onContinue} className="px-12">
                Continue
              </Button>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
