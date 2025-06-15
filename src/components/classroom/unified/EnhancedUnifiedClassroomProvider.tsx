
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { lessonService } from "@/services/lessonService";

interface UserProfile {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  avatar?: string;
}

interface LessonContext {
  lessonId?: string;
  title?: string;
  duration?: number;
  isValidated: boolean;
}

interface EnhancedUnifiedClassroomContextType {
  currentUser: UserProfile;
  finalRoomId: string;
  lessonContext: LessonContext;
  hasShownWelcome: boolean;
  setHasShownWelcome: (value: boolean) => void;
}

const EnhancedUnifiedClassroomContext = React.createContext<EnhancedUnifiedClassroomContextType | null>(null);

export const useEnhancedUnifiedClassroomContext = () => {
  const context = React.useContext(EnhancedUnifiedClassroomContext);
  if (!context) {
    throw new Error('useEnhancedUnifiedClassroomContext must be used within EnhancedUnifiedClassroomProvider');
  }
  return context;
};

interface EnhancedUnifiedClassroomProviderProps {
  children: React.ReactNode;
}

export function EnhancedUnifiedClassroomProvider({ children }: EnhancedUnifiedClassroomProviderProps) {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [lessonContext, setLessonContext] = useState<LessonContext>({
    isValidated: false
  });
  const userIdRef = useRef<string>();
  
  // Generate stable user ID only once
  if (!userIdRef.current) {
    userIdRef.current = `user-${Math.random().toString(36).substr(2, 9)}`;
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

  // Validate lesson access when roomId or user changes
  useEffect(() => {
    const validateLessonAccess = async () => {
      if (finalRoomId && currentUser.id && !lessonContext.isValidated) {
        try {
          console.log('🔐 Validating lesson access...', { finalRoomId, userId: currentUser.id });
          
          const canAccess = await lessonService.canAccessLesson(finalRoomId, currentUser.id);
          
          if (canAccess) {
            setLessonContext({
              isValidated: true,
              lessonId: finalRoomId, // In real implementation, you'd fetch lesson details
              title: "Scheduled Lesson",
              duration: 60
            });
            
            console.log('✅ Lesson access validated');
          } else {
            setLessonContext({ isValidated: false });
            
            toast({
              title: "Access Denied",
              description: "You don't have permission to access this lesson, or it's not time yet.",
              variant: "destructive"
            });
            
            console.log('❌ Lesson access denied');
          }
        } catch (error) {
          console.error('Error validating lesson access:', error);
          setLessonContext({ isValidated: false });
          
          toast({
            title: "Validation Error",
            description: "Could not validate lesson access. Please try again.",
            variant: "destructive"
          });
        }
      }
    };

    validateLessonAccess();
  }, [finalRoomId, currentUser.id, lessonContext.isValidated, toast]);

  // Show enhanced welcome message only once and after validation
  useEffect(() => {
    if (!hasShownWelcome && currentUser.role && lessonContext.isValidated) {
      const welcomeMessage = currentUser.role === 'teacher' 
        ? `Welcome to the lesson, ${currentUser.name}! You have full teaching controls.`
        : `Welcome to your lesson, ${currentUser.name}! Your teacher will join shortly.`;
      
      toast({
        title: `${currentUser.role === 'teacher' ? '👩‍🏫' : '👨‍🎓'} Lesson Ready`,
        description: welcomeMessage,
      });
      
      setHasShownWelcome(true);
    }
  }, [currentUser.role, currentUser.name, lessonContext.isValidated, toast, hasShownWelcome]);

  const contextValue = {
    currentUser,
    finalRoomId,
    lessonContext,
    hasShownWelcome,
    setHasShownWelcome
  };

  return (
    <EnhancedUnifiedClassroomContext.Provider value={contextValue}>
      {children}
    </EnhancedUnifiedClassroomContext.Provider>
  );
}
