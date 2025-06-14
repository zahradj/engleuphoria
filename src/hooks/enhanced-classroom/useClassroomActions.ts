
import { useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { EnhancedVideoService } from '@/services/video/enhancedVideoService';
import { ClassroomSession } from './types';

interface UseClassroomActionsProps {
  videoService: EnhancedVideoService | null;
  isConnected: boolean;
  isRecording: boolean;
  userRole: 'teacher' | 'student';
  roomId: string;
  userId: string;
  session: ClassroomSession | null;
  setSession: (session: ClassroomSession | null) => void;
  updateParticipants: () => void;
}

export function useClassroomActions({
  videoService,
  isConnected,
  isRecording,
  userRole,
  roomId,
  userId,
  session,
  setSession,
  updateParticipants
}: UseClassroomActionsProps) {
  const { toast } = useToast();

  const joinClassroom = useCallback(async () => {
    if (videoService && !isConnected) {
      try {
        console.log('Joining enhanced classroom...');
        await videoService.joinRoom();
        
        // Create session record
        const newSession: ClassroomSession = {
          id: Date.now().toString(),
          roomId,
          teacherId: userRole === 'teacher' ? userId : '',
          studentId: userRole === 'student' ? userId : '',
          startTime: new Date(),
          isRecording: false,
          status: 'active'
        };
        
        setSession(newSession);
        console.log('Enhanced classroom joined successfully');
      } catch (err) {
        console.error('Enhanced join classroom error:', err);
        toast({
          title: "Connection Error",
          description: "Failed to join classroom",
          variant: "destructive"
        });
      }
    }
  }, [videoService, isConnected, roomId, userId, userRole, setSession, toast]);

  const leaveClassroom = useCallback(async () => {
    if (videoService) {
      console.log('Leaving enhanced classroom...');
      await videoService.leaveRoom();
      
      if (session) {
        const updatedSession = {
          ...session,
          endTime: new Date(),
          status: 'ended' as const
        };
        setSession(updatedSession);
      }
      
      toast({
        title: "Left Classroom",
        description: "You have successfully left the classroom",
      });
    }
  }, [videoService, session, setSession, toast]);

  const toggleRecording = useCallback(async () => {
    if (videoService && userRole === 'teacher') {
      try {
        if (isRecording) {
          await videoService.stopRecording();
          toast({
            title: "Recording Stopped",
            description: "Classroom recording has been stopped",
          });
        } else {
          await videoService.startRecording();
          toast({
            title: "Recording Started",
            description: "Classroom is now being recorded",
          });
        }
        updateParticipants();
      } catch (err) {
        toast({
          title: "Recording Error",
          description: "Failed to toggle recording",
          variant: "destructive"
        });
      }
    }
  }, [videoService, userRole, isRecording, toast, updateParticipants]);

  const toggleMicrophone = useCallback(async () => {
    if (videoService) {
      await videoService.toggleMicrophone();
      updateParticipants();
    }
  }, [videoService, updateParticipants]);

  const toggleCamera = useCallback(async () => {
    if (videoService) {
      await videoService.toggleCamera();
      updateParticipants();
    }
  }, [videoService, updateParticipants]);

  const raiseHand = useCallback(async () => {
    if (videoService) {
      await videoService.raiseHand();
      updateParticipants();
      toast({
        title: "Hand Raised",
        description: "Your hand has been raised",
      });
    }
  }, [videoService, updateParticipants, toast]);

  const startScreenShare = useCallback(async () => {
    if (videoService) {
      await videoService.startScreenShare();
      toast({
        title: "Screen Share",
        description: "Screen sharing has been started",
      });
    }
  }, [videoService, toast]);

  return {
    joinClassroom,
    leaveClassroom,
    toggleRecording,
    toggleMicrophone,
    toggleCamera,
    raiseHand,
    startScreenShare
  };
}
