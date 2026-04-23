import { useState, useRef, useCallback, useEffect } from "react";
import { logger } from "@/utils/logger";

// Module-level constants (computed once)
const IS_SECURE_CONTEXT =
  typeof window !== "undefined" && (window.isSecureContext || location.protocol === "https:");
const IS_BROWSER_SUPPORTED =
  typeof navigator !== "undefined" && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

const CAMERA_KEY = "preferredCameraId";
const MIC_KEY = "preferredMicId";

/** Read persisted device id; returns undefined if missing or in non-browser contexts. */
const readSavedDevice = (key: string): string | undefined => {
  if (typeof localStorage === "undefined") return undefined;
  const v = localStorage.getItem(key);
  return v && v.length > 0 ? v : undefined;
};

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

  // Connect: request access to webcam & mic — honors persisted device IDs.
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

      // Use saved device IDs from the device-picker dropdown if present.
      const camId = readSavedDevice(CAMERA_KEY);
      const micId = readSavedDevice(MIC_KEY);

      const constraints: MediaStreamConstraints = {
        video: camId
          ? { deviceId: { exact: camId }, width: { ideal: 640 }, height: { ideal: 480 } }
          : { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: micId
          ? { deviceId: { exact: micId }, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
          : { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
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

  // Mute/unmute audio. If `force` is a boolean, set explicitly (true = muted).
  const toggleMicrophone = useCallback((force?: unknown) => {
    if (!mediaRef.current) {
      logger.warn("No media stream available for microphone toggle");
      return;
    }

    const audioTracks = mediaRef.current.getAudioTracks();
    if (audioTracks[0]) {
      const nextEnabled = typeof force === 'boolean' ? !force : !audioTracks[0].enabled;
      audioTracks[0].enabled = nextEnabled;
      setIsMuted(!nextEnabled);
      logger.debug(`Microphone ${nextEnabled ? 'unmuted' : 'muted'}`);
    }
  }, []);

  // Disable/enable camera. If `force` is a boolean, set explicitly (true = camera off).
  const toggleCamera = useCallback((force?: unknown) => {
    if (!mediaRef.current) {
      logger.warn("No media stream available for camera toggle");
      return;
    }

    const videoTracks = mediaRef.current.getVideoTracks();
    if (videoTracks[0]) {
      const nextEnabled = typeof force === 'boolean' ? !force : !videoTracks[0].enabled;
      videoTracks[0].enabled = nextEnabled;
      setIsCameraOff(!nextEnabled);
      logger.debug(`Camera ${nextEnabled ? 'enabled' : 'disabled'}`);
    }
  }, []);

  /**
   * Hot-swap the live video track to a different camera without rejoining.
   * Stops the old track, requests a fresh stream from the chosen device,
   * removes the old track from `mediaRef.current` and adds the new one.
   * Persists the choice in localStorage so subsequent sessions reuse it.
   */
  const switchCamera = useCallback(async (deviceId: string): Promise<boolean> => {
    if (!deviceId) return false;
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId }, width: { ideal: 640 }, height: { ideal: 480 } },
      });
      const newTrack = newStream.getVideoTracks()[0];
      if (!newTrack) return false;

      const current = mediaRef.current;
      if (current) {
        // Remove old video tracks first.
        current.getVideoTracks().forEach((t) => {
          current.removeTrack(t);
          t.stop();
        });
        current.addTrack(newTrack);
        // Force React consumers (video element refs) to re-bind by setting state.
        setStream(current);
      } else {
        // No existing stream — adopt the new one wholesale.
        mediaRef.current = newStream;
        setStream(newStream);
        setIsConnected(true);
      }

      localStorage.setItem(CAMERA_KEY, deviceId);
      setIsCameraOff(false);
      logger.info("Camera switched", { deviceId });
      return true;
    } catch (err) {
      logger.error("switchCamera failed", err);
      return false;
    }
  }, []);

  /** Same idea for the microphone. */
  const switchMicrophone = useCallback(async (deviceId: string): Promise<boolean> => {
    if (!deviceId) return false;
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: deviceId },
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      const newTrack = newStream.getAudioTracks()[0];
      if (!newTrack) return false;

      const current = mediaRef.current;
      if (current) {
        current.getAudioTracks().forEach((t) => {
          current.removeTrack(t);
          t.stop();
        });
        current.addTrack(newTrack);
        setStream(current);
      } else {
        mediaRef.current = newStream;
        setStream(newStream);
        setIsConnected(true);
      }

      localStorage.setItem(MIC_KEY, deviceId);
      setIsMuted(false);
      logger.info("Microphone switched", { deviceId });
      return true;
    } catch (err) {
      logger.error("switchMicrophone failed", err);
      return false;
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
    switchCamera,
    switchMicrophone,
  };
}
