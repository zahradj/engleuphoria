
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { UnifiedUser } from "@/types/user";

interface UnifiedClassroomContextType {
  currentUser: UnifiedUser;
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

export function UnifiedClassroomProvider({ children }: UnifiedClassroomProviderProps) {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const userIdRef = useRef<string>();
  
  // Generate stable user ID only once
  if (!userIdRef.current) {
    userIdRef.current = `user-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Enhanced role parameter extraction with stable memoization
  const currentUser = useMemo<UnifiedUser>(() => {
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
    const finalUserId = userIdParam || persistedUserId || userIdRef.current!;

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
      const displayName = currentUser.name || 'User';
      const welcomeMessage = currentUser.role === 'teacher' 
        ? `Welcome to the enhanced classroom, ${displayName}! You have full teaching controls and session management.`
        : `Welcome to the enhanced classroom, ${displayName}! Enjoy the interactive learning experience.`;
      
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
