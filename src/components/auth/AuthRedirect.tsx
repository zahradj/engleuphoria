import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AuthRedirectProps {
  children: React.ReactNode;
}

export const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect authenticated users to their dashboard
  if (user) {
    const dashboardMap: Record<string, string> = {
      student: '/dashboard',
      teacher: '/teacher-dashboard',
      admin: '/admin',
      parent: '/dashboard'
    };
    return <Navigate to={dashboardMap[user.role] || '/dashboard'} replace />;
  }

  // Show login/signup for unauthenticated users
  return <>{children}</>;
};