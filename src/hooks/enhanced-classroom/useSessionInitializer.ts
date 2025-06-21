
import { useEffect, useMemo, useRef } from 'react';
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
  const hasInitialized = useRef(false);
  const initializationInProgress = useRef(false);
  
  // Memoize props to prevent unnecessary re-initializations
  const sessionProps = useMemo(() => ({ roomId, userId, userRole }), [roomId, userId, userRole]);
  
  const sessionManager = useSessionManager(sessionProps);
  const realTimeSync = useRealTimeSync(sessionProps);

  // Auto-join session on mount with stable dependencies
  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitialized.current || initializationInProgress.current) {
      return;
    }

    // Only initialize once per session
    initializationInProgress.current = true;

    console.log('🚀 Auto-joining session for role:', userRole);
    
    const initializeSession = async () => {
      try {
        if (userRole === 'teacher') {
          await sessionManager.createSession();
        } else {
          await sessionManager.joinSession();
        }
        
        await realTimeSync.connectToSync();
        
        hasInitialized.current = true;
        console.log('✅ Session initialization complete');
      } catch (error) {
        console.error('❌ Session initialization failed:', error);
      } finally {
        initializationInProgress.current = false;
      }
    };

    // Small delay to ensure components are mounted
    const timeoutId = setTimeout(initializeSession, 100);

    return () => {
      clearTimeout(timeoutId);
      if (!hasInitialized.current) {
        initializationInProgress.current = false;
      }
    };
  }, [userRole]); // Only depend on userRole, not the manager objects

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      realTimeSync.disconnect();
      hasInitialized.current = false;
      initializationInProgress.current = false;
    };
  }, []);

  return {
    sessionManager,
    realTimeSync,
    isInitialized: hasInitialized.current
  };
}
