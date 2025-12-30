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

export type ThemeType = 'jungle' | 'space' | 'underwater';

export interface LessonContent {
  vocabulary: string[];
  sentence: string;
  videoUrl?: string;
  quizQuestion: string;
  quizOptions: string[];
  quizAnswer: string;
}

export interface Level {
  id: number;
  number: number;
  title: string;
  type: 'video' | 'slide' | 'game';
  status: 'completed' | 'current' | 'locked';
  position: { x: number; y: number };
  content: LessonContent;
}

interface KidsWorldMapProps {
  theme?: ThemeType;
  totalStars?: number;
  studentName?: string;
  onPlayNext?: () => void;
}

// Magic Forest Curriculum - Real Educational Content for Ages 4-7
const INITIAL_LESSONS: Level[] = [
  {
    id: 1,
    number: 1,
    title: 'Hello, Pip!',
    type: 'video',
    status: 'current',
    position: { x: 15, y: 70 },
    content: {
      vocabulary: ['Hello', 'Name', 'Bird'],
      sentence: 'Hello! My name is Pip.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      quizQuestion: "What is the bird's name?",
      quizOptions: ['Pip', 'Pop', 'Pap'],
      quizAnswer: 'Pip',
    },
  },
  {
    id: 2,
    number: 2,
    title: 'The Red Balloon',
    type: 'slide',
    status: 'locked',
    position: { x: 30, y: 45 },
    content: {
      vocabulary: ['Red', 'Balloon', 'Up'],
      sentence: 'The balloon is red.',
      quizQuestion: 'Touch the RED balloon.',
      quizOptions: ['🔴', '🔵', '🟢'],
      quizAnswer: '🔴',
    },
  },
  {
    id: 3,
    number: 3,
    title: 'Counting Berries',
    type: 'game',
    status: 'locked',
    position: { x: 50, y: 60 },
    content: {
      vocabulary: ['One', 'Two', 'Three'],
      sentence: 'I see three berries.',
      quizQuestion: 'How many berries?',
      quizOptions: ['1', '3', '5'],
      quizAnswer: '3',
    },
  },
  {
    id: 4,
    number: 4,
    title: 'Animal Friends',
    type: 'video',
    status: 'locked',
    position: { x: 70, y: 40 },
    content: {
      vocabulary: ['Cat', 'Dog', 'Friend'],
      sentence: 'The cat and dog are friends.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      quizQuestion: 'Who are friends?',
      quizOptions: ['Cat & Dog', 'Bird & Fish', 'Tree & Flower'],
      quizAnswer: 'Cat & Dog',
    },
  },
  {
    id: 5,
    number: 5,
    title: 'My Family',
    type: 'slide',
    status: 'locked',
    position: { x: 85, y: 55 },
    content: {
      vocabulary: ['Mom', 'Dad', 'Family'],
      sentence: 'I love my family.',
      quizQuestion: 'Who do you love?',
      quizOptions: ['Family', 'Toys', 'Food'],
      quizAnswer: 'Family',
    },
  },
];

export const KidsWorldMap: React.FC<KidsWorldMapProps> = ({
  theme = 'jungle',
  totalStars = 1234,
  studentName = 'Explorer',
  onPlayNext,
}) => {
  const [selectedTheme] = useState<ThemeType>(theme);
  const [lessons, setLessons] = useState<Level[]>(INITIAL_LESSONS);
  const [selectedLesson, setSelectedLesson] = useState<Level | null>(null);
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
      />
    </div>
  );
};

export default KidsWorldMap;
