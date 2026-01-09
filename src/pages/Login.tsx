import React from 'react';
import { LogIn } from 'lucide-react';
import { AuthPageLayout } from '@/components/auth/AuthPageLayout';
import { SimpleAuthForm } from '@/components/auth/SimpleAuthForm';

const Login = () => {
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
