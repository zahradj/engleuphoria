
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
    console.log('Join classroom called:', { 
      hasVideoService: !!videoService, 
      isConnected, 
      roomId 
    });

    if (!videoService) {
      console.error('Video service not available');
      toast({
        title: "Service Error",
        description: "Video service is not ready. Please wait and try again.",
        variant: "destructive"
      });
      return;
    }

    if (isConnected) {
      console.log('Already connected to classroom');
      return;
    }

    try {
      console.log('Attempting to join enhanced classroom...');
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
      updateParticipants();
      console.log('Enhanced classroom joined successfully');
      
      toast({
        title: "Joined Classroom",
        description: "Successfully connected to the classroom",
      });
    } catch (err) {
      console.error('Enhanced join classroom error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast({
        title: "Connection Error",
        description: `Failed to join classroom: ${errorMessage}`,
        variant: "destructive"
      });
    }
  }, [videoService, isConnected, roomId, userId, userRole, setSession, updateParticipants, toast]);

  const leaveClassroom = useCallback(async () => {
    console.log('Leave classroom called');
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
      console.log('Toggling microphone');
      await videoService.toggleMicrophone();
      updateParticipants();
    }
  }, [videoService, updateParticipants]);

  const toggleCamera = useCallback(async () => {
    if (videoService) {
      console.log('Toggling camera');
      await videoService.toggleCamera();
      updateParticipants();
    }
  }, [videoService, updateParticipants]);

  const raiseHand = useCallback(async () => {
    if (videoService) {
      console.log('Raising hand');
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
      console.log('Starting screen share');
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
