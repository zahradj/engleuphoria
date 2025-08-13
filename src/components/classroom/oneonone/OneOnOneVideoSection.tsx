
import React from "react";
import { Card } from "@/components/ui/card";
import { useMediaContext } from "./video/MediaContext";
import { LessonStartPrompt } from "./video/components/LessonStartPrompt";
import { LiveVideoPanels } from "./video/components/LiveVideoPanels";
import { VideoControlsOverlay } from "./video/components/VideoControlsOverlay";
import { XPProgressSection } from "./video/components/XPProgressSection";
import { SessionLog } from "./video/components/SessionLog";
import { MediaErrorDisplay } from "./video/components/MediaErrorDisplay";
import { QuickTeachingTools } from "./QuickTeachingTools";
import { StudentProgress } from "./StudentProgress";
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
    <div className="h-full flex flex-col gap-6">
      <Card className="flex-1 p-0 border-0 glass-enhanced rounded-3xl overflow-hidden relative floating-animation video-panel-glow classroom-ambient rgb-background">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/8 to-secondary/12 pointer-events-none animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-accent/10 via-primary/6 to-secondary/8 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/8 via-accent/10 to-primary/12 pointer-events-none animate-pulse"></div>
        <div className="aspect-video relative flex items-center justify-center">
          {!lessonStarted ? (
            <LessonStartPrompt isTeacher={isTeacher} onStartLesson={startLessonAndJoin} />
          ) : (
            <>
              <LiveVideoPanels isTeacher={isTeacher} media={media} lessonStarted={lessonStarted} videoRefs={videoRefs} />
              <VideoControlsOverlay media={media} lessonStarted={lessonStarted} onReportIssue={handleReportIssue} />
              {reportedIssue && (
                <div className="absolute bottom-16 right-3 z-10 glass-subtle px-4 py-2 rounded-xl text-warning font-medium animate-fade-in">
                  Reported: {reportedIssue}
                </div>
              )}
              {lessonStarted && media.isConnected && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-gradient-to-r from-secondary to-secondary-foreground text-white shadow-xl flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold pulse-ring status-indicator">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-lg"></div>
                    LIVE SESSION
                  </span>
                </div>
              )}
            </>
          )}
        </div>
        <XPProgressSection studentXP={studentXP} showRewardPopup={!!showRewardPopup} />
      </Card>

      {/* Teaching Tools and Simple Progress - Only show for teachers */}
      {isTeacher && (
        <div className="flex-shrink-0 space-y-5">
          <div className="glass-subtle rounded-3xl p-6 animate-fade-in interactive-hover">
            <QuickTeachingTools 
              currentUser={{
                role: isTeacher ? 'teacher' : 'student',
                name: currentUserName
              }}
            />
          </div>
          <div className="glass-subtle rounded-3xl p-6 animate-fade-in interactive-hover">
            <StudentProgress
              studentXP={studentXP}
              studentName="Emma"
              showRewardPopup={showRewardPopup}
              onAwardPoints={onAwardPoints}
            />
          </div>
        </div>
      )}

      <SessionLog logMessages={logMessages} />
      <MediaErrorDisplay error={media.error} />
    </div>
  );
}
