
import React, { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, Phone } from "lucide-react";
import { useMediaContext } from "@/components/classroom/oneonone/video/MediaContext";
import { useMediaAccess } from "@/hooks/enhanced-classroom/useMediaAccess";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  
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

  // Set up video element when stream is available
  useEffect(() => {
    if (videoRef.current && mediaState.stream) {
      videoRef.current.srcObject = mediaState.stream;
      console.log(`🎥 ${isTeacher ? 'Teacher' : 'Student'} video stream connected`);
    }
  }, [mediaState.stream, isTeacher]);

  const handleJoinVideo = () => {
    console.log(`🎥 ${isTeacher ? 'Teacher' : 'Student'} joining video...`);
    mediaState.joinOrInitialize();
  };

  const handleToggleMicrophone = () => {
    mediaState.toggleMicrophone();
  };

  const handleToggleCamera = () => {
    mediaState.toggleCamera();
  };

  const handleLeaveVideo = () => {
    mediaState.leaveOrStop();
  };

  const hasVideo = mediaState.stream && mediaState.isConnected && !mediaState.isCameraOff;
  const userLabel = isTeacher ? "Teacher Sarah" : currentUser.name;
  const gradientColors = isTeacher ? "from-blue-500 to-blue-600" : "from-purple-500 to-purple-600";
  const badgeColor = isTeacher ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800";

  return (
    <div className="h-full flex flex-col">
      <Card className="h-[300px] p-0 bg-white/90 border-2 border-opacity-50 shadow-lg rounded-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white/70 to-blue-50 pointer-events-none"></div>
        
        <div className="w-full h-full relative flex flex-col">
          {!mediaState.isConnected ? (
            <div className="w-full h-full flex items-center justify-center p-6">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full ${isTeacher ? 'bg-blue-100' : 'bg-purple-100'} flex items-center justify-center shadow-lg mb-3 mx-auto`}>
                  <span className={`text-2xl font-bold ${isTeacher ? 'text-blue-600' : 'text-purple-600'}`}>
                    {isTeacher ? 'T' : 'S'}
                  </span>
                </div>
                <p className={`${isTeacher ? 'text-blue-600' : 'text-purple-600'} font-semibold mb-2`}>
                  {isTeacher ? 'Teacher' : 'Student'} Video
                </p>
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">Ready to join video?</p>
                  <Button 
                    onClick={handleJoinVideo}
                    className={`${isTeacher ? 'bg-blue-500 hover:bg-blue-600' : 'bg-purple-500 hover:bg-purple-600'} text-white px-6 py-2 rounded-lg shadow-lg`}
                  >
                    Join Video
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full relative">
              {/* Video Area */}
              {hasVideo ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  onLoadedMetadata={() => console.log(`🎥 ${userLabel} video metadata loaded`)}
                  onError={e => console.error(`🎥 ${userLabel} video error`, e)}
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${gradientColors} flex items-center justify-center relative`}>
                  <div className="text-center">
                    <div className={`w-24 h-24 rounded-full ${isTeacher ? 'bg-blue-400' : 'bg-purple-400'} flex items-center justify-center shadow-xl mb-3 mx-auto`}>
                      <span className="text-4xl font-bold text-white">
                        {isTeacher ? 'T' : 'S'}
                      </span>
                    </div>
                    <p className="text-white font-semibold">{userLabel}</p>
                  </div>
                  {mediaState.isCameraOff && (
                    <div className="absolute bottom-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Camera Off
                    </div>
                  )}
                </div>
              )}

              {/* Status Indicators */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {mediaState.isConnected && (
                  <Badge className="bg-green-500 text-white animate-pulse">
                    ● Live
                  </Badge>
                )}
                <Badge variant="secondary" className={badgeColor}>
                  {isTeacher ? 'Teacher' : 'Student'}
                </Badge>
              </div>

              {/* Video Controls */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <Button
                  variant={mediaState.isMuted ? "destructive" : "outline"}
                  size="icon"
                  onClick={handleToggleMicrophone}
                  className="w-8 h-8 bg-black/20 hover:bg-black/40 border-white/30"
                >
                  {mediaState.isMuted ? <MicOff size={16} className="text-white" /> : <Mic size={16} className="text-white" />}
                </Button>
                <Button
                  variant={mediaState.isCameraOff ? "destructive" : "outline"}
                  size="icon"
                  onClick={handleToggleCamera}
                  className="w-8 h-8 bg-black/20 hover:bg-black/40 border-white/30"
                >
                  {mediaState.isCameraOff ? <VideoOff size={16} className="text-white" /> : <Video size={16} className="text-white" />}
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={handleLeaveVideo}
                  className="w-8 h-8"
                  title="Leave Video"
                >
                  <Phone size={16} />
                </Button>
              </div>

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

      {/* Error Display */}
      {mediaState.mediaError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {mediaState.mediaError}
        </div>
      )}
    </div>
  );
}
