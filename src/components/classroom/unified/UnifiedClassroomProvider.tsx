
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

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

export function UnifiedClassroomProvider({ children }: UnifiedClassroomProviderProps) {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Get user from Supabase auth
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // If no authenticated user, use URL parameters as fallback
          const roleParam = searchParams.get('role') as 'teacher' | 'student' || 'student';
          const nameParam = searchParams.get('name') || (roleParam === 'teacher' ? 'Teacher' : 'Student');
          
          setCurrentUser({
            id: `temp-${Date.now()}`,
            name: nameParam,
            role: roleParam
          });
          return;
        }

        // Get user role from users table or URL parameter
        const { data: userData } = await supabase
          .from('users')
          .select('full_name, role')
          .eq('id', user.id)
          .single();

        const roleParam = searchParams.get('role') as 'teacher' | 'student';
        const finalRole = roleParam || userData?.role || 'student';
        const finalName = userData?.full_name || user.email?.split('@')[0] || 'User';

        setCurrentUser({
          id: user.id,
          name: finalName,
          role: finalRole
        });

      } catch (error) {
        console.error('Error getting user profile:', error);
        
        // Fallback to URL parameters
        const roleParam = searchParams.get('role') as 'teacher' | 'student' || 'student';
        const nameParam = searchParams.get('name') || (roleParam === 'teacher' ? 'Teacher' : 'Student');
        
        setCurrentUser({
          id: `fallback-${Date.now()}`,
          name: nameParam,
          role: roleParam
        });
      }
    };

    getUserProfile();
  }, [searchParams]);

  const finalRoomId = useMemo(() => roomId || "classroom-1", [roomId]);

  // Show welcome message only once
  useEffect(() => {
    if (!hasShownWelcome && currentUser?.role) {
      const welcomeMessage = currentUser.role === 'teacher' 
        ? `Welcome to the classroom, ${currentUser.name}! You have full teaching controls and session management.`
        : `Welcome to the classroom, ${currentUser.name}! Enjoy the interactive learning experience.`;
      
      toast({
        title: `${currentUser.role === 'teacher' ? '👩‍🏫' : '👨‍🎓'} ${currentUser.role === 'teacher' ? 'Teacher' : 'Student'} Mode`,
        description: welcomeMessage,
      });
      
      setHasShownWelcome(true);
    }
  }, [currentUser?.role, currentUser?.name, toast, hasShownWelcome]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
