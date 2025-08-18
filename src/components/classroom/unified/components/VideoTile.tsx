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
    <div className="w-full h-full min-h-[200px] bg-surface-2 rounded-xl overflow-hidden relative border border-muted shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/20 via-transparent to-accent-50/10 pointer-events-none"></div>
      {hasVideo && stream ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-surface">
          <div className="text-center">
            <div className={`w-10 h-10 rounded-full ${
              isTeacher ? 'bg-primary-500' : 'bg-accent-500'
            } flex items-center justify-center mx-auto mb-2 shadow-sm`}>
              <span className="text-sm font-medium text-white">
                {isTeacher ? 'T' : 'S'}
              </span>
            </div>
            <p className="text-xs text-foreground font-medium">{userLabel}</p>
          </div>
        </div>
      )}
      {isCameraOff && (
        <div className="absolute bottom-2 right-2 bg-error text-white text-xs px-2 py-1 rounded shadow-sm">
          Camera Off
        </div>
      )}
    </div>
  );
}