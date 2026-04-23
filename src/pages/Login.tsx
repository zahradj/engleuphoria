import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LogIn, Loader2 } from 'lucide-react';
import { AuthPageLayout } from '@/components/auth/AuthPageLayout';
import { SimpleAuthForm } from '@/components/auth/SimpleAuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { HeroThemeProvider } from '@/contexts/HeroThemeContext';
import { resolveHubRoute } from '@/lib/hubResolver';
import { toast } from 'sonner';

const Login = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirectedRef = useRef(false);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchParams.get('reason') === 'access_denied') {
      toast.error('Access Denied', {
        description: "You don't have permission to access that page.",
        duration: 5000,
      });
    }
  }, [searchParams]);

  // Safety net: redirect authenticated users based on role.
  // If role doesn't resolve in 3s, fall back to metadata-based hub routing.
  useEffect(() => {
    if (loading || !user || redirectedRef.current) return;

    const role = (user as any).role;
    const doRedirect = (path: string) => {
      redirectedRef.current = true;
      navigate(path, { replace: true });
    };

    if (role) {
      if (role === 'admin') doRedirect('/super-admin');
      else if (role === 'content_creator') doRedirect('/content-creator');
      else if (role === 'teacher') doRedirect('/teacher');
      else if (role === 'parent') doRedirect('/parent');
      else if (role === 'student') {
        const { route } = resolveHubRoute({ metadata: (user as any).user_metadata });
        doRedirect(route);
      } else {
        doRedirect('/dashboard');
      }
      return;
    }

    // No role yet — arm a 3s metadata fallback so we never freeze.
    if (!fallbackTimerRef.current) {
      fallbackTimerRef.current = setTimeout(() => {
        if (redirectedRef.current) return;
        const { route, source } = resolveHubRoute({ metadata: (user as any).user_metadata });
        console.warn(`⏱️ [Login] role timeout — routing from ${source} →`, route);
        doRedirect(route);
      }, 3000);
    }

    return () => {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
    };
  }, [loading, user, navigate]);

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-foreground text-lg font-medium">
            {user ? 'Redirecting to your dashboard...' : 'Loading...'}
          </p>
          <p className="text-muted-foreground text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <HeroThemeProvider>
      <AuthPageLayout
        title="Welcome Back"
        subtitle="Sign in to continue your learning journey"
        icon={LogIn}
        variant="default"
      >
        <SimpleAuthForm mode="login" />
      </AuthPageLayout>
    </HeroThemeProvider>
  );
};

export default Login;
