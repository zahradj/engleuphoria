
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { classroomAccessService } from '@/services/classroomAccessService';

interface CurrentUser {
  id: string;
  name: string;
  role: 'teacher' | 'student';
}

interface UnifiedClassroomContextType {
  currentUser: CurrentUser;
  finalRoomId: string;
  isValidatingAccess: boolean;
  accessError: string | null;
}

const UnifiedClassroomContext = createContext<UnifiedClassroomContextType>({
  currentUser: { id: 'default', name: 'User', role: 'student' },
  finalRoomId: '',
  isValidatingAccess: true,
  accessError: null
});

export const useUnifiedClassroomContext = () => useContext(UnifiedClassroomContext);

interface UnifiedClassroomProviderProps {
  children: React.ReactNode;
}

export function UnifiedClassroomProvider({ children }: UnifiedClassroomProviderProps) {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentUser, setCurrentUser] = useState<CurrentUser>({ 
    id: 'default', 
    name: 'User', 
    role: 'student' 
  });
  const [finalRoomId, setFinalRoomId] = useState('');
  const [isValidatingAccess, setIsValidatingAccess] = useState(true);
  const [accessError, setAccessError] = useState<string | null>(null);

  useEffect(() => {
    const initializeClassroom = async () => {
      console.log('🏫 Initializing Unified Classroom...');
      
      // Determine user info from localStorage or defaults
      const userType = localStorage.getItem('userType');
      const teacherName = localStorage.getItem('teacherName');
      const studentName = localStorage.getItem('studentName');
      
      console.log('User data from localStorage:', { userType, teacherName, studentName });
      
      let user: CurrentUser;
      
      // Determine user role and name based on localStorage
      if (userType === 'teacher' && teacherName) {
        user = {
          id: `teacher-${Date.now()}`,
          name: teacherName,
          role: 'teacher'
        };
      } else if (userType === 'student' && studentName) {
        user = {
          id: `student-${Date.now()}`,
          name: studentName,
          role: 'student'
        };
      } else {
        // Fallback: check for any name and default to student
        const fallbackName = teacherName || studentName || 'User';
        user = {
          id: `user-${Date.now()}`,
          name: fallbackName,
          role: 'student'
        };
      }
      
      setCurrentUser(user);
      console.log('Current user set:', user);

      // Set room ID
      const currentRoomId = roomId || `room-${Date.now()}`;
      setFinalRoomId(currentRoomId);
      console.log('Room ID set:', currentRoomId);

      // For demo purposes, skip access validation and allow entry
      setIsValidatingAccess(false);
      setAccessError(null);
      
      console.log('✅ Classroom initialization complete');
    };

    initializeClassroom();
  }, [roomId, navigate, toast]);

  const contextValue: UnifiedClassroomContextType = {
    currentUser,
    finalRoomId,
    isValidatingAccess,
    accessError
  };

  return (
    <UnifiedClassroomContext.Provider value={contextValue}>
      {children}
    </UnifiedClassroomContext.Provider>
  );
}
