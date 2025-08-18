export interface Media {
  type: 'image' | 'video' | 'audio';
  url: string;
  alt?: string;
  autoplay?: boolean;
}

export interface Option {
  id: string;
  text: string;
  image?: string;
  isCorrect?: boolean;
}

export interface Slide {
  id: string;
  type: SlideType;
  prompt: string;
  instructions?: string;
  media?: Media;
  options?: Option[];
  correct?: string | string[];
  timeLimit?: number;
  accessibility?: {
    screenReaderText?: string;
    highContrast?: boolean;
    largeText?: boolean;
  };
}

export type SlideType = 
  | 'warmup'
  | 'target_language'
  | 'sentence_builder'
  | 'pronunciation_shadow'
  | 'accuracy_mcq'
  | 'transform'
  | 'error_fix'
  | 'micro_input'
  | 'communicative_task'
  | 'fluency_sprint'
  | 'exit_check'
  | 'picture_choice'
  | 'labeling'
  | 'tpr_phonics';

export interface LessonSlides {
  version: '2.0';
  theme: 'mist-blue' | 'sage-sand' | 'default';
  slides: Slide[];
  durationMin: number;
  metadata: {
    CEFR: string;
    module: number;
    lesson: number;
    targets: string[];
    weights: {
      accuracy: number;
      fluency: number;
    };
  };
}

export interface ActivityResult {
  itemId: string;
  correct: boolean;
  timeMs: number;
  attempts: number;
  tags: string[];
  cefr: string;
  accuracyPercent?: number;
  fluency?: {
    secondsSpoken?: number;
    wpm?: number;
    hesitations?: number;
  };
}