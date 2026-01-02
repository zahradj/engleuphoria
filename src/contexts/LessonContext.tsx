import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface LessonContent {
  vocabulary: string[];
  sentence: string;
  videoUrl?: string;
  quizQuestion: string;
  quizOptions: string[];
  quizAnswer: string;
}

export interface Lesson {
  id: number;
  number: number;
  title: string;
  type: 'video' | 'slide' | 'game' | 'pdf' | 'quiz' | 'interactive';
  status: 'completed' | 'current' | 'locked';
  position: { x: number; y: number };
  content: LessonContent;
  system: 'playground' | 'academy' | 'hub';
}

interface LessonContextType {
  lessons: Lesson[];
  addLesson: (lesson: Omit<Lesson, 'id' | 'number' | 'status' | 'position'>) => void;
  updateLessonStatus: (lessonId: number, status: Lesson['status']) => void;
  getPlaygroundLessons: () => Lesson[];
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

// Initial mock lessons for the Playground
const INITIAL_LESSONS: Lesson[] = [
  {
    id: 1,
    number: 1,
    title: 'Hello, Pip!',
    type: 'video',
    status: 'current',
    position: { x: 15, y: 70 },
    system: 'playground',
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
    system: 'playground',
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
    system: 'playground',
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
    system: 'playground',
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
    system: 'playground',
    content: {
      vocabulary: ['Mom', 'Dad', 'Family'],
      sentence: 'I love my family.',
      quizQuestion: 'Who do you love?',
      quizOptions: ['Family', 'Toys', 'Food'],
      quizAnswer: 'Family',
    },
  },
];

// Pre-calculated positions for new lessons on the path
const PATH_POSITIONS = [
  { x: 15, y: 70 },
  { x: 30, y: 45 },
  { x: 50, y: 60 },
  { x: 70, y: 40 },
  { x: 85, y: 55 },
  { x: 20, y: 30 },
  { x: 40, y: 20 },
  { x: 60, y: 35 },
  { x: 80, y: 25 },
  { x: 25, y: 15 },
];

interface LessonProviderProps {
  children: ReactNode;
}

export const LessonProvider: React.FC<LessonProviderProps> = ({ children }) => {
  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);

  const addLesson = useCallback((newLessonData: Omit<Lesson, 'id' | 'number' | 'status' | 'position'>) => {
    setLessons(prev => {
      const systemLessons = prev.filter(l => l.system === newLessonData.system);
      const newNumber = systemLessons.length + 1;
      const newId = Math.max(...prev.map(l => l.id), 0) + 1;
      
      // Get position from predefined path or generate one
      const positionIndex = (newNumber - 1) % PATH_POSITIONS.length;
      const position = PATH_POSITIONS[positionIndex];

      const newLesson: Lesson = {
        ...newLessonData,
        id: newId,
        number: newNumber,
        status: 'locked',
        position,
      };

      return [...prev, newLesson];
    });
  }, []);

  const updateLessonStatus = useCallback((lessonId: number, status: Lesson['status']) => {
    setLessons(prev => 
      prev.map(lesson => 
        lesson.id === lessonId ? { ...lesson, status } : lesson
      )
    );
  }, []);

  const getPlaygroundLessons = useCallback(() => {
    return lessons.filter(l => l.system === 'playground');
  }, [lessons]);

  return (
    <LessonContext.Provider value={{ lessons, addLesson, updateLessonStatus, getPlaygroundLessons }}>
      {children}
    </LessonContext.Provider>
  );
};

export const useLessonContext = () => {
  const context = useContext(LessonContext);
  if (context === undefined) {
    throw new Error('useLessonContext must be used within a LessonProvider');
  }
  return context;
};
