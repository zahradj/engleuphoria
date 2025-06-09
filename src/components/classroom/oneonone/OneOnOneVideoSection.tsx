
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Award } from "lucide-react";
import { CompactVideoFeed } from "../video/CompactVideoFeed";
import { OneOnOneRewards } from "./OneOnOneRewards";
import { useWebRTC } from "@/hooks/useWebRTC";

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
    streams,
    localStream,
    isConnected,
    error,
    isMuted,
    isCameraOff,
    connectToRoom,
    disconnect,
    toggleVideo,
    toggleAudio
  } = useWebRTC(roomId, currentUserId);

  console.log("OneOnOneVideoSection rendering:", { isConnected, streams: streams.length });

  return (
    <Card className="h-full shadow-lg flex flex-col overflow-hidden">
      {/* Video Feed */}
      <div className="p-3 flex-shrink-0">
        <CompactVideoFeed
          stream={localStream}
          isConnected={isConnected}
          isMuted={isMuted}
          isCameraOff={isCameraOff}
          userName={currentUserName}
          userRole={isTeacher ? 'teacher' : 'student'}
          isOwnVideo={true}
          onToggleMute={toggleAudio}
          onToggleCamera={toggleVideo}
          onJoinCall={connectToRoom}
          onLeaveCall={disconnect}
        />
      </div>

      {/* Content based on user role */}
      <div className="flex-1 p-3 overflow-y-auto">
        {isTeacher ? (
          /* Teacher Rewards System */
          <OneOnOneRewards
            studentXP={studentXP}
            onAwardPoints={onAwardPoints || (() => {})}
            showRewardPopup={showRewardPopup}
          />
        ) : (
          /* Student Stats and Achievements */
          <>
            {/* Student Stats */}
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2">Your Progress</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 p-2 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-600">{Math.floor(studentXP / 100)}</div>
                  <div className="text-xs text-blue-600">Level</div>
                </div>
                <div className="bg-green-50 p-2 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-600">{studentXP}</div>
                  <div className="text-xs text-green-600">Total XP</div>
                </div>
              </div>
            </div>

            {/* Student Achievements */}
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2">Achievements</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <div>
                    <div className="text-xs font-medium">Great Student</div>
                    <div className="text-xs text-gray-500">Attend 10 classes</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                  <Star className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="text-xs font-medium">Quick Learner</div>
                    <div className="text-xs text-gray-500">Complete tasks fast</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border-t">
          <p className="text-red-600 text-xs">{error}</p>
        </div>
      )}
    </Card>
  );
}
