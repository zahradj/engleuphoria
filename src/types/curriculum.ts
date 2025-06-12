
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
  duration: number; // minutes
  description: string;
  url?: string;
  content?: any;
  tags: string[];
  embedding?: number[]; // for AI similarity search
}

export interface LessonPlan {
  objective: string;
  resources: { id: string; type: string }[];
  nlpAnchor: string;
  criticalThinking: string;
  homework: string;
  xpReward: number;
}

export interface WeeklyPlan {
  theme: string;
  lessons: LessonPlan[];
}

export interface CurriculumPlan {
  id: string;
  studentId: string;
  weeks: WeeklyPlan[];
  badgeRule: string;
  createdAt: Date;
  status: 'draft' | 'active' | 'completed';
  teacherNotes?: string;
}

export interface PlannerRequest {
  studentProfile: StudentProfile;
  availableResources: Resource[];
  weekCount?: number;
}

export interface PlannerResponse {
  success: boolean;
  plan?: CurriculumPlan;
  error?: string;
}
