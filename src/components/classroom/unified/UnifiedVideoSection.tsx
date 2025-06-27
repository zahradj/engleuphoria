
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
  
  // Generate a proper UUID format for the user ID if it's not already
  const generateProperUserId = (id: string) => {
    // If it's already a UUID format, return as is
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      return id;
    }
    // Generate a UUID v4 based on the provided ID
    const crypto = window.crypto || (window as any).msCrypto;
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    // Set version (4) and variant bits
    array[6] = (array[6] & 0x0f) | 0x40;
    array[8] = (array[8] & 0x3f) | 0x80;
    // Convert to hex string
    const hex = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    return `${hex.substr(0,8)}-${hex.substr(8,4)}-${hex.substr(12,4)}-${hex.substr(16,4)}-${hex.substr(20,12)}`;
  };

  const properUserId = generateProperUserId(currentUser.id);
  
  // Get session state with error handling
  const {
    session,
    isLoading: sessionLoading,
    error: sessionError,
    startSession,
    endSession,
    canStartSession,
    canJoinVideo,
    isWaitingForTeacher
  } = useClassroomSession({
    roomId: media.roomId,
    userId: properUserId,
    userRole: currentUser.role
  });
  
  // Get the appropriate media properties based on user role
  const getMediaState = () => {
    try {
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
    } catch (error) {
      console.error('Error getting media state:', error);
      return {
        stream: null,
        isConnected: false,
        isMuted: true,
        isCameraOff: true,
        mediaError: 'Failed to initialize media connection',
        toggleMicrophone: () => {},
        toggleCamera: () => {},
        joinOrInitialize: () => {},
        leaveOrStop: () => {}
      };
    }
  };

  const mediaState = getMediaState();

  const handleStartSession = async () => {
    try {
      console.log('🎬 Teacher starting session...');
      await startSession();
      // After starting session, initialize teacher's media
      if (!mediaState.isConnected) {
        mediaState.joinOrInitialize();
      }
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const handleJoinVideo = () => {
    try {
      console.log(`🎥 ${isTeacher ? 'Teacher' : 'Student'} joining video...`);
      mediaState.joinOrInitialize();
    } catch (error) {
      console.error('Error joining video:', error);
    }
  };

  const handleLeaveVideo = () => {
    try {
      mediaState.leaveOrStop();
      if (isTeacher) {
        endSession();
      }
    } catch (error) {
      console.error('Error leaving video:', error);
    }
  };

  const hasVideo = mediaState.stream && mediaState.isConnected && !mediaState.isCameraOff;
  const userLabel = isTeacher ? "Teacher" : currentUser.name;

  // Determine the primary error to display
  const primaryError = sessionError || mediaState.mediaError;

  // Show error state if there are critical errors
  if (sessionError) {
    return (
      <div className="h-full flex flex-col">
        <Card className="h-[300px] p-0 bg-white/90 border-2 border-opacity-50 shadow-lg rounded-2xl overflow-hidden relative">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center shadow-lg mb-3 mx-auto">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-red-600 font-semibold mb-2">Session Unavailable</p>
              <p className="text-xs text-gray-500">Unable to connect to the classroom session</p>
            </div>
          </div>
        </Card>
        <VideoErrorDisplay error={sessionError} />
      </div>
    );
  }

  if (sessionLoading) {
    return (
      <div className="h-full flex flex-col">
        <Card className="h-[300px] p-0 bg-white/90 border-2 border-opacity-50 shadow-lg rounded-2xl overflow-hidden relative">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Connecting to session...</p>
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

      <VideoErrorDisplay error={primaryError} />
    </div>
  );
}
