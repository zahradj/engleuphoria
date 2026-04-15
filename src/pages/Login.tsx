import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LogIn, Loader2 } from 'lucide-react';
import { AuthPageLayout } from '@/components/auth/AuthPageLayout';
import { SimpleAuthForm } from '@/components/auth/SimpleAuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { HeroThemeProvider } from '@/contexts/HeroThemeContext';
import { toast } from 'sonner';

const Login = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (searchParams.get('reason') === 'access_denied') {
      toast.error('Access Denied', {
        description: "You don't have permission to access that page.",
        duration: 5000,
      });
    }
  }, [searchParams]);

  // Safety net: redirect authenticated users based on role
  // Guard: only redirect once AND only when role is resolved
  useEffect(() => {
    if (!loading && user && !redirectedRef.current) {
      const role = (user as any).role;
      // Don't redirect if role hasn't been resolved yet
      if (!role) return;
      redirectedRef.current = true;
      if (role === 'admin') navigate('/super-admin', { replace: true });
      else if (role === 'content_creator') navigate('/content-creator', { replace: true });
      else if (role === 'teacher') navigate('/teacher', { replace: true });
      else if (role === 'parent') navigate('/parent', { replace: true });
      else navigate('/dashboard', { replace: true });
    }
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
