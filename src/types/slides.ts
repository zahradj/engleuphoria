export interface Media {
  type: 'image' | 'video' | 'audio';
  url: string;
  alt?: string;
  autoplay?: boolean;
  imagePrompt?: string;
  autoGenerate?: boolean;
}

export interface AudioConfig {
  text: string;
  autoGenerate?: boolean;
  url?: string;
}

export interface Option {
  id: string;
  text: string;
  image?: string;
  isCorrect?: boolean;
}

export interface MatchPair {
  id: string;
  left: string;
  right: string;
  leftImage?: string;
  rightImage?: string;
}

export interface DragDropItem {
  id: string;
  text: string;
  targetId: string;
  image?: string;
}

export interface DragDropTarget {
  id: string;
  text: string;
  acceptsItemIds: string[];
  image?: string;
}

export interface ClozeGap {
  id: string;
  correctAnswers: string[];
  options?: string[];
}

export interface Slide {
  id: string;
  type: SlideType;
  prompt: string;
  instructions?: string;
  media?: Media;
  audio?: AudioConfig;
  options?: Option[];
  correct?: string | string[];
  timeLimit?: number;
  accessibility?: {
    screenReaderText?: string;
    highContrast?: boolean;
    largeText?: boolean;
  };
  // Interactive activity data
  matchPairs?: MatchPair[];
  dragDropItems?: DragDropItem[];
  dragDropTargets?: DragDropTarget[];
  clozeText?: string;
  clozeGaps?: ClozeGap[];
  // Canva integration
  canvaDesignId?: string;
  canvaEmbedUrl?: string;
  canvaViewUrl?: string;
  // Slide ordering and management
  orderIndex?: number;
  isLocked?: boolean;
  duration?: number;
  // Game mechanics
  gameConfig?: {
    theme: 'space' | 'ocean' | 'forest' | 'playground' | 'fantasy';
    difficulty: 'easy' | 'medium' | 'hard';
    targetScore?: number;
    lives?: number;
    timeBonus?: boolean;
    powerUps?: boolean;
    soundEffects?: boolean;
    backgroundMusic?: boolean;
  };
  vocabulary?: string[];
  gameWords?: string[];
}

export type SlideType = 
  | 'warmup'
  | 'vocabulary_preview'
  | 'target_language'
  | 'listening_comprehension'
  | 'sentence_builder'
  | 'pronunciation_shadow'
  | 'grammar_focus'
  | 'accuracy_mcq'
  | 'transform'
  | 'error_fix'
  | 'picture_description'
  | 'controlled_practice'
  | 'controlled_output'
  | 'micro_input'
  | 'roleplay_setup'
  | 'communicative_task'
  | 'fluency_sprint'
  | 'review_consolidation'
  | 'exit_check'
  | 'picture_choice'
  | 'labeling'
  | 'tpr_phonics'
  | 'match'
  | 'drag_drop'
  | 'cloze'
  | 'canva_embed'
  | 'canva_link'
  // Interactive Game Types
  | 'fast_match'
  | 'memory_flip'
  | 'spelling_race'
  | 'word_rain'
  | 'bubble_pop'
  | 'treasure_hunt'
  // Quiz Types
  | 'quiz_match_pairs'
  | 'quiz_multiple_choice'
  | 'quiz_drag_drop';

export interface LessonSlides {
  version: '2.0';
  theme: 'mist-blue' | 'sage-sand' | 'default';
  slides: Slide[];
  durationMin: number;
  total_slides?: number;
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
  // Enhanced slide management
  slideOrder?: string[];
  lastModified?: string;
  canvaIntegration?: {
    projectId?: string;
    sharedUrl?: string;
    editUrl?: string;
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