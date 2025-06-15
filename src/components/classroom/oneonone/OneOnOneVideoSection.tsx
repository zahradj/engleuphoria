
import React from "react";
import { Card } from "@/components/ui/card";
import { useMediaContext } from "./video/MediaContext";
import { LessonStartPrompt } from "./video/components/LessonStartPrompt";
import { LiveVideoPanels } from "./video/components/LiveVideoPanels";
import { VideoControlsOverlay } from "./video/components/VideoControlsOverlay";
import { XPProgressSection } from "./video/components/XPProgressSection";
import { SessionLog } from "./video/components/SessionLog";
import { MediaErrorDisplay } from "./video/components/MediaErrorDisplay";
import { LessonPlanOverview } from "./LessonPlanOverview";
import { useLessonState } from "./video/hooks/useLessonState";
import { useSessionLogging } from "./video/hooks/useSessionLogging";
import { useVideoRefs } from "./video/hooks/useVideoRefs";
import { useReportIssue } from "./video/hooks/useReportIssue";
import { OneOnOneVideoSectionProps } from "./video/types";

export function OneOnOneVideoSection({
  enhancedClassroom,
  currentUserId,
  currentUserName,
  isTeacher,
  studentXP = 1250,
  onAwardPoints,
  showRewardPopup = false,
  lessonStarted: externalLessonStarted
}: OneOnOneVideoSectionProps) {
  const media = useMediaContext();
  const { logMessages, logEvent } = useSessionLogging();
  const { lessonStarted, handleStartLesson } = useLessonState(externalLessonStarted, isTeacher, logEvent);
  const videoRefs = useVideoRefs(media, isTeacher);
  const { reportedIssue, handleReportIssue } = useReportIssue(logEvent);

  React.useEffect(() => {
    if (media.isConnected) {
      logEvent(`${isTeacher ? "Teacher" : "Student"} joined the session.`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media.isConnected, isTeacher]);

  const startLessonAndJoin = () => {
    handleStartLesson();
    logEvent("Lesson started by Teacher.");
    if (!media.isConnected) {
      console.log("🎥 Starting lesson and joining media...");
      media.join();
    }
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <Card className="flex-1 p-0 bg-white/80 border-0 shadow-2xl glass-enhanced rounded-3xl overflow-hidden ring-1 ring-white/30 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white/50 to-purple-100 pointer-events-none"></div>
        <div className="aspect-video relative flex items-center justify-center">
          {!lessonStarted ? (
            <LessonStartPrompt isTeacher={isTeacher} onStartLesson={startLessonAndJoin} />
          ) : (
            <>
              <LiveVideoPanels isTeacher={isTeacher} media={media} lessonStarted={lessonStarted} videoRefs={videoRefs} />
              <VideoControlsOverlay media={media} lessonStarted={lessonStarted} onReportIssue={handleReportIssue} />
              {reportedIssue && (
                <div className="absolute bottom-16 right-3 z-10 bg-yellow-50 border border-yellow-300 px-4 py-2 rounded-lg shadow-md text-yellow-900 font-medium">
                  Reported: {reportedIssue}
                </div>
              )}
              {lessonStarted && media.isConnected && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-green-500 text-white shadow-lg flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold animate-pulse">
                    LIVE
                  </span>
                </div>
              )}
            </>
          )}
        </div>
        <XPProgressSection studentXP={studentXP} showRewardPopup={!!showRewardPopup} />
      </Card>

      {/* Lesson Plan Overview - Only show for teachers */}
      {isTeacher && (
        <div className="flex-shrink-0">
          <LessonPlanOverview 
            currentUser={{
              role: isTeacher ? 'teacher' : 'student',
              name: currentUserName
            }}
          />
        </div>
      )}

      <SessionLog logMessages={logMessages} />
      <MediaErrorDisplay error={media.error} />
    </div>
  );
}
