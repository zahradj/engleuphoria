import { supabase } from '@/integrations/supabase/client';
import { studentProgressService } from './studentProgressService';

interface RecommendedLesson {
  id: string;
  title: string;
  topic: string;
  module_number: number;
  lesson_number: number;
  cefr_level: string;
  slides_content: any;
  learning_objectives: string[];
  vocabulary_focus: string[];
  grammar_focus: string[];
  difficulty_level: string;
  duration_minutes: number;
  description?: string;
}

class LessonRecommendationService {
  /**
   * Get the next recommended lesson for a student based on their progress
   */
  async getNextLessonForStudent(studentId: string): Promise<RecommendedLesson | null> {
    try {
      // Get student progress
      const progress = await studentProgressService.getStudentProgress(studentId);
      
      if (!progress) {
        // New student - return first lesson (placement test)
        return this.getFirstLesson();
      }

      // Get the next lesson based on current progress
      const { data: nextLesson, error } = await supabase
        .from('lessons_content')
        .select('*')
        .eq('module_number', progress.current_week)
        .eq('lesson_number', progress.current_lesson)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching next lesson:', error);
        return null;
      }

      return nextLesson;
    } catch (error) {
      console.error('Error in getNextLessonForStudent:', error);
      return null;
    }
  }

  /**
   * Get the first lesson (placement test) for new students
   */
  async getFirstLesson(): Promise<RecommendedLesson | null> {
    try {
      const { data, error } = await supabase
        .from('lessons_content')
        .select('*')
        .eq('module_number', 1)
        .eq('lesson_number', 1)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching first lesson:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getFirstLesson:', error);
      return null;
    }
  }

  /**
   * Assign a curriculum lesson to a scheduled class
   */
  async assignLessonToScheduledClass(
    curriculumLessonId: string,
    scheduledLessonId: string,
    lessonPlanNotes?: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('lessons')
        .update({
          curriculum_lesson_id: curriculumLessonId,
          lesson_plan_notes: lessonPlanNotes || ''
        })
        .eq('id', scheduledLessonId);

      if (error) {
        console.error('Error assigning lesson to class:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in assignLessonToScheduledClass:', error);
      throw error;
    }
  }

  /**
   * Track lesson completion and update student progress
   */
  async trackLessonCompletion(
    studentId: string,
    lessonId: string,
    completionData: {
      timeSpent?: number;
      engagementScore?: number;
      memoryScore?: number;
      attentionScore?: number;
      xpEarned?: number;
    }
  ): Promise<void> {
    try {
      // Get lesson content details
      const { data: lesson } = await supabase
        .from('lessons_content')
        .select('module_number, lesson_number')
        .eq('id', lessonId)
        .single();

      if (!lesson) {
        console.error('Lesson not found');
        return;
      }

      // Record lesson completion
      await studentProgressService.recordLessonCompletion(
        studentId,
        lessonId,
        completionData
      );

      // Update student progress to next lesson
      await studentProgressService.updateStudentProgress(
        studentId,
        lesson.module_number,
        lesson.lesson_number + 1
      );

      console.log('✅ Lesson completion tracked successfully');
    } catch (error) {
      console.error('Error in trackLessonCompletion:', error);
      throw error;
    }
  }

  /**
   * Get recommended lessons for a student based on their level and progress
   */
  async getRecommendedLessonsForLevel(cefrLevel: string, limit: number = 10): Promise<RecommendedLesson[]> {
    try {
      const { data, error } = await supabase
        .from('lessons_content')
        .select('*')
        .eq('cefr_level', cefrLevel)
        .eq('is_active', true)
        .order('module_number', { ascending: true })
        .order('lesson_number', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching recommended lessons:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRecommendedLessonsForLevel:', error);
      return [];
    }
  }

  /**
   * Check if student needs placement test
   */
  async needsPlacementTest(studentId: string): Promise<boolean> {
    try {
      const { data: profile } = await supabase
        .from('student_profiles')
        .select('placement_test_completed_at')
        .eq('user_id', studentId)
        .maybeSingle();

      return !profile?.placement_test_completed_at;
    } catch (error) {
      console.error('Error checking placement test status:', error);
      return true;
    }
  }
}

export const lessonRecommendationService = new LessonRecommendationService();
