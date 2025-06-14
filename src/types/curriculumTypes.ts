
export interface CurriculumPhase {
  id: number;
  name: string;
  description: string;
  duration: number; // weeks
  focus: string;
  skills: string[];
  sentenceComplexity: 'basic' | 'intermediate' | 'advanced' | 'complex';
}

export interface SentenceTemplate {
  id: string;
  level: number;
  pattern: string;
  example: string;
  visualAid: string;
  practiceExercises: string[];
}

export interface ComprehensionStrategy {
  id: string;
  name: string;
  description: string;
  technique: string;
  application: string;
  visualComponent: string;
}

export interface PhaseProgress {
  currentPhase: CurriculumPhase;
  nextPhase: CurriculumPhase | null;
  progressPercentage: number;
  skillsMastered: string[];
  nextSkills: string[];
}
