
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  redirectTo = '/login' 
}) => {
  const { user, loading } = useAuth();

  // Show loading spinner while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if no user
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role requirements
  if (requiredRole && user.role !== requiredRole) {
    const dashboardMap: Record<string, string> = {
      student: '/student',
      teacher: '/teacher', 
      admin: '/admin'
    };
    return <Navigate to={dashboardMap[user.role] || '/student'} replace />;
  }

  // Handle generic /dashboard redirect
  if (!requiredRole && window.location.pathname === '/dashboard') {
    const dashboardMap: Record<string, string> = {
      student: '/student',
      teacher: '/teacher', 
      admin: '/admin'
    };
    return <Navigate to={dashboardMap[user.role] || '/student'} replace />;
  }

  return <>{children}</>;
};
