import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LogIn, Loader2 } from 'lucide-react';
import { AuthPageLayout } from '@/components/auth/AuthPageLayout';
import { SimpleAuthForm } from '@/components/auth/SimpleAuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('reason') === 'access_denied') {
      toast.error('Access Denied', {
        description: "You don't have permission to access that page.",
        duration: 5000,
      });
    }
  }, [searchParams]);

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
    <AuthPageLayout
      title="Welcome Back"
      subtitle="Sign in to continue your learning journey"
      icon={LogIn}
      variant="default"
    >
      <SimpleAuthForm mode="login" />
    </AuthPageLayout>
  );
};

export default Login;
