import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface XPSystemProps {
  currentXP: number;
  currentLevel: number;
  xpForNextLevel: number;
  onLevelUp?: () => void;
}

export function XPSystem({
  currentXP,
  currentLevel,
  xpForNextLevel,
  onLevelUp
}: XPSystemProps) {
  const progressPercentage = (currentXP / xpForNextLevel) * 100;

  return (
    <div className="w-full max-w-md">
      {/* Level Badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {currentLevel}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Level {currentLevel}</p>
            <p className="text-xs text-muted-foreground">
              {currentXP} / {xpForNextLevel} XP
            </p>
          </div>
        </div>
        <Zap className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      </div>

      {/* XP Progress Bar */}
      <div className="h-4 bg-muted rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-end pr-2"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {progressPercentage > 20 && (
            <span className="text-xs font-bold text-white">
              {Math.round(progressPercentage)}%
            </span>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// XP Toast Notification Component
interface XPToastProps {
  xpAmount: number;
  reason?: string;
}

export function XPToast({ xpAmount, reason }: XPToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg shadow-lg"
    >
      <Zap className="w-6 h-6 fill-yellow-300 text-yellow-300" />
      <div>
        <p className="font-bold text-lg">+{xpAmount} XP</p>
        {reason && <p className="text-sm opacity-90">{reason}</p>}
      </div>
    </motion.div>
  );
}
