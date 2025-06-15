
import React from "react";
import { OneOnOneVideoSection } from "@/components/classroom/oneonone/OneOnOneVideoSection";

interface UnifiedVideoSectionProps {
  enhancedClassroom: any;
  currentUser: {
    id: string;
    name: string;
    role: 'teacher' | 'student';
  };
  studentXP: number;
  onAwardPoints?: () => void;
  showRewardPopup: boolean;
}

export function UnifiedVideoSection({
  enhancedClassroom,
  currentUser,
  studentXP,
  onAwardPoints,
  showRewardPopup
}: UnifiedVideoSectionProps) {
  return (
    <OneOnOneVideoSection
      enhancedClassroom={enhancedClassroom}
      currentUserId={currentUser.id}
      currentUserName={currentUser.name}
      isTeacher={currentUser.role === 'teacher'}
      studentXP={studentXP}
      onAwardPoints={onAwardPoints}
      showRewardPopup={showRewardPopup}
    />
  );
}
