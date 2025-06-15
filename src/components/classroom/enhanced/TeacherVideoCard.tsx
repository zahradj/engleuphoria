
import React from "react";
import { Card } from "@/components/ui/card";
import { EnhancedVideoPanel } from "./EnhancedVideoPanel";

interface User {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  avatar: string;
  level: number;
  isOnline: boolean;
}

interface TeacherVideoCardProps {
  user: User;
  enhancedClassroom: any;
}

export function TeacherVideoCard({ user, enhancedClassroom }: TeacherVideoCardProps) {
  return (
    <Card className="overflow-hidden bg-white shadow-sm border border-gray-200">
      <div className="h-64">
        <EnhancedVideoPanel
          participants={enhancedClassroom.participants}
          isConnected={enhancedClassroom.isConnected}
          isRecording={enhancedClassroom.isRecording}
          connectionQuality={enhancedClassroom.connectionQuality}
          userRole={user.role}
          localStream={enhancedClassroom.localStream}
          isMuted={enhancedClassroom.isMuted}
          isCameraOff={enhancedClassroom.isCameraOff}
          onToggleMicrophone={enhancedClassroom.toggleMicrophone}
          onToggleCamera={enhancedClassroom.toggleCamera}
          onRaiseHand={() => {}}
        />
      </div>
    </Card>
  );
}
