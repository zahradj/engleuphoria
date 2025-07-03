
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

  // Auto-initialize session only (real-time sync auto-connects)
  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitialized.current || initializationInProgress.current) {
      return;
    }

    initializationInProgress.current = true;

    console.log('🚀 Initializing classroom session...', { userRole, roomId });
    
    const initializeSession = async () => {
      try {
        // Initialize based on role
        if (userRole === 'teacher') {
          console.log('👨‍🏫 Teacher initializing - creating session...');
          await sessionManager.createSession();
        } else {
          console.log('👨‍🎓 Student initializing - joining session...');
          await sessionManager.joinSession();
        }
        
        hasInitialized.current = true;
        console.log('✅ Classroom initialization complete');
      } catch (error) {
        console.error('❌ Classroom initialization failed:', error);
      } finally {
        initializationInProgress.current = false;
      }
    };

    // Small delay to ensure components are mounted
    const timeoutId = setTimeout(initializeSession, 500);

    return () => {
      clearTimeout(timeoutId);
      if (!hasInitialized.current) {
        initializationInProgress.current = false;
      }
    };
  }, [userRole, roomId, sessionManager]); // Only depend on essential props

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      realTimeSync.disconnect();
      hasInitialized.current = false;
      initializationInProgress.current = false;
    };
  }, [realTimeSync]);

  return {
    sessionManager,
    realTimeSync,
    isInitialized: hasInitialized.current
  };
}
