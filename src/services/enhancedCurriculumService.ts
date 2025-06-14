
// Re-export all types and services for backward compatibility
export type { CurriculumPhase, SentenceTemplate, ComprehensionStrategy } from '@/types/curriculumTypes';

// Re-export data
export { CURRICULUM_PHASES } from '@/data/curriculumPhases';
export { SENTENCE_TEMPLATES } from '@/data/sentenceTemplates';
export { COMPREHENSION_STRATEGIES } from '@/data/comprehensionStrategies';

// Re-export services
export { curriculumPlannerService } from '@/services/curriculumPlannerService';
export { progressTrackingService } from '@/services/progressTrackingService';
