
import { faker } from '@faker-js/faker';
import { GameElement } from '@/types/eslCurriculum';

export const generateRandomGameElements = (count: number): GameElement[] => {
  const elements: GameElement[] = [];
  for (let i = 0; i < count; i++) {
    const type = faker.helpers.arrayElement(['points', 'badge', 'achievement', 'leaderboard', 'progress_bar', 'mini_game', 'sticker', 'certificate']);
    elements.push({
      id: faker.string.uuid(),
      type: type as 'points' | 'badge' | 'achievement' | 'leaderboard' | 'progress_bar' | 'mini_game' | 'sticker' | 'certificate',
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      value: faker.number.int({ min: 5, max: 50 }),
      ageAppropriate: true,
    });
  }
  return elements;
};

export const generateAgeAppropriateGameElements = (ageGroup: string): GameElement[] => {
  const baseElements: GameElement[] = [
    { id: 'word-match', type: 'points', name: 'Word Match', value: 10, description: 'Match words with pictures', ageAppropriate: true },
    { id: 'sentence-build', type: 'points', name: 'Sentence Builder', value: 15, description: 'Build simple sentences', ageAppropriate: true },
    { id: 'vocabulary-quiz', type: 'points', name: 'Vocabulary Quiz', value: 20, description: 'Vocabulary quiz', ageAppropriate: true }
  ];

  switch (ageGroup) {
    case 'young':
      return [
        ...baseElements,
        { id: 'star-sticker', type: 'sticker', name: 'Star Sticker', value: 1, description: 'Colorful star sticker', ageAppropriate: true },
        { id: 'animal-sticker', type: 'sticker', name: 'Animal Sticker', value: 1, description: 'Cute animal sticker', ageAppropriate: true }
      ];
    case 'teen':
      return [
        ...baseElements,
        { id: 'achievement-badge', type: 'certificate', name: 'Achievement Badge', value: 1, description: 'Achievement certificate', ageAppropriate: true },
        { id: 'progress-certificate', type: 'certificate', name: 'Progress Certificate', value: 1, description: 'Progress certificate', ageAppropriate: true }
      ];
    default:
      return baseElements;
  }
};
