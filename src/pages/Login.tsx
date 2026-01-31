import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
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
        role === 'teacher' ? '/teacher' : '/playground';
      navigate(redirectPath, { replace: true });
    }
  }, [user, loading, navigate]);

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
