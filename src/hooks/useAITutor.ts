import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AITutoringSession {
  id: string;
  student_id: string;
  conversation_id: string;
  session_type: 'voice' | 'text' | 'mixed';
  topic?: string;
  cefr_level: string;
  duration_seconds: number;
  messages_count: number;
  ai_model: string;
  voice_model?: string;
  session_data: any;
  learning_objectives: string[];
  completed_objectives: string[];
  session_rating?: number;
  feedback_notes?: string;
  started_at: string;
  ended_at?: string;
}

export interface ConversationMessage {
  id: string;
  session_id: string;
  message_type: 'user_text' | 'user_audio' | 'ai_text' | 'ai_audio';
  content?: string;
  audio_url?: string;
  audio_duration?: number;
  metadata: any;
  processing_time_ms?: number;
  tokens_used?: number;
  created_at: string;
}

export const useAITutor = () => {
  const [currentSession, setCurrentSession] = useState<AITutoringSession | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Start new tutoring session
  const startSession = async (
    studentId: string,
    cefrLevel: string,
    sessionType: 'voice' | 'text' | 'mixed' = 'text',
    topic?: string
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('ai_tutoring_sessions')
        .insert({
          student_id: studentId,
          conversation_id: crypto.randomUUID(),
          session_type: sessionType,
          topic,
          cefr_level: cefrLevel,
          ai_model: 'gpt-4.1-2025-04-14',
          voice_model: sessionType !== 'text' ? 'alloy' : null,
          learning_objectives: ['conversational_practice', 'grammar_improvement', 'vocabulary_expansion']
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentSession(data);
      setIsConnected(true);
      setMessages([]);

      toast({
        title: "AI Tutor Started",
        description: `Started ${sessionType} session for ${cefrLevel} level`,
      });

      return data;
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: "Error",
        description: "Failed to start AI tutoring session",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // End current session
  const endSession = async (rating?: number, feedback?: string) => {
    if (!currentSession) return;

    try {
      const endTime = new Date().toISOString();
      const duration = Math.floor((new Date(endTime).getTime() - new Date(currentSession.started_at).getTime()) / 1000);

      const { error } = await supabase
        .from('ai_tutoring_sessions')
        .update({
          ended_at: endTime,
          duration_seconds: duration,
          session_rating: rating,
          feedback_notes: feedback
        })
        .eq('id', currentSession.id);

      if (error) throw error;

      setCurrentSession(null);
      setIsConnected(false);
      setMessages([]);

      toast({
        title: "Session Ended",
        description: "AI tutoring session completed successfully",
      });
    } catch (error) {
      console.error('Error ending session:', error);
      toast({
        title: "Error",
        description: "Failed to end session properly",
        variant: "destructive"
      });
    }
  };

  // Send message to AI tutor
  const sendMessage = async (message: string) => {
    if (!currentSession) {
      throw new Error('No active session');
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-tutor', {
        body: {
          message,
          sessionId: currentSession.id,
          studentId: currentSession.student_id,
          cefrLevel: currentSession.cefr_level,
          sessionType: currentSession.session_type
        }
      });

      if (error) throw error;

      // Refresh messages
      await loadMessages(currentSession.id);

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message to AI tutor",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Load conversation messages
  const loadMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('ai_conversation_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load conversation messages",
        variant: "destructive"
      });
    }
  };

  // Get user's tutoring sessions history
  const getTutoringSessions = async (studentId: string, limit = 10) => {
    try {
      const { data, error } = await supabase
        .from('ai_tutoring_sessions')
        .select('*')
        .eq('student_id', studentId)
        .order('started_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load tutoring sessions",
        variant: "destructive"
      });
      return [];
    }
  };

  // Resume existing session
  const resumeSession = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('ai_tutoring_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) throw error;

      // Only resume if session hasn't ended
      if (!data.ended_at) {
        setCurrentSession(data);
        setIsConnected(true);
        await loadMessages(sessionId);

        toast({
          title: "Session Resumed",
          description: "Continued your AI tutoring session",
        });
      } else {
        toast({
          title: "Session Ended",
          description: "This session has already been completed",
          variant: "destructive"
        });
      }

      return data;
    } catch (error) {
      console.error('Error resuming session:', error);
      toast({
        title: "Error",
        description: "Failed to resume session",
        variant: "destructive"
      });
    }
  };

  // Mark learning objectives as completed
  const markObjectiveCompleted = async (objective: string) => {
    if (!currentSession) return;

    try {
      const updatedObjectives = [...(currentSession.completed_objectives || []), objective];
      
      const { error } = await supabase
        .from('ai_tutoring_sessions')
        .update({
          completed_objectives: updatedObjectives
        })
        .eq('id', currentSession.id);

      if (error) throw error;

      setCurrentSession({
        ...currentSession,
        completed_objectives: updatedObjectives
      });
    } catch (error) {
      console.error('Error marking objective completed:', error);
    }
  };

  // Get session analytics
  const getSessionAnalytics = async (studentId: string, days = 30) => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('ai_tutoring_sessions')
        .select('*')
        .eq('student_id', studentId)
        .gte('started_at', startDate.toISOString())
        .not('ended_at', 'is', null);

      if (error) throw error;

      // Calculate analytics
      const totalSessions = data.length;
      const totalTime = data.reduce((sum, session) => sum + (session.duration_seconds || 0), 0);
      const averageRating = data.filter(s => s.session_rating).reduce((sum, s) => sum + s.session_rating, 0) / data.filter(s => s.session_rating).length || 0;
      const sessionTypes = data.reduce((acc, session) => {
        acc[session.session_type] = (acc[session.session_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalSessions,
        totalTimeMinutes: Math.floor(totalTime / 60),
        averageRating: Math.round(averageRating * 100) / 100,
        sessionTypes,
        recentSessions: data.slice(-5)
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      return null;
    }
  };

  return {
    currentSession,
    messages,
    isConnected,
    isLoading,
    isProcessing,
    startSession,
    endSession,
    sendMessage,
    loadMessages,
    getTutoringSessions,
    resumeSession,
    markObjectiveCompleted,
    getSessionAnalytics
  };
};