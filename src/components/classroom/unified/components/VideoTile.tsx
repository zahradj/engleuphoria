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
    <div className="w-full h-full bg-muted rounded-2xl overflow-hidden relative video-frame-enhanced">
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
        <div className="absolute bottom-1 right-1 bg-destructive text-destructive-foreground text-xs px-1 py-0.5 rounded">
          Camera Off
        </div>
      )}
    </div>
  );
}