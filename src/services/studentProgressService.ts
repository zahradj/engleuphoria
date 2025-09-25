import { supabase } from '@/integrations/supabase/client';
import { curriculumService } from './curriculumService';

export interface StudentLessonProgress {
  student_id: string;
  current_week: number;
  current_lesson: number;
  completion_percentage: number;
  vocabulary_mastered?: string[];
  grammar_patterns_learned?: string[];
  conversation_milestones_achieved?: string[];
}

export interface LessonContent {
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
}

class StudentProgressService {
  // Extract student ID from classroom context (URL parameters or room session)
  extractStudentIdFromContext(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Try to get student ID from URL parameters
    const studentId = urlParams.get('studentId');
    if (studentId) return studentId;
    
    // For demo purposes, return a default student ID
    // In a real implementation, this would come from the room session
    return 'demo-student-123';
  }

  // Get current lesson progress for a student
  async getStudentProgress(studentId: string): Promise<StudentLessonProgress | null> {
    try {
      const { data, error } = await supabase
        .from('student_curriculum_progress')
        .select('*')
        .eq('student_id', studentId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching student progress:', error);
        return null;
      }

      if (!data) {
        // No progress found, create initial progress starting from lesson 1
        return {
          student_id: studentId,
          current_week: 1,
          current_lesson: 1,
          completion_percentage: 0,
          vocabulary_mastered: [],
          grammar_patterns_learned: [],
          conversation_milestones_achieved: []
        };
      }

      return data;
    } catch (error) {
      console.error('Error in getStudentProgress:', error);
      return null;
    }
  }

  // Get lesson content from lessons_content table
  async getLessonContent(moduleNumber: number, lessonNumber: number): Promise<LessonContent | null> {
    try {
      const { data, error } = await supabase
        .from('lessons_content')
        .select('*')
        .eq('module_number', moduleNumber)
        .eq('lesson_number', lessonNumber)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching lesson content:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getLessonContent:', error);
      return null;
    }
  }

  // Get all available lessons for browsing
  async getAllLessons(): Promise<LessonContent[]> {
    try {
      const { data, error } = await supabase
        .from('lessons_content')
        .select('*')
        .eq('is_active', true)
        .order('module_number', { ascending: true })
        .order('lesson_number', { ascending: true });

      if (error) {
        console.error('Error fetching all lessons:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllLessons:', error);
      return [];
    }
  }

  // Update student progress when a lesson is completed
  async updateStudentProgress(studentId: string, weekNumber: number, lessonNumber: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('student_curriculum_progress')
        .upsert({
          student_id: studentId,
          current_week: weekNumber,
          current_lesson: lessonNumber,
          completion_percentage: Math.min(100, (weekNumber - 1) * 10 + lessonNumber * 2),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating student progress:', error);
      }
    } catch (error) {
      console.error('Error in updateStudentProgress:', error);
    }
  }

  // Record lesson completion
  async recordLessonCompletion(studentId: string, lessonId: string, completionData: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('lesson_completions')
        .insert({
          student_id: studentId,
          lesson_id: lessonId,
          completed_at: new Date().toISOString(),
          conversation_time_seconds: completionData.timeSpent || 0,
          neuroscience_engagement_score: completionData.engagementScore || 0,
          memory_consolidation_score: completionData.memoryScore || 0,
          attention_optimization_score: completionData.attentionScore || 0
        });

      if (error) {
        console.error('Error recording lesson completion:', error);
      }
    } catch (error) {
      console.error('Error in recordLessonCompletion:', error);
    }
  }

  // Get next recommended lesson for a student
  getNextLesson(progress: StudentLessonProgress): { week: number; lesson: number } {
    // Simple logic: if current lesson is completed, move to next lesson
    // In a real system, this would be more sophisticated
    return {
      week: progress.current_week,
      lesson: progress.current_lesson
    };
  }

  // Check if student has any progress
  hasProgress(progress: StudentLessonProgress | null): boolean {
    return progress !== null && (progress.current_week > 1 || progress.current_lesson > 1);
  }
}

export const studentProgressService = new StudentProgressService();