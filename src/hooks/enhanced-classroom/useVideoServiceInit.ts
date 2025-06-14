
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { EnhancedVideoService } from '@/services/video/enhancedVideoService';

interface UseVideoServiceInitProps {
  roomId: string;
  displayName: string;
  userRole: 'teacher' | 'student';
  updateParticipants: () => void;
  setIsConnected: (connected: boolean) => void;
  setError: (error: string | null) => void;
}

export function useVideoServiceInit({
  roomId,
  displayName,
  userRole,
  updateParticipants,
  setIsConnected,
  setError
}: UseVideoServiceInitProps) {
  const [videoService, setVideoService] = useState<EnhancedVideoService | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initializeVideo = async () => {
      try {
        console.log('Initializing enhanced video service for:', { roomId, displayName, userRole });
        
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
              console.log('Enhanced: Participant joined:', participantId, displayName);
              updateParticipants();
            },
            onParticipantLeft: (participantId) => {
              console.log('Enhanced: Participant left:', participantId);
              updateParticipants();
            },
            onConnectionStatusChanged: (connected) => {
              console.log('Enhanced: Connection status changed:', connected);
              setIsConnected(connected);
              if (connected) {
                toast({
                  title: "Connected",
                  description: "Successfully joined the classroom",
                });
              }
            },
            onError: (errorMessage) => {
              console.error('Enhanced: Video service error:', errorMessage);
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
        console.log('Enhanced video service initialized successfully');
        setVideoService(service);
      } catch (err) {
        console.error('Enhanced video service initialization error:', err);
        setError('Failed to initialize video service');
      }
    };

    initializeVideo();

    return () => {
      console.log('Cleaning up enhanced video service');
      if (videoService) {
        videoService.dispose();
      }
    };
  }, [roomId, displayName, userRole, updateParticipants, setIsConnected, setError, toast]);

  return videoService;
}
