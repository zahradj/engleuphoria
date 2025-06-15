
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/services/classroomDatabase';
import { useToast } from '@/hooks/use-toast';
import { AuthContextType } from './auth/types';
import { loadUserProfile } from './auth/userProfileService';
import { signInUser, signUpUser, signOutUser } from './auth/authMethods';

const AuthContext = createContext<AuthContextType | null>(null);

export const ClassroomAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('ClassroomAuth: Initializing auth state');
    
    let timeoutId: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        // Set a maximum timeout for the entire auth initialization
        timeoutId = setTimeout(() => {
          console.warn('ClassroomAuth: Auth initialization timeout, setting loading to false');
          setLoading(false);
        }, 15000); // 15 second maximum timeout

        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        console.log('ClassroomAuth: Initial session check:', !!session?.user);
        
        if (session?.user) {
          await handleUserProfileLoad(session.user.id);
        } else {
          console.log('ClassroomAuth: No initial session, setting loading to false');
          setLoading(false);
        }
        
        clearTimeout(timeoutId);
      } catch (error) {
        console.error('ClassroomAuth: Error during auth initialization:', error);
        setLoading(false);
        clearTimeout(timeoutId);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('ClassroomAuth: Auth state changed:', event, !!session?.user);
        
        // Clear any existing timeouts
        if (timeoutId) clearTimeout(timeoutId);
        
        if (session?.user) {
          await handleUserProfileLoad(session.user.id);
        } else {
          console.log('ClassroomAuth: User signed out, clearing state');
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const handleUserProfileLoad = async (userId: string) => {
    try {
      console.log('ClassroomAuth: Starting profile load for user:', userId);
      
      const userData = await loadUserProfile(userId);
      
      if (userData) {
        console.log('ClassroomAuth: Profile loaded successfully:', userData.role);
        setUser(userData);
        
        // Show appropriate toast for new users
        if (!userData.created_at || new Date(userData.created_at).getTime() > Date.now() - 5000) {
          if (userData.role === 'student' && userData.full_name !== userData.email?.split('@')[0]) {
            toast({
              title: "Welcome to Engleuphoria!",
              description: `Profile created successfully! You can update your role in settings.`,
            });
          }
        }
      } else {
        console.warn('ClassroomAuth: No user data returned from loadUserProfile');
        // Show a fallback user with incomplete profile
        const fallbackUser: User = {
          id: userId,
          email: '',
          full_name: 'User',
          role: 'student',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setUser(fallbackUser);
        
        toast({
          title: "Profile Setup Incomplete",
          description: "You can complete your profile setup later.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('ClassroomAuth: Error loading user profile:', error);
      
      // Create a basic fallback user to prevent app crash
      const fallbackUser: User = {
        id: userId,
        email: '',
        full_name: 'User',
        role: 'student',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setUser(fallbackUser);
      
      toast({
        title: "Profile Load Error",
        description: "There was an issue loading your profile. Some features may be limited.",
        variant: "destructive"
      });
    } finally {
      // ALWAYS set loading to false, regardless of success or failure
      console.log('ClassroomAuth: Setting loading to false');
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const result = await signInUser(email, password);
    
    if (result.success) {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    }
    
    return result;
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'teacher' | 'student') => {
    const result = await signUpUser(email, password, fullName, role);
    
    if (result.success) {
      toast({
        title: "Account created!",
        description: `Welcome to Engleuphoria, ${fullName}! Please check your email to verify your account.`,
      });
    }
    
    return result;
  };

  const signOut = async () => {
    try {
      await signOutUser();
      setUser(null);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('ClassroomAuth: Error signing out:', error);
    }
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user
  };

  console.log('ClassroomAuth: Rendering with state:', { hasUser: !!user, loading, isAuthenticated: !!user });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useClassroomAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useClassroomAuth must be used within ClassroomAuthProvider');
  }
  return context;
};
