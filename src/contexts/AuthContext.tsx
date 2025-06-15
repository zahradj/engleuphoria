
import React, { createContext, useContext } from 'react';
import { useClassroomAuth, ClassroomAuthProvider } from '@/hooks/useClassroomAuth';
import { User } from '@/services/classroomDatabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName: string, role: 'teacher' | 'student') => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClassroomAuthProvider>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </ClassroomAuthProvider>
  );
};

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useClassroomAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
