
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

  // Derive an effective role from multiple sources to avoid false "access denied"
  const email = (user as any)?.email as string | undefined;
  const metaRole = (user as any)?.user_metadata?.role as string | undefined;
  const storedUserType = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;
  const specialAdminEmails = ['f.zahra.djaanine@engleuphoria.com'];
  const effectiveRole = specialAdminEmails.includes(email || '')
    ? 'admin'
    : ((user as any)?.role || metaRole || (storedUserType === 'admin' ? 'admin' : undefined));

  // Check role requirements using effectiveRole
  if (requiredRole && effectiveRole !== requiredRole) {
    // Redirect to correct dashboard if we know the role
    const dashboardMap: Record<string, string> = {
      student: '/student',
      teacher: '/teacher',
      admin: '/admin'
    };

    const correctPath = effectiveRole ? dashboardMap[effectiveRole] : undefined;

    if (correctPath) {
      return <Navigate to={correctPath} replace />;
    } else {
      // Handle unknown roles
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Role Not Recognized</h3>
              <p className="text-gray-600 mb-4">
                Your account role "{String((user as any)?.role || metaRole || 'unknown')}" is not recognized. Please contact support.
              </p>
              <Button 
                onClick={() => navigate('/')} 
                variant="outline"
                className="w-full"
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Handle generic /dashboard redirect
  if (!requiredRole && window.location.pathname === '/dashboard') {
    const dashboardMap: Record<string, string> = {
      student: '/student',
      teacher: '/teacher', 
      admin: '/admin'
    };
    return <Navigate to={dashboardMap[effectiveRole || 'student'] || '/student'} replace />;
  }

  return <>{children}</>;
};
