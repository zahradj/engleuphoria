import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDevBypass } from '@/hooks/useDevBypass';
import { DevBypassWrapper } from './DevBypassWrapper';

interface ImprovedProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export const ImprovedProtectedRoute: React.FC<ImprovedProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  redirectTo = '/login' 
}) => {
  const navigate = useNavigate();
  const { user, loading, error } = useAuth();
  const { isDevBypassActive, bypassRole } = useDevBypass();

  // DEV BYPASS - Only in development mode with query param
  if (isDevBypassActive && bypassRole) {
    console.warn('⚠️ DEV BYPASS ACTIVE - This should never appear in production');
    return <DevBypassWrapper role={bypassRole}>{children}</DevBypassWrapper>;
  }

  // Show loading spinner while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we set things up</p>
        </div>
      </div>
    );
  }

  // Show error state if authentication failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-semibold text-lg text-gray-900 mb-2">Authentication Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
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

  // Check role if required
  if (requiredRole && user.role !== requiredRole) {
    // Handle special case for /dashboard generic redirect
    if (requiredRole === 'any') {
      return <>{children}</>;
    }

    // Redirect to appropriate dashboard based on actual role
    const roleRedirects: Record<string, string> = {
      student: '/playground',
      teacher: '/admin',
      admin: '/super-admin',
      parent: '/parent'
    };

    const redirectPath = roleRedirects[user.role] || '/login';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
