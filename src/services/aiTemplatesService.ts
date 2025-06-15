
import { faker } from '@faker-js/faker';
import { AITemplate, ESLMaterial, ESLLevel } from '@/types/eslCurriculum';
import { mockESLLevels } from './eslLevelsService';
import { generateRandomGameElements } from './gameElementsService';

// Mock AI Templates
export const mockAITemplates: AITemplate[] = [
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
    type: 'activity',
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

export const getAITemplates = (): AITemplate[] => {
  return mockAITemplates;
};

export const generateAIContent = async (templateId: string, parameters: Record<string, any>): Promise<ESLMaterial> => {
  // Simulate AI content generation
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const template = mockAITemplates.find(t => t.id === templateId);
  const level = mockESLLevels.find(l => l.cefrLevel === parameters.level) || mockESLLevels[0];
  
  // Map template type to valid ESLMaterial type
  let materialType: ESLMaterial['type'] = 'worksheet';
  if (template?.type === 'activity') {
    materialType = 'activity';
  } else if (template?.type === 'lesson_plan') {
    materialType = 'lesson_plan';
  } else if (template?.type === 'story') {
    materialType = 'story';
  } else if (template?.type === 'song') {
    materialType = 'song';
  } else if (template?.type === 'game') {
    materialType = 'game';
  } else if (template?.type === 'exam_prep') {
    materialType = 'exam_prep';
  }
  
  return {
    id: faker.string.uuid(),
    title: `Generated ${template?.name || 'Material'}: ${parameters.topic || 'General'}`,
    description: `AI-generated content for ${parameters.topic || 'general learning'} at ${parameters.level || 'A1'} level`,
    type: materialType,
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
