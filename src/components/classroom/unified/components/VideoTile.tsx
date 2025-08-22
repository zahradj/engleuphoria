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
      <div className="absolute -inset-2 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, rgba(196, 217, 255, 0.4) 0%, rgba(232, 249, 255, 0.3) 50%, rgba(197, 186, 255, 0.2) 100%)' }}></div>
      
      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300" style={{ 
        background: 'linear-gradient(135deg, #FBFBFB 0%, #E8F9FF 50%, #C4D9FF 100%)',
        border: '1px solid rgba(196, 217, 255, 0.5)'
      }}>
        {/* Multiple gradient overlays for depth */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(232, 249, 255, 0.3) 0%, transparent 50%, rgba(197, 186, 255, 0.2) 100%)' }}></div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(196, 217, 255, 0.1) 50%, transparent 100%)' }}></div>
        
        {hasVideo && stream ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg, rgba(251, 251, 251, 0.95) 0%, rgba(232, 249, 255, 0.7) 100%)' }}>
            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full animate-float" style={{ backgroundColor: 'rgba(196, 217, 255, 0.4)' }}></div>
              <div className="absolute top-3/4 right-1/3 w-1 h-1 rounded-full animate-float animation-delay-700" style={{ backgroundColor: 'rgba(197, 186, 255, 0.5)' }}></div>
              <div className="absolute bottom-1/4 left-2/3 w-1.5 h-1.5 rounded-full animate-float animation-delay-1100" style={{ backgroundColor: 'rgba(196, 217, 255, 0.3)' }}></div>
            </div>
            
            <div className="text-center relative z-10">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg group-hover:scale-110 transition-all duration-300`} style={{
                background: isTeacher 
                  ? 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)' 
                  : 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
                border: '2px solid rgba(196, 217, 255, 0.4)'
              }}>
                <span className="text-lg font-bold text-white animate-pulse-subtle">
                  {isTeacher ? 'T' : 'S'}
                </span>
              </div>
              <p className="text-sm font-semibold group-hover:transition-colors duration-200" style={{ color: '#1E40AF' }}>{userLabel}</p>
            </div>
          </div>
        )}
        
        {isCameraOff && (
          <div className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded-lg shadow-lg backdrop-blur-sm border animate-pulse" style={{
            background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.9) 0%, rgba(239, 68, 68, 0.8) 100%)',
            color: 'white',
            borderColor: 'rgba(239, 68, 68, 0.2)'
          }}>
            Camera Off
          </div>
        )}
        
        {/* Decorative corner elements */}
        <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 rounded-tl-lg" style={{ borderColor: 'rgba(196, 217, 255, 0.6)' }}></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 rounded-br-lg" style={{ borderColor: 'rgba(197, 186, 255, 0.6)' }}></div>
      </div>
    </div>
  );
}