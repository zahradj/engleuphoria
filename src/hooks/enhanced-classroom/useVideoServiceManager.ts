
import { useState, useEffect, useCallback } from 'react';
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

  // Initialize video service
  useEffect(() => {
    const initService = async () => {
      try {
        console.log('🎥 Initializing RealTimeVideoService...');
        const service = new RealTimeVideoService(
          {
            roomName: roomId,
            displayName,
            enableRecording: userRole === 'teacher',
            enableScreenShare: true,
            maxParticipants: 10
          },
          {
            onConnectionStatusChanged: (connected: boolean) => {
              console.log('🔗 Connection status changed:', connected);
              setIsConnected(connected);
            },
            onError: (err: string) => {
              console.error('❌ Video service error:', err);
              setError(err);
            },
            onParticipantJoined: (id, name) => {
              console.log('👋 Participant joined:', id, name);
            },
            onParticipantLeft: (id) => {
              console.log('👋 Participant left:', id);
            }
          }
        );

        await service.initialize();
        setVideoService(service);
        console.log('✅ RealTimeVideoService initialized successfully');
      } catch (err) {
        console.error('❌ Failed to initialize video service:', err);
        setError(err instanceof Error ? err.message : 'Video service initialization failed');
      }
    };

    initService();

    return () => {
      if (videoService) {
        console.log('🧹 Disposing video service...');
        videoService.dispose();
      }
    };
  }, [roomId, displayName, userRole]);

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
