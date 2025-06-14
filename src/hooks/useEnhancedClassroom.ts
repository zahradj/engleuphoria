
import { useState, useCallback } from 'react';
import { ParticipantData } from '@/services/video/enhancedVideoService';
import { UseEnhancedClassroomProps, ClassroomSession } from './enhanced-classroom/types';
import { useVideoServiceInit } from './enhanced-classroom/useVideoServiceInit';
import { useClassroomActions } from './enhanced-classroom/useClassroomActions';

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
  }, [videoService]); // Fixed: Added videoService to dependencies

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
    error
  });

  return {
    // Connection state
    isConnected,
    connectionQuality,
    error,
    
    // Session data
    session,
    participants,
    isRecording,
    
    // Actions
    ...actions,
    
    // Utility
    updateParticipants
  };
}
