import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MediaTestFlow } from '@/components/classroom/MediaTestFlow';
import { ClassroomAccessGuard } from '@/components/classroom/ClassroomAccessGuard';
import { OneOnOneVideoSection } from '@/components/classroom/oneonone/OneOnOneVideoSection';
import { MediaProvider } from '@/components/classroom/oneonone/video/MediaContext';
import { useOneOnOneClassroom } from '@/hooks/useOneOnOneClassroom';

type EntryStep = 'media-test' | 'classroom';

export default function ClassroomEntryPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<EntryStep>('media-test');
  const { user } = useAuth();
  
  const roomId = searchParams.get("roomId") || "unified-classroom-1";
  const roleParam = searchParams.get("role") || "student";
  const nameParam = searchParams.get("name") || "User";
  const userIdParam = searchParams.get("userId") || "user-1";

  const authedUserId = user?.id || userIdParam;
  const authedName = (user as any)?.full_name || (user?.user_metadata as any)?.full_name || nameParam;
  const authedRole = (user?.role as 'teacher' | 'student' | 'admin' | undefined) || (roleParam === 'teacher' ? 'teacher' : 'student');

  const isTeacher = authedRole === 'teacher';
  const userRole = isTeacher ? 'teacher' : 'student';

  const {
    studentXP,
    showRewardPopup,
    awardPoints
  } = useOneOnOneClassroom();

  const handleAccessDenied = () => {
    navigate(isTeacher ? "/teacher" : "/student");
  };

  const handleMediaTestComplete = () => {
    console.log('✅ Media test completed, proceeding to classroom');
    setCurrentStep('classroom');
  };

  const handleSkipMediaTest = () => {
    console.log('⚠️ Media test skipped, proceeding to classroom');
    setCurrentStep('classroom');
  };

  if (currentStep === 'media-test') {
    return (
      <MediaTestFlow
        roomId={roomId}
        role={authedRole}
        name={authedName}
        userId={authedUserId}
        onComplete={handleMediaTestComplete}
        onSkip={handleSkipMediaTest}
      />
    );
  }

  return (
    <ClassroomAccessGuard
      roomId={roomId}
      userId={authedUserId}
      userRole={userRole}
      onAccessDenied={handleAccessDenied}
    >
      <MediaProvider roomId={roomId}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
          <div className="max-w-7xl mx-auto h-[calc(100vh-2rem)]">
            <OneOnOneVideoSection
              enhancedClassroom={null}
              currentUserId={authedUserId}
              currentUserName={authedName}
              isTeacher={isTeacher}
              studentXP={studentXP}
              onAwardPoints={awardPoints}
              showRewardPopup={showRewardPopup}
              lessonStarted={false}
            />
          </div>
        </div>
      </MediaProvider>
    </ClassroomAccessGuard>
  );
}