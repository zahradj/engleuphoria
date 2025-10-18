
import { useState, useEffect, useCallback, useMemo } from 'react';
import { RealTimeVideoService } from '@/services/video/realTimeVideoService';
import { EnhancedVideoService } from '@/services/video/enhancedVideoService';
import { ParticipantData } from '@/services/video/enhancedVideoService';

type VideoServiceType = RealTimeVideoService | EnhancedVideoService;

interface UseVideoServiceManagerProps {
  roomId: string;
  displayName: string;
  userRole: 'teacher' | 'student';
}

export function useVideoServiceManager({
  roomId,
  displayName,
  userRole
}: UseVideoServiceManagerProps) {
  const [videoService, setVideoService] = useState<VideoServiceType | null>(null);
  const [participants, setParticipants] = useState<ParticipantData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState('good');
  const [error, setError] = useState<string | null>(null);

  // Memoize service configuration to prevent unnecessary re-initializations
  const serviceConfig = useMemo(() => ({
    roomName: roomId,
    displayName,
    enableRecording: userRole === 'teacher',
    enableScreenShare: true,
    maxParticipants: 10
  }), [roomId, displayName, userRole]);

  const serviceCallbacks = useMemo(() => ({
    onConnectionStatusChanged: (connected: boolean) => {
      console.log('🔗 Connection status changed:', connected);
      setIsConnected(connected);
    },
    onError: (err: string) => {
      console.error('❌ Video service error:', err);
      setError(err);
    },
    onParticipantJoined: (id: string, name: string) => {
      console.log('👋 Participant joined:', id, name);
    },
    onParticipantLeft: (id: string) => {
      console.log('👋 Participant left:', id);
    }
  }), []);

  // Initialize video service only when config changes
  useEffect(() => {
    let mounted = true;

    const initService = async () => {
      try {
        console.log('🎥 Initializing RealTimeVideoService...');
        const service = new RealTimeVideoService();

        await service.initialize();
        
        if (mounted) {
          setVideoService(service);
          console.log('✅ RealTimeVideoService initialized successfully');
        }
      } catch (err) {
        if (mounted) {
          console.error('❌ Failed to initialize video service:', err);
          setError(err instanceof Error ? err.message : 'Video service initialization failed');
        }
      }
    };

    initService();

    return () => {
      mounted = false;
      if (videoService) {
        console.log('🧹 Disposing video service...');
        videoService.dispose();
      }
    };
  }, [serviceConfig, serviceCallbacks]);

  const updateParticipants = useCallback(() => {
    if (videoService) {
      try {
        const currentParticipants = videoService.getParticipants();
        setParticipants(currentParticipants);
        setConnectionQuality(videoService.getConnectionQuality());
        setIsRecording(videoService.isRecordingActive());
      } catch (error) {
        console.error('Error updating participants:', error);
      }
    }
  }, [videoService]);

  return {
    videoService,
    participants,
    isConnected,
    isRecording,
    connectionQuality,
    error,
    updateParticipants
  };
}
