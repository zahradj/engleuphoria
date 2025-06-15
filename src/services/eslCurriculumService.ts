import { faker } from '@faker-js/faker';

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
      type: type,
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

export const eslCurriculumService = {
  generateRandomGameElements,
  generateAgeAppropriateGameElements,
};
