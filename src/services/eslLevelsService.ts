
import { ESLLevel } from '@/types/eslCurriculum';

// Mock ESL Levels data
export const mockESLLevels: ESLLevel[] = [
  {
    id: 'pre-a1',
    name: 'True Beginner',
    cefrLevel: 'Pre-A1',
    ageGroup: 'Young Learners (4-7 years)',
    description: 'Complete beginners with no English knowledge',
    skills: [
      {
        id: 'basic-vocab',
        name: 'Basic Vocabulary',
        category: 'vocabulary',
        description: 'Learn basic words like colors, numbers, family',
        canStudentPractice: true,
        ageAppropriate: true,
        vocabularyThemes: ['colors', 'numbers', 'family']
      }
    ],
    xpRequired: 0,
    estimatedHours: 50,
    levelOrder: 1
  },
  {
    id: 'a1',
    name: 'Beginner',
    cefrLevel: 'A1',
    ageGroup: 'Elementary (6-9 years)',
    description: 'Basic everyday expressions and simple interactions',
    skills: [
      {
        id: 'simple-sentences',
        name: 'Simple Sentences',
        category: 'grammar',
        description: 'Form basic sentences with subject-verb-object',
        canStudentPractice: true,
        ageAppropriate: true,
        grammarPoints: ['present simple', 'basic word order']
      }
    ],
    xpRequired: 500,
    estimatedHours: 80,
    levelOrder: 2
  },
  {
    id: 'a2',
    name: 'Elementary',
    cefrLevel: 'A2',
    ageGroup: 'Elementary (8-11 years)',
    description: 'Understanding frequently used expressions',
    skills: [
      {
        id: 'past-tense',
        name: 'Past Tense',
        category: 'grammar',
        description: 'Learn simple past tense forms',
        canStudentPractice: true,
        ageAppropriate: true,
        grammarPoints: ['past simple', 'irregular verbs']
      }
    ],
    xpRequired: 1000,
    estimatedHours: 120,
    levelOrder: 3
  }
];

export const getAllLevels = (): ESLLevel[] => {
  return mockESLLevels;
};
