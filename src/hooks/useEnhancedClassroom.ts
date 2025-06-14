
import { useState, useCallback } from 'react';
import { ParticipantData } from '@/services/video/enhancedVideoService';
import { UseEnhancedClassroomProps, ClassroomSession } from './enhanced-classroom/types';
import { useVideoServiceInit } from './enhanced-classroom/useVideoServiceInit';
import { useClassroomActions } from './enhanced-classroom/useClassroomActions';
import { useMediaAccess } from './enhanced-classroom/useMediaAccess';

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
  const videoService = useVideoServiceInit({
    roomId,
    displayName,
    userRole,
    setIsConnected,
    setError
  });

  const updateParticipants = useCallback(() => {
    console.log('UpdateParticipants called, videoService:', !!videoService);
    if (videoService) {
      try {
        const currentParticipants = videoService.getParticipants();
        console.log('Updating participants:', currentParticipants);
        setParticipants(currentParticipants);
        setConnectionQuality(videoService.getConnectionQuality());
        setIsRecording(videoService.isRecordingActive());
      } catch (error) {
        console.error('Error updating participants:', error);
      }
    }
  }, [videoService]);

  // Enhanced toggle functions that work with both local media and video service
  const enhancedToggleMicrophone = useCallback(async () => {
    console.log('🎤 Enhanced microphone toggle called');
    
    // Always toggle local media first
    const newMutedState = toggleMicrophone();
    
    // If connected to video service, also toggle there
    if (videoService && isConnected) {
      try {
        await videoService.toggleMicrophone();
        console.log('🎤 Video service microphone toggled');
      } catch (error) {
        console.error('🎤 Failed to toggle microphone in video service:', error);
      }
    }
    
    updateParticipants();
    return newMutedState;
  }, [toggleMicrophone, videoService, isConnected, updateParticipants]);

  const enhancedToggleCamera = useCallback(async () => {
    console.log('📹 Enhanced camera toggle called');
    
    // Always toggle local media first
    const newCameraState = toggleCamera();
    
    // If connected to video service, also toggle there
    if (videoService && isConnected) {
      try {
        await videoService.toggleCamera();
        console.log('📹 Video service camera toggled');
      } catch (error) {
        console.error('📹 Failed to toggle camera in video service:', error);
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

  console.log('useEnhancedClassroom state:', {
    hasVideoService: !!videoService,
    isConnected,
    participantsCount: participants.length,
    isMuted,
    isCameraOff,
    hasLocalStream: !!localStream,
    error: error || mediaError
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
    session,
    participants,
    isRecording,
    
    // Actions
    ...actions,
    toggleMicrophone: enhancedToggleMicrophone,
    toggleCamera: enhancedToggleCamera,
    
    // Utility
    updateParticipants
  };
}
