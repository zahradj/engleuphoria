
export interface AIContentRequest {
  type: 'worksheet' | 'activity' | 'lesson_plan' | 'quiz' | 'flashcards' | 'lesson' | 'phonics_lesson' | 'english_lesson';
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  specificRequirements?: string;
  studentAge?: string;
  ageGroup?: '5-7' | '8-12';
  cefrLevel?: 'Pre-A1' | 'A1' | 'A1+' | 'A2' | 'A2+' | 'B1';
  learningObjectives?: string[];
  objectives?: string[];
  requirements?: string;
  phonicsType?: 'letter_sounds' | 'blends' | 'digraphs' | 'short_vowels' | 'long_vowels';
}

export interface PhonicsLessonContent {
  title: string;
  objective: string;
  ageGroup: string;
  cefrLevel: string;
  warmup: {
    activity: string;
    duration: number;
    materials: string[];
  };
  mainActivity: {
    type: 'drag-drop' | 'matching' | 'listening' | 'blending';
    instructions: string;
    exercises: Array<{
      id: string;
      prompt: string;
      items: Array<{
        id: string;
        letter?: string;
        word?: string;
        image?: string;
        imagePrompt?: string;
        correctAnswer?: string;
      }>;
    }>;
    duration: number;
  };
  practice: {
    exercises: Array<{
      type: 'tracing' | 'repetition' | 'identification';
      content: string;
      items: any[];
    }>;
    duration: number;
  };
  assessment: {
    type: 'quiz' | 'interactive';
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      correctAnswer: string;
      adaptiveHint: string;
    }>;
    passingScore: number;
  };
  rewards: {
    badges: string[];
    motivationalMessages: string[];
  };
  teacherNotes: string[];
  vocabulary: string[];
  imagePrompt: string;
}

export interface AIGeneratedContent {
  id: string;
  title: string;
  type: string;
  topic: string;
  level: string;
  duration: number;
  content: string | any; // Allow both string and object content
  worksheet?: {
    title: string;
    content: string;
    answers: string;
    instructions: string;
  };
  activities?: {
    matchPairs?: Array<{
      id: string;
      left: string;
      right: string;
      leftImage?: string;
      rightImage?: string;
    }>;
    dragDropItems?: Array<{
      id: string;
      text: string;
      targetId: string;
      image?: string;
    }>;
    dragDropTargets?: Array<{
      id: string;
      text: string;
      acceptsItemIds: string[];
      image?: string;
    }>;
    clozeText?: string;
    clozeGaps?: Array<{
      id: string;
      correctAnswers: string[];
      options?: string[];
    }>;
  };
  vocabulary?: Array<{
    word: string;
    definition: string;
    example: string;
    imagePrompt: string;
    pronunciation: string;
    partOfSpeech: string;
  }>;
  slides?: Array<{
    id: string;
    type: string;
    prompt: string;
    instructions?: string;
    media?: {
      type: string;
      imagePrompt?: string;
    };
    options?: Array<{
      id: string;
      text: string;
      isCorrect?: boolean;
    }>;
    correct?: string;
  }>;
  phonicsLesson?: PhonicsLessonContent;
  metadata: {
    generatedAt: string;
    model?: string;
    isAIGenerated: boolean;
    generationTime?: number;
    isFallback?: boolean;
    fallbackReason?: string;
  };
}

export interface ContentLibraryItem extends AIGeneratedContent {
  downloads?: number;
  rating?: number;
  tags?: string[];
  isPublic?: boolean;
  createdBy?: string;
}
