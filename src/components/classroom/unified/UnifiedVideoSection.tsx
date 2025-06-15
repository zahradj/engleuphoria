
import React from "react";
import { Card } from "@/components/ui/card";
import { OneOnOneVideoSection } from "../oneonone/OneOnOneVideoSection";

interface UnifiedVideoSectionProps {
  enhancedClassroom: any;
  currentUser: {
    id: string;
    name: string;
    role: 'teacher' | 'student';
  };
  studentXP?: number;
  onAwardPoints?: () => void;
  showRewardPopup?: boolean;
}

export function UnifiedVideoSection({
  enhancedClassroom,
  currentUser,
  studentXP = 1250,
  onAwardPoints,
  showRewardPopup = false
}: UnifiedVideoSectionProps) {
  const isTeacher = currentUser.role === 'teacher';

  return (
    <Card className="h-full shadow-lg glass-enhanced backdrop-blur-xl border-0">
      <OneOnOneVideoSection
        enhancedClassroom={enhancedClassroom}
        currentUserId={currentUser.id}
        currentUserName={currentUser.name}
        isTeacher={isTeacher}
        studentXP={studentXP}
        onAwardPoints={onAwardPoints}
        showRewardPopup={showRewardPopup}
      />
    </Card>
  );
}
