import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { StudentClassroom } from '@/components/student/classroom';
import { Skeleton } from '@/components/ui/skeleton';
import { SessionPrivacyGuard } from '@/components/classroom/SessionPrivacyGuard';

const StudentClassroomPage: React.FC = () => {
  const { id: roomId } = useParams<{ id: string }>();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
          <Skeleton className="h-32 w-full max-w-md mx-auto" />
        </div>
      </div>
    );
  }

  if (!roomId) {
    return <Navigate to="/playground" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const studentName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student';

  return (
    <SessionPrivacyGuard sessionId={roomId}>
      <StudentClassroom
        roomId={roomId}
        studentId={user.id}
        studentName={studentName}
      />
    </SessionPrivacyGuard>
  );
};

export default StudentClassroomPage;
