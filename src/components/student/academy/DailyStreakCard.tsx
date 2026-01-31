import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Snowflake } from 'lucide-react';

interface DailyStreakCardProps {
  currentStreak?: number;
  longestStreak?: number;
  weeklyActivity?: boolean[];
  hasStreakFreeze?: boolean;
  isDarkMode?: boolean;
}

const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const DailyStreakCard: React.FC<DailyStreakCardProps> = ({
  currentStreak = 7,
  longestStreak = 14,
  weeklyActivity = [true, true, true, true, true, false, true],
  hasStreakFreeze = false,
  isDarkMode = true,
}) => {
  const isMilestone = currentStreak === 7 || currentStreak === 30 || currentStreak === 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-4 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-500/30' 
          : 'bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Animated Flame */}
          <motion.div
            animate={isMilestone ? { 
              scale: [1, 1.2, 1],
              rotate: [0, -5, 5, 0],
            } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="relative"
          >
            <Flame 
              className={`w-10 h-10 ${
                currentStreak >= 30 
                  ? 'text-yellow-400' 
                  : currentStreak >= 7 
                    ? 'text-orange-400' 
                    : 'text-orange-500'
              }`}
              fill={currentStreak > 0 ? 'currentColor' : 'none'}
            />
            {isMilestone && (
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute inset-0 bg-orange-500 rounded-full blur-lg -z-10"
              />
            )}
          </motion.div>
          
          <div>
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentStreak}
              </span>
              <span className={`text-sm ${isDarkMode ? 'text-orange-300' : 'text-orange-600'}`}>
                day streak
              </span>
            </div>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Best: {longestStreak} days
            </p>
          </div>
        </div>
        
        {/* Streak Freeze */}
        {hasStreakFreeze && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
            isDarkMode ? 'bg-cyan-500/20' : 'bg-cyan-100'
          }`}>
            <Snowflake className="w-4 h-4 text-cyan-400" />
            <span className={`text-xs font-medium ${isDarkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
              1 freeze
            </span>
          </div>
        )}
      </div>
      
      {/* Weekly Calendar */}
      <div className="flex justify-between gap-1">
        {weeklyActivity.map((isActive, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                isActive
                  ? isDarkMode
                    ? 'bg-gradient-to-br from-orange-400 to-red-500 shadow-lg shadow-orange-500/30'
                    : 'bg-gradient-to-br from-orange-400 to-red-500 shadow-md'
                  : isDarkMode
                    ? 'bg-gray-800/50 border border-gray-700'
                    : 'bg-gray-100 border border-gray-200'
              }`}
            >
              {isActive && (
                <Flame className="w-4 h-4 text-white" fill="white" />
              )}
            </motion.div>
            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {dayLabels[index]}
            </span>
          </div>
        ))}
      </div>
      
      {/* Motivational Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`text-center text-sm mt-3 ${
          isDarkMode ? 'text-orange-300' : 'text-orange-600'
        }`}
      >
        {currentStreak >= 30 
          ? "🔥 You're on fire! Incredible dedication!" 
          : currentStreak >= 7 
            ? "🎯 One week strong! Keep it up!" 
            : "💪 Keep your streak alive!"}
      </motion.p>
    </motion.div>
  );
};
