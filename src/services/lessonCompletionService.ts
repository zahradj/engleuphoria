import { supabase } from '@/integrations/supabase/client';
import { curriculumAssignmentService } from './curriculumAssignmentService';

interface LessonCompletionData {
  lessonId: string;
  scheduledLessonId?: string;
  timeSpentMinutes: number;
  performanceScore?: number;
  skillsPracticed?: Record<string, number>;
  notes?: string;
}

class LessonCompletionService {
  /**
   * Record lesson completion and update student progress
   */
  async recordCompletion(studentId: string, completionData: LessonCompletionData) {
    try {
      // Calculate XP based on performance
      const xpEarned = this.calculateXPForLesson(
        completionData.timeSpentMinutes,
        completionData.performanceScore
      );

      // Record completion in database
      const { data: completion, error: completionError } = await supabase
        .from('lesson_completions')
        .insert({
          student_id: studentId,
          library_lesson_id: completionData.lessonId,
          scheduled_lesson_id: completionData.scheduledLessonId,
          time_spent_minutes: completionData.timeSpentMinutes,
          xp_earned: xpEarned,
          performance_score: completionData.performanceScore || 0,
          skills_practiced: completionData.skillsPracticed || {},
          notes: completionData.notes
        })
        .select()
        .single();

      if (completionError) throw completionError;

      // Update student XP
      await this.awardXP(studentId, xpEarned);

      // Update curriculum progress
      const lessonNumber = this.extractLessonNumber(completionData.lessonId);
      if (lessonNumber) {
        await curriculumAssignmentService.updateLessonProgress(studentId, lessonNumber);
      }

      // Update student learning streak
      await this.updateStreak(studentId);

      return { completion, xpEarned };
    } catch (error) {
      console.error('Error recording lesson completion:', error);
      throw error;
    }
  }

  /**
   * Calculate XP reward based on lesson performance
   */
  private calculateXPForLesson(timeSpent: number, performanceScore?: number): number {
    let baseXP = 50; // Base XP for completing a lesson

    // Bonus for longer lessons
    if (timeSpent >= 45) {
      baseXP += 25;
    } else if (timeSpent >= 30) {
      baseXP += 15;
    }

    // Performance bonus
    if (performanceScore) {
      if (performanceScore >= 90) {
        baseXP += 30; // Excellent performance
      } else if (performanceScore >= 75) {
        baseXP += 20; // Good performance
      } else if (performanceScore >= 60) {
        baseXP += 10; // Satisfactory performance
      }
    }

    return baseXP;
  }

  /**
   * Award XP to student
   */
  private async awardXP(studentId: string, xpAmount: number) {
    try {
      // Get current XP
      const { data: currentXP, error: fetchError } = await supabase
        .from('student_xp')
        .select('total_xp, level')
        .eq('student_id', studentId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      const newTotalXP = (currentXP?.total_xp || 0) + xpAmount;
      const newLevel = Math.floor(newTotalXP / 500) + 1;

      if (currentXP) {
        // Update existing XP record
        await supabase
          .from('student_xp')
          .update({
            total_xp: newTotalXP,
            level: newLevel
          })
          .eq('student_id', studentId);
      } else {
        // Create new XP record
        await supabase
          .from('student_xp')
          .insert({
            student_id: studentId,
            total_xp: newTotalXP,
            level: newLevel
          });
      }

      return { newTotalXP, newLevel, leveledUp: newLevel > (currentXP?.level || 0) };
    } catch (error) {
      console.error('Error awarding XP:', error);
      throw error;
    }
  }

  /**
   * Update student learning streak
   */
  private async updateStreak(studentId: string) {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data: streak, error: fetchError } = await supabase
        .from('student_learning_streaks')
        .select('*')
        .eq('student_id', studentId)
        .eq('streak_type', 'daily')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (streak) {
        const lastActivityDate = streak.last_activity_date;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = streak.current_streak;

        if (lastActivityDate === yesterdayStr) {
          // Continuing streak
          newStreak += 1;
        } else if (lastActivityDate !== today) {
          // Streak broken
          newStreak = 1;
        }

        const longestStreak = Math.max(newStreak, streak.longest_streak);

        await supabase
          .from('student_learning_streaks')
          .update({
            current_streak: newStreak,
            longest_streak: longestStreak,
            last_activity_date: today
          })
          .eq('id', streak.id);
      } else {
        // Create new streak record
        await supabase
          .from('student_learning_streaks')
          .insert({
            student_id: studentId,
            streak_type: 'daily',
            current_streak: 1,
            longest_streak: 1,
            last_activity_date: today
          });
      }
    } catch (error) {
      console.error('Error updating streak:', error);
      // Don't throw - streak update failure shouldn't block lesson completion
    }
  }

  /**
   * Extract lesson number from lesson ID (e.g., "stage-2-unit-3-lesson-5" => 5)
   */
  private extractLessonNumber(lessonId: string): number | null {
    const match = lessonId.match(/lesson-(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  /**
   * Get completion history for a student
   */
  async getCompletionHistory(studentId: string, limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('lesson_completions')
        .select('*')
        .eq('student_id', studentId)
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching completion history:', error);
      return [];
    }
  }

  /**
   * Check if lesson is already completed
   */
  async isLessonCompleted(studentId: string, lessonId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('lesson_completions')
        .select('id')
        .eq('student_id', studentId)
        .eq('library_lesson_id', lessonId)
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return !!data;
    } catch (error) {
      console.error('Error checking lesson completion:', error);
      return false;
    }
  }
}

export const lessonCompletionService = new LessonCompletionService();
