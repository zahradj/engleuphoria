
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { EnhancedVideoService } from '@/services/video/enhancedVideoService';

interface UseVideoServiceInitProps {
  roomId: string;
  displayName: string;
  userRole: 'teacher' | 'student';
  setIsConnected: (connected: boolean) => void;
  setError: (error: string | null) => void;
}

export function useVideoServiceInit({
  roomId,
  displayName,
  userRole,
  setIsConnected,
  setError
}: UseVideoServiceInitProps) {
  const [videoService, setVideoService] = useState<EnhancedVideoService | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const initializeVideo = async () => {
      try {
        console.log('🎥 Starting video service initialization for:', { roomId, displayName, userRole });
        setError(null);
        
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
              console.log('🔥 Enhanced: Participant joined:', participantId, displayName);
            },
            onParticipantLeft: (participantId) => {
              console.log('🔥 Enhanced: Participant left:', participantId);
            },
            onConnectionStatusChanged: (connected) => {
              console.log('🔥 Enhanced: Connection status changed:', connected);
              if (isMounted) {
                setIsConnected(connected);
                console.log('🔥 setIsConnected called with:', connected);
                if (connected) {
                  toast({
                    title: "Connected",
                    description: "Successfully joined the classroom",
                  });
                }
              }
            },
            onError: (errorMessage) => {
              console.error('🔥 Enhanced: Video service error:', errorMessage);
              if (isMounted) {
                setError(errorMessage);
                toast({
                  title: "Connection Error",
                  description: errorMessage,
                  variant: "destructive"
                });
              }
            }
          }
        );

        console.log('🎥 Initializing enhanced video service...');
        await service.initialize();
        
        if (isMounted) {
          console.log('🎥 Enhanced video service initialized successfully, setting service');
          setVideoService(service);
        }
      } catch (err) {
        console.error('🎥 Enhanced video service initialization error:', err);
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to initialize video service';
          setError(errorMessage);
          toast({
            title: "Initialization Error",
            description: errorMessage,
            variant: "destructive"
          });
        }
      }
    };

    initializeVideo();

    return () => {
      console.log('🎥 Cleanup: Setting isMounted to false');
      isMounted = false;
      if (videoService) {
        console.log('🎥 Cleanup: Disposing video service');
        videoService.dispose();
      }
    };
  }, [roomId, displayName, userRole, setIsConnected, setError, toast]);

  console.log('🎥 useVideoServiceInit returning service:', !!videoService);
  return videoService;
}
