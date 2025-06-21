
import { useState, useCallback, useRef } from 'react';
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
  const hasShownJoinedToast = useRef(false);
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

    // Prevent duplicate session creation
    if (session || isLoading) {
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
      
      if (!hasShownJoinedToast.current) {
        toast({
          title: "Session Created",
          description: `Room ${roomId} is ready for students`,
        });
        hasShownJoinedToast.current = true;
      }

    } catch (error) {
      toast({
        title: "Session Error",
        description: "Failed to create session",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [roomId, userId, userRole, toast, session, isLoading]);

  const joinSession = useCallback(async () => {
    // Prevent duplicate session joining
    if (session || isLoading) {
      return;
    }

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
      
      if (!hasShownJoinedToast.current) {
        toast({
          title: "Session Joined",
          description: `Welcome to room ${roomId}`,
        });
        hasShownJoinedToast.current = true;
      }

    } catch (error) {
      toast({
        title: "Join Error",
        description: "Failed to join session",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [roomId, userId, userRole, toast, session, isLoading]);

  const leaveSession = useCallback(() => {
    if (session) {
      setSession(null);
      hasShownJoinedToast.current = false;
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
