
import React, { useEffect } from 'react';
import { SimpleAuthForm } from '@/components/auth/SimpleAuthForm';
import { createAdminAccount } from '@/utils/createAdmin';

const Login = () => {
  useEffect(() => {
    // Auto-create admin account when login page loads
    createAdminAccount();
  }, []);

  return <SimpleAuthForm mode="login" />;
};

export default Login;
