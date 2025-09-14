
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { sanitizeText, rateLimiter } from '@/utils/security';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updateUserProfile: (updates: { full_name?: string; role?: string }) => Promise<{ error: any }>;
  refreshUser: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured] = useState(true); // Always configured in Lovable projects

  // Function to fetch user data from database
  const fetchUserFromDatabase = async (userId: string): Promise<User | null> => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('User not found in database, will use auth metadata');
        return null;
      }

      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // Function to create fallback user from auth metadata
  const createFallbackUser = async (authUser: any): Promise<User> => {
    // Check localStorage for demo admin first
    const storedUserType = localStorage.getItem('userType');
    let role = authUser.user_metadata?.role || 'student';
    
    if (storedUserType === 'admin') {
      role = 'admin';
      console.log('🎭 Setting admin role from localStorage');
    }
    
    // Try to get role from database
    try {
      const { data: dbUser } = await supabase
        .from('users')
        .select('role')
        .eq('id', authUser.id)
        .maybeSingle();
      
      if (dbUser?.role) {
        role = dbUser.role;
        console.log('🎭 Found role in database:', role);
      }
    } catch (error) {
      console.warn('Could not fetch role from database:', error);
    }
    
    return {
      id: authUser.id,
      email: authUser.email || '',
      role: role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_metadata: authUser.user_metadata || {}
    } as any;
  };

  // Function to refresh user state (not used in production)
  const refreshUser = () => {
    // Only for compatibility - no demo mode in production
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setError(null);
        
        if (!isConfigured) {
          setError('Supabase not configured. Please check your environment setup.');
          setLoading(false);
          return;
        }

        // Supabase mode: set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (!mounted) return;
            
            console.info('Auth state changed:', event, !!session);
            setSession(session);
            
            if (session?.user) {
              // Defer database call to avoid blocking the auth state change
              setTimeout(async () => {
                if (!mounted) return;
                
              try {
                const dbUser = await fetchUserFromDatabase(session.user.id);
                if (mounted) {
                  const finalUser = dbUser || await createFallbackUser(session.user);
                  console.log('Setting user after auth state change:', finalUser);
                  setUser(finalUser);
                }
              } catch (error) {
                console.error('Error in deferred user fetch:', error);
                if (mounted) {
                  const fallbackUser = await createFallbackUser(session.user);
                  console.log('Setting fallback user after error:', fallbackUser);
                  setUser(fallbackUser);
                }
              }
              }, 0);
            } else {
              setUser(null);
            }
            
            if (mounted) {
              setLoading(false);
            }
          }
        );

        // Then get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(initialSession);
          
          if (initialSession?.user) {
            try {
              const dbUser = await fetchUserFromDatabase(initialSession.user.id);
              setUser(dbUser || await createFallbackUser(initialSession.user));
            } catch (error) {
              console.error('Error fetching initial user:', error);
              setUser(await createFallbackUser(initialSession.user));
            }
          } else {
            setUser(null);
          }
          
          setLoading(false);
        }

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
        
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setError('Failed to initialize authentication');
          setLoading(false);
        }
      }
    };

    const cleanup = initializeAuth();
     
    // Reduce timeout to prevent long loading states
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth initialization timeout');
        setLoading(false);
      }
    }, 1000); // Reduced from 2000ms to 1000ms

    return () => {
      mounted = false;
      clearTimeout(timeout);
      if (cleanup instanceof Promise) {
        cleanup.then(cleanupFn => cleanupFn?.());
      }
    };
  }, [isConfigured]);

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    if (!isConfigured) {
      return { data: null, error: new Error('Supabase not configured. Please check your environment setup.') };
    }

    // Rate limiting check
    const clientKey = `signup_${email}`;
    if (!rateLimiter.isAllowed(clientKey, 3, 60000)) {
      const error = new Error('Too many signup attempts. Please try again later.');
      setError(error.message);
      toast.error(error.message);
      return { data: null, error };
    }

    try {
      setError(null);
      
      // Input sanitization
      const sanitizedEmail = sanitizeText(email);
      const sanitizedUserData = {
        ...userData,
        role: userData.role ? sanitizeText(userData.role) : 'student'
      };
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: sanitizedUserData
        }
      });

      if (error) {
        setError(error.message);
        toast.error(error.message);
      }

      return { data, error };
    } catch (error: any) {
      const errorMessage = 'Sign up failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isConfigured) {
      return { data: null, error: new Error('Supabase not configured. Please check your environment setup.') };
    }

    // Rate limiting check
    const clientKey = `signin_${email}`;
    if (!rateLimiter.isAllowed(clientKey, 5, 300000)) {
      const error = new Error('Too many login attempts. Please try again later.');
      setError(error.message);
      toast.error(error.message);
      return { data: null, error };
    }

    try {
      setError(null);
      
      // Input sanitization
      const sanitizedEmail = sanitizeText(email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });
      
      if (error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        // Reset rate limiter on successful login
        rateLimiter.reset(clientKey);
      }
      
      return { data, error };
    } catch (error: any) {
      const errorMessage = 'Sign in failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return { data: null, error };
    }
  };

  const resetPassword = async (email: string) => {
    if (!isConfigured) {
      return { data: null, error: new Error('Supabase not configured. Please check your environment setup.') };
    }

    // Rate limiting check
    const clientKey = `reset_${email}`;
    if (!rateLimiter.isAllowed(clientKey, 3, 600000)) {
      const error = new Error('Too many password reset attempts. Please try again later.');
      setError(error.message);
      toast.error(error.message);
      return { data: null, error };
    }

    try {
      setError(null);
      
      // Input sanitization
      const sanitizedEmail = sanitizeText(email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        setError(error.message);
        toast.error(error.message);
      }
      
      return { data: null, error };
    } catch (error: any) {
      const errorMessage = 'Password reset failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return { data: null, error };
    }
  };

  const updateUserProfile = async (updates: { full_name?: string; role?: string }) => {
    if (!user) {
      return { error: { message: 'User not authenticated' } };
    }

    try {
      // Sanitize inputs
      const sanitizedUpdates = {
        ...updates,
        full_name: updates.full_name ? sanitizeText(updates.full_name) : undefined
      };

      const { error } = await supabase
        .from('users')
        .update(sanitizedUpdates)
        .eq('id', user.id);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Profile updated successfully');
      }

      return { error };
    } catch (error: any) {
      const errorMessage = 'Failed to update profile';
      toast.error(errorMessage);
      return { error: { message: errorMessage } };
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Sign out initiated');
      setError(null);
      
      if (!isConfigured) {
        console.error('❌ Supabase not configured for logout');
        setError('Supabase not configured. Please check your environment setup.');
        return { error: new Error('Supabase not configured') };
      }

      console.log('🔄 Clearing user state...');
      // Clear user state immediately
      setUser(null);
      setSession(null);
      
      console.log('📤 Calling Supabase signOut...');
      // Supabase sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Logout error:', error);
        setError('Logout failed');
      } else {
        console.log('✅ Supabase signOut successful');
      }
      
      console.log('🏠 Redirecting to home page...');
      // Force redirect to home page using location.replace for complete reload
      window.location.replace('/');
      
      return { error };
    } catch (error) {
      console.error('❌ Sign out error:', error);
      setError('Sign out failed');
      // Force redirect even on error
      console.log('🏠 Force redirecting to home page after error...');
      window.location.replace('/');
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isConfigured,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updateUserProfile,
      refreshUser,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
