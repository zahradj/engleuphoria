
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

  // Create peer connection
  const createPeer = useCallback((targetUserId: string, initiator: boolean, stream: MediaStream) => {
    const peer = new Peer({
      initiator,
      trickle: false,
      stream
    });

    peer.on('signal', (signal) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: 'signal',
          signal,
          targetUserId,
          userId
        }));
      }
    });

    peer.on('stream', (remoteStream) => {
      setStreams(prev => {
        const filtered = prev.filter(s => s.id !== targetUserId);
        return [...filtered, { id: targetUserId, stream: remoteStream, peer, isLocal: false }];
      });
    });

    peer.on('error', (err) => {
      console.error('Peer error:', err);
      setError('Connection error with peer');
    });

    peer.on('close', () => {
      setStreams(prev => prev.filter(s => s.id !== targetUserId));
      peersRef.current.delete(targetUserId);
    });

    peersRef.current.set(targetUserId, peer);
    return peer;
  }, [userId]);

  // Connect to signaling server (mock WebSocket for demo)
  const connectToRoom = useCallback(async () => {
    try {
      const stream = await initializeMedia();
      if (!stream) return;

      // Mock WebSocket connection for demo
      const mockSocket = {
        readyState: WebSocket.OPEN,
        send: (data: string) => {
          console.log('Mock WebSocket send:', data);
          // In a real implementation, this would send to a signaling server
        },
        close: () => console.log('Mock WebSocket closed')
      } as WebSocket;

      socketRef.current = mockSocket;
      setIsConnected(true);

      // Mock receiving other users in the room
      setTimeout(() => {
        // Simulate another user joining for demo
        if (userId !== 'teacher-1') {
          const mockRemoteStream = new MediaStream();
          setStreams(prev => [
            ...prev,
            { id: 'teacher-1', stream: mockRemoteStream, peer: null, isLocal: false }
          ]);
        }
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
        return !videoTrack.enabled;
      }
    }
    return false;
  }, [localStream]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return !audioTrack.enabled;
      }
    }
    return false;
  }, [localStream]);

  // Cleanup
  const disconnect = useCallback(() => {
    localStream?.getTracks().forEach(track => track.stop());
    peersRef.current.forEach(peer => peer.destroy());
    peersRef.current.clear();
    socketRef.current?.close();
    setStreams([]);
    setLocalStream(null);
    setIsConnected(false);
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
    connectToRoom,
    disconnect,
    toggleVideo,
    toggleAudio,
    initializeMedia
  };
}
