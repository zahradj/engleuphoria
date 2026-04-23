import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useStudentLevel, getStudentDashboardRoute } from '@/hooks/useStudentLevel';

export const HomeGate: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { studentLevel, loading: studentLoading } = useStudentLevel();

  if (authLoading || (user && (user as any).role === 'student' && studentLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-foreground text-lg font-medium">Preparing your experience...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const role = (user as any).role;
  if (role === 'admin') return <Navigate to="/super-admin" replace />;
  if (role === 'content_creator') return <Navigate to="/content-creator" replace />;
  if (role === 'teacher') return <Navigate to="/teacher" replace />;
  if (role === 'parent') return <Navigate to="/parent" replace />;
  if (role === 'student' && studentLevel) return <Navigate to={getStudentDashboardRoute(studentLevel)} replace />;

  return <Navigate to="/dashboard" replace />;
};
