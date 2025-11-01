import { useState, useEffect, useCallback, useRef } from 'react';
import { WebRTCService } from '@/services/webRTCService';

interface UseWebRTCProps {
  roomId: string;
  userId: string;
  localStream: MediaStream | null;
  enabled: boolean;
  isInitiator: boolean; // Teacher should be true
}

export function useWebRTC({ roomId, userId, localStream, enabled, isInitiator }: UseWebRTCProps) {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const webrtcServiceRef = useRef<WebRTCService | null>(null);

  const initialize = useCallback(async () => {
    if (!enabled || !localStream || !roomId || !userId) {
      console.log('⏸️ WebRTC not ready:', { enabled, hasStream: !!localStream, roomId, userId });
      return;
    }

    try {
      console.log('🚀 Initializing WebRTC as', isInitiator ? 'initiator' : 'responder');
      
      const service = new WebRTCService({
        onRemoteStream: (stream) => {
          console.log('✅ Remote stream received');
          setRemoteStream(stream);
        },
        onConnectionChange: (connected) => {
          console.log('🔗 Connection changed:', connected);
          setIsConnected(connected);
        },
        onError: (error) => {
          console.error('❌ WebRTC error:', error);
        }
      });

      await service.initialize(roomId, userId, localStream);
      webrtcServiceRef.current = service;

      // If we're the initiator (teacher), create offer
      if (isInitiator) {
        setTimeout(() => {
          service.createOffer();
        }, 1000);
      }

    } catch (error) {
      console.error('Failed to initialize WebRTC:', error);
    }
  }, [roomId, userId, localStream, enabled, isInitiator]);

  useEffect(() => {
    initialize();

    return () => {
      if (webrtcServiceRef.current) {
        console.log('🧹 Cleaning up WebRTC');
        webrtcServiceRef.current.dispose();
        webrtcServiceRef.current = null;
      }
    };
  }, [initialize]);

  return {
    remoteStream,
    isConnected
  };
}
