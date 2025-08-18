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
    <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-neutral-100 via-primary-50 to-accent-50 rounded-xl overflow-hidden relative border border-neutral-200 shadow-md">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-accent-50/20 pointer-events-none"></div>
      {hasVideo && stream ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-100/90 to-primary-50/60">
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full ${
              isTeacher ? 'bg-gradient-to-br from-primary-500 to-primary-600' : 'bg-gradient-to-br from-accent-500 to-accent-600'
            } flex items-center justify-center mx-auto mb-2 shadow-md ring-2 ring-primary-200/50`}>
              <span className="text-lg font-bold text-white">
                {isTeacher ? 'T' : 'S'}
              </span>
            </div>
            <p className="text-sm text-primary-800 font-semibold">{userLabel}</p>
          </div>
        </div>
      )}
      {isCameraOff && (
        <div className="absolute bottom-2 right-2 bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground text-xs px-2 py-1 rounded-lg shadow-lg">
          Camera Off
        </div>
      )}
    </div>
  );
}