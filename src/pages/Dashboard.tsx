import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useStudentLevel, getStudentDashboardRoute } from '@/hooks/useStudentLevel';
import { Loader2 } from 'lucide-react';

/**
 * Smart Dashboard Router
 * 
 * This component acts as a central hub that redirects users to their 
 * appropriate dashboard based on their role and student level.
 * 
 * Flow:
 * 1. Check if user is authenticated
 * 2. Check user role from user_roles table
 * 3. Redirect based on role:
 *    - admin -> /super-admin
 *    - teacher -> /admin
 *    - student -> Check student_level:
 *      - playground -> /playground
 *      - academy -> /academy
 *      - professional -> /hub
 * 4. If student hasn't completed onboarding -> /onboarding
 */
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { studentLevel, onboardingCompleted, loading: studentLoading } = useStudentLevel();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) return;

    // If not authenticated, redirect to login
    if (!user) {
      setRedirectPath('/login');
      return;
    }

    const userRole = (user as any).role;
    
    // Wait for role to be populated before redirecting
    // This prevents race conditions where user exists but role hasn't been fetched yet
    if (!userRole) {
      console.log('Waiting for user role to be populated...');
      return;
    }

    console.log('Dashboard redirecting user with role:', userRole);

    // Handle admin redirect
    if (userRole === 'admin') {
      setRedirectPath('/super-admin');
      return;
    }

    // Handle teacher redirect
    if (userRole === 'teacher') {
      setRedirectPath('/admin');
      return;
    }

    // Handle parent redirect
    if (userRole === 'parent') {
      setRedirectPath('/parent');
      return;
    }

    // Handle student redirect - wait for student level to load
    if (userRole === 'student') {
      if (studentLoading) return;

      // Check if onboarding is required
      if (!onboardingCompleted && studentLevel) {
        setRedirectPath('/onboarding');
        return;
      }

      // Redirect to appropriate student dashboard based on level
      if (studentLevel) {
        const dashboardRoute = getStudentDashboardRoute(studentLevel);
        setRedirectPath(dashboardRoute);
        return;
      }

      // Default to playground if no level is set
      setRedirectPath('/playground');
      return;
    }

    // Default fallback for unknown roles
    setRedirectPath('/login');
  }, [user, authLoading, studentLevel, studentLoading, onboardingCompleted]);

  // Show loading state while determining redirect
  if (authLoading || (user && (user as any).role === 'student' && studentLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-foreground text-lg font-medium">Loading your dashboard...</p>
          <p className="text-muted-foreground text-sm mt-2">Preparing your personalized experience</p>
        </div>
      </div>
    );
  }

  // Perform the redirect
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  // Fallback loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-foreground text-lg">Redirecting...</p>
      </div>
    </div>
  );
};

export default Dashboard;
