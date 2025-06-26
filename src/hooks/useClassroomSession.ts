
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ClassroomSession {
  id: string;
  room_id: string;
  teacher_id: string;
  session_status: 'waiting' | 'started' | 'ended';
  started_at?: string;
  ended_at?: string;
  created_at: string;
  updated_at: string;
}

interface UseClassroomSessionProps {
  roomId: string;
  userId: string;
  userRole: 'teacher' | 'student';
}

export function useClassroomSession({ roomId, userId, userRole }: UseClassroomSessionProps) {
  const [session, setSession] = useState<ClassroomSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load or create session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First, try to find existing session
        const { data: existingSession, error: fetchError } = await supabase
          .from('classroom_sessions')
          .select('*')
          .eq('room_id', roomId)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw fetchError;
        }

        if (existingSession) {
          setSession(existingSession);
        } else if (userRole === 'teacher') {
          // Create new session if teacher
          const { data: newSession, error: createError } = await supabase
            .from('classroom_sessions')
            .insert({
              room_id: roomId,
              teacher_id: userId,
              session_status: 'waiting'
            })
            .select()
            .single();

          if (createError) throw createError;
          setSession(newSession);
        }
      } catch (err) {
        console.error('Session initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize session');
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, [roomId, userId, userRole]);

  // Set up realtime subscription
  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`classroom_session_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'classroom_sessions',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          console.log('Session state changed:', payload);
          
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setSession(payload.new as ClassroomSession);
            
            // Show toast notifications for session state changes
            if (payload.new.session_status === 'started' && userRole === 'student') {
              toast({
                title: "Session Started!",
                description: "Your teacher has started the session. You can now join the video.",
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, userRole, toast]);

  const startSession = useCallback(async () => {
    if (userRole !== 'teacher' || !session) return;

    try {
      const { error } = await supabase
        .from('classroom_sessions')
        .update({
          session_status: 'started',
          started_at: new Date().toISOString()
        })
        .eq('id', session.id);

      if (error) throw error;

      toast({
        title: "Session Started",
        description: "Students can now join the video session.",
      });
    } catch (err) {
      console.error('Failed to start session:', err);
      toast({
        title: "Error",
        description: "Failed to start session. Please try again.",
        variant: "destructive"
      });
    }
  }, [session, userRole, toast]);

  const endSession = useCallback(async () => {
    if (userRole !== 'teacher' || !session) return;

    try {
      const { error } = await supabase
        .from('classroom_sessions')
        .update({
          session_status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('id', session.id);

      if (error) throw error;

      toast({
        title: "Session Ended",
        description: "The classroom session has been ended.",
      });
    } catch (err) {
      console.error('Failed to end session:', err);
      toast({
        title: "Error",
        description: "Failed to end session. Please try again.",
        variant: "destructive"
      });
    }
  }, [session, userRole, toast]);

  return {
    session,
    isLoading,
    error,
    startSession,
    endSession,
    canStartSession: userRole === 'teacher' && session?.session_status === 'waiting',
    canJoinVideo: session?.session_status === 'started',
    isWaitingForTeacher: userRole === 'student' && session?.session_status === 'waiting'
  };
}
