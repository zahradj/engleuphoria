
import { supabase } from "@/integrations/supabase/client";

export interface StudentXP {
  id: string;
  student_id: string;
  total_xp: number;
  current_level: number;
  xp_in_current_level: number;
  last_activity_date: string;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  xp_reward: number;
  requirements: Record<string, any>;
  is_active: boolean;
  created_at: string;
}

export interface StudentAchievement {
  id: string;
  student_id: string;
  achievement_id: string;
  earned_at: string;
  progress: Record<string, any>;
  achievement?: Achievement;
}

export interface LearningAnalytics {
  id: string;
  student_id: string;
  activity_type: string;
  skill_area: string;
  session_duration: number;
  accuracy_score?: number;
  completion_rate?: number;
  xp_earned: number;
  metadata: Record<string, any>;
  recorded_at: string;
}

export interface PerformanceMetrics {
  id: string;
  student_id: string;
  metric_type: string;
  metric_value: number;
  time_period: 'daily' | 'weekly' | 'monthly';
  date_recorded: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface ProgressSummary {
  totalXP: number;
  currentLevel: number;
  xpProgress: number;
  achievementsEarned: number;
  totalAchievements: number;
  weeklyActivity: number;
  skillBreakdown: Record<string, number>;
  recentAchievements: StudentAchievement[];
}

class ProgressAnalyticsService {
  // XP Management
  async getStudentXP(studentId: string): Promise<StudentXP | null> {
    const { data, error } = await supabase
      .from('student_xp')
      .select('*')
      .eq('student_id', studentId)
      .single();

    if (error) {
      console.error('Error fetching student XP:', error);
      return null;
    }
    return data;
  }

  async updateStudentXP(studentId: string, xpToAdd: number): Promise<any> {
    const { data, error } = await supabase.rpc('update_student_xp', {
      student_uuid: studentId,
      xp_to_add: xpToAdd
    });

    if (error) {
      console.error('Error updating student XP:', error);
      return null;
    }
    return data;
  }

  // Achievement Management
  async getAllAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true });

    if (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
    return data || [];
  }

  async getStudentAchievements(studentId: string): Promise<StudentAchievement[]> {
    const { data, error } = await supabase
      .from('student_achievements')
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq('student_id', studentId)
      .order('earned_at', { ascending: false });

    if (error) {
      console.error('Error fetching student achievements:', error);
      return [];
    }
    return data || [];
  }

  async checkAndAwardAchievements(studentId: string, activityData: Record<string, any>): Promise<any[]> {
    const { data, error } = await supabase.rpc('check_achievements', {
      student_uuid: studentId,
      activity_data: activityData
    });

    if (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
    return data || [];
  }

  // Analytics Recording
  async recordLearningActivity(data: Omit<LearningAnalytics, 'id' | 'recorded_at'>): Promise<void> {
    const { error } = await supabase
      .from('learning_analytics')
      .insert([data]);

    if (error) {
      console.error('Error recording learning activity:', error);
    }
  }

  async recordPerformanceMetric(data: Omit<PerformanceMetrics, 'id' | 'created_at'>): Promise<void> {
    const { error } = await supabase
      .from('performance_metrics')
      .insert([data]);

    if (error) {
      console.error('Error recording performance metric:', error);
    }
  }

  // Analytics Queries
  async getLearningAnalytics(studentId: string, days: number = 30): Promise<LearningAnalytics[]> {
    const { data, error } = await supabase
      .from('learning_analytics')
      .select('*')
      .eq('student_id', studentId)
      .gte('recorded_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('recorded_at', { ascending: false });

    if (error) {
      console.error('Error fetching learning analytics:', error);
      return [];
    }
    return data || [];
  }

  async getPerformanceMetrics(studentId: string, timePeriod: string = 'weekly'): Promise<PerformanceMetrics[]> {
    const { data, error } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('student_id', studentId)
      .eq('time_period', timePeriod)
      .order('date_recorded', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching performance metrics:', error);
      return [];
    }
    return data || [];
  }

  // Comprehensive Progress Summary
  async getProgressSummary(studentId: string): Promise<ProgressSummary | null> {
    try {
      const [xpData, achievementsData, allAchievements, analyticsData] = await Promise.all([
        this.getStudentXP(studentId),
        this.getStudentAchievements(studentId),
        this.getAllAchievements(),
        this.getLearningAnalytics(studentId, 7)
      ]);

      if (!xpData) {
        return null;
      }

      // Calculate skill breakdown
      const skillBreakdown: Record<string, number> = {};
      analyticsData.forEach(activity => {
        skillBreakdown[activity.skill_area] = (skillBreakdown[activity.skill_area] || 0) + activity.xp_earned;
      });

      // Calculate weekly activity
      const weeklyActivity = analyticsData.reduce((sum, activity) => sum + activity.session_duration, 0);

      return {
        totalXP: xpData.total_xp,
        currentLevel: xpData.current_level,
        xpProgress: (xpData.xp_in_current_level / 500) * 100, // Assuming 500 XP per level
        achievementsEarned: achievementsData.length,
        totalAchievements: allAchievements.length,
        weeklyActivity: Math.round(weeklyActivity / 60), // Convert to minutes
        skillBreakdown,
        recentAchievements: achievementsData.slice(0, 3)
      };
    } catch (error) {
      console.error('Error getting progress summary:', error);
      return null;
    }
  }

  // Activity Tracking Helpers
  async trackLessonCompletion(studentId: string, lessonData: {
    duration: number;
    accuracy: number;
    skillArea: string;
    xpEarned: number;
  }): Promise<void> {
    // Record analytics
    await this.recordLearningActivity({
      student_id: studentId,
      activity_type: 'lesson_completion',
      skill_area: lessonData.skillArea,
      session_duration: lessonData.duration,
      accuracy_score: lessonData.accuracy,
      completion_rate: 100,
      xp_earned: lessonData.xpEarned,
      metadata: {}
    });

    // Update XP
    await this.updateStudentXP(studentId, lessonData.xpEarned);

    // Check for achievements
    await this.checkAndAwardAchievements(studentId, {
      lessons_completed: 1,
      words_learned: Math.floor(lessonData.duration / 30), // Estimate words learned
      perfect_scores: lessonData.accuracy === 100 ? 1 : 0,
      fast_completion: lessonData.duration < 600 ? 1 : 0 // Under 10 minutes
    });
  }

  async trackSpeakingPractice(studentId: string, speakingData: {
    duration: number;
    overallRating: number;
    xpEarned: number;
  }): Promise<void> {
    await this.recordLearningActivity({
      student_id: studentId,
      activity_type: 'speaking_practice',
      skill_area: 'speaking',
      session_duration: speakingData.duration,
      accuracy_score: speakingData.overallRating * 20, // Convert to 0-100 scale
      completion_rate: 100,
      xp_earned: speakingData.xpEarned,
      metadata: {}
    });

    await this.updateStudentXP(studentId, speakingData.xpEarned);

    await this.checkAndAwardAchievements(studentId, {
      speaking_exercises: 1
    });
  }
}

export const progressAnalyticsService = new ProgressAnalyticsService();
