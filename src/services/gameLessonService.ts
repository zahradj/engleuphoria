import { supabase } from '@/integrations/supabase/client';

export interface GameLessonRequest {
  topic: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  ageGroup: string;
  duration: number;
  gameType?: 'story_adventure' | 'collection_quest' | 'puzzle_challenge' | 'mixed';
  focusSkills?: string[];
}

export interface GameCharacter {
  name: string;
  type: 'friendly_teacher' | 'story_narrator' | 'animal_friend' | 'magical_guide' | 'playful_character' | 'student_friend' | 'game_host';
  personality: string;
  role: string;
}

export interface VocabularyItem {
  word: string;
  definition: string;
  example: string;
}

export interface GameSlide {
  slide_type: 'story_intro' | 'vocabulary_preview' | 'interactive_game' | 'practice_activity' | 'celebration';
  title: string;
  content: {
    text: string;
    character_speaking?: string;
    dialogue?: string;
    activity_type?: string;
    activity_data?: {
      instructions: string;
      items?: string[];
      correct_answers?: string[];
    };
  };
  duration_seconds: number;
}

export interface GameLesson {
  lesson_title: string;
  story_theme: string;
  characters: GameCharacter[];
  learning_objectives: string[];
  vocabulary: VocabularyItem[];
  story_narrative: string;
  game_slides: GameSlide[];
  total_slides: number;
  estimated_duration: number;
  metadata?: {
    generated_at: string;
    request_params: GameLessonRequest;
  };
}

class GameLessonService {
  async generateGameLesson(request: GameLessonRequest): Promise<GameLesson> {
    console.log('Generating game lesson with params:', request);

    try {
      const { data, error } = await supabase.functions.invoke('ai-game-lesson-generator', {
        body: request
      });

      if (error) {
        console.error('Game lesson generation error:', error);
        throw new Error(error.message || 'Failed to generate game lesson');
      }

      if (!data) {
        throw new Error('No data received from game lesson generator');
      }

      console.log('Game lesson generated successfully:', data.lesson_title);
      return data as GameLesson;

    } catch (error) {
      console.error('Error in generateGameLesson:', error);
      throw error;
    }
  }

  async generateQuickLesson(topic: string, level: string = 'A1'): Promise<GameLesson> {
    return this.generateGameLesson({
      topic,
      cefrLevel: level as any,
      ageGroup: '6-12 years',
      duration: 15,
      gameType: 'story_adventure',
      focusSkills: ['vocabulary', 'speaking', 'listening']
    });
  }
}

export const gameLessonService = new GameLessonService();
