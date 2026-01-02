import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { StudentClassroom } from '@/components/student/classroom';
import { Skeleton } from '@/components/ui/skeleton';

const StudentClassroomPage: React.FC = () => {
  const { id: roomId } = useParams<{ id: string }>();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-48 mx-auto bg-gray-800" />
          <Skeleton className="h-4 w-64 mx-auto bg-gray-800" />
          <Skeleton className="h-32 w-full max-w-md mx-auto bg-gray-800" />
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
    <StudentClassroom
      roomId={roomId}
      studentId={user.id}
      studentName={studentName}
    />
  );
};

export default StudentClassroomPage;
