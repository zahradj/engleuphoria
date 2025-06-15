import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { classroomDatabase, User } from '@/services/classroomDatabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string, role: 'teacher' | 'student') => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const ClassroomAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('ClassroomAuth: Initializing auth state');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('ClassroomAuth: Initial session check:', !!session?.user);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        console.log('ClassroomAuth: No initial session, setting loading to false');
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('ClassroomAuth: Auth state changed:', event, !!session?.user);
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          console.log('ClassroomAuth: User signed out, clearing state');
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    console.log('ClassroomAuth: Loading user profile for:', userId);
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.log('ClassroomAuth: Error loading user profile:', error);
        
        // If user profile doesn't exist, try to get user info from auth
        if (error.code === 'PGRST116') { // No rows returned
          console.log('ClassroomAuth: User profile not found, checking auth user');
          const { data: { user: authUser } } = await supabase.auth.getUser();
          
          if (authUser) {
            console.log('ClassroomAuth: Auth user exists but no profile, creating default profile');
            // Create a basic user profile with default role for OAuth users
            try {
              const newUserData = {
                email: authUser.email || '',
                full_name: authUser.user_metadata?.full_name || 
                          authUser.user_metadata?.name || 
                          authUser.email?.split('@')[0] || 'User',
                role: 'student' as const, // Default to student for OAuth users
              };
              
              const createdUser = await classroomDatabase.createUser(newUserData);
              console.log('ClassroomAuth: Created user profile:', createdUser);
              setUser(createdUser);
              
              // Show welcome message for new OAuth users
              toast({
                title: "Welcome to Engleuphoria!",
                description: `Profile created successfully! You can update your role in settings.`,
              });
            } catch (createError) {
              console.error('ClassroomAuth: Failed to create user profile:', createError);
              toast({
                title: "Profile Setup Required",
                description: "Please complete your profile setup.",
                variant: "destructive"
              });
            }
          }
        } else {
          console.error('ClassroomAuth: Database error loading user:', error);
          toast({
            title: "Error",
            description: "Failed to load user profile",
            variant: "destructive"
          });
        }
      } else {
        console.log('ClassroomAuth: User profile loaded successfully:', userData?.role);
        setUser(userData);
      }
    } catch (error) {
      console.error('ClassroomAuth: Unexpected error loading user profile:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      console.log('ClassroomAuth: Setting loading to false');
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('ClassroomAuth: Attempting sign in for:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.log('ClassroomAuth: Sign in error:', error.message);
        return { success: false, error: error.message };
      }

      console.log('ClassroomAuth: Sign in successful');
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      return { success: true };
    } catch (error) {
      console.error('ClassroomAuth: Unexpected sign in error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'teacher' | 'student') => {
    console.log('ClassroomAuth: Attempting sign up for:', email, 'as', role);
    try {
      // First create auth user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (authError) {
        console.log('ClassroomAuth: Sign up auth error:', authError.message);
        return { success: false, error: authError.message };
      }

      if (authData.user) {
        console.log('ClassroomAuth: Auth user created, creating profile');
        
        // For confirmed users, create profile immediately
        if (authData.user.email_confirmed_at) {
          try {
            const newUserData = {
              email,
              full_name: fullName,
              role,
            };
            
            await classroomDatabase.createUser(newUserData);
            console.log('ClassroomAuth: User profile created successfully');
          } catch (profileError) {
            console.error('ClassroomAuth: Error creating user profile:', profileError);
            return { success: false, error: 'Failed to create user profile' };
          }
        }

        toast({
          title: "Account created!",
          description: authData.user.email_confirmed_at 
            ? `Welcome to the ${role} dashboard, ${fullName}!`
            : `Welcome to Engleuphoria, ${fullName}! Please check your email to verify your account.`,
        });

        return { success: true };
      }

      return { success: false, error: 'Failed to create user account' };
    } catch (error) {
      console.error('ClassroomAuth: Unexpected sign up error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    console.log('ClassroomAuth: Signing out');
    try {
      await supabase.auth.signOut();
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
