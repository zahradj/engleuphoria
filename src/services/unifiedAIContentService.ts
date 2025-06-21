import { supabase, isSupabaseConfigured } from '@/lib/supabase';

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
    isMockData?: boolean;
    generationTime?: number;
  };
}

export interface ContentLibraryItem extends AIGeneratedContent {
  downloads?: number;
  rating?: number;
  tags?: string[];
  isPublic?: boolean;
  createdBy?: string;
}

class UnifiedAIContentService {
  private contentLibrary: ContentLibraryItem[] = [];
  private isDemoMode: boolean;

  constructor() {
    this.isDemoMode = !isSupabaseConfigured();
    this.loadStoredContent();
  }

  async generateContent(request: AIContentRequest): Promise<AIGeneratedContent> {
    if (this.isDemoMode) {
      return this.generateMockContent(request);
    }

    const startTime = Date.now();

    try {
      // Add retry logic with exponential backoff
      let retries = 3;
      let delay = 1000;

      while (retries > 0) {
        try {
          const { data, error } = await supabase.functions.invoke('ai-content-generator', {
            body: request
          });

          if (error) {
            throw new Error(error.message || 'Failed to generate content');
          }

          const generatedContent = data.content;
          generatedContent.metadata.generationTime = Date.now() - startTime;
          this.addToLibrary(generatedContent);
          return generatedContent;
        } catch (error) {
          retries--;
          if (retries === 0) throw error;
          
          console.log(`Retrying in ${delay}ms... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        }
      }
    } catch (error) {
      console.error('Failed to generate AI content, falling back to mock:', error);
      return this.generateMockContent(request);
    }
  }

  private generateMockContent(request: AIContentRequest): AIGeneratedContent {
    const mockContent = this.createOptimizedMockContent(request);
    const generatedContent: AIGeneratedContent = {
      id: `mock_${Date.now()}`,
      title: `${request.type.charAt(0).toUpperCase() + request.type.slice(1).replace('_', ' ')}: ${request.topic}`,
      type: request.type,
      topic: request.topic,
      level: request.level,
      duration: request.duration || 30,
      content: mockContent,
      metadata: {
        generatedAt: new Date().toISOString(),
        isAIGenerated: true,
        isMockData: true,
        generationTime: 500 // Simulated fast generation
      }
    };

    this.addToLibrary(generatedContent);
    return generatedContent;
  }

  private createOptimizedMockContent(request: AIContentRequest): string {
    const { type, topic, level } = request;

    // Simplified mock content for faster generation
    const templates = {
      'worksheet': `# ${topic} Worksheet - ${level} Level

## Exercise 1: Vocabulary
Fill in the blanks with words related to ${topic}:
1. The _____ is very important for ${topic}.
2. When we talk about ${topic}, we should remember _____.

## Exercise 2: Multiple Choice
1. What is most important about ${topic}?
   a) Option A  b) Option B  c) Option C

## Answer Key
1. [Answer], 2. [Answer] | 1. c`,

      'quiz': `# ${topic} Quiz - ${level} Level

1. True/False: ${topic} is important in daily life.
2. What is the main purpose of ${topic}?
3. Give an example of ${topic} in your life.

## Answers
1. True, 2. [Main purpose], 3. [Example]`,

      'flashcards': `# ${topic} Flashcards - ${level} Level

**Card 1:** Basic | Definition: Fundamental concept
**Card 2:** Important | Definition: Having great value
**Card 3:** Useful | Definition: Helpful and practical

*Study these cards daily for best results!*`,

      'activity': `# ${topic} Activity - ${level} Level

## Materials: Paper, pencils
## Time: ${request.duration || 20} minutes

1. Warm-up (5 min): Discuss ${topic}
2. Main activity (10 min): Practice exercises
3. Wrap-up (5 min): Review key points`,

      'lesson_plan': `# ${topic} Lesson Plan - ${level} Level

## Objectives
- Understand basic concepts of ${topic}
- Use vocabulary related to ${topic}

## Activities (${request.duration || 60} min)
1. Introduction (10 min)
2. Main lesson (30 min)
3. Practice (15 min)
4. Review (5 min)`
    };

    return templates[type] || `# ${topic} Content - ${level} Level\n\nBasic content about ${topic}.`;
  }

  private addToLibrary(content: AIGeneratedContent) {
    const libraryItem: ContentLibraryItem = {
      ...content,
      downloads: 0,
      rating: 0,
      tags: [content.topic, content.level, content.type],
      isPublic: false,
      createdBy: 'ai'
    };

    this.contentLibrary.unshift(libraryItem);
    this.saveContentLibrary();
  }

  getContentLibrary(): ContentLibraryItem[] {
    return this.contentLibrary;
  }

  clearLibrary() {
    this.contentLibrary = [];
    this.saveContentLibrary();
  }

  exportContent(content: ContentLibraryItem): string {
    const dataStr = JSON.stringify(content, null, 2);
    return dataStr;
  }

  private loadStoredContent() {
    if (this.isDemoMode) {
      try {
        const stored = localStorage.getItem('ai_content_library');
        if (stored) {
          this.contentLibrary = JSON.parse(stored);
        }
      } catch (error) {
        console.error('Failed to load stored content:', error);
      }
    }
  }

  private saveContentLibrary() {
    if (this.isDemoMode) {
      try {
        localStorage.setItem('ai_content_library', JSON.stringify(this.contentLibrary));
      } catch (error) {
        console.error('Failed to save content library:', error);
      }
    }
  }

  isDemoModeActive(): boolean {
    return this.isDemoMode;
  }

  getEstimatedGenerationTime(type: string): number {
    // Estimated generation times in milliseconds
    const times = {
      'flashcards': 3000,
      'quiz': 5000,
      'worksheet': 8000,
      'activity': 12000,
      'lesson_plan': 15000
    };
    return times[type] || 10000;
  }
}

export const unifiedAIContentService = new UnifiedAIContentService();
