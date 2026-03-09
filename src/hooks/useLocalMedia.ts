import { useState, useRef, useCallback, useEffect } from "react";
import { logger } from "@/utils/logger";

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
    logger.debug("Attempting to join video call");
    
    if (joinAttemptRef.current) {
      logger.debug("Join already in progress, skipping");
      return;
    }
    
    joinAttemptRef.current = true;
    setError(null);
    
    try {
      if (mediaRef.current && mediaRef.current.active) {
        logger.debug("Reusing existing stream");
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

      logger.debug("Requesting media permissions");
      
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
      
      logger.debug("Media access granted", {
        video: userStream.getVideoTracks().length,
        audio: userStream.getAudioTracks().length,
      });

      if (!joinAttemptRef.current) {
        logger.debug("Join was cancelled, stopping new stream");
        userStream.getTracks().forEach(track => track.stop());
        return;
      }

      setStream(userStream);
      mediaRef.current = userStream;
      setIsCameraOff(false);
      setIsMuted(false);
      setIsConnected(true);
      setError(null);
      
      logger.info("Successfully connected to media");
    } catch (err) {
      logger.error("Media access error", err);
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
    logger.debug("Leaving video call");
    joinAttemptRef.current = false;
    
    if (mediaRef.current) {
      mediaRef.current.getTracks().forEach((track) => {
        logger.debug(`Stopping ${track.kind} track`);
        track.stop();
      });
    }
    
    setStream(null);
    mediaRef.current = null;
    setIsConnected(false);
    setIsCameraOff(false);
    setIsMuted(false);
    setError(null);
    
    logger.info("Successfully left video call");
  }, []);

  // Mute/unmute audio
  const toggleMicrophone = useCallback(() => {
    if (!mediaRef.current) {
      logger.warn("No media stream available for microphone toggle");
      return;
    }
    
    const audioTracks = mediaRef.current.getAudioTracks();
    if (audioTracks[0]) {
      const newMutedState = !audioTracks[0].enabled;
      audioTracks[0].enabled = !newMutedState;
      setIsMuted(newMutedState);
      logger.debug(`Microphone ${newMutedState ? 'muted' : 'unmuted'}`);
    }
  }, []);

  // Disable/enable camera
  const toggleCamera = useCallback(() => {
    if (!mediaRef.current) {
      logger.warn("No media stream available for camera toggle");
      return;
    }
    
    const videoTracks = mediaRef.current.getVideoTracks();
    if (videoTracks[0]) {
      const newCameraOffState = !videoTracks[0].enabled;
      videoTracks[0].enabled = !newCameraOffState;
      setIsCameraOff(newCameraOffState);
      logger.debug(`Camera ${newCameraOffState ? 'disabled' : 'enabled'}`);
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
