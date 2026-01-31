import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Loader2 } from 'lucide-react';
import { AuthPageLayout } from '@/components/auth/AuthPageLayout';
import { SimpleAuthForm } from '@/components/auth/SimpleAuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const SignUp = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  // Sign out existing user when accessing signup page
  useEffect(() => {
    if (!loading && user) {
      setIsSigningOut(true);
      console.log('Existing user detected on signup page, signing out...');
      supabase.auth.signOut().then(() => {
        console.log('Previous session cleared for new signup');
        setIsSigningOut(false);
      });
    }
  }, [user, loading]);

  // Show loading while signing out existing user
  if (isSigningOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 text-lg">Preparing signup...</p>
        </div>
      </div>
    );
  }

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
