
// Main service that re-exports all ESL curriculum functionality
export { generateRandomGameElements, generateAgeAppropriateGameElements } from './gameElementsService';
export { getAllLevels } from './eslLevelsService';
export { getAITemplates, generateAIContent } from './aiTemplatesService';
export { getBadgeSystem } from './badgeSystemService';

// Import services for the aggregate object
import { generateRandomGameElements, generateAgeAppropriateGameElements } from './gameElementsService';
import { getAllLevels } from './eslLevelsService';
import { getAITemplates, generateAIContent } from './aiTemplatesService';
import { getBadgeSystem } from './badgeSystemService';

// Aggregate service object for backward compatibility
export const eslCurriculumService = {
  generateRandomGameElements,
  generateAgeAppropriateGameElements,
  getAllLevels,
  getAITemplates,
  getBadgeSystem,
  generateAIContent,
};
