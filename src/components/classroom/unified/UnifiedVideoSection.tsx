
import React from "react";
import { Card } from "@/components/ui/card";
import { EnhancedVideoPanel } from "@/components/classroom/enhanced/EnhancedVideoPanel";
import { OneOnOneRewards } from "@/components/classroom/oneonone/OneOnOneRewards";

interface UserProfile {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  avatar?: string;
}

interface UnifiedVideoSectionProps {
  enhancedClassroom: any;
  currentUser: UserProfile;
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
  const {
    isConnected,
    connectionQuality,
    participants,
    isRecording,
    localStream,
    isMuted,
    isCameraOff
  } = enhancedClassroom;

  const isTeacher = currentUser.role === 'teacher';

  console.log("UnifiedVideoSection with enhanced classroom:", { 
    isConnected, 
    participants: participants.length,
    isRecording,
    connectionQuality,
    hasLocalStream: !!localStream,
    isMuted,
    isCameraOff,
    userRole: currentUser.role
  });

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Enhanced Video Panel - Main Content */}
      <div className="flex-1">
        <EnhancedVideoPanel
          participants={participants}
          isConnected={isConnected}
          isRecording={isRecording}
          connectionQuality={connectionQuality}
          userRole={currentUser.role}
          localStream={localStream}
          isMuted={isMuted}
          isCameraOff={isCameraOff}
          onToggleMicrophone={() => {}} // Disabled - controlled from top bar
          onToggleCamera={() => {}} // Disabled - controlled from top bar
          onRaiseHand={() => {}} // Disabled - controlled from top bar
          onToggleRecording={undefined} // Disabled - controlled from top bar
          onStartScreenShare={() => {}} // Disabled - controlled from top bar
        />
      </div>

      {/* Teacher Rewards System */}
      {isTeacher && onAwardPoints && (
        <div className="flex-shrink-0">
          <Card className="p-3">
            <OneOnOneRewards
              studentXP={studentXP}
              onAwardPoints={onAwardPoints}
              showRewardPopup={showRewardPopup}
            />
          </Card>
        </div>
      )}
    </div>
  );
}
