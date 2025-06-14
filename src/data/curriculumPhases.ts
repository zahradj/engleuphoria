
import { CurriculumPhase } from '@/types/curriculumTypes';

export const CURRICULUM_PHASES: CurriculumPhase[] = [
  {
    id: 1,
    name: "Foundation Building",
    description: "Sentence Construction Mastery",
    duration: 4,
    focus: "Basic sentence patterns and core vocabulary",
    skills: ["Subject-Verb construction", "Basic word order", "Present simple", "Core vocabulary"],
    sentenceComplexity: 'basic'
  },
  {
    id: 2,
    name: "Pattern Recognition",
    description: "Grammar Patterns as Building Blocks",
    duration: 4,
    focus: "Grammar pattern recognition and application",
    skills: ["Verb tenses", "Question formation", "Negatives", "Pattern recognition"],
    sentenceComplexity: 'intermediate'
  },
  {
    id: 3,
    name: "Contextual Application", 
    description: "Theme-Based Communication",
    duration: 8,
    focus: "Real-world communication contexts",
    skills: ["Descriptive language", "Time expressions", "Comparisons", "Complex descriptions"],
    sentenceComplexity: 'advanced'
  },
  {
    id: 4,
    name: "Advanced Integration",
    description: "Complex Communication",
    duration: 8,
    focus: "Sophisticated language use and complex thoughts",
    skills: ["Complex sentences", "Abstract concepts", "Argumentation", "Fluency"],
    sentenceComplexity: 'complex'
  }
];
