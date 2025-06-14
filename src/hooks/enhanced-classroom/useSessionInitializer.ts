
import { useEffect } from 'react';
import { useSessionManager } from './useSessionManager';
import { useRealTimeSync } from './useRealTimeSync';

interface UseSessionInitializerProps {
  roomId: string;
  userId: string;
  userRole: 'teacher' | 'student';
}

export function useSessionInitializer({
  roomId,
  userId,
  userRole
}: UseSessionInitializerProps) {
  const sessionManager = useSessionManager({ roomId, userId, userRole });
  const realTimeSync = useRealTimeSync({ roomId, userId, userRole });

  // Auto-join session on mount
  useEffect(() => {
    console.log('🚀 Auto-joining session for role:', userRole);
    if (userRole === 'teacher') {
      sessionManager.createSession();
    } else {
      sessionManager.joinSession();
    }
    
    realTimeSync.connectToSync();

    return () => {
      realTimeSync.disconnect();
    };
  }, [userRole]);

  return {
    sessionManager,
    realTimeSync
  };
}
