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

  console.log('=== ProtectedRoute render ===');
  console.log('Path:', window.location.pathname);
  console.log('User:', user);
  console.log('Loading:', loading);
  console.log('Required role:', requiredRole);

  if (loading) {
    console.log('Still loading, showing spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to:', redirectTo);
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
    console.log('Redirecting from /dashboard to:', dashboardMap[user.role] || '/student');
    return <Navigate to={dashboardMap[user.role] || '/student'} replace />;
  }

  console.log('✅ ProtectedRoute: All checks passed, rendering children');
  return <>{children}</>;
};