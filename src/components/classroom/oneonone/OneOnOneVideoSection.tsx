
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Mic, MicOff, Video, VideoOff, Sparkles, Users, Circle } from "lucide-react";
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

  // Find the other participant (for advanced layouts, not shown for now)
  const participantCount = participants.length + 1; // Self + others

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Enhanced Video Panel */}
      <Card className="p-0 bg-white/80 border-0 shadow-2xl glass-enhanced rounded-3xl overflow-hidden ring-1 ring-white/30 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white/50 to-purple-100 pointer-events-none"></div>

        {/* Video Display Area with overlays */}
        <div className="aspect-video relative flex items-center justify-center">
          {/* Video Element or Placeholder */}
          {localStream && !isCameraOff ? (
            <video
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover rounded-3xl"
              ref={el => { if (el) el.srcObject = localStream; }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-200/50 to-purple-200/30">
              <div className="bg-gradient-to-br from-blue-400 via-purple-400 to-violet-500 rounded-full w-20 h-20 flex items-center justify-center shadow-2xl mb-2">
                <span className="text-3xl font-bold text-white">
                  {isTeacher ? "T" : "S"}
                </span>
              </div>
              <span className="text-lg font-semibold text-gray-800">{currentUserName}</span>
              {isCameraOff && (
                <span className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                  <VideoOff size={14} className="mr-1" /> Camera off
                </span>
              )}
              {isMuted && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <MicOff size={14} className="mr-1" /> Muted
                </span>
              )}
            </div>
          )}

          {/* Live status badge */}
          {isConnected && (
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-green-500 text-white shadow-lg flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold animate-pulse">
                <Sparkles size={14} className="mr-1" />
                LIVE
              </Badge>
            </div>
          )}

          {/* Recording badge */}
          {isRecording && (
            <div className="absolute top-3 right-3 z-10">
              <Badge variant="destructive" className="animate-pulse shadow-lg flex items-center gap-1 px-2 py-1">
                <Circle className="h-3 w-3 mr-1 fill-current animate-pulse" />
                RECORDING
              </Badge>
            </div>
          )}

          {/* Role and Connection status */}
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
            <Badge className={`text-xs px-2 py-1 ${isTeacher ? 'bg-teal-500 text-white' : 'bg-purple-500 text-white'}`}>
              {isTeacher ? "Teacher" : "Student"}
            </Badge>
            <Badge variant="secondary" className={`text-xs px-2 py-1 ${isConnected ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
              <Users size={12} className="inline -mt-0.5 mr-1" />
              {participantCount} in Room
            </Badge>
            <Badge className="text-xs px-2 py-1 bg-gray-50 text-gray-500 border">
              {connectionQuality || "Quality: n/a"}
            </Badge>
          </div>
        </div>

        {/* Show XP and Reward pop animation */}
        <div className="p-4 flex flex-col items-center">
          <div className="w-full flex items-center justify-between">
            <div>
              <span className="font-semibold text-md text-gray-800">
                XP Progress
              </span>
              <span className="ml-2 font-bold text-orange-600 text-lg">{studentXP % 100}/100</span>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white border-0 shadow-xl px-4 py-2 rounded-full flex items-center gap-2">
              <Star size={18} className="mr-1" /> 
              Level {Math.floor(studentXP/100)}
            </Badge>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mt-3 relative overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 h-3 rounded-full transition-all duration-700 ease-out shadow-md"
              style={{width: `${studentXP % 100}%`}} />
            {/* XP reward popup */}
            {showRewardPopup && (
              <div className="absolute right-0 -top-8 text-green-600 font-bold text-sm animate-bounce-in bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-xl shadow-lg border border-green-200">
                <Sparkles className="inline h-3 w-3 mr-1" /> +50 XP ✨
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Teacher Rewards System */}
      {isTeacher && (
        <div className="flex-shrink-0">
          <Card className="p-3 mt-2">
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
