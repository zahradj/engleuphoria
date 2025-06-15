
import { useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { RealTimeVideoService } from '@/services/video/realTimeVideoService';
import { EnhancedVideoService } from '@/services/video/enhancedVideoService';
import { ClassroomSession } from './types';

// Create a union type for video services
type VideoServiceType = RealTimeVideoService | EnhancedVideoService;

interface UseClassroomActionsProps {
  videoService: VideoServiceType | null;
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
    if (!videoService) {
      console.error('❌ Video service not available');
      toast({
        title: "Connection Error",
        description: "Video service is not ready. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (isConnected) {
      console.log('⚠️ Already connected to classroom');
      return;
    }

    try {
      console.log('🚪 Joining classroom...');
      await videoService.joinRoom();
      
      toast({
        title: "Joined Classroom",
        description: "Successfully connected to the video session"
      });

      updateParticipants();
    } catch (error) {
      console.error('❌ Failed to join classroom:', error);
      toast({
        title: "Connection Failed",
        description: "Could not join the classroom. Please try again.",
        variant: "destructive"
      });
    }
  }, [videoService, isConnected, toast, updateParticipants]);

  const leaveClassroom = useCallback(async () => {
    if (!videoService) {
      console.error('❌ Video service not available');
      return;
    }

    try {
      console.log('🚪 Leaving classroom...');
      await videoService.leaveRoom();
      
      toast({
        title: "Left Classroom",
        description: "Disconnected from the video session"
      });

      updateParticipants();
    } catch (error) {
      console.error('❌ Failed to leave classroom:', error);
      toast({
        title: "Error",
        description: "Could not leave the classroom properly",
        variant: "destructive"
      });
    }
  }, [videoService, toast, updateParticipants]);

  const toggleRecording = useCallback(async () => {
    if (!videoService) {
      console.error('❌ Video service not available');
      return false;
    }

    if (userRole !== 'teacher') {
      toast({
        title: "Permission Denied",
        description: "Only teachers can control recording",
        variant: "destructive"
      });
      return false;
    }

    try {
      let success = false;
      if (isRecording) {
        success = await videoService.stopRecording();
        if (success) {
          toast({
            title: "Recording Stopped",
            description: "Class recording has been stopped"
          });
        }
      } else {
        success = await videoService.startRecording();
        if (success) {
          toast({
            title: "Recording Started",
            description: "Class recording has begun"
          });
        }
      }
      
      updateParticipants();
      return success;
    } catch (error) {
      console.error('❌ Failed to toggle recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not change recording status",
        variant: "destructive"
      });
      return false;
    }
  }, [videoService, isRecording, userRole, toast, updateParticipants]);

  const raiseHand = useCallback(async () => {
    if (!videoService) {
      console.error('❌ Video service not available');
      return false;
    }

    try {
      const success = await videoService.raiseHand();
      if (success) {
        toast({
          title: "Hand Raised",
          description: "Your hand has been raised"
        });
      }
      updateParticipants();
      return success;
    } catch (error) {
      console.error('❌ Failed to raise hand:', error);
      return false;
    }
  }, [videoService, toast, updateParticipants]);

  const startScreenShare = useCallback(async () => {
    if (!videoService) {
      console.error('❌ Video service not available');
      return false;
    }

    try {
      const success = await videoService.startScreenShare();
      if (success) {
        toast({
          title: "Screen Sharing Started",
          description: "Your screen is now being shared"
        });
      } else {
        toast({
          title: "Screen Share Failed",
          description: "Could not start screen sharing",
          variant: "destructive"
        });
      }
      updateParticipants();
      return success;
    } catch (error) {
      console.error('❌ Failed to start screen share:', error);
      toast({
        title: "Screen Share Error",
        description: "Screen sharing permission denied or not supported",
        variant: "destructive"
      });
      return false;
    }
  }, [videoService, toast, updateParticipants]);

  return {
    joinClassroom,
    leaveClassroom,
    toggleRecording,
    raiseHand,
    startScreenShare
  };
}
