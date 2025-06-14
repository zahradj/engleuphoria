
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

interface SessionData {
  id: string;
  roomId: string;
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
  participants: string[];
  settings: {
    allowRecording: boolean;
    maxParticipants: number;
    isPublic: boolean;
  };
}

interface UseSessionManagerProps {
  roomId: string;
  userId: string;
  userRole: 'teacher' | 'student';
}

export function useSessionManager({ roomId, userId, userRole }: UseSessionManagerProps) {
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createSession = useCallback(async () => {
    if (userRole !== 'teacher') {
      toast({
        title: "Permission Denied",
        description: "Only teachers can create sessions",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const newSession: SessionData = {
        id: `session-${Date.now()}`,
        roomId,
        createdBy: userId,
        createdAt: new Date(),
        isActive: true,
        participants: [userId],
        settings: {
          allowRecording: true,
          maxParticipants: 10,
          isPublic: false
        }
      };

      setSession(newSession);
      console.log('📋 Session created:', newSession.id);
      
      toast({
        title: "Session Created",
        description: `Room ${roomId} is ready for students`,
      });

    } catch (error) {
      toast({
        title: "Session Error",
        description: "Failed to create session",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [roomId, userId, userRole, toast]);

  const joinSession = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate finding existing session or creating one
      const existingSession: SessionData = {
        id: `session-${roomId}`,
        roomId,
        createdBy: userRole === 'teacher' ? userId : 'teacher-id',
        createdAt: new Date(),
        isActive: true,
        participants: [userId],
        settings: {
          allowRecording: userRole === 'teacher',
          maxParticipants: 10,
          isPublic: false
        }
      };

      setSession(existingSession);
      console.log('📋 Session joined:', existingSession.id);
      
      toast({
        title: "Session Joined",
        description: `Welcome to room ${roomId}`,
      });

    } catch (error) {
      toast({
        title: "Join Error",
        description: "Failed to join session",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [roomId, userId, userRole, toast]);

  const leaveSession = useCallback(() => {
    if (session) {
      setSession(null);
      console.log('📋 Session left');
      
      toast({
        title: "Session Left",
        description: "You have left the classroom",
      });
    }
  }, [session, toast]);

  const updateSessionSettings = useCallback((newSettings: Partial<SessionData['settings']>) => {
    if (userRole !== 'teacher') return;
    
    if (session) {
      setSession({
        ...session,
        settings: { ...session.settings, ...newSettings }
      });
    }
  }, [session, userRole]);

  return {
    session,
    isLoading,
    createSession,
    joinSession,
    leaveSession,
    updateSessionSettings
  };
}
