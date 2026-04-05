
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
  const signInRedirectRef = useRef(false); // Track if SIGNED_IN redirect is in progress
  const initialFetchDoneRef = useRef(false); // Track when initial auth fetch completes

  // SECURITY: Roles MUST come from user_roles table only.
  // When a user has multiple roles, prioritize: admin > content_creator > teacher > student
  const fetchUserRoleFromDatabase = async (userId: string): Promise<string | null> => {
    try {
      // Use .select() (NOT .maybeSingle()) to handle users with multiple roles
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (!error && data && data.length > 0) {
        // Priority order: admin > content_creator > teacher > parent > student
        const priorityOrder = ['admin', 'content_creator', 'teacher', 'parent', 'student'];
        const userRoles = data.map((r: any) => r.role);
        
        for (const role of priorityOrder) {
          if (userRoles.includes(role)) {
            return role;
          }
        }
        
        return userRoles[0] ?? null;
      }

      // Fallback: check users.role column for legacy users missing user_roles rows
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      
      return userData?.role || null;
    } catch {
      return null;
    }
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

      // Attach role from user_roles table (do NOT read role from users table)
      const role = (await fetchUserRoleFromDatabase(userId)) ?? 'student';
      return {
        ...(userData as any),
        role
      } as any;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // Auto-heal: ensure users + user_roles rows exist for authenticated user
  const autoHealUserRows = async (authUser: any) => {
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', authUser.id)
        .maybeSingle();

      if (!existingUser) {
        const fullName = authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User';
        const role = authUser.user_metadata?.role || 'student';
        
        const { error: upsertErr } = await supabase.from('users').upsert({
          id: authUser.id,
          email: authUser.email,
          full_name: fullName,
          role: role
        }, { onConflict: 'id' });
        if (upsertErr) console.error('Auto-heal users upsert failed:', upsertErr);

        try {
          await supabase.rpc('ensure_user_role', { p_user_id: authUser.id, p_role: role });
        } catch (e) { console.error('Auto-heal user_roles RPC failed:', e); }
        
        console.log('🔧 Auto-healed missing user rows for:', authUser.email);
        return;
      }

      // User exists — check user_roles
      const { data: existingRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authUser.id);

      if (!existingRoles || existingRoles.length === 0) {
        const role = authUser.user_metadata?.role || 'student';
        try {
          await supabase.rpc('ensure_user_role', { p_user_id: authUser.id, p_role: role });
          console.warn('🔧 Auto-healed missing user_roles for:', authUser.email);
        } catch (e) { console.error('Auto-heal user_roles RPC failed:', e); }
      }
    } catch (err) {
      console.error('Auto-heal error (non-fatal):', err);
    }
  };

  // Function to create fallback user from auth metadata
  const createFallbackUser = async (authUser: any): Promise<User> => {
    const role = (await fetchUserRoleFromDatabase(authUser.id)) ?? 'student';
    
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
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            if (!mounted) return;
            
            console.info('Auth state changed:', event, !!currentSession);
            setSession(currentSession);
            
            if (currentSession?.user) {
              // SIGNED_IN is handled entirely by the signIn() function which
              // already does role resolution + redirect. The listener only needs
              // to update user state for non-redirect events.
              if (event === 'SIGNED_IN') {
                // signIn() already handles redirect — just update state if needed
                if (sessionStorage.getItem('auth_redirect_done') || signInRedirectRef.current) {
                  // User state already set by signIn(), nothing to do
                  (async () => {
                    if (!mounted) return;
                    try {
                      const dbUser = await fetchUserFromDatabase(currentSession.user.id);
                      const finalUser = dbUser || await createFallbackUser(currentSession.user);
                      if (mounted) setUser(finalUser);
                    } catch (err) {
                      console.error('Error fetching user on reload:', err);
                      if (mounted) {
                        const fallback = await createFallbackUser(currentSession.user);
                        setUser(fallback);
                      }
                    }
                  })();
                  return;
                }
                // If somehow we get SIGNED_IN without signIn() handling it,
                // just update state — Login.tsx will handle the redirect
                (async () => {
                  if (!mounted) return;
                  try {
                    const dbUser = await fetchUserFromDatabase(currentSession.user.id);
                    const finalUser = dbUser || await createFallbackUser(currentSession.user);
                    if (mounted) {
                      setUser(finalUser);
                      setLoading(false);
                    }
                  } catch (err) {
                    console.error('Error in SIGNED_IN state update:', err);
                    if (mounted) {
                      const fallback = await createFallbackUser(currentSession.user);
                      setUser(fallback);
                      setLoading(false);
                    }
                  }
                })();
            } else if (event === 'INITIAL_SESSION') {
                // Page refresh with existing session - update state + auto-heal
                setTimeout(async () => {
                  if (!mounted) return;
                  
                  try {
                    // Auto-heal: ensure users and user_roles rows exist
                    await autoHealUserRows(currentSession.user);
                    
                    const dbUser = await fetchUserFromDatabase(currentSession.user.id);
                    if (mounted) {
                      const finalUser = dbUser || await createFallbackUser(currentSession.user);
                      setUser(finalUser);
                    }
                  } catch (error) {
                    console.error('Error in INITIAL_SESSION user fetch:', error);
                    if (mounted) {
                      const fallbackUser = await createFallbackUser(currentSession.user);
                      setUser(fallbackUser);
                    }
                  }
                }, 0);
              } else {
                // For other events (TOKEN_REFRESHED, SIGNED_OUT, etc), update user in background
                setTimeout(async () => {
                  if (!mounted) return;
                  
                  try {
                    const dbUser = await fetchUserFromDatabase(currentSession.user.id);
                    if (mounted) {
                      const finalUser = dbUser || await createFallbackUser(currentSession.user);
                      setUser(finalUser);
                    }
                  } catch (error) {
                    console.error('Error in deferred user fetch:', error);
                    if (mounted) {
                      const fallbackUser = await createFallbackUser(currentSession.user);
                      setUser(fallbackUser);
                    }
                  }
                }, 0);
              }
            } else {
              setUser(null);
              setLoading(false);
            }
          }
        );

        // THEN get initial session and AWAIT the user fetch
        // This is the ONLY place where we set loading = false
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(initialSession);
          
          if (initialSession?.user) {
            // Do NOT set interim user without role — it causes Login.tsx to
            // see a truthy user with undefined role and redirect to /dashboard
            // prematurely. Wait for the DB fetch to complete.
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
          initialFetchDoneRef.current = true;
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
     
    // Safety timeout with session recovery
    // Reduced from 10s to 6s — faster fallback with role recovery
    const timeout = setTimeout(async () => {
      if (signInRedirectRef.current) {
        console.log('⏳ Safety timeout skipped - redirect in progress');
        return;
      }
      if (initialFetchDoneRef.current) {
        return;
      }
      if (mounted && loading) {
        console.warn('Auth initialization timeout (6s) - forcing loading = false with fallback role');
        try {
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          if (currentSession?.user && mounted) {
            const fallback = await createFallbackUser(currentSession.user);
            setUser(fallback);
          }
        } catch (e) {
          console.error('Session recovery failed:', e);
        }
        if (mounted) setLoading(false);
      }
    }, 6000);

    return () => {
      mounted = false;
      initializedRef.current = false; // Allow re-init on StrictMode remount
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
      
      // Ensure stale redirect guard from previous sessions never blocks current login flow
      sessionStorage.removeItem('auth_redirect_done');
      signInRedirectRef.current = false;

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
          
          // Create missing user profile (upsert to handle race conditions)
          const { error: upsertErr } = await supabase.from('users').upsert({
            id: data.user.id,
            email: sanitizedEmail,
            full_name: fullName,
            role: role
          }, { onConflict: 'id' });
          if (upsertErr) console.error('Auto-heal users upsert failed:', upsertErr);
          
          // Create missing user_roles entry via RPC to bypass RLS
          try {
            await supabase.rpc('ensure_user_role', {
              p_user_id: data.user.id,
              p_role: role
            });
          } catch (rpcErr) {
            console.error('Auto-heal user_roles RPC failed:', rpcErr);
          }
          
          console.log('Auto-created missing user profile for:', sanitizedEmail);
        } else {
          // Auto-heal: check if user_roles rows exist (use .select, NOT .maybeSingle to avoid PGRST116)
          const { data: existingRoles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', data.user.id);

          if (!existingRoles || existingRoles.length === 0) {
            const { data: usersRow } = await supabase
              .from('users')
              .select('role')
              .eq('id', data.user.id)
              .maybeSingle();

            const healedRole = usersRow?.role
              || data.user.user_metadata?.role
              || 'student';

            // Use security definer RPC to bypass RLS
            await supabase.rpc('ensure_user_role', {
              p_user_id: data.user.id,
              p_role: healedRole
            });

            console.warn('🔧 Auto-healed missing user_roles:', data.user.email, '→', healedRole);
          }
        }

        // Deterministic post-login redirect fallback (prevents listener race conditions)
        const resolvedRole = (await fetchUserRoleFromDatabase(data.user.id))
          || data.user.user_metadata?.role
          || 'student';

        const redirectPath = resolvedRole === 'admin'
          ? '/super-admin'
          : resolvedRole === 'content_creator'
            ? '/content-creator'
            : resolvedRole === 'teacher'
              ? '/admin'
              : resolvedRole === 'parent'
                ? '/parent'
                : '/dashboard';

        setSession(data.session ?? null);
        setUser({ ...(data.user as any), role: resolvedRole } as any);
        sessionStorage.setItem('auth_redirect_done', 'true');
        signInRedirectRef.current = true;
        window.location.href = redirectPath;
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
        redirectTo: `https://engleuphoria.lovable.app/reset-password`
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
      // Clear redirect flag so next login can redirect again
      sessionStorage.removeItem('auth_redirect_done');
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
