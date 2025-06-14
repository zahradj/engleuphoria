
import React from "react";
import { Card } from "@/components/ui/card";
import { EnhancedVideoPanel } from "@/components/classroom/enhanced/EnhancedVideoPanel";
import { OneOnOneRewards } from "./OneOnOneRewards";
import { useEnhancedClassroom } from "@/hooks/useEnhancedClassroom";

interface OneOnOneVideoSectionProps {
  roomId: string;
  currentUserId: string;
  currentUserName: string;
  isTeacher: boolean;
  studentXP?: number;
  onAwardPoints?: () => void;
  showRewardPopup?: boolean;
}

export function OneOnOneVideoSection({
  roomId,
  currentUserId,
  currentUserName,
  isTeacher,
  studentXP = 1250,
  onAwardPoints,
  showRewardPopup = false
}: OneOnOneVideoSectionProps) {
  const {
    isConnected,
    connectionQuality,
    participants,
    isRecording
  } = useEnhancedClassroom({
    roomId,
    userId: currentUserId,
    displayName: currentUserName,
    userRole: isTeacher ? 'teacher' : 'student'
  });

  console.log("Simplified OneOnOneVideoSection:", { 
    isConnected, 
    participants: participants.length,
    isRecording,
    connectionQuality
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
          userRole={isTeacher ? 'teacher' : 'student'}
          onToggleMicrophone={() => {}} // Controlled from top bar now
          onToggleCamera={() => {}} // Controlled from top bar now
          onRaiseHand={() => {}} // Controlled from top bar now
          onToggleRecording={undefined} // Controlled from top bar now
          onStartScreenShare={() => {}} // Controlled from top bar now
        />
      </div>

      {/* Teacher Rewards System */}
      {isTeacher && (
        <div className="flex-shrink-0">
          <Card className="p-3">
            <OneOnOneRewards
              studentXP={studentXP}
              onAwardPoints={onAwardPoints || (() => {})}
              showRewardPopup={showRewardPopup}
            />
          </Card>
        </div>
      )}
    </div>
  );
}
