
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Video, VideoOff, Mic, MicOff } from "lucide-react";
import { OneOnOneRewards } from "./OneOnOneRewards";
import { useVideoRoom } from "@/hooks/useVideoRoom";
import { Button } from "@/components/ui/button";

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
    participants,
    error,
    isMuted,
    isCameraOff,
    toggleMicrophone,
    toggleCamera
  } = useVideoRoom({
    roomId,
    userId: currentUserId,
    displayName: currentUserName
  });

  console.log("OneOnOneVideoSection:", { isConnected, participants: participants.size });

  return (
    <Card className="h-full shadow-lg flex flex-col overflow-hidden">
      {/* Video Area - No header, direct video */}
      <div className="p-3 flex-shrink-0">
        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
          {isConnected ? (
            <div className="text-center text-white">
              <Video size={24} className="mx-auto mb-2 text-gray-400" />
              <p className="text-xs mb-1">Video Active</p>
              <p className="text-xs text-gray-400">
                {participants.size > 0 ? `With ${participants.size} other(s)` : 'Waiting for others...'}
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <Video size={24} className="mx-auto mb-2" />
              <p className="text-xs">Teacher Video</p>
            </div>
          )}

          {/* Video Controls Overlay */}
          {isConnected && (
            <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-1">
              <Button
                variant={isMuted ? "destructive" : "outline"}
                size="sm"
                onClick={toggleMicrophone}
                className="rounded-full w-8 h-8 p-0 bg-black/50 border-white/20"
              >
                {isMuted ? <MicOff size={12} /> : <Mic size={12} />}
              </Button>
              
              <Button
                variant={isCameraOff ? "destructive" : "outline"}
                size="sm"
                onClick={toggleCamera}
                className="rounded-full w-8 h-8 p-0 bg-black/50 border-white/20"
              >
                {isCameraOff ? <VideoOff size={12} /> : <Video size={12} />}
              </Button>
            </div>
          )}
        </div>
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
