import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy, Play, Lock, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurriculumLessons } from '@/hooks/useCurriculumLessons';
import { CurriculumLesson } from '@/types/multiTenant';

interface PlaygroundDashboardProps {
  studentName?: string;
  totalXp?: number;
  onLevelUp?: () => void;
}

export const PlaygroundDashboard: React.FC<PlaygroundDashboardProps> = ({
  studentName = 'Explorer',
  totalXp = 1234,
  onLevelUp,
}) => {
  const { data: lessons = [], isLoading } = useCurriculumLessons('kids');
  const currentLesson = lessons.find((_, index) => index < 3) || lessons[0];

  // Mock completed lessons (first 2)
  const completedCount = 2;

  return (
    <div 
      className="min-h-screen p-4 md:p-6"
      style={{
        background: 'linear-gradient(135deg, hsl(45 100% 97%) 0%, hsl(330 85% 95%) 50%, hsl(165 85% 95%) 100%)',
        fontFamily: "'Fredoka', 'Comic Neue', cursive",
      }}
    >
      {/* Header with Stars and Avatar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center mb-6"
      >
        <div className="flex items-center gap-3 bg-white/80 rounded-full px-4 py-2 shadow-lg">
          <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          <span className="text-2xl font-bold text-purple-700">{totalXp.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-purple-600">Hi there,</p>
            <p className="text-xl font-bold text-purple-800">{studentName}!</p>
          </div>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-2xl shadow-lg">
            🦁
          </div>
        </div>
      </motion.div>

      {/* Adventure Island Map */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white/90 rounded-3xl p-6 shadow-xl mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-200 to-teal-400 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-pink-200 to-pink-400 rounded-full translate-y-1/2 -translate-x-1/2 opacity-50" />
        
        <h2 className="text-2xl font-bold text-purple-700 mb-6 flex items-center gap-2 relative z-10">
          <span className="text-3xl">🏝️</span> Adventure Island
        </h2>
        
        {/* Level Nodes */}
        <div className="flex justify-center items-center gap-2 md:gap-4 overflow-x-auto py-4 relative z-10">
          {isLoading ? (
            <div className="flex gap-4">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : (
            lessons.slice(0, 5).map((lesson, index) => (
              <React.Fragment key={lesson.id}>
                <LevelNode 
                  number={index + 1}
                  isCompleted={index < completedCount}
                  isCurrent={index === completedCount}
                  isLocked={index > completedCount}
                  title={lesson.title}
                />
                {index < 4 && (
                  <div className={`w-6 md:w-10 h-1 rounded-full ${
                    index < completedCount ? 'bg-teal-400' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </motion.div>

      {/* Big Play Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Button
          className="w-full py-8 text-2xl font-bold rounded-3xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, hsl(330 85% 65%) 0%, hsl(280 85% 60%) 100%)',
            color: 'white',
          }}
        >
          <Play className="w-10 h-10 mr-3 fill-white" />
          PLAY NEXT LESSON
        </Button>
        {currentLesson && (
          <p className="text-center mt-2 text-purple-600 font-medium">
            "{currentLesson.title}"
          </p>
        )}
      </motion.div>

      {/* Trophy Room & Rewards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 rounded-3xl p-5 shadow-lg"
        >
          <h3 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Trophy Room
          </h3>
          <div className="flex gap-3 flex-wrap">
            <TrophyBadge emoji="🥇" name="First Steps" unlocked />
            <TrophyBadge emoji="🌟" name="Star Reader" unlocked />
            <TrophyBadge emoji="🎨" name="Color Master" unlocked />
            <TrophyBadge emoji="🏆" name="Champion" unlocked={false} />
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 rounded-3xl p-5 shadow-lg"
        >
          <h3 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
            <Gift className="w-6 h-6 text-pink-500" />
            Rewards
          </h3>
          <div className="space-y-2">
            <RewardItem name="New Avatar Hat" cost={500} canAfford={totalXp >= 500} />
            <RewardItem name="Magic Wand Effect" cost={1000} canAfford={totalXp >= 1000} />
            <RewardItem name="Special Theme" cost={2000} canAfford={totalXp >= 2000} />
          </div>
        </motion.div>
      </div>

      {/* Level Up Button (for testing) */}
      {onLevelUp && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <Button
            onClick={onLevelUp}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Graduate to Teen Academy!
          </Button>
        </motion.div>
      )}
    </div>
  );
};

// Sub-components
interface LevelNodeProps {
  number: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  title: string;
}

const LevelNode: React.FC<LevelNodeProps> = ({ number, isCompleted, isCurrent, isLocked, title }) => {
  let bgColor = 'bg-gray-200';
  let icon = <Lock className="w-5 h-5 text-gray-400" />;
  
  if (isCompleted) {
    bgColor = 'bg-teal-400';
    icon = <Star className="w-6 h-6 text-white fill-white" />;
  } else if (isCurrent) {
    bgColor = 'bg-gradient-to-br from-pink-400 to-purple-500';
    icon = <span className="text-2xl font-bold text-white">{number}</span>;
  }

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-1"
    >
      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full ${bgColor} flex items-center justify-center shadow-lg cursor-pointer ${isCurrent ? 'ring-4 ring-yellow-300 ring-offset-2' : ''}`}>
        {icon}
      </div>
      <span className="text-xs text-purple-600 font-medium text-center max-w-[60px] truncate">
        {isLocked ? '???' : title.split(' ')[0]}
      </span>
    </motion.div>
  );
};

interface TrophyBadgeProps {
  emoji: string;
  name: string;
  unlocked: boolean;
}

const TrophyBadge: React.FC<TrophyBadgeProps> = ({ emoji, name, unlocked }) => (
  <motion.div
    whileHover={{ scale: 1.1, rotate: 5 }}
    className={`flex flex-col items-center p-3 rounded-2xl ${
      unlocked ? 'bg-gradient-to-br from-yellow-100 to-yellow-200' : 'bg-gray-100 opacity-50'
    }`}
  >
    <span className="text-3xl">{unlocked ? emoji : '🔒'}</span>
    <span className="text-xs font-medium text-purple-700 mt-1">{name}</span>
  </motion.div>
);

interface RewardItemProps {
  name: string;
  cost: number;
  canAfford: boolean;
}

const RewardItem: React.FC<RewardItemProps> = ({ name, cost, canAfford }) => (
  <div className={`flex items-center justify-between p-2 rounded-xl ${canAfford ? 'bg-teal-50' : 'bg-gray-50'}`}>
    <span className="font-medium text-purple-700">{name}</span>
    <div className="flex items-center gap-1">
      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      <span className={canAfford ? 'text-teal-600 font-bold' : 'text-gray-400'}>{cost}</span>
    </div>
  </div>
);
