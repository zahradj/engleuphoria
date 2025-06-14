
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

export function useMediaAccess() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Initialize media access
  const initializeMedia = useCallback(async () => {
    if (isInitialized) return localStream;
    
    try {
      console.log('🎤 Requesting media access...');
      
      // Try to get both video and audio first
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: true
        });
      } catch (error) {
        console.warn('🎤 Failed to get video+audio, trying audio only:', error);
        // Fallback to audio only
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        });
        setIsCameraOff(true);
      }
      
      setLocalStream(stream);
      setMediaError(null);
      setIsInitialized(true);
      
      console.log('🎤 Media access granted:', { 
        video: stream.getVideoTracks().length > 0,
        audio: stream.getAudioTracks().length > 0
      });
      
      toast({
        title: "Media Access Granted",
        description: `${stream.getVideoTracks().length > 0 ? 'Camera and microphone' : 'Microphone only'} ready`,
      });
      
      return stream;
    } catch (error) {
      console.error('🎤 Media access denied:', error);
      const errorMessage = error instanceof Error ? error.message : 'Media access denied';
      setMediaError(errorMessage);
      setIsInitialized(true); // Mark as initialized even on error to prevent infinite retries
      
      toast({
        title: "Media Access Required",
        description: "Please allow camera and microphone access to join the classroom",
        variant: "destructive"
      });
      
      return null;
    }
  }, [toast, isInitialized, localStream]);

  // Toggle microphone
  const toggleMicrophone = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        console.log('🎤 Microphone toggled:', !audioTrack.enabled ? 'muted' : 'unmuted');
        return !audioTrack.enabled;
      }
    }
    
    // If no stream, toggle state only
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    console.log('🎤 Microphone state toggled (no stream):', newMutedState ? 'muted' : 'unmuted');
    return newMutedState;
  }, [localStream, isMuted]);

  // Toggle camera
  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOff(!videoTrack.enabled);
        console.log('📹 Camera toggled:', !videoTrack.enabled ? 'off' : 'on');
        return !videoTrack.enabled;
      }
    }
    
    // If no stream, toggle state only
    const newCameraState = !isCameraOff;
    setIsCameraOff(newCameraState);
    console.log('📹 Camera state toggled (no stream):', newCameraState ? 'off' : 'on');
    return newCameraState;
  }, [localStream, isCameraOff]);

  // Stop media stream
  const stopMedia = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
      setIsInitialized(false);
      console.log('🎤 Media stream stopped');
    }
  }, [localStream]);

  // Initialize media on mount with error handling
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isInitialized) {
        initializeMedia().catch(console.error);
      }
    }, 1000); // Delay to allow component to settle

    return () => {
      clearTimeout(timeoutId);
    };
  }, []); // Only run once

  return {
    localStream,
    isMuted,
    isCameraOff,
    mediaError,
    isInitialized,
    toggleMicrophone,
    toggleCamera,
    initializeMedia,
    stopMedia
  };
}
