
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  const initializingRef = useRef(false);
  const serviceRef = useRef<VideoServiceType | null>(null);

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
      initializingRef.current = false;
    },
    onParticipantJoined: (id: string, name: string) => {
      console.log('👋 Participant joined:', id, name);
      updateParticipants();
    },
    onParticipantLeft: (id: string) => {
      console.log('👋 Participant left:', id);
      updateParticipants();
    }
  }), []);

  // Initialize video service only once
  useEffect(() => {
    if (initializingRef.current || serviceRef.current) return;

    const initService = async () => {
      if (initializingRef.current) return;
      initializingRef.current = true;

      try {
        console.log('🎥 Initializing RealTimeVideoService...');
        const service = new RealTimeVideoService(serviceConfig, serviceCallbacks);

        await service.initialize();
        
        serviceRef.current = service;
        setVideoService(service);
        setError(null);
        console.log('✅ RealTimeVideoService initialized successfully');
      } catch (err) {
        console.error('❌ Failed to initialize video service:', err);
        setError(err instanceof Error ? err.message : 'Video service initialization failed');
      } finally {
        initializingRef.current = false;
      }
    };

    initService();

    return () => {
      if (serviceRef.current) {
        console.log('🧹 Disposing video service...');
        serviceRef.current.dispose();
        serviceRef.current = null;
      }
    };
  }, []);

  const updateParticipants = useCallback(() => {
    if (serviceRef.current) {
      try {
        const currentParticipants = serviceRef.current.getParticipants();
        setParticipants(currentParticipants);
        setConnectionQuality(serviceRef.current.getConnectionQuality());
        setIsRecording(serviceRef.current.isRecordingActive());
      } catch (error) {
        console.error('Error updating participants:', error);
      }
    }
  }, []);

  return {
    videoService: serviceRef.current,
    participants,
    isConnected,
    isRecording,
    connectionQuality,
    error,
    updateParticipants
  };
}
