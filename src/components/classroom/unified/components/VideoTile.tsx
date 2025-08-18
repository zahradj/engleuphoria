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
      {/* Ambient glow behind video tile */}
      <div className="absolute -inset-2 bg-gradient-to-br from-primary-200/40 via-accent-100/30 to-neutral-200/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative w-full h-full bg-gradient-to-br from-neutral-100 via-primary-50 to-accent-50 rounded-xl overflow-hidden border border-neutral-200/80 shadow-lg group-hover:shadow-xl transition-all duration-300">
        {/* Multiple gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/40 via-transparent to-accent-50/30 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-primary-100/10 to-transparent pointer-events-none"></div>
        
        {hasVideo && stream ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-100/95 to-primary-50/70 relative">
            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-300/30 rounded-full animate-float"></div>
              <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-accent-300/40 rounded-full animate-float animation-delay-700"></div>
              <div className="absolute bottom-1/4 left-2/3 w-1.5 h-1.5 bg-primary-200/25 rounded-full animate-float animation-delay-1100"></div>
            </div>
            
            <div className="text-center relative z-10">
              <div className={`w-12 h-12 rounded-full ${
                isTeacher ? 'bg-gradient-to-br from-primary-500 to-primary-600' : 'bg-gradient-to-br from-accent-500 to-accent-600'
              } flex items-center justify-center mx-auto mb-2 shadow-lg ring-2 ring-primary-200/50 group-hover:scale-110 group-hover:ring-primary-300/60 transition-all duration-300`}>
                <span className="text-lg font-bold text-white animate-pulse-subtle">
                  {isTeacher ? 'T' : 'S'}
                </span>
              </div>
              <p className="text-sm text-primary-800 font-semibold group-hover:text-primary-900 transition-colors duration-200">{userLabel}</p>
            </div>
          </div>
        )}
        
        {isCameraOff && (
          <div className="absolute bottom-2 right-2 bg-gradient-to-r from-error/90 to-error/80 text-error-foreground text-xs px-2 py-1 rounded-lg shadow-lg backdrop-blur-sm border border-error/20 animate-pulse">
            Camera Off
          </div>
        )}
        
        {/* Decorative corner elements */}
        <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-primary-300/40 rounded-tl-lg"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-accent-300/40 rounded-br-lg"></div>
      </div>
    </div>
  );
}