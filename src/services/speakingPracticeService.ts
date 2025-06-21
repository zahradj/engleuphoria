
import { supabase } from '@/lib/supabase';
import { SpeakingSession, SpeakingProgress, SpeakingScenario } from '@/types/speaking';

// Get current user ID with fallback for demo mode
const getCurrentUserId = async (): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || 'demo-user-id';
};

export const speakingPracticeService = {
  // Scenarios
  async getScenarios(cefrLevel?: string): Promise<SpeakingScenario[]> {
    let query = supabase
      .from('speaking_scenarios')
      .select('*')
      .eq('is_active', true)
      .order('difficulty_rating', { ascending: true });

    if (cefrLevel) {
      query = query.eq('cefr_level', cefrLevel);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching scenarios:', error);
      throw error;
    }
    return data || [];
  },

  async getScenariosByType(type: 'role_play' | 'picture_talk' | 'random_questions'): Promise<SpeakingScenario[]> {
    const { data, error } = await supabase
      .from('speaking_scenarios')
      .select('*')
      .eq('type', type)
      .eq('is_active', true)
      .order('difficulty_rating', { ascending: true });

    if (error) {
      console.error('Error fetching scenarios by type:', error);
      throw error;
    }
    return data || [];
  },

  // Sessions
  async createSession(sessionData: Omit<SpeakingSession, 'id' | 'created_at' | 'completed_at'>): Promise<SpeakingSession> {
    const userId = await getCurrentUserId();
    
    const sessionWithUser = {
      ...sessionData,
      student_id: userId,
      completed_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('speaking_sessions')
      .insert([sessionWithUser])
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      throw error;
    }
    
    console.log('Session created successfully:', data);
    return data;
  },

  async getUserSessions(studentId?: string, limit: number = 10): Promise<SpeakingSession[]> {
    const userId = studentId || await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('speaking_sessions')
      .select('*')
      .eq('student_id', userId)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user sessions:', error);
      throw error;
    }
    return data || [];
  },

  // Progress
  async getUserProgress(studentId?: string): Promise<SpeakingProgress | null> {
    const userId = studentId || await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('speaking_progress')
      .select('*')
      .eq('student_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user progress:', error);
      throw error;
    }
    return data;
  },

  async initializeProgress(studentId?: string): Promise<SpeakingProgress> {
    const userId = studentId || await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('speaking_progress')
      .insert([{
        student_id: userId,
        current_cefr_level: 'A1',
        total_speaking_time: 0,
        total_sessions: 0,
        current_streak: 0,
        longest_streak: 0,
        speaking_xp: 0,
        badges_earned: []
      }])
      .select()
      .single();

    if (error) {
      console.error('Error initializing progress:', error);
      throw error;
    }
    
    console.log('Progress initialized:', data);
    return data;
  },

  // Badges and achievements
  async updateBadges(studentId?: string, newBadge?: string): Promise<void> {
    const userId = studentId || await getCurrentUserId();
    
    if (!newBadge) return;
    
    const progress = await this.getUserProgress(userId);
    if (!progress) return;

    const currentBadges = progress.badges_earned || [];
    if (currentBadges.includes(newBadge)) return;

    const { error } = await supabase
      .from('speaking_progress')
      .update({
        badges_earned: [...currentBadges, newBadge],
        updated_at: new Date().toISOString()
      })
      .eq('student_id', userId);

    if (error) {
      console.error('Error updating badges:', error);
      throw error;
    }
    
    console.log('Badge added:', newBadge);
  },

  // Speaking time tracking for dashboard
  async getTodaysSpeakingTime(studentId?: string): Promise<number> {
    const userId = studentId || await getCurrentUserId();
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('speaking_sessions')
      .select('duration_seconds')
      .eq('student_id', userId)
      .gte('completed_at', `${today}T00:00:00`)
      .lt('completed_at', `${today}T23:59:59`);

    if (error) {
      console.error('Error fetching today\'s speaking time:', error);
      throw error;
    }
    
    return (data || []).reduce((total, session) => total + session.duration_seconds, 0);
  }
};
