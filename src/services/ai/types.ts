
export interface AIContentRequest {
  type: 'worksheet' | 'activity' | 'lesson_plan' | 'quiz' | 'flashcards';
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  specificRequirements?: string;
  studentAge?: string;
  learningObjectives?: string[];
}

export interface AIGeneratedContent {
  id: string;
  title: string;
  type: string;
  topic: string;
  level: string;
  duration: number;
  content: string;
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
