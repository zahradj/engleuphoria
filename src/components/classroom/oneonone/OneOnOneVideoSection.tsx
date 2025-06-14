
import React from "react";
import { Card } from "@/components/ui/card";
import { EnhancedVideoPanel } from "@/components/classroom/enhanced/EnhancedVideoPanel";
import { OneOnOneRewards } from "./OneOnOneRewards";

interface OneOnOneVideoSectionProps {
  enhancedClassroom: any; // Enhanced classroom hook return value
  currentUserId: string;
  currentUserName: string;
  isTeacher: boolean;
  studentXP?: number;
  onAwardPoints?: () => void;
  showRewardPopup?: boolean;
}

export function OneOnOneVideoSection({
  enhancedClassroom,
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
    isRecording,
    localStream,
    isMuted,
    isCameraOff
  } = enhancedClassroom;

  console.log("OneOnOneVideoSection with enhanced classroom:", { 
    isConnected, 
    participants: participants.length,
    isRecording,
    connectionQuality,
    hasLocalStream: !!localStream,
    isMuted,
    isCameraOff
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
