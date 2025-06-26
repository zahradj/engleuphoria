
import React, { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { useMediaContext } from "@/components/classroom/oneonone/video/MediaContext";
import { useMediaAccess } from "@/hooks/enhanced-classroom/useMediaAccess";
import { useClassroomSession } from "@/hooks/useClassroomSession";
import { VideoStateDisplay } from "./components/VideoStateDisplay";
import { VideoPlayer } from "./components/VideoPlayer";
import { VideoControls } from "./components/VideoControls";
import { VideoStatusIndicators } from "./components/VideoStatusIndicators";
import { VideoErrorDisplay } from "./components/VideoErrorDisplay";

interface UnifiedVideoSectionProps {
  currentUser: {
    id: string;
    name: string;
    role: 'teacher' | 'student';
  };
}

export function UnifiedVideoSection({ currentUser }: UnifiedVideoSectionProps) {
  const media = useMediaContext();
  const enhancedMedia = useMediaAccess();
  const isTeacher = currentUser.role === 'teacher';
  
  // Get session state
  const {
    session,
    isLoading: sessionLoading,
    startSession,
    endSession,
    canStartSession,
    canJoinVideo,
    isWaitingForTeacher
  } = useClassroomSession({
    roomId: media.roomId,
    userId: currentUser.id,
    userRole: currentUser.role
  });
  
  // Get the appropriate media properties based on user role
  const getMediaState = () => {
    if (isTeacher) {
      return {
        stream: media.stream,
        isConnected: media.isConnected,
        isMuted: media.isMuted,
        isCameraOff: media.isCameraOff,
        mediaError: media.error,
        toggleMicrophone: media.toggleMicrophone,
        toggleCamera: media.toggleCamera,
        joinOrInitialize: media.join,
        leaveOrStop: media.leave
      };
    } else {
      return {
        stream: enhancedMedia.localStream,
        isConnected: enhancedMedia.isInitialized,
        isMuted: enhancedMedia.isMuted,
        isCameraOff: enhancedMedia.isCameraOff,
        mediaError: enhancedMedia.mediaError,
        toggleMicrophone: enhancedMedia.toggleMicrophone,
        toggleCamera: enhancedMedia.toggleCamera,
        joinOrInitialize: enhancedMedia.initializeMedia,
        leaveOrStop: enhancedMedia.stopMedia
      };
    }
  };

  const mediaState = getMediaState();

  const handleStartSession = async () => {
    console.log('🎬 Teacher starting session...');
    await startSession();
    // After starting session, initialize teacher's media
    if (!mediaState.isConnected) {
      mediaState.joinOrInitialize();
    }
  };

  const handleJoinVideo = () => {
    console.log(`🎥 ${isTeacher ? 'Teacher' : 'Student'} joining video...`);
    mediaState.joinOrInitialize();
  };

  const handleLeaveVideo = () => {
    mediaState.leaveOrStop();
    if (isTeacher) {
      endSession();
    }
  };

  const hasVideo = mediaState.stream && mediaState.isConnected && !mediaState.isCameraOff;
  const userLabel = isTeacher ? "Teacher" : currentUser.name;

  if (sessionLoading) {
    return (
      <div className="h-full flex flex-col">
        <Card className="h-[300px] p-0 bg-white/90 border-2 border-opacity-50 shadow-lg rounded-2xl overflow-hidden relative">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading session...</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Card className="h-[300px] p-0 bg-white/90 border-2 border-opacity-50 shadow-lg rounded-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white/70 to-blue-50 pointer-events-none"></div>
        
        <div className="w-full h-full relative flex flex-col">
          {!mediaState.isConnected ? (
            <VideoStateDisplay
              isTeacher={isTeacher}
              isWaitingForTeacher={isWaitingForTeacher}
              canStartSession={canStartSession}
              canJoinVideo={canJoinVideo}
              sessionStatus={session?.session_status}
              onStartSession={handleStartSession}
              onJoinVideo={handleJoinVideo}
            />
          ) : (
            <div className="w-full h-full relative">
              <VideoPlayer
                stream={mediaState.stream}
                hasVideo={hasVideo}
                isTeacher={isTeacher}
                userLabel={userLabel}
                isCameraOff={mediaState.isCameraOff}
              />

              <VideoStatusIndicators
                isConnected={mediaState.isConnected}
                sessionStatus={session?.session_status}
                isTeacher={isTeacher}
              />

              <VideoControls
                isMuted={mediaState.isMuted}
                isCameraOff={mediaState.isCameraOff}
                isTeacher={isTeacher}
                onToggleMicrophone={mediaState.toggleMicrophone}
                onToggleCamera={mediaState.toggleCamera}
                onLeaveVideo={handleLeaveVideo}
              />

              {/* Name Label */}
              <div className="absolute bottom-3 left-3">
                <div className="bg-black/60 text-white px-3 py-1 rounded-lg text-sm font-medium">
                  {userLabel}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      <VideoErrorDisplay error={mediaState.mediaError} />
    </div>
  );
}
