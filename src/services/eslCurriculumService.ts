
import { faker } from '@faker-js/faker';
import { ESLLevel, ESLSkill, AITemplate, ESLMaterial } from '@/types/eslCurriculum';

interface GameElement {
  id: string;
  type: 'points' | 'sticker' | 'certificate';
  value: number;
  description: string;
}

const generateRandomGameElements = (count: number): GameElement[] => {
  const elements: GameElement[] = [];
  for (let i = 0; i < count; i++) {
    const type = faker.helpers.arrayElement(['points', 'sticker', 'certificate']);
    elements.push({
      id: faker.string.uuid(),
      type: type as 'points' | 'sticker' | 'certificate',
      value: faker.number.int({ min: 5, max: 50 }),
      description: faker.lorem.sentence(),
    });
  }
  return elements;
};

const generateAgeAppropriateGameElements = (ageGroup: string) => {
  const baseElements = [
    { id: 'word-match', type: 'points' as const, value: 10, description: 'Match words with pictures' },
    { id: 'sentence-build', type: 'points' as const, value: 15, description: 'Build simple sentences' },
    { id: 'vocabulary-quiz', type: 'points' as const, value: 20, description: 'Vocabulary quiz' }
  ];

  switch (ageGroup) {
    case 'young':
      return [
        ...baseElements,
        { id: 'star-sticker', type: 'sticker' as const, value: 1, description: 'Colorful star sticker' },
        { id: 'animal-sticker', type: 'sticker' as const, value: 1, description: 'Cute animal sticker' }
      ];
    case 'teen':
      return [
        ...baseElements,
        { id: 'achievement-badge', type: 'certificate' as const, value: 1, description: 'Achievement certificate' },
        { id: 'progress-certificate', type: 'certificate' as const, value: 1, description: 'Progress certificate' }
      ];
    default:
      return baseElements;
  }
};

// Mock ESL Levels data
const mockESLLevels: ESLLevel[] = [
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

// Mock AI Templates
const mockAITemplates: AITemplate[] = [
  {
    id: 'vocab-worksheet',
    name: 'Vocabulary Worksheet Generator',
    type: 'worksheet',
    prompt: 'Generate a vocabulary worksheet for {topic} at {level} level',
    parameters: [
      {
        name: 'topic',
        type: 'text',
        required: true,
        description: 'The vocabulary topic (e.g., animals, food, family)',
        ageDependent: false
      },
      {
        name: 'level',
        type: 'select',
        required: true,
        options: ['A1', 'A2', 'B1', 'B2'],
        description: 'CEFR level for the worksheet',
        ageDependent: false
      },
      {
        name: 'question_count',
        type: 'number',
        required: false,
        defaultValue: 10,
        description: 'Number of questions to generate'
      }
    ],
    outputFormat: 'PDF worksheet with answer key',
    estimatedGenerationTime: 5,
    ageGroups: ['children', 'teens', 'adults'],
    minAge: 6,
    maxAge: 18
  },
  {
    id: 'dialogue-creator',
    name: 'Dialogue Creator',
    type: 'dialogue',
    prompt: 'Create a dialogue about {scenario} for {level} level students',
    parameters: [
      {
        name: 'scenario',
        type: 'select',
        required: true,
        options: ['restaurant', 'shopping', 'travel', 'school', 'family'],
        description: 'Conversation scenario',
        ageDependent: true
      },
      {
        name: 'level',
        type: 'select',
        required: true,
        options: ['A1', 'A2', 'B1', 'B2'],
        description: 'CEFR level for the dialogue'
      }
    ],
    outputFormat: 'Interactive dialogue with audio',
    estimatedGenerationTime: 8,
    ageGroups: ['children', 'teens'],
    minAge: 8,
    maxAge: 16
  }
];

// Mock Badge System
const mockBadgeSystem = {
  skillMasteryBadges: [
    {
      id: 'vocab-master',
      name: 'Vocabulary Master',
      description: 'Complete 50 vocabulary exercises',
      xpValue: 100,
      category: 'skill_mastery'
    },
    {
      id: 'grammar-guru',
      name: 'Grammar Guru',
      description: 'Master all A1 grammar points',
      xpValue: 150,
      category: 'skill_mastery'
    },
    {
      id: 'speaking-star',
      name: 'Speaking Star',
      description: 'Complete 25 speaking activities',
      xpValue: 120,
      category: 'skill_mastery'
    }
  ],
  streakBadges: [
    {
      id: 'week-warrior',
      name: 'Week Warrior',
      description: 'Study for 7 consecutive days',
      xpValue: 75,
      category: 'streak'
    },
    {
      id: 'month-master',
      name: 'Month Master',
      description: 'Study for 30 consecutive days',
      xpValue: 200,
      category: 'streak'
    }
  ],
  completionBadges: [
    {
      id: 'level-finisher',
      name: 'Level Finisher',
      description: 'Complete an entire CEFR level',
      xpValue: 250,
      category: 'completion'
    },
    {
      id: 'perfect-score',
      name: 'Perfect Score',
      description: 'Get 100% on 10 assessments',
      xpValue: 180,
      category: 'completion'
    }
  ]
};

const getAllLevels = (): ESLLevel[] => {
  return mockESLLevels;
};

const getAITemplates = (): AITemplate[] => {
  return mockAITemplates;
};

const getBadgeSystem = () => {
  return mockBadgeSystem;
};

const generateAIContent = async (templateId: string, parameters: Record<string, any>): Promise<ESLMaterial> => {
  // Simulate AI content generation
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const template = mockAITemplates.find(t => t.id === templateId);
  const level = mockESLLevels.find(l => l.cefrLevel === parameters.level) || mockESLLevels[0];
  
  return {
    id: faker.string.uuid(),
    title: `Generated ${template?.name || 'Material'}: ${parameters.topic || 'General'}`,
    description: `AI-generated content for ${parameters.topic || 'general learning'} at ${parameters.level || 'A1'} level`,
    type: template?.type || 'worksheet',
    level: level,
    skills: level.skills,
    duration: faker.number.int({ min: 15, max: 45 }),
    xpReward: faker.number.int({ min: 20, max: 100 }),
    difficultyRating: faker.number.int({ min: 1, max: 5 }),
    isAIGenerated: true,
    ageAppropriate: true,
    gamificationElements: generateRandomGameElements(3),
    content: {
      generatedWith: templateId,
      parameters: parameters
    },
    createdAt: new Date(),
    lastModified: new Date()
  };
};

export const eslCurriculumService = {
  generateRandomGameElements,
  generateAgeAppropriateGameElements,
  getAllLevels,
  getAITemplates,
  getBadgeSystem,
  generateAIContent,
};
