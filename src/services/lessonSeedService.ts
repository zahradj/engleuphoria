import { supabase } from '@/integrations/supabase/client';
import lesson1Data from '@/data/lessons/lesson1-greetings-letterA.json';

export interface SeedResult {
  success: boolean;
  lessonId?: string;
  message: string;
  error?: string;
}

export const lessonSeedService = {
  /**
   * Seeds Lesson 1: Greetings & Letter Aa into the database
   */
  async seedLesson1(): Promise<SeedResult> {
    try {
      // Check if lesson already exists
      const { data: existingLesson } = await supabase
        .from('interactive_lessons')
        .select('id')
        .eq('title', lesson1Data.title)
        .single();

      if (existingLesson) {
        return {
          success: false,
          message: 'Lesson 1 already exists in the database',
          lessonId: existingLesson.id
        };
      }

      // Insert the lesson
      const { data, error } = await supabase
        .from('interactive_lessons')
        .insert({
          title: lesson1Data.title,
          topic: lesson1Data.topic,
          cefr_level: lesson1Data.cefr_level,
          age_group: lesson1Data.age_group,
          estimated_duration: lesson1Data.estimated_duration,
          total_xp: lesson1Data.total_xp,
          total_screens: lesson1Data.screens_data.length,
          screens_data: lesson1Data.screens_data,
          is_published: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error seeding Lesson 1:', error);
        return {
          success: false,
          message: 'Failed to seed Lesson 1',
          error: error.message
        };
      }

      return {
        success: true,
        lessonId: data.id,
        message: 'Lesson 1 seeded successfully!'
      };
    } catch (error) {
      console.error('Unexpected error:', error);
      return {
        success: false,
        message: 'Unexpected error occurred',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  /**
   * Checks if Lesson 1 exists in the database
   */
  async checkLesson1Exists(): Promise<{ exists: boolean; lessonId?: string }> {
    try {
      const { data } = await supabase
        .from('interactive_lessons')
        .select('id')
        .eq('title', lesson1Data.title)
        .single();

      return {
        exists: !!data,
        lessonId: data?.id
      };
    } catch {
      return { exists: false };
    }
  },

  /**
   * Deletes Lesson 1 from the database (for testing/reseeding)
   */
  async deleteLesson1(): Promise<SeedResult> {
    try {
      const { data: lesson } = await supabase
        .from('interactive_lessons')
        .select('id')
        .eq('title', lesson1Data.title)
        .single();

      if (!lesson) {
        return {
          success: false,
          message: 'Lesson 1 not found in database'
        };
      }

      const { error } = await supabase
        .from('interactive_lessons')
        .delete()
        .eq('id', lesson.id);

      if (error) {
        return {
          success: false,
          message: 'Failed to delete Lesson 1',
          error: error.message
        };
      }

      return {
        success: true,
        message: 'Lesson 1 deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Unexpected error occurred',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  /**
   * Re-seeds Lesson 1 (deletes and re-inserts)
   */
  async reseedLesson1(): Promise<SeedResult> {
    const deleteResult = await this.deleteLesson1();
    if (!deleteResult.success && deleteResult.message !== 'Lesson 1 not found in database') {
      return deleteResult;
    }

    return await this.seedLesson1();
  }
};
