import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { TeacherClassroom } from '@/components/teacher/classroom';
import { SessionPrivacyGuard } from '@/components/classroom/SessionPrivacyGuard';
import { PreFlightCheck } from '@/components/classroom/PreFlightCheck';

const TeacherClassroomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [preFlightPassed, setPreFlightPassed] = useState(false);

  if (!id) {
    return <Navigate to="/admin" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!preFlightPassed) {
    return <PreFlightCheck onComplete={() => setPreFlightPassed(true)} />;
  }

  const teacherName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Teacher';

  return (
    <SessionPrivacyGuard sessionId={id}>
      <TeacherClassroom 
        classId={id} 
        teacherName={teacherName}
      />
    </SessionPrivacyGuard>
  );
};

export default TeacherClassroomPage;
