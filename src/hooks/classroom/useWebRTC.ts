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
  const [signalingReady, setSignalingReady] = useState(false);
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
          console.log('🔗 Peer connection changed:', connected);
          setIsConnected(connected);
        },
        onError: (error) => {
          console.error('❌ WebRTC error:', error);
        },
        onSignalingReady: () => {
          setSignalingReady(true);
          // Re-trigger negotiation on (re)connect for the initiator
          if (isInitiator) {
            console.log('📡 Signaling ready — (re)creating offer');
            service.createOffer().catch((e) => console.error('createOffer failed:', e));
          }
        },
        onSignalingLost: () => {
          setSignalingReady(false);
          console.warn('📡 Signaling lost — waiting for reconnect…');
        },
      });

      await service.initialize(roomId, userId, localStream);
      webrtcServiceRef.current = service;
      // Note: we do NOT call createOffer here — onSignalingReady drives it,
      // ensuring both peers are subscribed before any SDP is broadcast.
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
    isConnected,
    signalingReady,
  };
}
