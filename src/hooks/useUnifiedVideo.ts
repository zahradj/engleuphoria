import { useState, useEffect, useCallback, useRef } from 'react';
import { UnifiedVideoService, UnifiedVideoConfig, ParticipantInfo } from '@/services/video/unifiedVideoService';
import { useToast } from '@/hooks/use-toast';

interface UseUnifiedVideoProps {
  roomId: string;
  displayName: string;
  userRole: 'teacher' | 'student';
}

export function useUnifiedVideo({ roomId, displayName, userRole }: UseUnifiedVideoProps) {
  const [videoService, setVideoService] = useState<UnifiedVideoService | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<ParticipantInfo[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<string>('good');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const serviceRef = useRef<UnifiedVideoService | null>(null);
  const mountedRef = useRef(true);

  // Initialize video service
  useEffect(() => {
    mountedRef.current = true;
    let service: UnifiedVideoService | null = null;

    const initService = async () => {
      if (serviceRef.current) {
        return; // Already initialized
      }

      try {
        setIsLoading(true);
        setError(null);

        const config: UnifiedVideoConfig = {
          roomName: roomId,
          displayName,
          enableRecording: userRole === 'teacher',
          enableScreenShare: true,
          maxParticipants: 10
        };

        const callbacks = {
          onConnectionStatusChanged: (connected: boolean) => {
            if (mountedRef.current) {
              console.log('🔗 Video connection status:', connected);
              setIsConnected(connected);
            }
          },
          onLocalStreamChanged: (stream: MediaStream | null) => {
            if (mountedRef.current) {
              console.log('🎥 Local stream changed:', !!stream);
              setLocalStream(stream);
            }
          },
          onError: (err: string) => {
            if (mountedRef.current) {
              console.error('❌ Video service error:', err);
              setError(err);
              toast({
                title: "Video Error",
                description: err,
                variant: "destructive"
              });
            }
          }
        };

        service = new UnifiedVideoService(config, callbacks);
        await service.initialize();

        if (mountedRef.current) {
          serviceRef.current = service;
          setVideoService(service);
          console.log('✅ Video service initialized successfully');
        }

      } catch (err) {
        if (mountedRef.current) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to initialize video';
          console.error('❌ Video service initialization failed:', errorMessage);
          setError(errorMessage);
        }
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    initService();

    return () => {
      mountedRef.current = false;
      if (service && service !== serviceRef.current) {
        service.dispose();
      }
    };
  }, [roomId, displayName, userRole, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (serviceRef.current) {
        serviceRef.current.dispose();
        serviceRef.current = null;
      }
    };
  }, []);

  const joinRoom = useCallback(async () => {
    if (!videoService) {
      throw new Error('Video service not initialized');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await videoService.joinRoom();
      
      // Update participants after joining
      const currentParticipants = videoService.getParticipants();
      setParticipants(currentParticipants);
      
      toast({
        title: "Connected",
        description: "Successfully joined the classroom",
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join room';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [videoService, toast]);

  const leaveRoom = useCallback(async () => {
    if (!videoService) return;

    try {
      await videoService.leaveRoom();
      setParticipants([]);
      
      toast({
        title: "Disconnected",
        description: "Left the classroom",
      });
      
    } catch (err) {
      console.error('Failed to leave room:', err);
    }
  }, [videoService, toast]);

  const toggleMicrophone = useCallback(async () => {
    if (!videoService) return false;

    try {
      const muted = await videoService.toggleMicrophone();
      setIsMuted(muted);
      
      // Update participants list
      const currentParticipants = videoService.getParticipants();
      setParticipants(currentParticipants);
      
      return muted;
    } catch (err) {
      console.error('Failed to toggle microphone:', err);
      return isMuted;
    }
  }, [videoService, isMuted]);

  const toggleCamera = useCallback(async () => {
    if (!videoService) return false;

    try {
      const cameraOff = await videoService.toggleCamera();
      setIsCameraOff(cameraOff);
      
      // Update participants list
      const currentParticipants = videoService.getParticipants();
      setParticipants(currentParticipants);
      
      return cameraOff;
    } catch (err) {
      console.error('Failed to toggle camera:', err);
      return isCameraOff;
    }
  }, [videoService, isCameraOff]);

  const startRecording = useCallback(async () => {
    if (!videoService || userRole !== 'teacher') return false;

    try {
      const success = await videoService.startRecording();
      setIsRecording(success);
      
      if (success) {
        toast({
          title: "Recording Started",
          description: "The session is now being recorded",
        });
      }
      
      return success;
    } catch (err) {
      console.error('Failed to start recording:', err);
      return false;
    }
  }, [videoService, userRole, toast]);

  const stopRecording = useCallback(async () => {
    if (!videoService) return false;

    try {
      const success = await videoService.stopRecording();
      setIsRecording(false);
      
      if (success) {
        toast({
          title: "Recording Stopped",
          description: "The session recording has ended",
        });
      }
      
      return success;
    } catch (err) {
      console.error('Failed to stop recording:', err);
      return false;
    }
  }, [videoService, toast]);

  const startScreenShare = useCallback(async () => {
    if (!videoService) return false;

    try {
      const success = await videoService.startScreenShare();
      
      if (success) {
        toast({
          title: "Screen Sharing",
          description: "You are now sharing your screen",
        });
      }
      
      return success;
    } catch (err) {
      console.error('Failed to start screen share:', err);
      return false;
    }
  }, [videoService, toast]);

  // Update connection quality periodically
  useEffect(() => {
    if (!videoService || !isConnected) return;

    const interval = setInterval(() => {
      const quality = videoService.getConnectionQuality();
      setConnectionQuality(quality);
    }, 5000);

    return () => clearInterval(interval);
  }, [videoService, isConnected]);

  return {
    // State
    localStream,
    participants,
    isConnected,
    isMuted,
    isCameraOff,
    isRecording,
    connectionQuality,
    error,
    isLoading,
    
    // Actions
    joinRoom,
    leaveRoom,
    toggleMicrophone,
    toggleCamera,
    startRecording,
    stopRecording,
    startScreenShare,
    
    // Utility
    videoService
  };
}