export type AgeGroup = '5-7' | '8-11' | '12-14' | '15-17';
export type CEFRLevel = 'Pre-A1' | 'A1' | 'A2' | 'B1' | 'B2';
export type MaterialType = 'lesson' | 'worksheet' | 'activity' | 'assessment' | 'scope_sequence';
export type Category = 'lesson' | 'activity' | 'worksheet' | 'planning';
export type ECAMode = 'lesson' | 'unit' | 'curriculum' | 'assessment' | 'mission' | 'resource';

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

export interface CurriculumMaterial<T extends ECAContent = LessonContent> {
  id: string;
  title: string;
  mode?: ECAMode;
  ageGroup: AgeGroup;
  cefrLevel: CEFRLevel;
  materialType: MaterialType;
  durationMinutes: number;
  learningObjectives: string[];
  targetLanguage: {
    grammar: string[];
    vocabulary: string[];
  };
  content: T;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuickActionButton {
  id: string;
  ageGroup: AgeGroup;
  mode: ECAMode;
  buttonLabel: string;
  promptText: string;
  category: string;
  orderIndex: number;
  icon: string;
}

export interface ECATemplate {
  id: string;
  templateName: string;
  templateType: ECAMode;
  ageGroup: AgeGroup;
  cefrLevel: CEFRLevel;
  description: string;
  templateStructure: any;
  useCount: number;
  createdAt: Date;
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

// Unit Content Types
export interface UnitLesson {
  weekNumber: number;
  lessonNumber: number;
  title: string;
  objectives: string[];
  activities: string[];
}

export interface UnitContent {
  unitTitle: string;
  ageGroup: AgeGroup;
  cefrLevel: CEFRLevel;
  durationWeeks: number;
  overallObjectives: string[];
  grammarProgression: string[];
  vocabularyThemes: string[];
  lessons: UnitLesson[];
  unitAssessment: {
    formative: string[];
    summative: string;
  };
  resources: string[];
  teacherNotes: string;
}

// Curriculum Content Types
export interface CurriculumUnit {
  unitNumber: number;
  title: string;
  weeks: number;
  cefrLevel: string;
  focusAreas: string[];
}

export interface AssessmentSchedule {
  week: number;
  type: string;
  focus: string;
}

export interface CurriculumContent {
  curriculumTitle: string;
  ageGroup: AgeGroup;
  startCEFR: CEFRLevel;
  endCEFR: CEFRLevel;
  durationMonths: number;
  overarchingGoals: string[];
  units: CurriculumUnit[];
  assessmentSchedule: AssessmentSchedule[];
  progressionMap: {
    grammar: string[];
    vocabulary: string[];
    skills: string[];
  };
  resourceRequirements: string[];
  implementationGuide: string;
}

// Assessment Content Types
export interface AssessmentQuestion {
  questionNumber: number;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'fill_blank' | 'short_answer' | 'essay';
  options?: string[];
  correctAnswer: string;
  points: number;
  cefrLevel: string;
}

export interface AssessmentSection {
  sectionName: string;
  skillArea: 'reading' | 'writing' | 'listening' | 'speaking' | 'grammar' | 'vocabulary';
  questions: AssessmentQuestion[];
}

export interface AssessmentRubric {
  criteria: Array<{
    criterion: string;
    levels: string[];
  }>;
}

export interface AssessmentContent {
  assessmentTitle: string;
  assessmentType: 'placement' | 'progress' | 'final';
  ageGroup: AgeGroup;
  cefrLevel: CEFRLevel;
  duration: number;
  sections: AssessmentSection[];
  rubric: AssessmentRubric;
  answerKey: string;
  scoringGuide: string;
  teacherInstructions: string;
}

// Mission Content Types
export interface MissionQuest {
  questNumber: number;
  questTitle: string;
  questDescription: string;
  objectives: string[];
  activities: string[];
  xpReward: number;
  badgeUnlocked: string;
}

export interface MissionContent {
  missionTitle: string;
  missionNarrative: string;
  ageGroup: AgeGroup;
  cefrLevel: CEFRLevel;
  totalQuests: number;
  estimatedWeeks: number;
  quests: MissionQuest[];
  finalBoss: {
    challengeName: string;
    description: string;
    requirements: string[];
  };
  rewardStructure: {
    xpPerQuest: number;
    badges: string[];
    finalReward: string;
  };
  gamificationElements: string[];
}

// Resource Content Types
export interface ResourceContent {
  resourceTitle: string;
  resourceType: 'worksheet' | 'reading' | 'listening' | 'flashcards';
  ageGroup: AgeGroup;
  cefrLevel: CEFRLevel;
  topic: string;
  objectives: string[];
  content: any;
  answerKey: string;
  teacherNotes: string;
  extensionActivities: string[];
}

// Union type for all content
export type ECAContent = 
  | LessonContent 
  | UnitContent 
  | CurriculumContent 
  | AssessmentContent 
  | MissionContent 
  | ResourceContent;

export interface GenerationParams {
  mode: ECAMode;
  prompt: string;
  ageGroup?: AgeGroup;
  cefrLevel?: CEFRLevel;
  duration?: number;
  topic?: string;
  grammarFocus?: string;
  vocabularyTheme?: string;
  
  // Mode-specific params
  unitWeeks?: number;
  curriculumMonths?: number;
  assessmentType?: 'placement' | 'progress' | 'final';
  missionChainLength?: number;
  resourceType?: 'worksheet' | 'reading' | 'listening' | 'flashcards';
  templateId?: string;
}