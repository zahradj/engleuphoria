import { supabase } from '@/integrations/supabase/client';

export interface LessonProgress {
  id: string;
  lesson_id: string;
  student_id: string;
  current_slide_index: number;
  total_slides: number;
  completed_slides: number;
  completion_percentage: number;
  xp_earned: number;
  stars_earned: number;
  lesson_status: 'not_started' | 'in_progress' | 'completed' | 'redo_required';
  started_at: string;
  updated_at: string;
  completed_at?: string;
  last_slide_completed?: number;
  session_data: any;
}

export interface LessonAssignment {
  id: string;
  lesson_id: string;
  student_id: string;
  assigned_by?: string;
  assigned_at: string;
  due_date?: string;
  status: 'assigned' | 'locked' | 'unlocked' | 'in_progress' | 'completed';
  is_unlocked: boolean;
  unlock_condition?: any;
  order_in_sequence?: number;
  notes?: string;
}

export interface CompletionData {
  totalSlides: number;
  completedSlides: number;
  xpEarned: number;
  starsEarned: number;
}

export interface LessonWithProgress {
  lesson: any;
  progress: LessonProgress | null;
  assignment: LessonAssignment | null;
}

class InteractiveLessonProgressService {
  /**
   * Get or create progress for a student on a specific lesson
   */
  async getStudentLessonProgress(studentId: string, lessonId: string): Promise<LessonProgress | null> {
    try {
      const { data, error } = await supabase
        .from('interactive_lesson_progress')
        .select('*')
        .eq('lesson_id', lessonId)
        .eq('student_id', studentId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching progress:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getStudentLessonProgress:', error);
      return null;
    }
  }

  /**
   * Initialize progress for a new lesson
   */
  async initializeLessonProgress(
    studentId: string,
    lessonId: string,
    totalSlides: number
  ): Promise<LessonProgress | null> {
    try {
      const { data, error } = await supabase
        .from('interactive_lesson_progress')
        .insert({
          lesson_id: lessonId,
          student_id: studentId,
          total_slides: totalSlides,
          current_slide_index: 0,
          completed_slides: 0,
          completion_percentage: 0,
          xp_earned: 0,
          stars_earned: 0,
          lesson_status: 'not_started'
        })
        .select()
        .single();

      if (error) {
        console.error('Error initializing progress:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in initializeLessonProgress:', error);
      return null;
    }
  }

  /**
   * Update slide progress (called after each slide)
   */
  async updateSlideProgress(
    studentId: string,
    lessonId: string,
    slideIndex: number,
    xpEarned: number = 0,
    starsEarned: number = 0
  ): Promise<void> {
    try {
      // Get current progress
      let progress = await this.getStudentLessonProgress(studentId, lessonId);

      if (!progress) {
        // If no progress exists, initialize it
        const { data: lesson } = await supabase
          .from('interactive_lessons')
          .select('screens_data')
          .eq('id', lessonId)
          .single();

        const totalSlides = lesson?.screens_data?.length || 20;
        progress = await this.initializeLessonProgress(studentId, lessonId, totalSlides);
        
        if (!progress) return;
      }

      // Calculate new values
      const completedSlides = Math.max(slideIndex, progress.completed_slides);
      const completionPercentage = (completedSlides / progress.total_slides) * 100;
      const lessonStatus = completionPercentage === 100 ? 'completed' : 'in_progress';

      // Update progress
      const { error } = await supabase
        .from('interactive_lesson_progress')
        .update({
          current_slide_index: slideIndex,
          completed_slides: completedSlides,
          completion_percentage: Math.round(completionPercentage * 100) / 100,
          xp_earned: progress.xp_earned + xpEarned,
          stars_earned: progress.stars_earned + starsEarned,
          lesson_status: lessonStatus,
          last_slide_completed: slideIndex,
          updated_at: new Date().toISOString()
        })
        .eq('lesson_id', lessonId)
        .eq('student_id', studentId);

      if (error) {
        console.error('Error updating slide progress:', error);
      }

      // Update assignment status if exists
      await supabase
        .from('interactive_lesson_assignments')
        .update({ status: lessonStatus === 'completed' ? 'completed' : 'in_progress' })
        .eq('lesson_id', lessonId)
        .eq('student_id', studentId);

    } catch (error) {
      console.error('Error in updateSlideProgress:', error);
    }
  }

  /**
   * Mark lesson as completed or redo required based on 50% rule
   */
  async completeLessonSession(
    studentId: string,
    lessonId: string,
    finalData: CompletionData
  ): Promise<'completed' | 'redo_required'> {
    try {
      const completionPercentage = (finalData.completedSlides / finalData.totalSlides) * 100;
      const status = completionPercentage >= 50 ? 'completed' : 'redo_required';

      const { error } = await supabase
        .from('interactive_lesson_progress')
        .update({
          lesson_status: status,
          completion_percentage: Math.round(completionPercentage * 100) / 100,
          xp_earned: finalData.xpEarned,
          stars_earned: finalData.starsEarned,
          completed_at: status === 'completed' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('lesson_id', lessonId)
        .eq('student_id', studentId);

      if (error) {
        console.error('Error completing lesson:', error);
      }

      // Update assignment
      await supabase
        .from('interactive_lesson_assignments')
        .update({ status })
        .eq('lesson_id', lessonId)
        .eq('student_id', studentId);

      // If completed >= 50%, unlock next lesson
      if (status === 'completed') {
        await this.unlockNextLesson(studentId, lessonId);
      }

      return status;
    } catch (error) {
      console.error('Error in completeLessonSession:', error);
      return 'redo_required';
    }
  }

  /**
   * Auto-unlock next lesson based on completion
   */
  async unlockNextLesson(studentId: string, currentLessonId: string): Promise<string | null> {
    try {
      // Get current assignment order
      const { data: currentAssignment } = await supabase
        .from('interactive_lesson_assignments')
        .select('order_in_sequence')
        .eq('lesson_id', currentLessonId)
        .eq('student_id', studentId)
        .single();

      if (!currentAssignment?.order_in_sequence) return null;

      // Find next lesson in sequence
      const { data: nextAssignment } = await supabase
        .from('interactive_lesson_assignments')
        .select('*')
        .eq('student_id', studentId)
        .eq('order_in_sequence', currentAssignment.order_in_sequence + 1)
        .single();

      if (nextAssignment) {
        // Unlock next lesson
        await supabase
          .from('interactive_lesson_assignments')
          .update({ 
            is_unlocked: true, 
            status: 'unlocked' 
          })
          .eq('id', nextAssignment.id);

        return nextAssignment.lesson_id;
      }

      return null;
    } catch (error) {
      console.error('Error in unlockNextLesson:', error);
      return null;
    }
  }

  /**
   * Reset progress for redo
   */
  async resetLessonProgress(studentId: string, lessonId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('interactive_lesson_progress')
        .update({
          current_slide_index: 0,
          completed_slides: 0,
          completion_percentage: 0,
          xp_earned: 0,
          stars_earned: 0,
          lesson_status: 'not_started',
          completed_at: null,
          last_slide_completed: null,
          updated_at: new Date().toISOString()
        })
        .eq('lesson_id', lessonId)
        .eq('student_id', studentId);

      if (error) {
        console.error('Error resetting progress:', error);
      }

      // Reset assignment status
      await supabase
        .from('interactive_lesson_assignments')
        .update({ status: 'assigned' })
        .eq('lesson_id', lessonId)
        .eq('student_id', studentId);

    } catch (error) {
      console.error('Error in resetLessonProgress:', error);
    }
  }

  /**
   * Get all lessons with progress for a student
   */
  async getStudentLessonLibrary(studentId: string): Promise<LessonWithProgress[]> {
    try {
      // Get all lessons
      const { data: lessons, error: lessonsError } = await supabase
        .from('interactive_lessons')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (lessonsError) {
        console.error('Error fetching lessons:', lessonsError);
        return [];
      }

      // Get all progress for this student
      const { data: progressData } = await supabase
        .from('interactive_lesson_progress')
        .select('*')
        .eq('student_id', studentId);

      // Get all assignments for this student
      const { data: assignmentData } = await supabase
        .from('interactive_lesson_assignments')
        .select('*')
        .eq('student_id', studentId);

      // Combine data
      return (lessons || []).map(lesson => {
        const progress = progressData?.find(p => p.lesson_id === lesson.id) || null;
        const assignment = assignmentData?.find(a => a.lesson_id === lesson.id) || null;

        return {
          lesson,
          progress,
          assignment
        };
      });

    } catch (error) {
      console.error('Error in getStudentLessonLibrary:', error);
      return [];
    }
  }

  /**
   * Assign a lesson to a student
   */
  async assignLessonToStudent(
    lessonId: string,
    studentId: string,
    assignedBy: string,
    orderInSequence?: number,
    isUnlocked: boolean = true
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('interactive_lesson_assignments')
        .insert({
          lesson_id: lessonId,
          student_id: studentId,
          assigned_by: assignedBy,
          order_in_sequence: orderInSequence,
          is_unlocked: isUnlocked,
          status: isUnlocked ? 'assigned' : 'locked'
        });

      if (error) {
        console.error('Error assigning lesson:', error);
      }
    } catch (error) {
      console.error('Error in assignLessonToStudent:', error);
    }
  }

  /**
   * Mark lesson as completed by teacher (override)
   */
  async markLessonCompleted(studentId: string, lessonId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('interactive_lesson_progress')
        .update({
          lesson_status: 'completed',
          completion_percentage: 100,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('lesson_id', lessonId)
        .eq('student_id', studentId);

      if (error) {
        console.error('Error marking lesson completed:', error);
      }

      await supabase
        .from('interactive_lesson_assignments')
        .update({ status: 'completed' })
        .eq('lesson_id', lessonId)
        .eq('student_id', studentId);

      // Unlock next lesson
      await this.unlockNextLesson(studentId, lessonId);

    } catch (error) {
      console.error('Error in markLessonCompleted:', error);
    }
  }

  /**
   * Mark lesson as redo required by teacher
   */
  async markLessonRedo(studentId: string, lessonId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('interactive_lesson_progress')
        .update({
          lesson_status: 'redo_required',
          updated_at: new Date().toISOString()
        })
        .eq('lesson_id', lessonId)
        .eq('student_id', studentId);

      if (error) {
        console.error('Error marking lesson redo:', error);
      }

      await supabase
        .from('interactive_lesson_assignments')
        .update({ status: 'redo_required' })
        .eq('lesson_id', lessonId)
        .eq('student_id', studentId);

    } catch (error) {
      console.error('Error in markLessonRedo:', error);
    }
  }

  /**
   * Get recent student activity for teacher dashboard
   */
  async getRecentStudentActivity(teacherId: string, limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('interactive_lesson_progress')
        .select(`
          *,
          student:users!interactive_lesson_progress_student_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          lesson:interactive_lessons!interactive_lesson_progress_lesson_id_fkey(
            id,
            title,
            cefr_level
          )
        `)
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent activity:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRecentStudentActivity:', error);
      return [];
    }
  }
}

export const interactiveLessonProgressService = new InteractiveLessonProgressService();
