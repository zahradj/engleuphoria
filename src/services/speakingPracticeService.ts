
import { supabase } from '@/lib/supabase';
import { SpeakingSession, SpeakingProgress, SpeakingScenario } from '@/types/speaking';

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
    if (error) throw error;
    return data || [];
  },

  async getScenariosByType(type: 'role_play' | 'picture_talk' | 'random_questions'): Promise<SpeakingScenario[]> {
    const { data, error } = await supabase
      .from('speaking_scenarios')
      .select('*')
      .eq('type', type)
      .eq('is_active', true)
      .order('difficulty_rating', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Sessions
  async createSession(sessionData: Omit<SpeakingSession, 'id' | 'created_at' | 'completed_at'>): Promise<SpeakingSession> {
    const { data, error } = await supabase
      .from('speaking_sessions')
      .insert([sessionData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserSessions(studentId: string, limit: number = 10): Promise<SpeakingSession[]> {
    const { data, error } = await supabase
      .from('speaking_sessions')
      .select('*')
      .eq('student_id', studentId)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // Progress
  async getUserProgress(studentId: string): Promise<SpeakingProgress | null> {
    const { data, error } = await supabase
      .from('speaking_progress')
      .select('*')
      .eq('student_id', studentId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async initializeProgress(studentId: string): Promise<SpeakingProgress> {
    const { data, error } = await supabase
      .from('speaking_progress')
      .insert([{
        student_id: studentId,
        current_cefr_level: 'A1'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Badges and achievements
  async updateBadges(studentId: string, newBadge: string): Promise<void> {
    const progress = await this.getUserProgress(studentId);
    if (!progress) return;

    const currentBadges = progress.badges_earned || [];
    if (currentBadges.includes(newBadge)) return;

    const { error } = await supabase
      .from('speaking_progress')
      .update({
        badges_earned: [...currentBadges, newBadge],
        updated_at: new Date().toISOString()
      })
      .eq('student_id', studentId);

    if (error) throw error;
  },

  // Speaking time tracking for dashboard
  async getTodaysSpeakingTime(studentId: string): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('speaking_sessions')
      .select('duration_seconds')
      .eq('student_id', studentId)
      .gte('completed_at', `${today}T00:00:00`)
      .lt('completed_at', `${today}T23:59:59`);

    if (error) throw error;
    
    return (data || []).reduce((total, session) => total + session.duration_seconds, 0);
  }
};
