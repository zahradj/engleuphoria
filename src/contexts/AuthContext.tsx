
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  refreshUser: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured] = useState(isSupabaseConfigured());

  // Function to create demo user from localStorage
  const createDemoUser = (): User | null => {
    const userType = localStorage.getItem('userType');
    const mockEmail = localStorage.getItem('mockUserEmail');
    
    if (!userType) return null;

    const email = mockEmail || `demo-${userType}@example.com`;
    const isAdminEmail = email === 'f.zahra.djaanine@engleuphoria.com';
    const finalUserType = isAdminEmail ? 'admin' : userType;
    
    const nameKey = finalUserType === 'admin' ? 'adminName' : 
                   finalUserType === 'teacher' ? 'teacherName' : 'studentName';
    const fullName = localStorage.getItem(nameKey) || email.split('@')[0];

    return {
      id: isAdminEmail ? 'admin-f-zahra' : `demo-${userType}-${Date.now()}`,
      email,
      full_name: fullName,
      role: finalUserType as 'student' | 'teacher' | 'parent' | 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  };

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
  const createFallbackUser = (authUser: any): User => {
    return {
      id: authUser.id,
      email: authUser.email || '',
      full_name: authUser.user_metadata?.full_name || authUser.email || '',
      role: authUser.user_metadata?.role || 'student',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  };

  // Function to refresh user state
  const refreshUser = () => {
    if (!isConfigured) {
      const demoUser = createDemoUser();
      setUser(demoUser);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setError(null);
        
        if (!isConfigured) {
          // Demo mode: load user from localStorage
          const demoUser = createDemoUser();
          if (mounted) {
            setUser(demoUser);
            setLoading(false);
          }
          
          // Listen for custom auth events
          const handleAuthChange = () => {
            if (mounted) {
              const updatedDemoUser = createDemoUser();
              setUser(updatedDemoUser);
            }
          };
          
          window.addEventListener('authStateChanged', handleAuthChange);
          
          return () => {
            mounted = false;
            window.removeEventListener('authStateChanged', handleAuthChange);
          };
        }

        // Supabase mode: set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (!mounted) return;
            
            console.log('Auth state changed:', event, !!session);
            setSession(session);
            
            if (session?.user) {
              // Defer database call to avoid blocking the auth state change
              setTimeout(async () => {
                if (!mounted) return;
                
                try {
                  const dbUser = await fetchUserFromDatabase(session.user.id);
                  if (mounted) {
                    setUser(dbUser || createFallbackUser(session.user));
                  }
                } catch (error) {
                  console.error('Error in deferred user fetch:', error);
                  if (mounted) {
                    setUser(createFallbackUser(session.user));
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
              setUser(dbUser || createFallbackUser(initialSession.user));
            } catch (error) {
              console.error('Error fetching initial user:', error);
              setUser(createFallbackUser(initialSession.user));
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
    
    // Shorter timeout to prevent long loading states
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth initialization timeout');
        setLoading(false);
      }
    }, 2000);

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
      return { data: null, error: new Error('Supabase not configured') };
    }

    try {
      setError(null);
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: userData.full_name,
            role: userData.role
          }
        }
      });

      return { data, error };
    } catch (error) {
      setError('Sign up failed');
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isConfigured) {
      return { data: null, error: new Error('Supabase not configured') };
    }

    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (error) {
      setError('Sign in failed');
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      
      if (!isConfigured) {
        // Clear demo mode data
        localStorage.removeItem('userType');
        localStorage.removeItem('mockUserEmail');
        localStorage.removeItem('adminName');
        localStorage.removeItem('teacherName');
        localStorage.removeItem('studentName');
        setUser(null);
        setSession(null);
        
        // Dispatch auth change event
        window.dispatchEvent(new CustomEvent('authStateChanged'));
        
        // Force redirect to home page
        window.location.href = '/';
        return { error: null };
      }

      // Clear user state immediately
      setUser(null);
      setSession(null);
      
      // Supabase sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        setError('Logout failed');
      }
      
      // Force redirect to home page
      window.location.href = '/';
      
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      setError('Sign out failed');
      // Force redirect even on error
      window.location.href = '/';
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
