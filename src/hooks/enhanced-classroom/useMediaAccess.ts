
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

export function useMediaAccess() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize media access
  const initializeMedia = useCallback(async () => {
    try {
      console.log('🎤 Requesting media access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setLocalStream(stream);
      setMediaError(null);
      console.log('🎤 Media access granted:', { 
        video: stream.getVideoTracks().length > 0,
        audio: stream.getAudioTracks().length > 0
      });
      
      toast({
        title: "Media Access",
        description: "Camera and microphone access granted",
      });
      
      return stream;
    } catch (error) {
      console.error('🎤 Media access denied:', error);
      const errorMessage = error instanceof Error ? error.message : 'Media access denied';
      setMediaError(errorMessage);
      toast({
        title: "Media Access Denied",
        description: "Please allow camera and microphone access",
        variant: "destructive"
      });
      return null;
    }
  }, [toast]);

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
      console.log('🎤 Media stream stopped');
    }
  }, [localStream]);

  // Initialize media on mount
  useEffect(() => {
    initializeMedia();
    
    return () => {
      stopMedia();
    };
  }, []); // Only run once

  return {
    localStream,
    isMuted,
    isCameraOff,
    mediaError,
    toggleMicrophone,
    toggleCamera,
    initializeMedia,
    stopMedia
  };
}
