import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDevBypass } from '@/hooks/useDevBypass';
import { DevBypassWrapper } from './DevBypassWrapper';
import { useStudentLevel, StudentLevel } from '@/hooks/useStudentLevel';

interface ImprovedProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredStudentLevel?: StudentLevel;
  requireOnboarding?: boolean;
  redirectTo?: string;
}

export const ImprovedProtectedRoute: React.FC<ImprovedProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  requiredStudentLevel,
  requireOnboarding = false,
  redirectTo = '/login' 
}) => {
  const navigate = useNavigate();
  const { user, loading, error } = useAuth();
  const { isDevBypassActive, bypassRole } = useDevBypass();
  const { studentLevel, onboardingCompleted, loading: studentLoading } = useStudentLevel();
  const [roleLoadTimeout, setRoleLoadTimeout] = useState(false);

  // Timeout for role loading - if role doesn't appear within 5 seconds, redirect to login
  useEffect(() => {
    if (user && !(user as any).role && requiredRole && requiredRole !== 'any') {
      const timeout = setTimeout(() => {
        console.warn('⏱️ Role verification timeout - redirecting to login');
        setRoleLoadTimeout(true);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [user, requiredRole]);

  // DEV BYPASS - Only in development mode with query param
  if (isDevBypassActive && bypassRole) {
    console.warn('⚠️ DEV BYPASS ACTIVE - This should never appear in production');
    return <DevBypassWrapper role={bypassRole}>{children}</DevBypassWrapper>;
  }

  // Show loading spinner while auth is being determined
  const isLoadingStudentData = user?.role === 'student' && studentLoading;
  if (loading || isLoadingStudentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-foreground text-lg font-medium">Loading your dashboard...</p>
          <p className="text-muted-foreground text-sm mt-2">Please wait while we set things up</p>
        </div>
      </div>
    );
  }

  // Show error state if authentication failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="font-semibold text-lg text-foreground mb-2">Authentication Error</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button 
              onClick={() => navigate('/login')} 
              variant="outline"
              className="w-full"
            >
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to login if no user
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  const userRole = (user as any).role;

  // If role is required but not yet loaded, show loading spinner
  if (requiredRole && requiredRole !== 'any' && !userRole && !roleLoadTimeout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-foreground text-lg font-medium">Verifying your access...</p>
          <p className="text-muted-foreground text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  // If role verification timed out, redirect to login
  if (requiredRole && requiredRole !== 'any' && !userRole && roleLoadTimeout) {
    console.warn('🚫 Role verification failed - redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check role if required
  if (requiredRole && requiredRole !== 'any' && userRole !== requiredRole) {
    // SECURITY: If user tries to access a protected route without the required role,
    // always kick them back to login (do not "helpfully" redirect to another dashboard).
    return <Navigate to={redirectTo} replace />;
  }

  // Check student level if required (for student-specific routes)
  if (requiredStudentLevel && userRole === 'student') {
    if (studentLevel !== requiredStudentLevel) {
      // Redirect to the smart dashboard router which will handle proper routing
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Check if onboarding is required and not completed
  if (requireOnboarding && userRole === 'student' && !onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
