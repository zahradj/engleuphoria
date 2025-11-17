import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Zap, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LessonGameSystemProps {
  hearts: number;
  maxHearts: number;
  xp: number;
  streak: number;
  combo: number;
  className?: string;
}

export function LessonGameSystem({ 
  hearts, 
  maxHearts, 
  xp, 
  streak, 
  combo,
  className = '' 
}: LessonGameSystemProps) {
  return (
    <div className={`flex items-center justify-between bg-card/80 backdrop-blur-sm px-4 py-3 rounded-lg border border-border shadow-sm ${className}`}>
      {/* Hearts */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {Array.from({ length: maxHearts }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Heart
                className={`w-6 h-6 ${
                  i < hearts
                    ? 'fill-red-500 text-red-500'
                    : 'fill-muted text-muted'
                }`}
              />
            </motion.div>
          ))}
        </div>
        <Badge variant="secondary" className="text-xs font-semibold">
          {hearts}/{maxHearts}
        </Badge>
      </div>

      {/* XP */}
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        <div className="flex flex-col items-start">
          <span className="text-sm font-bold text-foreground">{xp} XP</span>
          {combo > 1 && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-xs font-bold text-orange-500"
            >
              {combo}x Combo!
            </motion.span>
          )}
        </div>
      </div>

      {/* Streak */}
      <AnimatePresence>
        {streak > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            <Badge variant="default" className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold">
              {streak} Streak
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
