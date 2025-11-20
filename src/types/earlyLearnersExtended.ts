// Extended types for Early Learners Library - 7 Component System

export interface PhonicsComponent {
  focusLetters: string[];
  focusSounds: string[];
  activities: PhonicsActivity[];
  song?: { lyrics: string; audioUrl?: string };
  chant?: { text: string; audioUrl?: string };
}

export interface PhonicsActivity {
  id: string;
  type: 'drag_drop_letters' | 'listening_exercise' | 'blending_game' | 'sound_matching';
  instructions: string;
  instructionAudioUrl?: string;
  items: Array<{
    id: string;
    content: string;
    imageUrl?: string;
    audioUrl?: string;
    targetId?: string;
  }>;
  correctAnswers: string[];
  imagePrompt?: string;
  imageUrl?: string;
}

export interface GrammarComponent {
  focusPoints: string[];
  activities: GrammarActivity[];
}

export interface GrammarActivity {
  id: string;
  type: 'gap_fill' | 'error_spotting' | 'sentence_creation';
  instructions: string;
  examples: Array<{
    sentence: string;
    imagePrompt?: string;
    imageUrl?: string;
    audioUrl?: string;
  }>;
  exercises: Array<{
    prompt: string;
    correctAnswer: string;
    hints: string[];
    imagePrompt?: string;
    imageUrl?: string;
  }>;
}

export interface VocabularyComponent {
  targetWords: VocabularyWord[];
  activities: VocabularyActivity[];
}

export interface VocabularyWord {
  word: string;
  definition: string;
  pronunciation: string;
  partOfSpeech: string;
  exampleSentence: string;
  imagePrompt: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface VocabularyActivity {
  id: string;
  type: 'matching' | 'flashcards' | 'word_maps' | 'mini_dialogue';
  instructions: string;
  items: Array<{
    id: string;
    content: string;
    imageUrl?: string;
    audioUrl?: string;
  }>;
}

export interface SpeakingComponent {
  activities: SpeakingActivity[];
  targetStructures: string[];
}

export interface SpeakingActivity {
  id: string;
  type: 'role_play' | 'interview' | 'discussion' | 'repetition';
  scenario: string;
  instructions: string;
  modelDialogue: Array<{
    speaker: string;
    text: string;
    audioUrl?: string;
  }>;
  visualSupport?: {
    imagePrompt: string;
    imageUrl?: string;
  };
  pointsForCompletion: number;
}

export interface WritingComponent {
  activities: WritingActivity[];
}

export interface WritingActivity {
  id: string;
  type: 'complete_sentence' | 'copy_words' | 'label_images' | 'write_paragraph';
  instructions: string;
  prompt: string;
  visualAids: Array<{
    imagePrompt: string;
    imageUrl?: string;
    label?: string;
  }>;
  scaffolding: string[];
  exampleAnswer?: string;
}

export interface ReadingComponent {
  preReading: {
    predictions: string[];
    keyVocabulary: string[];
    discussionQuestions: string[];
  };
  mainReading: {
    title: string;
    text: string;
    imagePrompts: string[];
    imageUrls?: string[];
    audioUrl?: string;
  };
  duringReading: ReadingQuestion[];
  postReading: {
    summaryPrompt: string;
    personalConnectionPrompts: string[];
    drawingActivity?: string;
  };
}

export interface ReadingQuestion {
  question: string;
  type: 'comprehension' | 'main_idea' | 'details' | 'inference';
  options?: string[];
  correctAnswer: string;
}

export interface ListeningComponent {
  preListening: {
    activationQuestions: string[];
    keyVocabulary: string[];
  };
  mainListening: {
    title: string;
    script: string;
    audioUrl?: string;
    imagePrompt?: string;
    imageUrl?: string;
  };
  whileListening: ListeningActivity[];
  postListening: {
    summaryPrompt: string;
    discussionQuestions: string[];
    retellActivity?: string;
  };
}

export interface ListeningActivity {
  id: string;
  type: 'questions' | 'fill_blanks' | 'chart_completion' | 'ordering';
  instructions: string;
  items: Array<{
    prompt: string;
    correctAnswer: string;
    options?: string[];
  }>;
}

export interface MultimediaManifest {
  totalImages: number;
  totalAudioFiles: number;
  images: Array<{
    id: string;
    prompt: string;
    url?: string;
    purpose: string;
    generationStatus: 'pending' | 'generating' | 'complete' | 'failed';
  }>;
  audioFiles: Array<{
    id: string;
    text: string;
    type: 'instruction' | 'pronunciation' | 'dialogue' | 'narration' | 'phonics';
    url?: string;
    generationStatus: 'pending' | 'generating' | 'complete' | 'failed';
  }>;
  generationProgress: number;
}

export interface LessonGamification {
  rewards: {
    starsPerActivity: number;
    totalStarsAvailable: number;
    badges: Array<{
      id: string;
      name: string;
      icon: string;
      condition: string;
    }>;
  };
  adaptiveFeatures: {
    difficultyAdjustment: boolean;
    hintsEnabled: boolean;
    encouragementMessages: string[];
  };
  celebrationAnimations: string[];
}

export interface CompleteEarlyLearnersLesson {
  id: string;
  title: string;
  topic: string;
  phonicsFocus: string;
  lessonNumber: number;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  learningObjectives: string[];
  durationMinutes: number;
  components: {
    phonics: PhonicsComponent;
    grammar: GrammarComponent;
    vocabulary: VocabularyComponent;
    speaking: SpeakingComponent;
    writing: WritingComponent;
    reading: ReadingComponent;
    listening: ListeningComponent;
  };
  multimedia: MultimediaManifest;
  gamification: LessonGamification;
  status: 'draft' | 'generating_multimedia' | 'complete' | 'published';
  createdAt: Date;
  updatedAt: Date;
}
