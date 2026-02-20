import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Flame, BarChart2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Stat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

interface WeeklyBriefingCardProps {
  isDarkMode?: boolean;
  improvementPct?: number;
  improvementArea?: string;
  focusArea?: string;
  stats?: Stat[];
}

export const WeeklyBriefingCard: React.FC<WeeklyBriefingCardProps> = ({
  isDarkMode = false,
  improvementPct = 15,
  improvementArea = 'professional tone',
  focusArea = 'Negotiation Vocabulary',
  stats,
}) => {
  const defaultStats: Stat[] = [
    {
      label: 'Sessions',
      value: 4,
      icon: <BarChart2 className="w-3.5 h-3.5" />,
    },
    {
      label: 'Avg Score',
      value: '87%',
      icon: <Target className="w-3.5 h-3.5" />,
    },
    {
      label: 'Streak',
      value: '12 days',
      icon: <Flame className="w-3.5 h-3.5" />,
    },
  ];

  const displayStats = stats ?? defaultStats;
  const isPositive = improvementPct >= 0;

  return (
    <Card className={`overflow-hidden ${
      isDarkMode
        ? 'bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-700/30'
        : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100'
    }`}>
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold text-sm flex items-center gap-1.5 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            📊 Weekly Briefing
          </h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            isDarkMode
              ? 'bg-emerald-800/50 text-emerald-300'
              : 'bg-emerald-100 text-emerald-700'
          }`}>
            AI Report
          </span>
        </div>

        {/* Main insight */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`flex items-start gap-3 p-3 rounded-xl mb-4 ${
            isDarkMode ? 'bg-white/5' : 'bg-white/70'
          }`}
        >
          {/* Trend icon */}
          <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
            isPositive
              ? isDarkMode ? 'bg-emerald-900/50' : 'bg-emerald-100'
              : isDarkMode ? 'bg-red-900/50' : 'bg-red-100'
          }`}>
            {isPositive
              ? <TrendingUp className="w-4 h-4 text-emerald-500" />
              : <TrendingDown className="w-4 h-4 text-red-500" />}
          </div>

          <div>
            <p className={`text-sm leading-snug ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              You improved your{' '}
              <span className={`font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                {improvementArea}
              </span>{' '}
              by{' '}
              <span className={`text-lg font-extrabold ${
                isPositive
                  ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                  : isDarkMode ? 'text-red-400' : 'text-red-600'
              }`}>
                {isPositive ? '+' : ''}{improvementPct}%
              </span>{' '}
              this week.
            </p>
          </div>
        </motion.div>

        {/* Focus recommendation */}
        <div className={`flex items-center gap-2 text-xs mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Next focus:</span>
          <span className={`px-2.5 py-0.5 rounded-full font-semibold ${
            isDarkMode
              ? 'bg-teal-900/50 text-teal-300 border border-teal-700/40'
              : 'bg-teal-100 text-teal-700 border border-teal-200'
          }`}>
            🎯 {focusArea}
          </span>
        </div>

        {/* Stat pills */}
        <div className="grid grid-cols-3 gap-2">
          {displayStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              className={`flex flex-col items-center py-2.5 px-1 rounded-xl text-center ${
                isDarkMode ? 'bg-white/5' : 'bg-white/80'
              }`}
            >
              <div className={`mb-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </span>
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} leading-tight`}>
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
