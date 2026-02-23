import { useState, useRef, useCallback, useEffect } from "react";

// Module-level constants (computed once)
const IS_SECURE_CONTEXT =
  typeof window !== "undefined" && (window.isSecureContext || location.protocol === "https:");
const IS_BROWSER_SUPPORTED =
  typeof navigator !== "undefined" && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

export function useLocalMedia() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRef = useRef<MediaStream | null>(null);
  const joinAttemptRef = useRef(false);

  useEffect(() => {
    if (!IS_SECURE_CONTEXT) {
      setError("HTTPS is required for camera and microphone access. Please use HTTPS or localhost.");
    } else if (!IS_BROWSER_SUPPORTED) {
      setError("Your browser doesn't support camera and microphone access.");
    }
  }, []);

  // Connect: request access to webcam & mic
  const join = useCallback(async () => {
    console.log("🎥 Attempting to join video call...");
    
    // Prevent multiple simultaneous join attempts
    if (joinAttemptRef.current) {
      console.log("🎥 Join already in progress, skipping...");
      return;
    }
    
    joinAttemptRef.current = true;
    setError(null);
    
    try {
      // Check if we already have a stream
      if (mediaRef.current && mediaRef.current.active) {
        console.log("🎥 Reusing existing stream");
        setIsConnected(true);
        joinAttemptRef.current = false;
        return;
      }

      if (!IS_SECURE_CONTEXT) {
        throw new Error("HTTPS is required for camera and microphone access");
      }

      if (!IS_BROWSER_SUPPORTED) {
        throw new Error("Your browser doesn't support camera and microphone access");
      }

      console.log("🎥 Requesting media permissions...");
      
      const constraints = {
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: "user"
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
      };

      const userStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log("🎥 Media access granted:", {
        video: userStream.getVideoTracks().length,
        audio: userStream.getAudioTracks().length,
        streamId: userStream.id
      });

      // Ensure we haven't been cancelled while waiting
      if (!joinAttemptRef.current) {
        console.log("🎥 Join was cancelled, stopping new stream");
        userStream.getTracks().forEach(track => track.stop());
        return;
      }

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
        } else if (err.name === "OverconstrainedError") {
          errorMessage = "Camera/microphone doesn't meet the required constraints.";
        }
      }
      
      setError(errorMessage);
      setIsConnected(false);
    } finally {
      joinAttemptRef.current = false;
    }
  }, []);

  // Leave: stop all tracks
  const leave = useCallback(() => {
    console.log("🎥 Leaving video call...");
    joinAttemptRef.current = false;
    
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRef.current) {
        mediaRef.current.getTracks().forEach(track => track.stop());
      }
    };
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
