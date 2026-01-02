export interface WizardFormData {
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  ageGroup: 'kids' | 'teens' | 'adults';
}

export interface GeneratedSlide {
  id: string;
  order: number;
  phase: 'presentation' | 'practice' | 'production';
  phaseLabel: string;
  type: 'title' | 'vocabulary' | 'matching' | 'fill-blank' | 'roleplay' | 'image' | 'quiz';
  title: string;
  imageUrl?: string;
  imageKeywords?: string;
  content?: {
    word?: string;
    definition?: string;
    sentence?: string;
    blankWord?: string;
    matchPairs?: Array<{ word: string; image: string }>;
    prompt?: string;
    quizQuestion?: string;
    quizOptions?: Array<{ text: string; isCorrect: boolean }>;
  };
  teacherNotes: string;
  keywords: string[];
}

export interface PPPLessonPlan {
  topic: string;
  level: string;
  ageGroup: string;
  slides: GeneratedSlide[];
  generatedAt: string;
}
