
import { useState, useRef, useCallback } from "react";

export function useLocalMedia() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRef = useRef<MediaStream | null>(null);

  // Connect: request access to webcam & mic
  const join = useCallback(async () => {
    console.log("🎥 Attempting to join video call...");
    setError(null);
    
    try {
      // Check if we already have a stream
      if (mediaRef.current && mediaRef.current.active) {
        console.log("🎥 Reusing existing stream");
        setIsConnected(true);
        return;
      }

      console.log("🎥 Requesting media permissions...");
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: "user"
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        },
      });
      
      console.log("🎥 Media access granted:", {
        video: userStream.getVideoTracks().length,
        audio: userStream.getAudioTracks().length
      });

      setStream(userStream);
      mediaRef.current = userStream;
      setIsCameraOff(false);
      setIsMuted(false);
      setIsConnected(true);
      setError(null);
      
      console.log("🎥 Successfully connected to media");
    } catch (err) {
      console.error("🎥 Media access error:", err);
      let errorMessage = "Unable to access camera/microphone";
      
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          errorMessage = "Camera/microphone access denied. Please allow permissions and try again.";
        } else if (err.name === "NotFoundError") {
          errorMessage = "No camera or microphone found.";
        } else if (err.name === "NotReadableError") {
          errorMessage = "Camera/microphone is already in use by another application.";
        }
      }
      
      setError(errorMessage);
      setIsConnected(false);
    }
  }, []);

  // Leave: stop all tracks
  const leave = useCallback(() => {
    console.log("🎥 Leaving video call...");
    
    if (mediaRef.current) {
      mediaRef.current.getTracks().forEach((track) => {
        console.log(`🎥 Stopping ${track.kind} track`);
        track.stop();
      });
    }
    
    setStream(null);
    mediaRef.current = null;
    setIsConnected(false);
    setIsCameraOff(false);
    setIsMuted(false);
    setError(null);
    
    console.log("🎥 Successfully left video call");
  }, []);

  // Mute/unmute audio
  const toggleMicrophone = useCallback(() => {
    if (!mediaRef.current) {
      console.warn("🎤 No media stream available for microphone toggle");
      return;
    }
    
    const audioTracks = mediaRef.current.getAudioTracks();
    if (audioTracks[0]) {
      const newMutedState = !audioTracks[0].enabled;
      audioTracks[0].enabled = !newMutedState;
      setIsMuted(newMutedState);
      console.log(`🎤 Microphone ${newMutedState ? 'muted' : 'unmuted'}`);
    }
  }, []);

  // Disable/enable camera
  const toggleCamera = useCallback(() => {
    if (!mediaRef.current) {
      console.warn("📹 No media stream available for camera toggle");
      return;
    }
    
    const videoTracks = mediaRef.current.getVideoTracks();
    if (videoTracks[0]) {
      const newCameraOffState = !videoTracks[0].enabled;
      videoTracks[0].enabled = !newCameraOffState;
      setIsCameraOff(newCameraOffState);
      console.log(`📹 Camera ${newCameraOffState ? 'disabled' : 'enabled'}`);
    }
  }, []);

  return {
    stream,
    isMuted,
    isCameraOff,
    isConnected,
    error,
    join,
    leave,
    toggleMicrophone,
    toggleCamera,
  };
}
