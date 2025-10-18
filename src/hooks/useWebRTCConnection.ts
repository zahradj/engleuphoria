import { useState, useEffect, useCallback } from 'react';
import { realTimeVideoService, VideoParticipant } from '@/services/video/realTimeVideoService';
import { toast } from 'sonner';

interface UseWebRTCConnectionProps {
  roomId: string;
  userId: string;
  localStream: MediaStream | null;
  enabled: boolean;
}

export const useWebRTCConnection = ({
  roomId,
  userId,
  localStream,
  enabled
}: UseWebRTCConnectionProps) => {
  const [participants, setParticipants] = useState<VideoParticipant[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    if (!localStream || !enabled || isConnected || isConnecting) {
      return;
    }

    setIsConnecting(true);
    try {
      console.log(`🔗 Connecting to WebRTC room ${roomId}`);
      realTimeVideoService.setRoomConfig(roomId, userId, localStream);
      await realTimeVideoService.joinRoom();
      setIsConnected(true);
      toast.success("Connected to video call");
    } catch (error) {
      console.error('Error connecting to video room:', error);
      toast.error("Failed to connect to video call");
    } finally {
      setIsConnecting(false);
    }
  }, [roomId, userId, localStream, enabled, isConnected, isConnecting]);

  const disconnect = useCallback(async () => {
    if (!isConnected) return;

    console.log('🔌 Disconnecting from WebRTC');
    await realTimeVideoService.leaveRoom();
    setIsConnected(false);
    setParticipants([]);
  }, [isConnected]);

  useEffect(() => {
    // Set up participants change listener
    realTimeVideoService.onParticipantsChange((newParticipants) => {
      console.log(`👥 Participants updated: ${newParticipants.length}`);
      setParticipants(newParticipants);
    });

    return () => {
      disconnect();
    };
  }, [disconnect]);

  useEffect(() => {
    if (enabled && localStream && !isConnected && !isConnecting) {
      connect();
    } else if (!enabled && isConnected) {
      disconnect();
    }
  }, [enabled, localStream, isConnected, isConnecting, connect, disconnect]);

  return {
    participants,
    isConnected,
    isConnecting,
    connect,
    disconnect
  };
};
