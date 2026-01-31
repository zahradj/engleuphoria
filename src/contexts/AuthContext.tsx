
import { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  const initializedRef = useRef(false);

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
    let role = 'student'; // Default role
    
    // SECURITY: Get role ONLY from user_roles table (prevents privilege escalation)
    // Never fallback to users.role column as it has been removed for security
    try {
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authUser.id)
        .maybeSingle();
      
      if (userRole?.role) {
        role = userRole.role;
        console.log('🔒 Retrieved role from user_roles table:', role);
      } else {
        console.warn('⚠️ No role found in user_roles table, defaulting to student');
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
      // Prevent double initialization
      if (initializedRef.current) return;
      initializedRef.current = true;

      try {
        setError(null);
        
        if (!isConfigured) {
          setError('Supabase not configured. Please check your environment setup.');
          setLoading(false);
          return;
        }

        // Set up auth state listener FIRST
        // This listener handles ONGOING auth changes (login/logout events)
        // It does NOT control the loading state - only the initial load does
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            if (!mounted) return;
            
            console.info('Auth state changed:', event, !!currentSession);
            setSession(currentSession);
            
            if (currentSession?.user) {
              // For ongoing changes, update user in background (fire-and-forget)
              // Do NOT await this - it should not block the UI
              setTimeout(async () => {
                if (!mounted) return;
                
                try {
                  const dbUser = await fetchUserFromDatabase(currentSession.user.id);
                  if (mounted) {
                    const finalUser = dbUser || await createFallbackUser(currentSession.user);
                    console.log('Setting user after auth state change:', finalUser);
                    setUser(finalUser);
                  }
                } catch (error) {
                  console.error('Error in deferred user fetch:', error);
                  if (mounted) {
                    const fallbackUser = await createFallbackUser(currentSession.user);
                    console.log('Setting fallback user after error:', fallbackUser);
                    setUser(fallbackUser);
                  }
                }
              }, 0);
            } else {
              setUser(null);
            }
            
            // NOTE: We do NOT set loading = false here
            // Loading is only controlled by the initial session check below
          }
        );

        // THEN get initial session and AWAIT the user fetch
        // This is the ONLY place where we set loading = false
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
          
          // Loading is set to false ONLY after initial session + user data is ready
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
     
    // Safety timeout - reduced to 1500ms with better handling
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth initialization timeout - forcing loading = false');
        setLoading(false);
      }
    }, 1500);

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
      } else if (data.user) {
        // Send welcome email after successful signup
        try {
          const userName = (sanitizedUserData as any).full_name || sanitizedEmail.split('@')[0];
          await supabase.functions.invoke('send-welcome-email', {
            body: {
              email: sanitizedEmail,
              name: userName,
              role: sanitizedUserData.role || 'student'
            }
          });
          console.log('Welcome email sent successfully');
        } catch (emailError) {
          console.warn('Failed to send welcome email:', emailError);
          // Don't fail signup if email fails
        }

        // Notify admins about new registration
        try {
          const userNameForNotify = (sanitizedUserData as any).full_name || sanitizedEmail.split('@')[0];
          await supabase.functions.invoke('notify-admin-new-registration', {
            body: {
              name: userNameForNotify,
              email: sanitizedEmail,
              role: sanitizedUserData.role || 'student',
              registeredAt: new Date().toISOString()
            }
          });
          console.log('Admin notification sent successfully');
        } catch (notifyError) {
          console.warn('Failed to notify admins:', notifyError);
          // Don't fail signup if notification fails
        }
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
      } else if (data.user) {
        // Reset rate limiter on successful login
        rateLimiter.reset(clientKey);
        
        // Check if user profile exists in users table, if not create it
        // This handles cases where the database trigger failed during signup
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', data.user.id)
          .maybeSingle();
        
        if (!existingUser) {
          console.log('Missing user profile detected, auto-creating...');
          const fullName = data.user.user_metadata?.full_name || sanitizedEmail.split('@')[0] || 'User';
          const role = data.user.user_metadata?.role || 'student';
          
          // Create missing user profile
          await supabase.from('users').insert({
            id: data.user.id,
            email: sanitizedEmail,
            full_name: fullName,
            role: role
          }).single();
          
          // Create missing user_roles entry
          await supabase.from('user_roles').insert({
            user_id: data.user.id,
            role: role
          }).single();
          
          console.log('Auto-created missing user profile for:', sanitizedEmail);
        }
      }
      
      return { data, error };
    } catch (error: any) {
      const errorMessage = 'Sign in failed';
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
