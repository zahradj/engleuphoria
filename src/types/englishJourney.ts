export interface CurriculumStage {
  id: number;
  name: string;
  theme: string;
  cefrLevel: string;
  ageGroup: string;
  bookReferences: string[];
  focus: string;
  goal: string;
  units: Unit[];
  totalDuration: number;
  color: string;
  icon: string;
}

export interface Unit {
  id: string;
  unitNumber: number;
  topic: string;
  keyVocabulary: string[];
  grammarFocus: string[];
  functionLanguage: string[];
  goal: string;
  
  listening: ActivityDetail;
  speaking: ActivityDetail;
  reading: ActivityDetail;
  writing: ActivityDetail;
  
  presentation: PPPPhase;
  practice: PPPPhase;
  production: PPPPhase;
  
  gamesActivities: GameActivity[];
  xpReward: number;
  badges: string[];
  
  estimatedDuration: number;
  materials: Material[];
  teacherNotes: string;
}

export interface ActivityDetail {
  description: string;
  tasks: string[];
  duration: number;
}

export interface PPPPhase {
  duration: number;
  activities: string[];
  materials: string[];
  teacherInstructions: string;
}

export interface GameActivity {
  id: string;
  name: string;
  type: 'drag-drop' | 'memory' | 'matching' | 'quiz' | 'role-play' | 'interactive';
  description: string;
  duration: number;
}

export interface Material {
  id: string;
  name: string;
  type: 'flashcard' | 'worksheet' | 'audio' | 'video' | 'interactive' | 'pdf';
  url?: string;
  downloadable: boolean;
}

export interface StudentProgress {
  studentId: string;
  currentStage: number;
  completedUnits: string[];
  totalXP: number;
  earnedBadges: string[];
  skillProgress: {
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
  };
}
