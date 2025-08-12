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
    <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
      {hasVideo && stream ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/20">
          <div className="text-center">
            <div className={`w-8 h-8 rounded-full ${
              isTeacher ? 'bg-primary' : 'bg-secondary'
            } flex items-center justify-center mx-auto mb-1`}>
              <span className="text-sm font-bold text-primary-foreground">
                {isTeacher ? 'T' : 'S'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-medium">{userLabel}</p>
          </div>
        </div>
      )}
      {isCameraOff && (
        <div className="absolute bottom-1 right-1 bg-destructive text-destructive-foreground text-xs px-1 py-0.5 rounded">
          Camera Off
        </div>
      )}
    </div>
  );
}