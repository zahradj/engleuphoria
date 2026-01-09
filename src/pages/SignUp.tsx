import React from 'react';
import { UserPlus } from 'lucide-react';
import { AuthPageLayout } from '@/components/auth/AuthPageLayout';
import { SimpleAuthForm } from '@/components/auth/SimpleAuthForm';

const SignUp = () => {
  return (
    <AuthPageLayout
      title="Create Account"
      subtitle="Join our community of English learners"
      icon={UserPlus}
      variant="default"
    >
      <SimpleAuthForm mode="signup" />
    </AuthPageLayout>
  );
};

export default SignUp;
