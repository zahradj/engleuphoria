
export interface StudentProfile {
  id: string;
  name: string;
  age: number;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  strengths: string[];
  gaps: string[];
  learningStyle: 'Visual' | 'Auditory' | 'Kinesthetic' | 'Mixed';
  interests: string[];
  weeklyMinutes: number;
  longTermGoal: string;
  parentContact: {
    email: string;
    phone?: string;
  };
  diagnosticResults?: {
    vocabulary: number;
    grammar: number;
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
  };
  currentXP: number;
  badges: string[];
  nlefpProgress?: {
    completedModules: number[];
    currentModule: number;
    progressWeeksCompleted: number;
    portfolioTasks: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Resource {
  id: string;
  title: string;
  type: 'worksheet' | 'game' | 'video' | 'audio' | 'interactive';
  cefrLevel: string;
  skillFocus: string[];
  theme: string;
  duration: number;
  description: string;
  url?: string;
  content?: {
    exercises?: any[];
    nlpAnchor?: string;
    criticalThinking?: string;
    vakElements?: {
      visual: string;
      auditory: string;
      kinesthetic: string;
    };
    metacognition?: string;
    [key: string]: any;
  };
  tags: string[];
  embedding?: number[];
  nlefpModule?: number;
}

export interface LessonPlan {
  objective: string;
  resources: { id: string; type: string }[];
  nlpAnchor: string;
  criticalThinking: string;
  homework: string;
  xpReward: number;
  lessonStructure?: {
    welcomeRitual: string;
    warmUpHook: string;
    presentation: string;
    practice: string;
    production: string;
    reviewReflect: string;
  };
  vakElements?: {
    visual: string;
    auditory: string;
    kinesthetic: string;
  };
  metacognition?: string;
}

export interface WeeklyPlan {
  theme: string;
  isProgressWeek?: boolean;
  lessons: LessonPlan[];
  nlefpModule?: number;
}

export interface CurriculumPlan {
  id: string;
  studentId: string;
  weeks: WeeklyPlan[];
  badgeRule: string;
  createdAt: Date;
  status: 'draft' | 'active' | 'completed';
  teacherNotes?: string;
  metadata?: {
    framework?: 'NLEFP' | 'Traditional';
    progressTracking?: {
      skillsToTrack: string[];
      nlpAnchorsUsed: string[];
      metacognitionPrompts: string[];
    };
    nlpIntegration?: boolean;
  };
}

export interface PlannerRequest {
  studentProfile: StudentProfile;
  availableResources: Resource[];
  weekCount?: number;
  framework?: 'NLEFP' | 'Traditional';
}

export interface PlannerResponse {
  success: boolean;
  plan?: CurriculumPlan;
  error?: string;
}

export interface NLEFPProgress {
  studentId: string;
  moduleId: number;
  weekNumber: number;
  lessonNumber: number;
  skillsAssessed: {
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
    criticalThinking: number;
  };
  nlpAnchorsUsed: string[];
  metacognitionResponses: string[];
  portfolioItems: string[];
  xpEarned: number;
  badgesEarned: string[];
  completedAt: Date;
}
