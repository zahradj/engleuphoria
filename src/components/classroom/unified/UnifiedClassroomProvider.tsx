
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  avatar?: string;
}

interface UnifiedClassroomContextType {
  currentUser: UserProfile;
  finalRoomId: string;
  hasShownWelcome: boolean;
  setHasShownWelcome: (value: boolean) => void;
}

const UnifiedClassroomContext = React.createContext<UnifiedClassroomContextType | null>(null);

export const useUnifiedClassroomContext = () => {
  const context = React.useContext(UnifiedClassroomContext);
  if (!context) {
    throw new Error('useUnifiedClassroomContext must be used within UnifiedClassroomProvider');
  }
  return context;
};

interface UnifiedClassroomProviderProps {
  children: React.ReactNode;
}

// Generate a proper UUID v4
const generateUUID = () => {
  const crypto = window.crypto || (window as any).msCrypto;
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  
  // Set version (4) and variant bits
  array[6] = (array[6] & 0x0f) | 0x40;
  array[8] = (array[8] & 0x3f) | 0x80;
  
  // Convert to hex string with dashes
  const hex = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.substr(0,8)}-${hex.substr(8,4)}-${hex.substr(12,4)}-${hex.substr(16,4)}-${hex.substr(20,12)}`;
};

export function UnifiedClassroomProvider({ children }: UnifiedClassroomProviderProps) {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const userIdRef = useRef<string>();
  
  // Generate stable user ID only once with proper UUID format
  if (!userIdRef.current) {
    userIdRef.current = generateUUID();
  }

  // Enhanced role parameter extraction with stable memoization
  const currentUser = useMemo<UserProfile>(() => {
    const roleParam = searchParams.get('role');
    const nameParam = searchParams.get('name');
    const userIdParam = searchParams.get('userId');
    
    // Check session storage for persisted role
    const persistedRole = sessionStorage.getItem('classroom-user-role') as 'teacher' | 'student' | null;
    const persistedName = sessionStorage.getItem('classroom-user-name');
    const persistedUserId = sessionStorage.getItem('classroom-user-id');

    // Determine final values with fallback logic
    const finalRole = roleParam as 'teacher' | 'student' || persistedRole || 'student';
    const finalName = nameParam || persistedName || (finalRole === 'teacher' ? 'Teacher' : 'Student');
    
    // Use persisted UUID if valid, otherwise generate new one
    let finalUserId = persistedUserId;
    if (!finalUserId || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(finalUserId)) {
      finalUserId = userIdRef.current!;
    }

    // Persist to session storage only if changed
    if (sessionStorage.getItem('classroom-user-role') !== finalRole) {
      sessionStorage.setItem('classroom-user-role', finalRole);
    }
    if (sessionStorage.getItem('classroom-user-name') !== finalName) {
      sessionStorage.setItem('classroom-user-name', finalName);
    }
    if (sessionStorage.getItem('classroom-user-id') !== finalUserId) {
      sessionStorage.setItem('classroom-user-id', finalUserId);
    }

    return {
      id: finalUserId,
      name: finalName,
      role: finalRole
    };
  }, [searchParams]);

  const finalRoomId = useMemo(() => roomId || "unified-classroom-1", [roomId]);

  // Show enhanced welcome message only once
  useEffect(() => {
    if (!hasShownWelcome && currentUser.role) {
      const welcomeMessage = currentUser.role === 'teacher' 
        ? `Welcome to the enhanced classroom, ${currentUser.name}! You have full teaching controls and session management.`
        : `Welcome to the enhanced classroom, ${currentUser.name}! Enjoy the interactive learning experience.`;
      
      toast({
        title: `${currentUser.role === 'teacher' ? '👩‍🏫' : '👨‍🎓'} Enhanced ${currentUser.role === 'teacher' ? 'Teacher' : 'Student'} Mode`,
        description: welcomeMessage,
      });
      
      setHasShownWelcome(true);
    }
  }, [currentUser.role, currentUser.name, toast, hasShownWelcome]);

  const contextValue = {
    currentUser,
    finalRoomId,
    hasShownWelcome,
    setHasShownWelcome
  };

  return (
    <UnifiedClassroomContext.Provider value={contextValue}>
      {children}
    </UnifiedClassroomContext.Provider>
  );
}
