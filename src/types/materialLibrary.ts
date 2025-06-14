
export interface Material {
  id: string;
  title: string;
  description: string;
  type: 'worksheet' | 'activity' | 'reading' | 'audio' | 'video' | 'game' | 'ai-generated';
  level: 'beginner' | 'intermediate' | 'advanced';
  subject: string;
  topic: string;
  duration: number; // in minutes
  content?: any;
  url?: string;
  thumbnailUrl?: string;
  createdBy: 'teacher' | 'student' | 'ai';
  createdAt: Date;
  lastModified: Date;
  tags: string[];
  downloads: number;
  rating: number;
  isPublic: boolean;
  isAIGenerated?: boolean;
}

export interface MaterialFilter {
  type?: string;
  level?: string;
  subject?: string;
  createdBy?: string;
  search?: string;
}

export interface AIGenerationRequest {
  type: 'worksheet' | 'activity' | 'quiz' | 'flashcards';
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  specificRequirements?: string;
}
