
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Award } from "lucide-react";
import { TeacherVideoFeed } from "../video/TeacherVideoFeed";
import { useWebRTC } from "@/hooks/useWebRTC";

interface OneOnOneVideoSectionProps {
  roomId: string;
  currentUserId: string;
  currentUserName: string;
  isTeacher: boolean;
}

export function OneOnOneVideoSection({
  roomId,
  currentUserId,
  currentUserName,
  isTeacher
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
      {/* Header */}
      <div className="p-3 border-b bg-gradient-to-r from-blue-50 to-green-50 flex-shrink-0">
        <h3 className="font-semibold text-gray-700 text-sm">Teacher</h3>
        <p className="text-xs text-gray-500 mt-1">Ms. Johnson - Math Teacher</p>
      </div>
      
      {/* Teacher Video */}
      <div className="p-3 flex-shrink-0">
        <TeacherVideoFeed
          stream={localStream}
          isConnected={isConnected}
          isMuted={isMuted}
          isCameraOff={isCameraOff}
          onToggleMute={toggleAudio}
          onToggleCamera={toggleVideo}
          onJoinCall={connectToRoom}
          onLeaveCall={disconnect}
        />
      </div>

      {/* Teacher Info & Achievements */}
      <div className="flex-1 p-3 overflow-y-auto">
        {/* Teacher Stats */}
        <div className="mb-4">
          <h4 className="font-semibold text-sm mb-2">Teacher Stats</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 p-2 rounded-lg text-center">
              <div className="text-lg font-bold text-blue-600">156</div>
              <div className="text-xs text-blue-600">Classes</div>
            </div>
            <div className="bg-green-50 p-2 rounded-lg text-center">
              <div className="text-lg font-bold text-green-600">4.9</div>
              <div className="text-xs text-green-600">Rating</div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-4">
          <h4 className="font-semibold text-sm mb-2">Achievements</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <div>
                <div className="text-xs font-medium">Expert Teacher</div>
                <div className="text-xs text-gray-500">100+ successful classes</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
              <Star className="w-4 h-4 text-purple-600" />
              <div>
                <div className="text-xs font-medium">Student Favorite</div>
                <div className="text-xs text-gray-500">Top rated by students</div>
              </div>
            </div>
          </div>
        </div>

        {/* Teaching Tools */}
        <div>
          <h4 className="font-semibold text-sm mb-2">Quick Tools</h4>
          <div className="grid grid-cols-2 gap-2">
            <button className="p-2 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
              <Award className="w-4 h-4 mx-auto mb-1 text-gray-600" />
              <div className="text-xs">Award Points</div>
            </button>
            <button className="p-2 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
              <Star className="w-4 h-4 mx-auto mb-1 text-gray-600" />
              <div className="text-xs">Give Star</div>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border-t">
          <p className="text-red-600 text-xs">{error}</p>
        </div>
      )}
    </Card>
  );
}
