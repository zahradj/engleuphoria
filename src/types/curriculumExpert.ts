export type AgeGroup = '5-7' | '8-11' | '12-14' | '15-17';
export type CEFRLevel = 'Pre-A1' | 'A1' | 'A2' | 'B1' | 'B2';
export type MaterialType = 'lesson' | 'worksheet' | 'activity' | 'assessment' | 'scope_sequence';
export type Category = 'lesson' | 'activity' | 'worksheet' | 'planning';

export interface LessonContent {
  materials: string;
  warmUp: string;
  presentation: string;
  controlledPractice: string;
  freerPractice: string;
  formativeAssessment: AssessmentItem[];
  differentiation: {
    easier: string[];
    harder: string[];
  };
  homework: string;
  teacherTips: string;
}

export interface AssessmentItem {
  question: string;
  answer: string;
}

export interface CurriculumMaterial {
  id: string;
  title: string;
  ageGroup: AgeGroup;
  cefrLevel: CEFRLevel;
  materialType: MaterialType;
  durationMinutes: number;
  learningObjectives: string[];
  targetLanguage: {
    grammar: string[];
    vocabulary: string[];
  };
  content: LessonContent;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuickActionButton {
  id: string;
  ageGroup: AgeGroup;
  buttonLabel: string;
  promptText: string;
  category: Category;
  orderIndex: number;
  icon: string;
}

export interface GrammarProgression {
  id: string;
  cefrLevel: CEFRLevel;
  ageRange: string;
  grammarPoints: string[];
  examples: Record<string, string>;
  createdAt: Date;
}

export interface VocabularyProgression {
  id: string;
  cefrLevel: CEFRLevel;
  ageRange: string;
  themes: string[];
  wordLists: Record<string, string[]>;
  createdAt: Date;
}

export interface GenerationParams {
  prompt: string;
  ageGroup?: AgeGroup;
  cefrLevel?: CEFRLevel;
  duration?: number;
  topic?: string;
  grammarFocus?: string;
  vocabularyTheme?: string;
}