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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const dashboardMap: Record<string, string> = {
      student: '/student',
      teacher: '/teacher', 
      admin: '/admin'
    };
    return <Navigate to={dashboardMap[user.role] || '/student'} replace />;
  }

  // If no specific role required but user is on /dashboard, redirect to role-specific dashboard
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