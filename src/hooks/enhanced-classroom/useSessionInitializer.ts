
import { useEffect, useMemo, useRef } from 'react';
import { useSessionManager } from './useSessionManager';
import { useRealTimeSync } from './useRealTimeSync';
import { supabase } from '@/lib/supabase';

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

    // Only initialize on classroom pages and for authenticated users
    const isClassroomPage = window.location.pathname.includes('/classroom') || 
                            window.location.pathname.includes('/unified-classroom');
    
    if (!isClassroomPage) {
      console.log('🚫 Skipping session initialization - not on classroom page');
      return;
    }

    initializationInProgress.current = true;

    console.log('🚀 Initializing classroom session...', { userRole, roomId });
    
    const initializeSession = async () => {
      try {
        // Check authentication first
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          console.log('🚫 Skipping session initialization - authentication required');
          initializationInProgress.current = false;
          return;
        }

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
