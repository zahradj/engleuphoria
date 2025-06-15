
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMediaContext } from "@/components/classroom/oneonone/video/MediaContext";
import { useVideoRefs } from "@/components/classroom/oneonone/video/hooks/useVideoRefs";
import { LessonStartPrompt } from "@/components/classroom/oneonone/video/components/LessonStartPrompt";
import { MediaErrorDisplay } from "@/components/classroom/oneonone/video/components/MediaErrorDisplay";
import { useReportIssue } from "@/components/classroom/oneonone/video/hooks/useReportIssue";
import { useSessionLogging } from "@/components/classroom/oneonone/video/hooks/useSessionLogging";

interface UnifiedVideoSectionProps {
  currentUser: {
    id: string;
    name: string;
    role: 'teacher' | 'student';
  };
}

export function UnifiedVideoSection({ currentUser }: UnifiedVideoSectionProps) {
  const media = useMediaContext();
  const { logEvent } = useSessionLogging();
  const isTeacher = currentUser.role === 'teacher';
  const videoRefs = useVideoRefs(media, isTeacher);
  const { reportedIssue, handleReportIssue } = useReportIssue(logEvent);
  
  const lessonStarted = media.isConnected;

  React.useEffect(() => {
    if (media.isConnected) {
      logEvent(`${isTeacher ? "Teacher" : "Student"} joined the session.`);
    }
  }, [media.isConnected, isTeacher, logEvent]);

  const startLessonAndJoin = () => {
    console.log("🎥 Starting lesson and joining media...");
    media.join();
  };

  const hasVideo = media.stream && media.isConnected && !media.isCameraOff;

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 p-0 bg-white/90 border-2 border-blue-300 shadow-lg rounded-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white/70 to-blue-50 pointer-events-none"></div>
        
        <div className="aspect-video max-w-full max-h-full relative flex flex-col">
          {!lessonStarted ? (
            <LessonStartPrompt isTeacher={isTeacher} onStartLesson={startLessonAndJoin} />
          ) : (
            <div className="flex-1 relative">
              {/* Teacher Video Area */}
              {isTeacher ? (
                hasVideo ? (
                  <video
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    ref={videoRefs.teacherVideoRef}
                    onLoadedMetadata={() => console.log("🎥 Teacher video metadata loaded")}
                    onError={e => console.error("🎥 Teacher video error", e)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center relative">
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-blue-400 flex items-center justify-center shadow-xl mb-3 mx-auto">
                        <span className="text-4xl font-bold text-white">T</span>
                      </div>
                      <p className="text-white font-semibold">Teacher</p>
                    </div>
                    {media.isCameraOff && (
                      <div className="absolute bottom-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Camera Off
                      </div>
                    )}
                  </div>
                )
              ) : (
                // Student sees teacher avatar/video
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center relative">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-blue-300 flex items-center justify-center shadow-xl mb-3 mx-auto">
                      <span className="text-4xl font-semibold text-white">T</span>
                    </div>
                    <p className="text-white font-semibold">Teacher Sarah</p>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-gray-600 text-white text-xs px-2 py-1 rounded">
                    Remote
                  </div>
                </div>
              )}

              {/* Status Indicators */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {lessonStarted && (
                  <Badge className="bg-green-500 text-white animate-pulse">
                    ● Live & Interactive
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Enhanced Session
                </Badge>
              </div>

              {/* Teacher Name Label */}
              <div className="absolute bottom-3 left-3">
                <div className="bg-black/60 text-white px-3 py-1 rounded-lg text-sm font-medium">
                  Teacher Sarah
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      <MediaErrorDisplay error={media.error} />
    </div>
  );
}
