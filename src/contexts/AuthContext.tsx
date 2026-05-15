
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { sanitizeText, rateLimiter } from '@/utils/security';
import { toast } from 'sonner';
import { detectMarketRegion } from '@/lib/marketRegion';

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
  const [isConfigured] = useState(true); // Always configured in Engleuphoria deployments
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

  // Function to fetch user data from database (parallelized profile + role)
  const fetchUserFromDatabase = async (authUser: any): Promise<User | null> => {
    try {
      const userId = authUser.id;
      const [profileRes, role] = await Promise.all([
        supabase.from('users').select('*').eq('id', userId).single(),
        fetchUserRoleFromDatabase(userId),
      ]);

      if (profileRes.error) {
        console.warn('User not found in database, will use auth metadata');
        return null;
      }

      return {
        ...(authUser as any),
        ...(profileRes.data as any),
        user_metadata: authUser.user_metadata || {},
        app_metadata: authUser.app_metadata || {},
        role: role ?? 'student',
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
          role: role,
          market_region: detectMarketRegion(),
        } as any, { onConflict: 'id' });
        if (upsertErr) console.error('Auto-heal users upsert failed:', upsertErr);

        try {
          await supabase.rpc('ensure_user_role', { p_user_id: authUser.id, p_role: role });
        } catch (e) { console.error('Auto-heal user_roles RPC failed:', e); }
        
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

  // Synchronous fallback user from auth metadata. Does NOT block on DB role fetch —
  // the canonical role is fetched in the background by the caller and merged in.
  const createFallbackUserSync = (authUser: any): User => {
    const fallbackName =
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      authUser.email?.split('@')[0] ||
      'User';

    // Prefer the role we just resolved at sign-in (sessionStorage cache) over
    // user_metadata.role, because metadata only reflects the *signup* role and
    // misses additional roles (e.g. content_creator added later). Without this,
    // ProtectedRoute briefly sees the wrong role on first render after redirect
    // and bounces the user back to /login?reason=access_denied.
    const cachedRole =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('auth_resolved_role')
        : null;
    const metadataRole = cachedRole || authUser.user_metadata?.role || 'student';

    return {
      id: authUser.id,
      email: authUser.email || '',
      full_name: fallbackName,
      role: metadataRole,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_metadata: authUser.user_metadata || {},
      app_metadata: authUser.app_metadata || {},
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
            
            // INITIAL_SESSION is handled by getSession() below — skip the listener
            // to prevent double state updates that cause flickering
            if (event === 'INITIAL_SESSION') {
              return;
            }
            
            setSession(currentSession);
            
            if (currentSession?.user) {
              if (event === 'SIGNED_IN') {
                // signIn() already handles redirect — skip if already done
                if (sessionStorage.getItem('auth_redirect_done') || signInRedirectRef.current) {
                  return;
                }
                // SIGNED_IN without signIn() (e.g. email verification, magic link)
                (async () => {
                  if (!mounted) return;
                  try {
                    await autoHealUserRows(currentSession.user);
                    const dbUser = await fetchUserFromDatabase(currentSession.user);
                    const finalUser = dbUser || createFallbackUserSync(currentSession.user);
                    if (mounted) {
                      setUser(finalUser);
                      setLoading(false);
                    }
                  } catch (err) {
                    console.error('Error in SIGNED_IN state update:', err);
                    if (mounted) {
                      const fallback = createFallbackUserSync(currentSession.user);
                      setUser(fallback);
                      setLoading(false);
                    }
                  }
                })();
              } else if (event === 'TOKEN_REFRESHED') {
                // Silent refresh — don't re-fetch user, just update session
                // This prevents unnecessary flickering on token refresh
              } else {
                // Other events — update user in background
                setTimeout(async () => {
                  if (!mounted) return;
                  try {
                    const dbUser = await fetchUserFromDatabase(currentSession.user);
                    if (mounted) {
                      const finalUser = dbUser || createFallbackUserSync(currentSession.user);
                      setUser(finalUser);
                    }
                  } catch (error) {
                    console.error('Error in deferred user fetch:', error);
                    if (mounted) {
                      const fallbackUser = createFallbackUserSync(currentSession.user);
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

        // THEN get initial session, but race against a 1.5s timeout so a
        // stalled auth network call can't freeze boot. The onAuthStateChange
        // listener will catch up if the real session arrives later.
        const sessionRace = Promise.race([
          supabase.auth.getSession().then((r) => r.data.session),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500)),
        ]);
        const initialSession = await sessionRace;

        if (mounted) {
          setSession(initialSession);

          if (initialSession?.user) {
            // Show fallback user (auth metadata) immediately so we don't block
            // render on a slow DB fetch. Real DB user swaps in below.
            const fallback = createFallbackUserSync(initialSession.user);
            if (mounted) setUser(fallback);
            initialFetchDoneRef.current = true;
            setLoading(false);

            // Background: fetch the real DB user and replace silently.
            fetchUserFromDatabase(initialSession.user)
              .then((dbUser) => {
                if (mounted && dbUser) {
                  setUser(dbUser);
                  // Canonical role confirmed — drop the sign-in cache.
                  sessionStorage.removeItem('auth_resolved_role');
                }
              })
              .catch((err) => console.error('Background user fetch failed:', err));
          } else {
            setUser(null);
            initialFetchDoneRef.current = true;
            setLoading(false);
          }
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
            const fallback = createFallbackUserSync(currentSession.user);
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
      
      const redirectUrl = `${window.location.origin}/auth/callback`;
      
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
      sessionStorage.removeItem('auth_resolved_role');
      signInRedirectRef.current = false;

      // Input sanitization
      const sanitizedEmail = sanitizeText(email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });
      
      if (error) {
        const status = (error as any)?.status ?? 0;
        const raw = (error.message || '').trim();
        const friendly = raw
          || (status >= 500
            ? 'Authentication service is temporarily unavailable. Please try again in a moment.'
            : 'Invalid email or password.');
        setError(friendly);
        toast.error(friendly);
        return { data: null, error: { ...(error as any), message: friendly } };
      } else if (data.user) {
        // Reset rate limiter on successful login
        rateLimiter.reset(clientKey);

        // Resolve role with a SHORT timeout so a slow DB never blocks the redirect.
        // Falls back to user_metadata.role then 'student'.
        const metadataRole = (data.user as any).user_metadata?.role;
        let resolvedRole: string | null = null;
        try {
          resolvedRole = await Promise.race([
            fetchUserRoleFromDatabase(data.user.id),
            new Promise<null>((resolve) => setTimeout(() => resolve(null), 1200)),
          ]);
        } catch {
          resolvedRole = null;
        }
        const finalRole = resolvedRole || metadataRole || 'student';

        // Fire-and-forget auto-heal so missing rows don't block the redirect.
        autoHealUserRows(data.user).catch((e) =>
          console.warn('Background auto-heal failed (non-fatal):', e)
        );

        let redirectPath = '/dashboard';
        if (finalRole === 'admin') {
          redirectPath = '/super-admin';
        } else if (finalRole === 'content_creator') {
          redirectPath = '/content-creator';
        } else if (finalRole === 'teacher') {
          redirectPath = '/teacher';
        } else if (finalRole === 'parent') {
          redirectPath = '/parent';
        } else if (finalRole === 'student') {
          // Hub from auth metadata only — avoid an extra DB round-trip here.
          const hubType =
            (data.user as any).user_metadata?.hub_type ||
            'playground';
          redirectPath = hubType === 'academy' ? '/academy'
            : hubType === 'professional' ? '/hub'
            : '/playground';
        }

        setSession(data.session ?? null);
        setUser({ ...(data.user as any), role: finalRole } as any);
        sessionStorage.setItem('auth_redirect_done', 'true');
        sessionStorage.setItem('auth_resolved_role', finalRole);
        signInRedirectRef.current = true;
        window.location.href = redirectPath;
      }
      
      return { data, error };
    } catch (error: any) {
      const errorMessage = (error?.message && String(error.message).trim()) || 'Sign in failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      return { data: null, error: { message: errorMessage } };
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
        redirectTo: `https://engleuphoria.com/reset-password`
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
      setError(null);
      
      if (!isConfigured) {
        console.error('❌ Supabase not configured for logout');
        setError('Supabase not configured. Please check your environment setup.');
        return { error: new Error('Supabase not configured') };
      }

      // Clear redirect flag so next login can redirect again
      sessionStorage.removeItem('auth_redirect_done');
      sessionStorage.removeItem('auth_resolved_role');
      // Clear user state immediately
      setUser(null);
      setSession(null);
      
      // Use 'local' scope so a missing/expired server session doesn't fail the flow.
      // The user is logged out client-side regardless.
      const { error } = await supabase.auth.signOut({ scope: 'local' });

      if (error) {
        const msg = (error as any)?.message?.toLowerCase?.() || '';
        const code = (error as any)?.code || (error as any)?.status;
        const isAlreadyGone =
          code === 'session_not_found' ||
          code === 403 ||
          msg.includes('session') && (msg.includes('not found') || msg.includes('missing') || msg.includes('expired'));

        if (isAlreadyGone) {
        } else {
          console.error('❌ Logout error:', error);
          // Don't block redirect — still proceed to home
        }
      } else {
      }
      
      // Force redirect to home page using location.replace for complete reload
      window.location.replace('/');
      
      return { error };
    } catch (error) {
      console.error('❌ Sign out error:', error);
      setError('Sign out failed');
      // Force redirect even on error
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
