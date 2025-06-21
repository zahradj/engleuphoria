
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { SpeakingSession, SpeakingProgress, SpeakingScenario } from '@/types/speaking';
import {
  demoSpeakingScenarios,
  getDemoSpeakingProgress,
  getDemoSpeakingSessions,
  updateDemoProgress,
  addDemoSession,
  getDemoTodaysSpeakingTime
} from './demoSpeakingData';

// Get current user ID with proper authentication handling
const getCurrentUserId = async (): Promise<string | null> => {
  if (!isSupabaseConfigured()) {
    return 'demo-student'; // Return demo user ID
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
};

export const speakingPracticeService = {
  // Scenarios
  async getScenarios(cefrLevel?: string): Promise<SpeakingScenario[]> {
    if (!isSupabaseConfigured()) {
      // Return demo scenarios
      let scenarios = demoSpeakingScenarios;
      if (cefrLevel) {
        scenarios = scenarios.filter(s => s.cefr_level === cefrLevel);
      }
      return scenarios;
    }

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
    if (!isSupabaseConfigured()) {
      return demoSpeakingScenarios.filter(s => s.type === type);
    }

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
  async createSession(sessionData: Omit<SpeakingSession, 'id' | 'created_at' | 'completed_at' | 'student_id'>): Promise<SpeakingSession> {
    if (!isSupabaseConfigured()) {
      // Handle demo mode
      const newSession = addDemoSession(sessionData);
      updateDemoProgress(sessionData);
      console.log('Demo session created successfully:', newSession);
      return newSession;
    }

    const userId = await getCurrentUserId();
    
    if (!userId) {
      throw new Error('User must be authenticated to create a speaking session');
    }
    
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

  async getUserSessions(limit: number = 10): Promise<SpeakingSession[]> {
    if (!isSupabaseConfigured()) {
      const sessions = getDemoSpeakingSessions();
      return sessions.slice(0, limit);
    }

    const userId = await getCurrentUserId();
    
    if (!userId) {
      return [];
    }
    
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
  async getUserProgress(): Promise<SpeakingProgress | null> {
    if (!isSupabaseConfigured()) {
      return getDemoSpeakingProgress();
    }

    const userId = await getCurrentUserId();
    
    if (!userId) {
      return null;
    }
    
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

  async initializeProgress(): Promise<SpeakingProgress | null> {
    if (!isSupabaseConfigured()) {
      return getDemoSpeakingProgress();
    }

    const userId = await getCurrentUserId();
    
    if (!userId) {
      throw new Error('User must be authenticated to initialize progress');
    }
    
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
  async updateBadges(newBadge?: string): Promise<void> {
    if (!isSupabaseConfigured() || !newBadge) {
      console.log('Badges update skipped in demo mode');
      return;
    }

    const userId = await getCurrentUserId();
    
    if (!userId || !newBadge) return;
    
    const progress = await this.getUserProgress();
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
  async getTodaysSpeakingTime(): Promise<number> {
    if (!isSupabaseConfigured()) {
      return getDemoTodaysSpeakingTime();
    }

    const userId = await getCurrentUserId();
    
    if (!userId) {
      return 0;
    }
    
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
