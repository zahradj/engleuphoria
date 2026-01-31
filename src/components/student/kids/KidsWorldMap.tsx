import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { JungleTheme } from './JungleTheme';
import { SpaceTheme } from './SpaceTheme';
import { UnderwaterTheme } from './UnderwaterTheme';
import { LevelNode } from './LevelNode';
import { WindingPath } from './WindingPath';
import { FloatingBackpack } from './FloatingBackpack';
import { GiantGoButton } from './GiantGoButton';
import { LessonPlayerModal } from './LessonPlayerModal';
import { PlaygroundLesson } from '@/hooks/usePlaygroundLessons';

export type ThemeType = 'jungle' | 'space' | 'underwater';

// Type alias for backwards compatibility
export type Level = PlaygroundLesson;
export type LessonContent = PlaygroundLesson['content'];

interface KidsWorldMapProps {
  theme?: ThemeType;
  totalStars?: number;
  studentName?: string;
  lessons: PlaygroundLesson[];
  onLessonComplete?: (lessonId: string, score?: number) => void;
  onPlayNext?: () => void;
}

export const KidsWorldMap: React.FC<KidsWorldMapProps> = ({
  theme = 'jungle',
  totalStars = 0,
  studentName = 'Explorer',
  lessons,
  onLessonComplete,
  onPlayNext,
}) => {
  const [selectedTheme] = useState<ThemeType>(theme);
  const [selectedLesson, setSelectedLesson] = useState<PlaygroundLesson | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const currentLevel = lessons.find(l => l.status === 'current');
  const completedIndex = lessons.findIndex(l => l.status === 'current') - 1;

  // Extract positions for the winding path
  const levelPositions = lessons.map(l => l.position);

  const ThemeBackground = {
    jungle: JungleTheme,
    space: SpaceTheme,
    underwater: UnderwaterTheme,
  }[selectedTheme];

  const triggerConfetti = useCallback(() => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 100,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      shapes: ['star'],
      colors: ['#FFD700', '#FFA500', '#FF6347'],
    });
  }, []);

  const handleLevelClick = useCallback((levelId: string) => {
    const lesson = lessons.find(l => l.id === levelId);
    if (lesson && lesson.status !== 'locked') {
      setSelectedLesson(lesson);
      setIsModalOpen(true);
    }
  }, [lessons]);

  const handleLessonComplete = useCallback((lessonId: string, score: number = 100) => {
    triggerConfetti();
    onLessonComplete?.(lessonId, score);
  }, [triggerConfetti, onLessonComplete]);

  const handlePlayNext = useCallback(() => {
    if (currentLevel) {
      setSelectedLesson(currentLevel);
      setIsModalOpen(true);
    }
    onPlayNext?.();
  }, [currentLevel, onPlayNext]);

  // Animated mascot (Pip the Parrot)
  const MascotPip = () => {
    if (!currentLevel) return null;
    
    return (
      <motion.div
        animate={{
          y: [-5, 5, -5],
          rotate: [-5, 5, -5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: 'absolute',
          left: `${currentLevel.position.x - 8}%`,
          top: `${currentLevel.position.y - 15}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 15,
        }}
        className="pointer-events-none"
      >
        <div className="text-5xl drop-shadow-lg">🦜</div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full text-sm font-bold text-purple-600 whitespace-nowrap shadow-lg"
        >
          Let's go!
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ fontFamily: "'Fredoka', cursive" }}>
      <ThemeBackground />
      
      {/* Header with student name */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center"
      >
        <div className="bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
          <span className="text-2xl">👋</span>
          <span className="font-bold text-purple-700">Hi, {studentName}!</span>
        </div>
        
        {/* Progress indicator */}
        <div className="bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
          <span className="text-lg">📚</span>
          <span className="font-bold text-emerald-700">
            {lessons.filter(l => l.status === 'completed').length}/{lessons.length}
          </span>
        </div>
      </motion.div>

      {/* Winding path */}
      <WindingPath 
        points={levelPositions} 
        completedIndex={completedIndex >= 0 ? completedIndex : -1}
        theme={selectedTheme}
      />

      {/* Mascot */}
      <MascotPip />

      {/* Level nodes */}
      {lessons.map((level) => (
        <LevelNode
          key={level.id}
          id={level.id}
          number={level.number}
          title={level.title}
          isCompleted={level.status === 'completed'}
          isCurrent={level.status === 'current'}
          isLocked={level.status === 'locked'}
          position={level.position}
          onClick={() => handleLevelClick(level.id)}
          theme={selectedTheme}
          score={level.score}
        />
      ))}

      {/* Big Play button */}
      <GiantGoButton 
        onClick={handlePlayNext}
        lessonTitle={currentLevel?.title || 'Start Adventure'}
      />

      {/* Floating backpack with stars */}
      <FloatingBackpack totalStars={totalStars} />

      {/* Lesson player modal */}
      <LessonPlayerModal
        isOpen={isModalOpen}
        lesson={selectedLesson}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleLessonComplete}
        studentName={studentName}
      />
    </div>
  );
};

export default KidsWorldMap;
