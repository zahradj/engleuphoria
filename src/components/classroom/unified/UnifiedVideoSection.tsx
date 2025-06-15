
import React from "react";
import { Card } from "@/components/ui/card";
import { useMediaContext } from "@/components/classroom/oneonone/video/MediaContext";
import { useVideoRefs } from "@/components/classroom/oneonone/video/hooks/useVideoRefs";
import { LiveVideoPanels } from "@/components/classroom/oneonone/video/components/LiveVideoPanels";
import { VideoControlsOverlay } from "@/components/classroom/oneonone/video/components/VideoControlsOverlay";
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
  
  // For unified classroom, we consider lesson always started when connected
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

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 p-0 bg-white/80 border-0 shadow-2xl glass-enhanced rounded-3xl overflow-hidden ring-1 ring-white/30 relative min-h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white/50 to-purple-100 pointer-events-none"></div>
        {/* Removed aspect-video constraint and increased height */}
        <div className="h-full relative flex items-center justify-center">
          {!lessonStarted ? (
            <LessonStartPrompt isTeacher={isTeacher} onStartLesson={startLessonAndJoin} />
          ) : (
            <>
              <LiveVideoPanels 
                isTeacher={isTeacher} 
                media={media} 
                lessonStarted={lessonStarted} 
                videoRefs={videoRefs} 
              />
              <VideoControlsOverlay 
                media={media} 
                lessonStarted={lessonStarted} 
                onReportIssue={handleReportIssue} 
              />
              {reportedIssue && (
                <div className="absolute bottom-16 right-3 z-10 bg-yellow-50 border border-yellow-300 px-4 py-2 rounded-lg shadow-md text-yellow-900 font-medium">
                  Reported: {reportedIssue}
                </div>
              )}
              {lessonStarted && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-green-500 text-white shadow-lg flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold animate-pulse">
                    LIVE
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      <MediaErrorDisplay error={media.error} />
    </div>
  );
}
