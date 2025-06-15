
import { useCallback } from 'react';
import { RealTimeVideoService } from '@/services/video/realTimeVideoService';
import { EnhancedVideoService } from '@/services/video/enhancedVideoService';
import { useMediaAccess } from './useMediaAccess';

type VideoServiceType = RealTimeVideoService | EnhancedVideoService;

interface UseEnhancedMediaControlsProps {
  videoService: VideoServiceType | null;
  isConnected: boolean;
  updateParticipants: () => void;
}

export function useEnhancedMediaControls({
  videoService,
  isConnected,
  updateParticipants
}: UseEnhancedMediaControlsProps) {
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

  // Enhanced toggle functions that sync with video service
  const enhancedToggleMicrophone = useCallback(async () => {
    let newMutedState = isMuted;
    
    // First toggle local media
    newMutedState = toggleMicrophone();
    
    // Then sync with video service if connected
    if (videoService && isConnected) {
      try {
        await videoService.toggleMicrophone();
        console.log('🎤 Enhanced: Microphone synced with service');
      } catch (error) {
        console.error('🎤 Enhanced: Failed to sync microphone:', error);
      }
    }
    
    updateParticipants();
    return newMutedState;
  }, [toggleMicrophone, videoService, isConnected, updateParticipants, isMuted]);

  const enhancedToggleCamera = useCallback(async () => {
    let newCameraState = isCameraOff;
    
    // First toggle local media
    newCameraState = toggleCamera();
    
    // Then sync with video service if connected
    if (videoService && isConnected) {
      try {
        await videoService.toggleCamera();
        console.log('📹 Enhanced: Camera synced with service');
      } catch (error) {
        console.error('📹 Enhanced: Failed to sync camera:', error);
      }
    }
    
    updateParticipants();
    return newCameraState;
  }, [toggleCamera, videoService, isConnected, updateParticipants, isCameraOff]);

  // Get local stream from video service if available, otherwise from media access
  const getActiveLocalStream = useCallback(() => {
    if (videoService && videoService.getLocalStream) {
      return videoService.getLocalStream();
    }
    return localStream;
  }, [videoService, localStream]);

  return {
    localStream: getActiveLocalStream(),
    isMuted,
    isCameraOff,
    mediaError,
    enhancedToggleMicrophone,
    enhancedToggleCamera,
    initializeMedia,
    stopMedia
  };
}
