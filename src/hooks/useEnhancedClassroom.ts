
import { useState, useCallback, useEffect } from 'react';
import { ParticipantData } from '@/services/video/enhancedVideoService';
import { UseEnhancedClassroomProps, ClassroomSession } from './enhanced-classroom/types';
import { RealTimeVideoService } from '@/services/video/realTimeVideoService';
import { useClassroomActions } from './enhanced-classroom/useClassroomActions';
import { useMediaAccess } from './enhanced-classroom/useMediaAccess';
import { useSessionManager } from './enhanced-classroom/useSessionManager';
import { useRoleManager } from './enhanced-classroom/useRoleManager';
import { useRealTimeSync } from './enhanced-classroom/useRealTimeSync';

export function useEnhancedClassroom({
  roomId,
  userId,
  displayName,
  userRole
}: UseEnhancedClassroomProps) {
  const [participants, setParticipants] = useState<ParticipantData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState('good');
  const [session, setSession] = useState<ClassroomSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoService, setVideoService] = useState<RealTimeVideoService | null>(null);

  // Enhanced hooks
  const sessionManager = useSessionManager({ roomId, userId, userRole });
  const roleManager = useRoleManager({ 
    initialRole: userRole, 
    userId, 
    userName: displayName 
  });
  const realTimeSync = useRealTimeSync({ roomId, userId, userRole });

  // Media access management
  const {
    localStream,
    isMuted,
    isCameraOff,
    mediaError,
    toggleMicrophone,
    toggleCamera,
    initializeMedia,
    stopMedia
  } = useMediaAccess();

  // Initialize video service
  useEffect(() => {
    const initService = async () => {
      try {
        const service = new RealTimeVideoService(
          {
            roomName: roomId,
            displayName,
            enableRecording: userRole === 'teacher',
            enableScreenShare: true,
            maxParticipants: 10
          },
          {
            onConnectionStatusChanged: setIsConnected,
            onError: setError,
            onParticipantJoined: (id, name) => {
              console.log('Participant joined:', id, name);
            },
            onParticipantLeft: (id) => {
              console.log('Participant left:', id);
            }
          }
        );

        await service.initialize();
        setVideoService(service);
      } catch (err) {
        console.error('Failed to initialize video service:', err);
        setError(err instanceof Error ? err.message : 'Video service initialization failed');
      }
    };

    initService();

    return () => {
      if (videoService) {
        videoService.dispose();
      }
    };
  }, [roomId, displayName, userRole]);

  // Auto-join session on mount
  useEffect(() => {
    if (userRole === 'teacher') {
      sessionManager.createSession();
    } else {
      sessionManager.joinSession();
    }
    
    realTimeSync.connectToSync();

    return () => {
      realTimeSync.disconnect();
    };
  }, []);

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

  // Enhanced toggle functions
  const enhancedToggleMicrophone = useCallback(async () => {
    const newMutedState = toggleMicrophone();
    
    if (videoService && isConnected) {
      try {
        await videoService.toggleMicrophone();
      } catch (error) {
        console.error('Failed to toggle microphone in video service:', error);
      }
    }
    
    updateParticipants();
    return newMutedState;
  }, [toggleMicrophone, videoService, isConnected, updateParticipants]);

  const enhancedToggleCamera = useCallback(async () => {
    const newCameraState = toggleCamera();
    
    if (videoService && isConnected) {
      try {
        await videoService.toggleCamera();
      } catch (error) {
        console.error('Failed to toggle camera in video service:', error);
      }
    }
    
    updateParticipants();
    return newCameraState;
  }, [toggleCamera, videoService, isConnected, updateParticipants]);

  // Get classroom actions
  const actions = useClassroomActions({
    videoService,
    isConnected,
    isRecording,
    userRole,
    roomId,
    userId,
    session,
    setSession,
    updateParticipants
  });

  return {
    // Connection state
    isConnected,
    connectionQuality,
    error: error || mediaError,
    
    // Media state
    isMuted,
    isCameraOff,
    localStream,
    
    // Session data
    session: sessionManager.session,
    participants,
    isRecording,
    
    // Enhanced features
    roleManager,
    sessionManager,
    realTimeSync,
    
    // Actions
    ...actions,
    toggleMicrophone: enhancedToggleMicrophone,
    toggleCamera: enhancedToggleCamera,
    
    // Utility
    updateParticipants
  };
}
