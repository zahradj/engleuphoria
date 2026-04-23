import React, { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useStudentLevel, getStudentDashboardRoute } from '@/hooks/useStudentLevel';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { studentLevel, onboardingCompleted, loading: studentLoading, refetch } = useStudentLevel();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const autoHealAttemptedRef = useRef(false);

  // Hard safety timeout — if nothing resolves in 10s, force to /playground
  useEffect(() => {
    const hardTimeout = setTimeout(() => {
      if (!redirectPath && user) {
        console.warn('⏱️ Dashboard hard timeout (10s) — forcing /playground');
        setRedirectPath('/playground');
      }
    }, 10000);
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

      // If studentLevel is loaded and valid, route to the right dashboard
      if (studentLevel) {
        if (!onboardingCompleted) {
          setRedirectPath('/hub-confirmation');
          return;
        }
        setRedirectPath(getStudentDashboardRoute(studentLevel));
        return;
      }

      // studentLevel is null — auto-heal: create student_profiles from metadata
      if (!autoHealAttemptedRef.current) {
        autoHealAttemptedRef.current = true;
        (async () => {
          try {
            const hubType = user.user_metadata?.hub_type || 'playground';
            const resolvedLevel = hubType === 'academy' ? 'academy'
              : (hubType === 'professional' || hubType === 'success') ? 'professional'
              : 'playground';

            console.log('🔧 Dashboard auto-healing student_profiles →', resolvedLevel);
            
            await supabase.from('student_profiles').upsert(
              { user_id: user.id, student_level: resolvedLevel, onboarding_completed: false },
              { onConflict: 'user_id' }
            );

            // Re-fetch student level after healing
            await refetch();
          } catch (err) {
            console.error('Auto-heal failed:', err);
            setRedirectPath('/playground');
          }
        })();
        return;
      }

      // Auto-heal was attempted but level is still null — force fallback
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
