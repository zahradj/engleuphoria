import React from 'react';
import { motion } from 'framer-motion';
import { Star, Zap } from 'lucide-react';

interface LessonProgressBarProps {
  currentSlide: number;
  totalSlides: number;
  xpEarned: number;
  starsEarned: number;
}

export function LessonProgressBar({
  currentSlide,
  totalSlides,
  xpEarned,
  starsEarned
}: LessonProgressBarProps) {
  const percentage = (currentSlide / totalSlides) * 100;

  return (
    <div className="w-full bg-background border-b">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          {/* Slide Progress */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              Slide {currentSlide} / {totalSlides}
            </span>
            <span className="text-xs text-muted-foreground">
              ({Math.round(percentage)}%)
            </span>
          </div>

          {/* Rewards Display */}
          <div className="flex items-center gap-4">
            {/* XP Counter */}
            <motion.div
              key={xpEarned}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-3 py-1 bg-purple-100 rounded-full"
            >
              <Zap className="w-4 h-4 fill-purple-500 text-purple-500" />
              <span className="text-sm font-bold text-purple-700">{xpEarned} XP</span>
            </motion.div>

            {/* Stars Counter */}
            <motion.div
              key={starsEarned}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-3 py-1 bg-yellow-100 rounded-full"
            >
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-yellow-700">{starsEarned}</span>
            </motion.div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
