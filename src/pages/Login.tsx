import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';
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
  const [roleTimeout, setRoleTimeout] = useState(false);

  useEffect(() => {
    if (searchParams.get('reason') === 'access_denied') {
      toast.error('Access Denied', {
        description: "You don't have permission to access that page.",
        duration: 5000,
      });
    }
  }, [searchParams]);

  // Strict role-gated redirect: never navigate until role is confirmed.
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

    // No role yet — wait, but show a warning after 8s instead of silently redirecting.
    const t = setTimeout(() => setRoleTimeout(true), 8000);
    return () => clearTimeout(t);
  }, [loading, user, navigate]);

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center max-w-md px-6">
          {roleTimeout ? (
            <>
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <p className="text-foreground text-lg font-medium">
                We couldn't verify your role.
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Please refresh the page or contact support if this persists.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
              >
                Refresh
              </button>
            </>
          ) : (
            <>
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-foreground text-lg font-medium">
                {user ? 'Verifying role…' : 'Loading...'}
              </p>
              <p className="text-muted-foreground text-sm mt-2">Please wait</p>
            </>
          )}
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
