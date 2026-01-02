import React, { useState, useCallback, useEffect } from 'react';
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
import { useLessonContext, Lesson } from '@/contexts/LessonContext';

export type ThemeType = 'jungle' | 'space' | 'underwater';

// Re-export for backwards compatibility
export type { LessonContent, Lesson as Level } from '@/contexts/LessonContext';

interface KidsWorldMapProps {
  theme?: ThemeType;
  totalStars?: number;
  studentName?: string;
  onPlayNext?: () => void;
}

export const KidsWorldMap: React.FC<KidsWorldMapProps> = ({
  theme = 'jungle',
  totalStars = 1234,
  studentName = 'Explorer',
  onPlayNext,
}) => {
  const { getPlaygroundLessons, updateLessonStatus } = useLessonContext();
  const playgroundLessons = getPlaygroundLessons();
  
  const [selectedTheme] = useState<ThemeType>(theme);
  const [lessons, setLessons] = useState<Lesson[]>(playgroundLessons);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Sync with context when lessons change
  useEffect(() => {
    setLessons(playgroundLessons);
  }, [playgroundLessons]);
  
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
    const lesson = lessons.find(l => String(l.id) === levelId);
    if (lesson && lesson.status !== 'locked') {
      setSelectedLesson(lesson);
      setIsModalOpen(true);
    }
  }, [lessons]);

  const handleLessonComplete = useCallback((lessonId: number) => {
    setLessons(prevLessons => {
      const lessonIndex = prevLessons.findIndex(l => l.id === lessonId);
      if (lessonIndex === -1) return prevLessons;

      return prevLessons.map((lesson, index) => {
        if (lesson.id === lessonId) {
          return { ...lesson, status: 'completed' as const };
        }
        if (index === lessonIndex + 1 && lesson.status === 'locked') {
          return { ...lesson, status: 'current' as const };
        }
        return lesson;
      });
    });

    triggerConfetti();
  }, [triggerConfetti]);

  const handlePlayNext = useCallback(() => {
    if (currentLevel) {
      setSelectedLesson(currentLevel);
      setIsModalOpen(true);
    }
    onPlayNext?.();
  }, [currentLevel, onPlayNext]);

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ fontFamily: "'Fredoka', cursive" }}>
      <ThemeBackground />
      
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

      <WindingPath 
        points={levelPositions} 
        completedIndex={completedIndex >= 0 ? completedIndex : -1}
        theme={selectedTheme}
      />

      {lessons.map((level) => (
        <LevelNode
          key={level.id}
          id={String(level.id)}
          number={level.number}
          title={level.title}
          isCompleted={level.status === 'completed'}
          isCurrent={level.status === 'current'}
          isLocked={level.status === 'locked'}
          position={level.position}
          onClick={() => handleLevelClick(String(level.id))}
          theme={selectedTheme}
        />
      ))}

      <GiantGoButton 
        onClick={handlePlayNext}
        lessonTitle={currentLevel?.title || 'Next Lesson'}
      />

      <FloatingBackpack totalStars={totalStars} />

      <LessonPlayerModal
        isOpen={isModalOpen}
        lesson={selectedLesson}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleLessonComplete}
        classId="101"
        studentName="Student"
      />
    </div>
  );
};

export default KidsWorldMap;
