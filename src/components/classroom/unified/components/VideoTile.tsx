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
    <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-muted via-muted to-muted/80 rounded-2xl overflow-hidden relative video-frame-enhanced rgb-video-frame">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/6 pointer-events-none"></div>
      {hasVideo && stream ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/90 to-muted-foreground/10">
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full ${
              isTeacher ? 'bg-gradient-to-br from-teacher to-teacher-accent' : 'bg-gradient-to-br from-student to-student-accent'
            } flex items-center justify-center mx-auto mb-2 shadow-lg ring-2 ${
              isTeacher ? 'ring-teacher/20' : 'ring-student/20'
            }`}>
              <span className="text-lg font-bold text-white">
                {isTeacher ? 'T' : 'S'}
              </span>
            </div>
            <p className="text-sm text-foreground font-semibold">{userLabel}</p>
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