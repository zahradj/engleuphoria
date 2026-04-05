export type HubType = 'playground' | 'academy' | 'professional';

export interface WizardFormData {
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  ageGroup: 'kids' | 'teens' | 'adults';
  hub?: HubType;
}

export type MediaType = 'illustration' | 'cartoon' | '3d_render' | 'cyber_aesthetic' | 'real_photography';
export type AnimationType = 'bounce' | 'zoom_in' | 'wiggle' | 'smooth_slide' | 'fade_up' | 'none';
export type ActivityType = 'drag_and_drop' | 'match_pictures' | 'fill_in_blanks' | 'match_terms' | 'multiple_choice' | 'case_study_input' | 'advanced_fill_blanks';

export interface GeneratedSlide {
  id: string;
  order: number;
  phase: 'presentation' | 'practice' | 'production';
  phaseLabel: string;
  slideType: 'hook' | 'vocabulary' | 'core_concept' | 'activity' | 'summary' | 'warmup' | 'dialogue' | 'game' | 'speaking' | 'creative' | 'review' | 'goodbye';
  type: 'title' | 'vocabulary' | 'matching' | 'fill-blank' | 'roleplay' | 'image' | 'quiz' | 'drag-drop' | 'sorting';
  title: string;
  imageUrl?: string;
  imageKeywords?: string;
  mediaPrompt?: string;
  mediaType?: MediaType;
  animation?: AnimationType;
  activityType?: ActivityType;
  content?: {
    word?: string;
    definition?: string;
    sentence?: string;
    blankWord?: string;
    matchPairs?: Array<{ word: string; image: string }>;
    prompt?: string;
    quizQuestion?: string;
    quizOptions?: Array<{ text: string; isCorrect: boolean }>;
    options?: string[];
    correctAnswer?: string;
    dragItems?: Array<{ text: string; target: string }>;
    caseStudy?: string;
  };
  teacherNotes: string;
  keywords: string[];
}

export interface LessonMeta {
  title: string;
  hub: HubType;
  level: string;
  estimatedMinutes: number;
}

export interface PPPLessonPlan {
  lessonMeta: LessonMeta;
  topic: string;
  level: string;
  ageGroup: string;
  slides: GeneratedSlide[];
  generatedAt: string;
}
