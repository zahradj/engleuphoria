import React, { useRef, useEffect, useState } from "react";
import { Camera, CameraOff, Mic, MicOff, User, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedVideoPlayerProps {
  stream: MediaStream | null;
  hasVideo: boolean;
  isTeacher: boolean;
  userLabel: string;
  isMuted: boolean;
  isCameraOff: boolean;
  isConnected: boolean;
  connectionQuality?: 'excellent' | 'good' | 'fair' | 'poor';
  className?: string;
}

export function EnhancedVideoPlayer({ 
  stream, 
  hasVideo, 
  isTeacher, 
  userLabel, 
  isMuted,
  isCameraOff,
  isConnected,
  connectionQuality = 'good',
  className 
}: EnhancedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  
  const roleColors = {
    teacher: {
      gradient: "from-blue-500/20 via-purple-500/20 to-indigo-500/20",
      border: "border-blue-400/30",
      glow: "shadow-blue-500/20",
      avatar: "bg-gradient-to-br from-blue-500 to-purple-600",
      accent: "text-blue-300"
    },
    student: {
      gradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
      border: "border-emerald-400/30", 
      glow: "shadow-emerald-500/20",
      avatar: "bg-gradient-to-br from-emerald-500 to-teal-600",
      accent: "text-emerald-300"
    }
  };

  const colors = roleColors[isTeacher ? 'teacher' : 'student'];
  
  const connectionIndicatorColor = {
    excellent: "bg-green-500",
    good: "bg-blue-500", 
    fair: "bg-yellow-500",
    poor: "bg-red-500"
  }[connectionQuality];

  useEffect(() => {
    if (videoRef.current && stream && hasVideo) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        setIsVideoLoaded(true);
        console.log(`🎥 ${userLabel} video loaded successfully`);
      };
    }
  }, [stream, hasVideo, userLabel]);

  const VideoContent = () => {
    if (hasVideo && stream && !isCameraOff) {
      return (
        <div className="relative w-full h-full overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              isVideoLoaded ? "animate-video-appear" : "opacity-0"
            )}
            onError={(e) => console.error(`🎥 ${userLabel} video error:`, e)}
          />
          
          {/* Video overlay gradient for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        </div>
      );
    }

    // Fallback avatar display
    return (
      <div className={cn(
        "w-full h-full flex items-center justify-center relative overflow-hidden",
        "bg-gradient-to-br",
        colors.gradient
      )}>
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-white/10 animate-float-slow" />
          <div className="absolute bottom-8 right-8 w-16 h-16 rounded-full bg-white/5 animate-float-delayed" />
          <div className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full bg-white/5 animate-pulse" />
        </div>
        
        {/* Main avatar */}
        <div className="relative z-10 text-center">
          <div className={cn(
            "w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center",
            "shadow-2xl mb-4 mx-auto border-2 border-white/20 relative overflow-hidden",
            colors.avatar
          )}>
            {/* Shimmer effect */}
            <div className="absolute inset-0 animate-shimmer" />
            
            {isCameraOff ? (
              <CameraOff className="w-10 h-10 md:w-12 md:h-12 text-white" />
            ) : (
              <User className="w-10 h-10 md:w-12 md:h-12 text-white" />
            )}
          </div>
          
          <h3 className="text-lg md:text-xl font-semibold text-white mb-1 drop-shadow-lg">
            {userLabel}
          </h3>
          <p className={cn("text-sm font-medium", colors.accent)}>
            {isTeacher ? "Teacher" : "Student"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className={cn(
      "relative aspect-video overflow-hidden group",
      "glass-video border-2 transition-all duration-300",
      colors.border,
      isConnected ? "animate-glow-pulse" : "opacity-75",
      "hover:scale-[1.02] hover:shadow-2xl",
      className
    )}>
      <VideoContent />
      
      {/* Status overlays */}
      <div className="absolute top-3 left-3 flex gap-2">
        {/* Connection quality indicator */}
        <div className={cn(
          "w-3 h-3 rounded-full border border-white/20",
          connectionIndicatorColor,
          isConnected ? "animate-pulse" : "bg-gray-500"
        )} />
        
        {/* Recording indicator */}
        {isConnected && (
          <div className="flex items-center gap-1 bg-red-500/90 text-white text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            LIVE
          </div>
        )}
      </div>
      
      {/* Audio/Video status indicators */}
      <div className="absolute bottom-3 right-3 flex gap-2">
        {isMuted && (
          <div className="bg-red-500/90 p-2 rounded-full backdrop-blur-sm">
            <MicOff className="w-4 h-4 text-white" />
          </div>
        )}
        
        {isCameraOff && hasVideo && (
          <div className="bg-gray-600/90 p-2 rounded-full backdrop-blur-sm">
            <CameraOff className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      
      {/* Connection status overlay */}
      {!isConnected && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="text-center text-white">
            <WifiOff className="w-8 h-8 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-medium">Connecting...</p>
          </div>
        </div>
      )}
      
      {/* Hover overlay with user info */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end justify-start p-4 opacity-0 group-hover:opacity-100">
        <div className="glass-controls rounded-lg p-2 text-white">
          <p className="text-sm font-medium">{userLabel}</p>
          <p className="text-xs opacity-75 capitalize">{connectionQuality} connection</p>
        </div>
      </div>
    </div>
  );
}