
import { useState, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

interface SyncState {
  whiteboardData: any;
  chatMessages: any[];
  activeTab: string;
  participants: any[];
  currentSlide: number;
}

interface UseRealTimeSyncProps {
  roomId: string;
  userId: string;
  userRole: 'teacher' | 'student';
}

export function useRealTimeSync({ roomId, userId, userRole }: UseRealTimeSyncProps) {
  const [syncState, setSyncState] = useState<SyncState>({
    whiteboardData: null,
    chatMessages: [],
    activeTab: 'whiteboard',
    participants: [],
    currentSlide: 0
  });

  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const hasShownConnectedToast = useRef(false);
  const { toast } = useToast();

  const connectToSync = useCallback(() => {
    // Prevent multiple connection attempts
    if (isConnected || wsRef.current) {
      return;
    }

    try {
      console.log('🔄 Connecting to sync service...');
      
      // For demo, simulate connection success
      setTimeout(() => {
        if (!hasShownConnectedToast.current) {
          setIsConnected(true);
          console.log('🔄 Sync service connected');
          
          toast({
            title: "Sync Connected",
            description: "Real-time synchronization active",
          });
          
          hasShownConnectedToast.current = true;
        }
      }, 1000);

    } catch (error) {
      console.error('🔄 Sync connection failed:', error);
      toast({
        title: "Sync Error",
        description: "Failed to connect to sync service",
        variant: "destructive"
      });
    }
  }, [toast, isConnected]);

  const broadcastStateChange = useCallback((key: keyof SyncState, value: any) => {
    if (userRole !== 'teacher') {
      console.log('🔄 Only teachers can broadcast state changes');
      return;
    }

    setSyncState(prev => ({ ...prev, [key]: value }));
    
    // In real implementation, this would send to WebSocket
    console.log('🔄 Broadcasting state change:', { key, value });
  }, [userRole]);

  const syncWhiteboard = useCallback((whiteboardData: any) => {
    broadcastStateChange('whiteboardData', whiteboardData);
  }, [broadcastStateChange]);

  const syncActiveTab = useCallback((tabId: string) => {
    broadcastStateChange('activeTab', tabId);
  }, [broadcastStateChange]);

  const syncSlideChange = useCallback((slideNumber: number) => {
    broadcastStateChange('currentSlide', slideNumber);
  }, [broadcastStateChange]);

  const addChatMessage = useCallback((message: any) => {
    setSyncState(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, message]
    }));
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    hasShownConnectedToast.current = false;
    console.log('🔄 Sync service disconnected');
  }, []);

  return {
    syncState,
    isConnected,
    connectToSync,
    disconnect,
    syncWhiteboard,
    syncActiveTab,
    syncSlideChange,
    addChatMessage
  };
}
