
import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
  const channelRef = useRef<any>(null);
  const hasConnected = useRef(false);
  const { toast } = useToast();

  const connectToSync = useCallback(async () => {
    // Prevent multiple connections
    if (hasConnected.current || channelRef.current) {
      console.log('🔄 Already connected or connecting, skipping...');
      return;
    }

    try {
      console.log('🔄 Connecting to real-time sync...', { roomId, userId, userRole });
      
      // Cleanup existing channel first
      if (channelRef.current) {
        console.log('🔄 Cleaning up existing channel...');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      // Mark as connecting
      hasConnected.current = true;

      // Add small delay to ensure proper cleanup
      await new Promise(resolve => setTimeout(resolve, 200));

      // Create new channel for the room with unique identifier
      const channelName = `classroom_sync_${roomId}_${userId}`;
      console.log('🔄 Creating sync channel:', channelName);
      
      const channel = supabase
        .channel(channelName)
        .on('presence', { event: 'sync' }, () => {
          const newState = channel.presenceState();
          const participants = Object.entries(newState).map(([key, data]: [string, any]) => ({
            id: key,
            ...data[0]
          }));
          
          setSyncState(prev => ({ ...prev, participants }));
          console.log('🔄 Participants synced:', participants);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('👋 User joined:', key, newPresences);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('👋 User left:', key, leftPresences);
        })
        .on('broadcast', { event: 'whiteboard_update' }, ({ payload }) => {
          if (payload.userId !== userId) {
            setSyncState(prev => ({ ...prev, whiteboardData: payload.data }));
          }
        })
        .on('broadcast', { event: 'tab_change' }, ({ payload }) => {
          if (payload.userId !== userId) {
            setSyncState(prev => ({ ...prev, activeTab: payload.tabId }));
          }
        })
        .on('broadcast', { event: 'slide_change' }, ({ payload }) => {
          if (payload.userId !== userId) {
            setSyncState(prev => ({ ...prev, currentSlide: payload.slideNumber }));
          }
        });

      // Subscribe to the channel
      channel.subscribe(async (status) => {
        console.log('🔄 Sync channel status:', status);
        
        if (status === 'SUBSCRIBED') {
          // Track user presence
          await channel.track({
            userId,
            userRole,
            name: `${userRole === 'teacher' ? 'Teacher' : 'Student'} ${userId}`,
            joinedAt: new Date().toISOString()
          });

          setIsConnected(true);
          
          console.log('✅ Real-time sync connected');
          toast({
            title: "Connected",
            description: "Real-time classroom sync is active",
          });
        } else if (status === 'CHANNEL_ERROR') {
          setIsConnected(false);
          hasConnected.current = false;
          console.error('❌ Channel connection failed');
        }
      });

      channelRef.current = channel;

    } catch (error) {
      console.error('🔄 Sync connection failed:', error);
      setIsConnected(false);
      hasConnected.current = false;
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to real-time sync",
        variant: "destructive"
      });
    }
  }, [roomId, userId, userRole, toast]);

  const broadcastStateChange = useCallback((event: string, payload: any) => {
    if (!channelRef.current || !isConnected) {
      console.warn('🔄 Cannot broadcast - not connected');
      return;
    }

    channelRef.current.send({
      type: 'broadcast',
      event,
      payload: { ...payload, userId }
    });
  }, [isConnected, userId]);

  const syncWhiteboard = useCallback((whiteboardData: any) => {
    setSyncState(prev => ({ ...prev, whiteboardData }));
    broadcastStateChange('whiteboard_update', { data: whiteboardData });
  }, [broadcastStateChange]);

  const syncActiveTab = useCallback((tabId: string) => {
    if (userRole !== 'teacher') {
      console.log('🔄 Only teachers can sync tab changes');
      return;
    }
    
    setSyncState(prev => ({ ...prev, activeTab: tabId }));
    broadcastStateChange('tab_change', { tabId });
  }, [userRole, broadcastStateChange]);

  const syncSlideChange = useCallback((slideNumber: number) => {
    if (userRole !== 'teacher') {
      console.log('🔄 Only teachers can sync slide changes');
      return;
    }
    
    setSyncState(prev => ({ ...prev, currentSlide: slideNumber }));
    broadcastStateChange('slide_change', { slideNumber });
  }, [userRole, broadcastStateChange]);

  const addChatMessage = useCallback((message: any) => {
    setSyncState(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, message]
    }));
  }, []);

  const disconnect = useCallback(() => {
    console.log('🔄 Disconnecting real-time sync...');
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    setIsConnected(false);
    hasConnected.current = false;
    console.log('🔄 Real-time sync disconnected');
  }, []);

  // Auto-connect once when hook is initialized
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;
    
    const initializeConnection = async () => {
      if (mounted && !hasConnected.current && !channelRef.current) {
        // Add delay to prevent immediate connection after mount
        timeoutId = setTimeout(async () => {
          if (mounted) {
            await connectToSync();
          }
        }, 500);
      }
    };

    initializeConnection();

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      disconnect();
    };
  }, []); // Empty dependency array to run only once

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
