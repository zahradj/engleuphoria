
import { useState, useEffect, useRef, useCallback } from 'react';
import Peer from 'simple-peer';

interface VideoStream {
  id: string;
  stream: MediaStream | null;
  peer: Peer.Instance | null;
  isLocal: boolean;
}

export function useWebRTC(roomId: string, userId: string) {
  const [streams, setStreams] = useState<VideoStream[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const peersRef = useRef<Map<string, Peer.Instance>>(new Map());

  // Initialize local media stream
  const initializeMedia = useCallback(async (video: boolean = true, audio: boolean = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video ? { width: 640, height: 480 } : false,
        audio: audio
      });
      
      setLocalStream(stream);
      setStreams(prev => [
        ...prev.filter(s => !s.isLocal),
        { id: userId, stream, peer: null, isLocal: true }
      ]);
      
      return stream;
    } catch (err) {
      setError('Failed to access camera/microphone');
      console.error('Media access error:', err);
      return null;
    }
  }, [userId]);

  // Connect to room and get media
  const connectToRoom = useCallback(async () => {
    try {
      const stream = await initializeMedia();
      if (!stream) return;

      setIsConnected(true);
      setError(null);

      // For demo purposes, simulate a remote peer joining
      setTimeout(() => {
        // Create a mock remote stream for demonstration
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#2563eb';
          ctx.fillRect(0, 0, 640, 480);
          ctx.fillStyle = 'white';
          ctx.font = '24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Remote Participant', 320, 240);
        }
        
        const mockRemoteStream = canvas.captureStream(30);
        const remoteUserId = userId === 'teacher-1' ? 'student-1' : 'teacher-1';
        
        setStreams(prev => [
          ...prev,
          { id: remoteUserId, stream: mockRemoteStream, peer: null, isLocal: false }
        ]);
      }, 1000);

    } catch (err) {
      setError('Failed to connect to room');
      console.error('Connection error:', err);
    }
  }, [initializeMedia, userId]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOff(!videoTrack.enabled);
        return !videoTrack.enabled;
      }
    }
    setIsCameraOff(!isCameraOff);
    return !isCameraOff;
  }, [localStream, isCameraOff]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        return !audioTrack.enabled;
      }
    }
    setIsMuted(!isMuted);
    return !isMuted;
  }, [localStream, isMuted]);

  // Cleanup
  const disconnect = useCallback(() => {
    localStream?.getTracks().forEach(track => track.stop());
    peersRef.current.forEach(peer => peer.destroy());
    peersRef.current.clear();
    socketRef.current?.close();
    setStreams([]);
    setLocalStream(null);
    setIsConnected(false);
    setIsMuted(false);
    setIsCameraOff(false);
  }, [localStream]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    streams,
    localStream,
    isConnected,
    error,
    isMuted,
    isCameraOff,
    connectToRoom,
    disconnect,
    toggleVideo,
    toggleAudio,
    initializeMedia
  };
}
