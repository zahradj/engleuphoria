
import React from "react";
import { Card } from "@/components/ui/card";
import { EnhancedVideoPanel } from "@/components/classroom/enhanced/EnhancedVideoPanel";
import { SessionManager } from "@/components/classroom/enhanced/SessionManager";
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
    error,
    session,
    participants,
    isRecording,
    joinClassroom,
    leaveClassroom,
    toggleRecording,
    toggleMicrophone,
    toggleCamera,
    raiseHand,
    startScreenShare
  } = useEnhancedClassroom({
    roomId,
    userId: currentUserId,
    displayName: currentUserName,
    userRole: isTeacher ? 'teacher' : 'student'
  });

  console.log("Enhanced OneOnOneVideoSection:", { 
    isConnected, 
    participants: participants.length,
    isRecording,
    connectionQuality
  });

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Enhanced Video Panel */}
      <div className="flex-1">
        <EnhancedVideoPanel
          participants={participants}
          isConnected={isConnected}
          isRecording={isRecording}
          connectionQuality={connectionQuality}
          userRole={isTeacher ? 'teacher' : 'student'}
          onToggleMicrophone={toggleMicrophone}
          onToggleCamera={toggleCamera}
          onRaiseHand={raiseHand}
          onToggleRecording={isTeacher ? toggleRecording : undefined}
          onStartScreenShare={startScreenShare}
        />
      </div>

      {/* Session Manager */}
      <div className="flex-shrink-0">
        <SessionManager
          session={session}
          isConnected={isConnected}
          onJoinClassroom={joinClassroom}
          onLeaveClassroom={leaveClassroom}
          classTime={0} // This will be replaced by session timer
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

      {/* Error Display */}
      {error && (
        <Card className="p-3 border-red-200 bg-red-50">
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      )}
    </div>
  );
}
