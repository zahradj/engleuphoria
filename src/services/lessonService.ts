
import { supabase } from '@/lib/supabase';

export interface ScheduledLesson {
  id: string;
  title: string;
  scheduled_at: string;
  duration: number;
  room_id: string;
  room_link: string;
  status: string;
  student_name?: string;
  teacher_name?: string;
  student_id?: string;
  teacher_id?: string;
  student_charged_amount?: number;
  teacher_payout_amount?: number;
  platform_profit_amount?: number;
  payment_status?: string;
  cancellation_reason?: string;
  completed_at?: string;
}

export interface CreateLessonData {
  title: string;
  teacher_id: string;
  student_id: string;
  scheduled_at: string;
  duration: number;
  cost?: number;
}

export const lessonService = {
  // Get upcoming lessons for a teacher
  async getTeacherUpcomingLessons(teacherId: string): Promise<ScheduledLesson[]> {
    const { data, error } = await supabase.rpc('get_teacher_upcoming_lessons', {
      teacher_uuid: teacherId
    });

    if (error) {
      console.error('Error fetching teacher lessons:', error);
      throw error;
    }

    return data || [];
  },

  // Get upcoming lessons for a student
  async getStudentUpcomingLessons(studentId: string): Promise<ScheduledLesson[]> {
    const { data, error } = await supabase.rpc('get_student_upcoming_lessons', {
      student_uuid: studentId
    });

    if (error) {
      console.error('Error fetching student lessons:', error);
      throw error;
    }

    return data || [];
  },

  // Create a new lesson with package credit deduction
  async createLesson(lessonData: CreateLessonData, packagePurchaseId?: string): Promise<ScheduledLesson> {
    const { lessonPricingService } = await import('./lessonPricingService');
    
    // Use the lessonPricingService to handle both lesson creation and payment/credit deduction
    const result = await lessonPricingService.bookLessonWithPayment(
      lessonData.teacher_id,
      lessonData.student_id,
      lessonData.scheduled_at,
      packagePurchaseId
    );

    console.log('✅ Lesson created with payment/credit handling:', {
      lesson_id: result.lesson.id,
      payment_processed: !!result.payment
    });

    // Send teacher booking notification email (non-blocking)
    supabase.functions.invoke('notify-teacher-booking', {
      body: { record: result.lesson }
    }).then(({ error }) => {
      if (error) console.error('Failed to send teacher notification:', error);
      else console.log('Teacher booking notification sent');
    });

    return result.lesson;
  },

  // Validate lesson access
  async canAccessLesson(roomId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('can_access_lesson', {
      room_uuid: roomId,
      user_uuid: userId
    });

    if (error) {
      console.error('Error validating lesson access:', error);
      return false;
    }

    return data || false;
  },

  // Join a lesson (track participation)
  async joinLesson(lessonId: string, userId: string, role: 'teacher' | 'student'): Promise<void> {
    const { error } = await supabase
      .from('lesson_participants')
      .upsert({
        lesson_id: lessonId,
        user_id: userId,
        role,
        joined_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error joining lesson:', error);
      throw error;
    }
  },

  // Leave a lesson (update participation)
  async leaveLesson(lessonId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('lesson_participants')
      .update({
        left_at: new Date().toISOString()
      })
      .eq('lesson_id', lessonId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error leaving lesson:', error);
      throw error;
    }
  },

  // Update lesson status
  async updateLessonStatus(lessonId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('lessons')
      .update({ status })
      .eq('id', lessonId);

    if (error) {
      console.error('Error updating lesson status:', error);
      throw error;
    }
  },

  // Process lesson completion with payment handling
  async processLessonCompletion(lessonId: string, status: 'completed' | 'cancelled', failureReason?: string): Promise<any> {
    const { data, error } = await supabase.rpc('process_lesson_completion', {
      lesson_uuid: lessonId,
      lesson_status: status,
      failure_reason: failureReason
    });

    if (error) {
      console.error('Error processing lesson completion:', error);
      throw error;
    }

    return data;
  },

  // Get student lesson statistics
  async getStudentLessonStats(studentId: string): Promise<any> {
    const { data, error } = await supabase.rpc('get_student_lesson_stats', {
      student_uuid: studentId
    });

    if (error) {
      console.error('Error fetching student lesson stats:', error);
      throw error;
    }

    return data;
  },

  // Get teacher earnings summary
  async getTeacherEarningsSummary(teacherId: string): Promise<any> {
    const { data, error } = await supabase.rpc('get_teacher_earnings_summary', {
      teacher_uuid: teacherId
    });

    if (error) {
      console.error('Error fetching teacher earnings:', error);
      throw error;
    }

    return data;
  }
};
