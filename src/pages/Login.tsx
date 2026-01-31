import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Loader2 } from 'lucide-react';
import { AuthPageLayout } from '@/components/auth/AuthPageLayout';
import { SimpleAuthForm } from '@/components/auth/SimpleAuthForm';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect logged-in users to their appropriate dashboard
  useEffect(() => {
    if (!loading && user) {
      const role = (user as any).role;
      const redirectPath = 
        role === 'admin' ? '/super-admin' : 
        role === 'teacher' ? '/admin' : '/playground';
      navigate(redirectPath, { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading state while auth context is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthPageLayout
      title="Welcome Back"
      subtitle="Log in to continue your learning journey"
      icon={LogIn}
      variant="default"
    >
      <SimpleAuthForm mode="login" />
    </AuthPageLayout>
  );
};

export default Login;
