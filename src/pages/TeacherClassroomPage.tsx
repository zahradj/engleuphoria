import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { TeacherClassroom } from '@/components/teacher/classroom';

const TeacherClassroomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  if (!id) {
    return <Navigate to="/admin" replace />;
  }

  const teacherName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Teacher';

  return (
    <TeacherClassroom 
      classId={id} 
      teacherName={teacherName}
    />
  );
};

export default TeacherClassroomPage;
