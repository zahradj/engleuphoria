
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
    setError(null);
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true,
      });
      setStream(userStream);
      mediaRef.current = userStream;
      setIsCameraOff(false);
      setIsMuted(false);
      setIsConnected(true);
    } catch (err) {
      setError("Unable to access camera/microphone");
      setIsConnected(false);
    }
  }, []);

  // Leave: stop all tracks
  const leave = useCallback(() => {
    mediaRef.current?.getTracks().forEach((t) => t.stop());
    setStream(null);
    mediaRef.current = null;
    setIsConnected(false);
    setIsCameraOff(false);
    setIsMuted(false);
  }, []);

  // Mute/unmute audio
  const toggleMicrophone = useCallback(() => {
    if (!mediaRef.current) return;
    const audioTracks = mediaRef.current.getAudioTracks();
    if (audioTracks[0]) {
      audioTracks[0].enabled = !audioTracks[0].enabled;
      setIsMuted(!audioTracks[0].enabled);
    }
  }, []);

  // Disable/enable camera
  const toggleCamera = useCallback(() => {
    if (!mediaRef.current) return;
    const videoTracks = mediaRef.current.getVideoTracks();
    if (videoTracks[0]) {
      videoTracks[0].enabled = !videoTracks[0].enabled;
      setIsCameraOff(!videoTracks[0].enabled);
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
