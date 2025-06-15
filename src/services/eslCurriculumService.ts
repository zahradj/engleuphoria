
// Main service that re-exports all ESL curriculum functionality
export { generateRandomGameElements, generateAgeAppropriateGameElements } from './gameElementsService';
export { getAllLevels } from './eslLevelsService';
export { getAITemplates, generateAIContent } from './aiTemplatesService';
export { getBadgeSystem } from './badgeSystemService';

// Aggregate service object for backward compatibility
export const eslCurriculumService = {
  generateRandomGameElements: require('./gameElementsService').generateRandomGameElements,
  generateAgeAppropriateGameElements: require('./gameElementsService').generateAgeAppropriateGameElements,
  getAllLevels: require('./eslLevelsService').getAllLevels,
  getAITemplates: require('./aiTemplatesService').getAITemplates,
  getBadgeSystem: require('./badgeSystemService').getBadgeSystem,
  generateAIContent: require('./aiTemplatesService').generateAIContent,
};
