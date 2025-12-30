import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { JungleTheme } from './JungleTheme';
import { SpaceTheme } from './SpaceTheme';
import { UnderwaterTheme } from './UnderwaterTheme';
import { LevelNode } from './LevelNode';
import { WindingPath } from './WindingPath';
import { FloatingBackpack } from './FloatingBackpack';
import { GiantGoButton } from './GiantGoButton';

export type ThemeType = 'jungle' | 'space' | 'underwater';

interface Level {
  id: number;
  number: number;
  title: string;
  type: 'video' | 'quiz' | 'game';
  status: 'completed' | 'current' | 'locked';
  position: { x: number; y: number };
}

interface KidsWorldMapProps {
  levels?: Level[];
  theme?: ThemeType;
  totalStars?: number;
  studentName?: string;
  onLevelClick?: (levelId: string) => void;
  onPlayNext?: () => void;
}

// Magic Forest Curriculum - Hardcoded Mock Data
const MOCK_LESSONS: Level[] = [
  { id: 1, number: 1, title: 'The Hello Song', type: 'video', status: 'completed', position: { x: 15, y: 70 } },
  { id: 2, number: 2, title: 'Red vs Blue', type: 'game', status: 'current', position: { x: 30, y: 45 } },
  { id: 3, number: 3, title: 'Counting 1-5', type: 'quiz', status: 'locked', position: { x: 50, y: 60 } },
  { id: 4, number: 4, title: 'Animal Friends', type: 'video', status: 'locked', position: { x: 70, y: 40 } },
  { id: 5, number: 5, title: 'My Family', type: 'game', status: 'locked', position: { x: 85, y: 55 } },
];

export const KidsWorldMap: React.FC<KidsWorldMapProps> = ({
  levels = MOCK_LESSONS,
  theme = 'jungle',
  totalStars = 1234,
  studentName = 'Explorer',
  onLevelClick,
  onPlayNext,
}) => {
  const [selectedTheme] = useState<ThemeType>(theme);
  
  const currentLevel = levels.find(l => l.status === 'current');
  const completedIndex = levels.findIndex(l => l.status === 'current') - 1;

  // Extract positions for the winding path
  const levelPositions = levels.map(l => l.position);

  const ThemeBackground = {
    jungle: JungleTheme,
    space: SpaceTheme,
    underwater: UnderwaterTheme,
  }[selectedTheme];

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ fontFamily: "'Fredoka', cursive" }}>
      {/* Theme Background */}
      <ThemeBackground />
      
      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center"
      >
        <div className="bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
          <span className="text-2xl">👋</span>
          <span className="font-bold text-purple-700">Hi, {studentName}!</span>
        </div>
      </motion.div>

      {/* Winding Path */}
      <WindingPath 
        points={levelPositions} 
        completedIndex={completedIndex >= 0 ? completedIndex : -1}
        theme={selectedTheme}
      />

      {/* Level Nodes */}
      {levels.map((level) => (
        <LevelNode
          key={level.id}
          id={String(level.id)}
          number={level.number}
          title={level.title}
          isCompleted={level.status === 'completed'}
          isCurrent={level.status === 'current'}
          isLocked={level.status === 'locked'}
          position={level.position}
          onClick={() => onLevelClick?.(String(level.id))}
          theme={selectedTheme}
        />
      ))}

      {/* Giant GO Button */}
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
