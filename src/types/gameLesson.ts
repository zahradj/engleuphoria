export interface GameLessonSlide {
  slide_type: 'text_input' | 'feelings_match' | 'listen_repeat' | 'character_introduction' | 'celebration' | 'vocabulary_preview' | 'picture_choice' | 'pronunciation_shadow' | 'quiz' | 'drawing_canvas' | 'dialogue_builder';
  prompt?: string;
  instructions?: string;
  phrases?: string[];
  pairs?: Array<{ emoji: string; word: string }>;
  character?: {
    name: string;
    dialogue: string;
  };
  stars?: number;
  confetti?: boolean;
  finalScore?: boolean;
  nextLesson?: string;
  onNameSubmit?: (name: string) => void;
  // Quiz specific
  options?: string[];
  correctAnswer?: string;
  // Celebration specific
  score?: number;
  studentName?: string;
  lessonTitle?: string;
  // Drawing canvas specific
  onSaveDrawing?: (imageData: string) => void;
  // Dialogue builder specific
  characterImage?: string;
  characterGreeting?: string;
}

export interface GameLessonData {
  version: '2.0';
  theme: 'game';
  durationMin: number;
  slides: GameLessonSlide[];
  metadata: {
    CEFR: string;
    ageGroup: string;
    characters?: any[];
    story_theme?: string;
    learning_objectives?: string[];
    vocabulary?: any[];
  };
}
