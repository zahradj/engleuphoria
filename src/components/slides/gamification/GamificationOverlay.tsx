import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Zap, Star, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface GamificationOverlayProps {
  xpEarned?: number;
  badgeUnlocked?: string;
  streak?: number;
  levelUp?: boolean;
  totalXP?: number;
  nextLevelXP?: number;
}

export function GamificationOverlay({
  xpEarned = 0,
  badgeUnlocked,
  streak = 0,
  levelUp = false,
  totalXP = 0,
  nextLevelXP = 100,
}: GamificationOverlayProps) {
  const xpProgress = (totalXP / nextLevelXP) * 100;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {/* XP Progress Bar */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 border-2 border-purple-200 min-w-[250px]"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-bold text-gray-900">XP Progress</span>
          </div>
          <span className="text-xs font-semibold text-purple-600">
            {totalXP} / {nextLevelXP}
          </span>
        </div>
        <Progress value={xpProgress} className="h-2" />
      </motion.div>

      {/* Streak Counter */}
      {streak > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl shadow-lg p-3 border-2 border-orange-300"
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(Math.min(streak, 5))].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                </motion.div>
              ))}
            </div>
            <span className="text-sm font-bold text-orange-900">
              {streak} {streak === 1 ? 'Correct' : 'in a Row'}!
            </span>
          </div>
        </motion.div>
      )}

      {/* XP Earned Animation */}
      <AnimatePresence>
        {xpEarned > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            transition={{ type: 'spring', bounce: 0.6 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-xl p-4 border-2 border-green-300"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <span className="text-lg font-bold">+{xpEarned} XP</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge Unlocked */}
      <AnimatePresence>
        {badgeUnlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: 'spring', bounce: 0.7 }}
            className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-xl p-4 border-2 border-yellow-400"
          >
            <div className="space-y-2 text-center">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, ease: 'easeInOut' }}
              >
                <Trophy className="h-8 w-8 text-yellow-600 mx-auto" />
              </motion.div>
              <div>
                <p className="text-xs font-semibold text-amber-900">Badge Unlocked!</p>
                <p className="text-sm font-bold text-yellow-700">{badgeUnlocked}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up */}
      <AnimatePresence>
        {levelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: [0, 1.2, 1] }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-xl shadow-2xl p-6 border-4 border-yellow-400"
          >
            <div className="space-y-2 text-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
              >
                <Award className="h-12 w-12 mx-auto text-yellow-300" />
              </motion.div>
              <div>
                <p className="text-2xl font-bold">LEVEL UP!</p>
                <p className="text-sm">You're becoming a master!</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
