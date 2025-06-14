
import { useEffect, useMemo } from 'react';
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
  // Memoize props to prevent unnecessary re-initializations
  const sessionProps = useMemo(() => ({ roomId, userId, userRole }), [roomId, userId, userRole]);
  
  const sessionManager = useSessionManager(sessionProps);
  const realTimeSync = useRealTimeSync(sessionProps);

  // Auto-join session on mount with stable dependencies
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
  }, [userRole, sessionManager, realTimeSync]);

  return {
    sessionManager,
    realTimeSync
  };
}
