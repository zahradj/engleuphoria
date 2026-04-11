export type HubType = 'playground' | 'academy' | 'professional';

export interface WizardFormData {
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  ageGroup: 'kids' | 'teens' | 'adults';
  hub?: HubType;
  lessonPrompt?: string;
}

export type MediaType = 'illustration' | 'cartoon' | '3d_render' | 'cyber_aesthetic' | 'real_photography';
export type AnimationType = 'bounce' | 'zoom_in' | 'wiggle' | 'smooth_slide' | 'fade_up' | 'none' | 'float' | 'glitch' | 'slide_fast' | 'neon_pulse';
export type ActivityType =
  | 'drag_and_drop' | 'match_pictures' | 'fill_in_blanks' | 'match_terms' | 'multiple_choice'
  | 'case_study_input' | 'advanced_fill_blanks'
  | 'drag_and_drop_image' | 'match_sound_to_picture' | 'pop_the_word_bubble'
  | 'sentence_unscramble' | 'speed_quiz'
  | 'case_study_analysis' | 'business_email_reply' | 'vocabulary_expansion'
  | 'word_bank' | 'visual_dictation' | 'time_attack' | 'executive_choice';

export type SlideLayout = 'split' | 'centered' | 'bento';

export interface SlideVisuals {
  image_prompt: string;
  animation_style: AnimationType;
  layout: SlideLayout;
}

export interface SlideInteraction {
  type: string;
  data: {
    question?: string;
    options?: string[];
    correct_answer?: string;
    scrambled_words?: string[];
    email_scenario?: string;
  };
}

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
  visuals?: SlideVisuals;
  interaction?: SlideInteraction;
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
    // Practice layer fields
    title?: string;
    imageUrl?: string;
    phonemeTarget?: string;
    targetLetterIndex?: number;
    distractors?: string[];
    oddOneOutCards?: Array<{ word: string; emoji: string; isOdd: boolean }>;
    grammarPattern?: string;
    grammarSlots?: Array<{ label: string; correctAnswer: string; filled: string | null }>;
    grammarBlocks?: string[];
    originalSentence?: string;
    transformType?: string;
    correctTransform?: string[];
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
