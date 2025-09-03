import { supabase } from '@/integrations/supabase/client';
import { LessonSlides, ActivityResult } from '@/types/slides';

export class LessonSlidesService {
  async saveActivityResult(result: ActivityResult) {
    try {
      const { data, error } = await supabase
        .from('learning_analytics')
        .insert({
          student_id: result.cefr, // This would be the actual student ID in production
          activity_type: result.tags.join(','),
          skill_area: result.cefr,
          accuracy_score: result.accuracyPercent || (result.correct ? 100 : 0),
          completion_rate: 100,
          session_duration: Math.round(result.timeMs / 1000),
          xp_earned: result.correct ? 10 : 5,
          metadata: {
            itemId: result.itemId,
            attempts: result.attempts,
            timeMs: result.timeMs,
            fluency: result.fluency
          }
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error saving activity result:', error);
      return { success: false, error };
    }
  }

  async saveAILearningEvent(result: ActivityResult, studentId: string) {
    try {
      const { data, error } = await supabase
        .from('ai_learning_events')
        .insert({
          student_id: studentId,
          event_type: 'slide_activity',
          event_data: {
            slideType: result.tags[0] || 'unknown',
            itemId: result.itemId,
            correct: result.correct,
            attempts: result.attempts,
            timeMs: result.timeMs,
            fluency: result.fluency
          },
          performance_score: result.accuracyPercent || (result.correct ? 100 : 0),
          time_spent_seconds: Math.round(result.timeMs / 1000)
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error saving AI learning event:', error);
      return { success: false, error };
    }
  }

  async fetchLessonSlides(lessonId: string): Promise<LessonSlides | null> {
    try {
      const { data, error } = await supabase
        .from('systematic_lessons')
        .select('slides_content, title, topic, estimated_duration')
        .eq('id', lessonId)
        .not('status', 'eq', 'archived')
        .single();

      if (error) throw error;
      
      if (!data?.slides_content) return null;

      return data.slides_content as LessonSlides;
    } catch (error) {
      console.error('Error fetching lesson slides:', error);
      return null;
    }
  }

  async fetchLessonSlidesFromLessonsContent(lessonId: string): Promise<LessonSlides | null> {
    try {
      const { data, error } = await supabase
        .from('lessons_content')
        .select('slides_content, title, topic, duration_minutes')
        .eq('id', lessonId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      
      if (!data?.slides_content) return null;

      return data.slides_content as LessonSlides;
    } catch (error) {
      console.error('Error fetching lesson slides from lessons_content:', error);
      return null;
    }
  }

  async updateLessonSlides(lessonId: string, slides: LessonSlides) {
    try {
      // Try to update in lessons_content table first (new structure)
      const { data: lessonsContentData, error: lessonsContentError } = await supabase
        .from('lessons_content')
        .update({ 
          slides_content: slides,
          updated_at: new Date().toISOString()
        })
        .eq('id', lessonId)
        .eq('is_active', true);

      if (lessonsContentError) {
        console.log('Lessons content update failed, trying systematic_lessons:', lessonsContentError);
        
        // Fallback to systematic_lessons table
        const { data, error } = await supabase
          .from('systematic_lessons')
          .update({ slides_content: slides })
          .eq('id', lessonId)
          .not('status', 'eq', 'archived');

        if (error) throw error;
        return { success: true, data };
      }

      return { success: true, data: lessonsContentData };
    } catch (error) {
      console.error('Error updating lesson slides:', error);
      return { success: false, error };
    }
  }

  async reorderSlides(lessonId: string, slideOrder: string[]) {
    try {
      const lessonData = await this.fetchLessonSlidesFromLessonsContent(lessonId);
      if (!lessonData) {
        throw new Error('Lesson not found');
      }

      // Reorder slides based on the new order
      const reorderedSlides = slideOrder.map((slideId, index) => {
        const slide = lessonData.slides.find(s => s.id === slideId);
        if (slide) {
          return { ...slide, orderIndex: index };
        }
        return null;
      }).filter(Boolean);

      const updatedLessonData = {
        ...lessonData,
        slides: reorderedSlides,
        slideOrder,
        lastModified: new Date().toISOString()
      };

      return await this.updateLessonSlides(lessonId, updatedLessonData);
    } catch (error) {
      console.error('Error reordering slides:', error);
      return { success: false, error };
    }
  }
}

export const lessonSlidesService = new LessonSlidesService();