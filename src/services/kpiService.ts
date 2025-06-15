
import { supabase } from '@/integrations/supabase/client';

export interface KPIMetrics {
  feedback_completion_rate: number;
  lesson_quality_score: number;
  attendance_rate: number;
  student_progress_impact: number;
  response_time_score: number;
  curriculum_coverage: number;
  overall_kpi_score: number;
}

export interface Achievement {
  id: string;
  achievement_type: string;
  achievement_name: string;
  achievement_description: string;
  earned_at: string;
  points_awarded: number;
}

export class KPIService {
  static async getTeacherMetrics(teacherId: string): Promise<KPIMetrics | null> {
    try {
      const { data, error } = await supabase
        .from('teacher_performance_metrics')
        .select('*')
        .eq('teacher_id', teacherId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching teacher metrics:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getTeacherMetrics:', error);
      return null;
    }
  }

  static async updateTeacherMetrics(teacherId: string): Promise<void> {
    try {
      // Call the stored procedure to update metrics
      const { error } = await supabase.rpc('update_teacher_performance_metrics', {
        teacher_uuid: teacherId
      });

      if (error) {
        console.error('Error updating teacher metrics:', error);
      }
    } catch (error) {
      console.error('Error in updateTeacherMetrics:', error);
    }
  }

  static async submitLessonFeedback(feedbackData: {
    lesson_id: string;
    teacher_id: string;
    student_id: string;
    feedback_content: string;
    student_performance_rating: number;
    lesson_objectives_met: boolean;
    homework_assigned: string;
    parent_communication_notes: string;
  }): Promise<boolean> {
    try {
      // Submit feedback
      const { error: feedbackError } = await supabase
        .from('lesson_feedback_submissions')
        .insert(feedbackData);

      if (feedbackError) {
        console.error('Error submitting feedback:', feedbackError);
        return false;
      }

      // Update lesson status
      const { error: lessonError } = await supabase
        .from('lessons')
        .update({
          feedback_submitted: true,
          quality_rating: feedbackData.student_performance_rating
        })
        .eq('id', feedbackData.lesson_id);

      if (lessonError) {
        console.error('Error updating lesson:', lessonError);
      }

      // Update teacher metrics
      await this.updateTeacherMetrics(feedbackData.teacher_id);

      // Check for new achievements
      await this.checkAndAwardAchievements(feedbackData.teacher_id);

      return true;
    } catch (error) {
      console.error('Error in submitLessonFeedback:', error);
      return false;
    }
  }

  static async checkAndAwardAchievements(teacherId: string): Promise<void> {
    try {
      // Get teacher's current metrics and feedback submissions
      const [metricsResult, feedbackResult] = await Promise.all([
        supabase
          .from('teacher_performance_metrics')
          .select('*')
          .eq('teacher_id', teacherId)
          .single(),
        supabase
          .from('lesson_feedback_submissions')
          .select('*')
          .eq('teacher_id', teacherId)
          .order('submitted_at', { ascending: false })
      ]);

      const metrics = metricsResult.data;
      const feedbackSubmissions = feedbackResult.data || [];

      // Check for achievements
      const achievements: Array<{
        achievement_type: string;
        achievement_name: string;
        achievement_description: string;
        points_awarded: number;
      }> = [];

      // Feedback Champion: 10+ feedback submissions
      if (feedbackSubmissions.length >= 10) {
        achievements.push({
          achievement_type: 'badge',
          achievement_name: 'Feedback Champion',
          achievement_description: 'Submitted feedback for 10+ lessons',
          points_awarded: 100
        });
      }

      // Quality Master: 95%+ feedback completion rate
      if (metrics && metrics.feedback_completion_rate >= 95) {
        achievements.push({
          achievement_type: 'milestone',
          achievement_name: 'Consistency Master',
          achievement_description: 'Achieved 95%+ feedback completion rate',
          points_awarded: 200
        });
      }

      // Perfect Attendance: 100% attendance rate
      if (metrics && metrics.attendance_rate >= 100) {
        achievements.push({
          achievement_type: 'badge',
          achievement_name: 'Perfect Attendance',
          achievement_description: 'Attended all scheduled lessons',
          points_awarded: 150
        });
      }

      // Award new achievements
      for (const achievement of achievements) {
        // Check if achievement already exists
        const { data: existingAchievement } = await supabase
          .from('teacher_achievements')
          .select('id')
          .eq('teacher_id', teacherId)
          .eq('achievement_name', achievement.achievement_name)
          .single();

        if (!existingAchievement) {
          await supabase
            .from('teacher_achievements')
            .insert({
              teacher_id: teacherId,
              ...achievement
            });

          // Update teacher points
          await supabase
            .from('users')
            .update({
              teacher_points: supabase.sql`teacher_points + ${achievement.points_awarded}`
            })
            .eq('id', teacherId);
        }
      }

      // Update teacher level based on points
      await this.updateTeacherLevel(teacherId);

    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }

  static async updateTeacherLevel(teacherId: string): Promise<void> {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('teacher_points')
        .eq('id', teacherId)
        .single();

      if (!userData) return;

      const points = userData.teacher_points || 0;
      let newLevel = 'Bronze';

      if (points >= 10000) newLevel = 'Master';
      else if (points >= 5000) newLevel = 'Platinum';
      else if (points >= 2500) newLevel = 'Gold';
      else if (points >= 1000) newLevel = 'Silver';

      await supabase
        .from('users')
        .update({ teacher_level: newLevel })
        .eq('id', teacherId);

    } catch (error) {
      console.error('Error updating teacher level:', error);
    }
  }

  static async getPendingFeedbackCount(teacherId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })
        .eq('teacher_id', teacherId)
        .eq('feedback_submitted', false)
        .eq('status', 'completed');

      if (error) {
        console.error('Error getting pending feedback count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getPendingFeedbackCount:', error);
      return 0;
    }
  }

  static async getPaymentStatus(teacherId: string): Promise<{
    locked_sessions: number;
    pending_amount: number;
    can_receive_payment: boolean;
  }> {
    try {
      const pendingCount = await this.getPendingFeedbackCount(teacherId);
      const metrics = await this.getTeacherMetrics(teacherId);
      
      const kpiThresholdMet = metrics ? metrics.overall_kpi_score >= 70 : false;
      
      return {
        locked_sessions: pendingCount,
        pending_amount: pendingCount * 25, // $25 per lesson
        can_receive_payment: pendingCount === 0 && kpiThresholdMet
      };
    } catch (error) {
      console.error('Error getting payment status:', error);
      return {
        locked_sessions: 0,
        pending_amount: 0,
        can_receive_payment: false
      };
    }
  }
}

export const kpiService = KPIService;
