import React, { useRef, useEffect } from "react";

interface VideoTileProps {
  stream: MediaStream | null;
  hasVideo: boolean;
  isTeacher: boolean;
  userLabel: string;
  isCameraOff: boolean;
}

export function VideoTile({ stream, hasVideo, isTeacher, userLabel, isCameraOff }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="w-full h-full min-h-[300px] group relative">
      {/* Vibrant ambient glow behind video tile */}
      <div className="absolute -inset-2 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary-300/40 via-accent-300/30 to-success-300/25"></div>
      
      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-surface via-primary-50 to-accent-50 border border-primary-200">
        {/* Colorful gradient overlays for depth */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary-100/30 via-transparent to-accent-100/20"></div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-transparent via-primary-50/10 to-transparent"></div>
        
        {hasVideo && stream ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative bg-gradient-to-br from-surface/95 to-primary-50/70">
            {/* Colorful floating particles effect */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full animate-float bg-primary-300/60"></div>
              <div className="absolute top-3/4 right-1/3 w-1 h-1 rounded-full animate-float animation-delay-700 bg-accent-400/70"></div>
              <div className="absolute bottom-1/4 left-2/3 w-1.5 h-1.5 rounded-full animate-float animation-delay-1100 bg-success-300/50"></div>
            </div>
            
            <div className="text-center relative z-10">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg group-hover:scale-110 transition-all duration-300 ${
                isTeacher 
                  ? 'bg-gradient-to-br from-primary-500 to-primary-600 border-2 border-primary-300' 
                  : 'bg-gradient-to-br from-accent-500 to-accent-600 border-2 border-accent-300'
              }`}>
                <span className="text-lg font-bold text-white animate-pulse-subtle">
                  {isTeacher ? 'T' : 'S'}
                </span>
              </div>
              <p className="text-sm font-semibold group-hover:text-primary-700 transition-colors duration-200 text-primary-600">Student</p>
            </div>
          </div>
        )}
        
        {isCameraOff && (
          <div className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded-lg shadow-lg backdrop-blur-sm border animate-pulse bg-gradient-to-r from-error to-error/80 text-white border-error/20">
            Camera Off
          </div>
        )}
        
        {/* Colorful decorative corner elements */}
        <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 rounded-tl-lg border-primary-400"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 rounded-br-lg border-accent-400"></div>
      </div>
    </div>
  );
}