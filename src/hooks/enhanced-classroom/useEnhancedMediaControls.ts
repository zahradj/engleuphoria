
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

  return {
    localStream,
    isMuted,
    isCameraOff,
    mediaError,
    enhancedToggleMicrophone,
    enhancedToggleCamera,
    initializeMedia,
    stopMedia
  };
}
