import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useStudentLevel, getStudentDashboardRoute } from '@/hooks/useStudentLevel';
import { Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { studentLevel, onboardingCompleted, loading: studentLoading } = useStudentLevel();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  // Hard safety timeout — if nothing resolves in 8s, force to /playground
  useEffect(() => {
    const hardTimeout = setTimeout(() => {
      if (!redirectPath && user) {
        console.warn('⏱️ Dashboard hard timeout (8s) — forcing /playground');
        setRedirectPath('/playground');
      }
    }, 8000);
    return () => clearTimeout(hardTimeout);
  }, [user, redirectPath]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setRedirectPath('/login');
      return;
    }

    const userRole = (user as any).role;

    if (!userRole) {
      console.log('⏳ Waiting for user role to be populated...');
      return;
    }

    console.log('📍 Dashboard redirecting user with role:', userRole);

    if (userRole === 'admin') { setRedirectPath('/super-admin'); return; }
    if (userRole === 'teacher') { setRedirectPath('/teacher'); return; }
    if (userRole === 'content_creator') { setRedirectPath('/content-creator'); return; }
    if (userRole === 'parent') { setRedirectPath('/parent'); return; }

    if (userRole === 'student') {
      if (studentLoading) return;

      if (!onboardingCompleted && studentLevel) {
        setRedirectPath('/onboarding');
        return;
      }

      if (studentLevel) {
        setRedirectPath(getStudentDashboardRoute(studentLevel));
        return;
      }

      // No level set — default
      setRedirectPath('/playground');
      return;
    }

    // Unknown role fallback
    setRedirectPath('/playground');
  }, [user, authLoading, studentLevel, studentLoading, onboardingCompleted]);

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-foreground text-lg font-medium">
          {authLoading ? 'Loading your dashboard...' : 'Verifying your access...'}
        </p>
        <p className="text-muted-foreground text-sm mt-2">Preparing your personalized experience</p>
      </div>
    </div>
  );
};

export default Dashboard;
