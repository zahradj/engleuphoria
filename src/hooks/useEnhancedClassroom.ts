
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { EnhancedVideoService, ParticipantData } from '@/services/enhancedVideoService';

interface ClassroomSession {
  id: string;
  roomId: string;
  teacherId: string;
  studentId: string;
  startTime: Date;
  endTime?: Date;
  isRecording: boolean;
  status: 'waiting' | 'active' | 'ended';
}

interface UseEnhancedClassroomProps {
  roomId: string;
  userId: string;
  displayName: string;
  userRole: 'teacher' | 'student';
}

export function useEnhancedClassroom({
  roomId,
  userId,
  displayName,
  userRole
}: UseEnhancedClassroomProps) {
  const [videoService, setVideoService] = useState<EnhancedVideoService | null>(null);
  const [participants, setParticipants] = useState<ParticipantData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState('good');
  const [session, setSession] = useState<ClassroomSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize video service
  useEffect(() => {
    const initializeVideo = async () => {
      try {
        const service = new EnhancedVideoService(
          {
            roomName: roomId,
            displayName: displayName,
            enableRecording: userRole === 'teacher',
            enableScreenShare: true,
            maxParticipants: 2
          },
          {
            onParticipantJoined: (participantId, displayName) => {
              console.log('Participant joined:', participantId, displayName);
              updateParticipants();
            },
            onParticipantLeft: (participantId) => {
              console.log('Participant left:', participantId);
              updateParticipants();
            },
            onConnectionStatusChanged: (connected) => {
              setIsConnected(connected);
              if (connected) {
                toast({
                  title: "Connected",
                  description: "Successfully joined the classroom",
                });
              }
            },
            onError: (errorMessage) => {
              setError(errorMessage);
              toast({
                title: "Connection Error",
                description: errorMessage,
                variant: "destructive"
              });
            }
          }
        );

        await service.initialize();
        setVideoService(service);
      } catch (err) {
        setError('Failed to initialize video service');
        console.error('Video service initialization error:', err);
      }
    };

    initializeVideo();

    return () => {
      if (videoService) {
        videoService.dispose();
      }
    };
  }, [roomId, displayName, userRole]);

  const updateParticipants = useCallback(() => {
    if (videoService) {
      const currentParticipants = videoService.getParticipants();
      setParticipants(currentParticipants);
      setConnectionQuality(videoService.getConnectionQuality());
      setIsRecording(videoService.isRecordingActive());
    }
  }, [videoService]);

  const joinClassroom = useCallback(async () => {
    if (videoService && !isConnected) {
      try {
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
      } catch (err) {
        setError('Failed to join classroom');
        console.error('Join classroom error:', err);
      }
    }
  }, [videoService, isConnected, roomId, userId, userRole]);

  const leaveClassroom = useCallback(async () => {
    if (videoService) {
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
  }, [videoService, session, toast]);

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
    // Connection state
    isConnected,
    connectionQuality,
    error,
    
    // Session data
    session,
    participants,
    isRecording,
    
    // Actions
    joinClassroom,
    leaveClassroom,
    toggleRecording,
    toggleMicrophone,
    toggleCamera,
    raiseHand,
    startScreenShare,
    
    // Utility
    updateParticipants
  };
}
