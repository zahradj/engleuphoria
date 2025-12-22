import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { JungleTheme } from './JungleTheme';
import { SpaceTheme } from './SpaceTheme';
import { UnderwaterTheme } from './UnderwaterTheme';
import { LevelNode } from './LevelNode';
import { WindingPath } from './WindingPath';
import { FloatingBackpack } from './FloatingBackpack';
import { GiantGoButton } from './GiantGoButton';
import { FloatingClouds } from './FloatingClouds';

export type ThemeType = 'jungle' | 'space' | 'underwater';

interface Level {
  id: string;
  number: number;
  title: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
}

interface KidsWorldMapProps {
  levels?: Level[];
  theme?: ThemeType;
  totalStars?: number;
  studentName?: string;
  onLevelClick?: (levelId: string) => void;
  onPlayNext?: () => void;
}

const defaultLevels: Level[] = [
  { id: '1', number: 1, title: 'Hello!', isCompleted: true, isCurrent: false, isLocked: false },
  { id: '2', number: 2, title: 'Colors', isCompleted: true, isCurrent: false, isLocked: false },
  { id: '3', number: 3, title: 'Animals', isCompleted: false, isCurrent: true, isLocked: false },
  { id: '4', number: 4, title: 'Numbers', isCompleted: false, isCurrent: false, isLocked: true },
  { id: '5', number: 5, title: 'Family', isCompleted: false, isCurrent: false, isLocked: true },
];

const levelPositions = [
  { x: 15, y: 70 },
  { x: 30, y: 45 },
  { x: 50, y: 60 },
  { x: 70, y: 40 },
  { x: 85, y: 55 },
];

export const KidsWorldMap: React.FC<KidsWorldMapProps> = ({
  levels = defaultLevels,
  theme = 'jungle',
  totalStars = 1234,
  studentName = 'Explorer',
  onLevelClick,
  onPlayNext,
}) => {
  const [selectedTheme] = useState<ThemeType>(theme);
  
  const currentLevel = levels.find(l => l.isCurrent);
  const completedIndex = levels.findIndex(l => l.isCurrent) - 1;

  const ThemeBackground = {
    jungle: JungleTheme,
    space: SpaceTheme,
    underwater: UnderwaterTheme,
  }[selectedTheme];

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ fontFamily: "'Fredoka', cursive" }}>
      {/* Theme Background - Layer 1 */}
      <ThemeBackground />
      
      {/* Floating Clouds - Layer 2 (dreamy atmosphere) */}
      <FloatingClouds theme={selectedTheme} />

      {/* Header - Glassmorphism style */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="bg-white/30 backdrop-blur-lg rounded-full px-5 py-2.5 shadow-xl border-2 border-white/50 flex items-center gap-2"
        >
          <span className="text-2xl">👋</span>
          <span className="font-bold text-white drop-shadow-md">Hi, {studentName}!</span>
        </motion.div>
      </motion.div>

      {/* Winding Path - white dashed with glow */}
      <WindingPath 
        points={levelPositions} 
        completedIndex={completedIndex >= 0 ? completedIndex : -1}
        theme={selectedTheme}
      />

      {/* Level Nodes - Glassmorphism beads */}
      {levels.map((level, index) => (
        <LevelNode
          key={level.id}
          id={level.id}
          number={level.number}
          title={level.title}
          isCompleted={level.isCompleted}
          isCurrent={level.isCurrent}
          isLocked={level.isLocked}
          position={levelPositions[index]}
          onClick={() => onLevelClick?.(level.id)}
          theme={selectedTheme}
        />
      ))}

      {/* Giant GO Button - bouncy springs */}
      <GiantGoButton 
        onClick={onPlayNext}
        lessonTitle={currentLevel?.title || 'Next Lesson'}
      />

      {/* Floating Backpack Menu */}
      <FloatingBackpack totalStars={totalStars} />
    </div>
  );
};

export default KidsWorldMap;
