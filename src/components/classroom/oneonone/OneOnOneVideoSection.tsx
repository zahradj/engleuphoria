import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Mic, MicOff, Video, VideoOff, Sparkles, Users, Circle } from "lucide-react";
import { OneOnOneRewards } from "./OneOnOneRewards";
import { ReportIssueDropdown } from "./ReportIssueDropdown";
import { useLocalMedia } from "@/hooks/useLocalMedia";

interface OneOnOneVideoSectionProps {
  enhancedClassroom: any;
  currentUserId: string;
  currentUserName: string;
  isTeacher: boolean;
  studentXP?: number;
  onAwardPoints?: () => void;
  showRewardPopup?: boolean;
  lessonStarted?: boolean;
}

type IssueType = "Audio Issue" | "Video Issue" | "Internet Issue" | "Other";

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

  // Hook for real media state
  const media = useLocalMedia();

  // UI-local lesson controls
  const [lessonStarted, setLessonStarted] = useState(externalLessonStarted ?? false);
  const [waitingSince, setWaitingSince] = useState<number | null>(null);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const lessonStartTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [reportedIssue, setReportedIssue] = useState<IssueType | null>(null);

  useEffect(() => {
    if (!lessonStarted) {
      setWaitingSince(Date.now());
      if (!lessonStartTimeout.current) {
        lessonStartTimeout.current = setTimeout(() => {
          const now = Date.now();
          if (!lessonStarted && waitingSince) {
            const minutes = Math.round((now - waitingSince) / 60000);
            if (minutes >= 5) {
              if (isTeacher) {
                setLogMessages(old => [...old, "Student marked absent (not joined within 5min)"]);
              } else {
                setLogMessages(old => [...old, "Teacher marked absent (lesson not started in 5min)"]);
              }
            }
          }
        }, 300000);
      }
    } else {
      if (lessonStartTimeout.current) {
        clearTimeout(lessonStartTimeout.current);
        lessonStartTimeout.current = null;
      }
      setWaitingSince(null);
    }
    return () => { if (lessonStartTimeout.current) clearTimeout(lessonStartTimeout.current); };
  }, [lessonStarted, isTeacher, waitingSince]);

  const logEvent = (msg: string) => {
    setLogMessages(old => [...old, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    if (media.isConnected) {
      logEvent(`${isTeacher ? "Teacher" : "Student"} joined the session.`);
    }
  }, [media.isConnected, isTeacher]);

  const handleStartLesson = () => {
    setLessonStarted(true);
    logEvent("Lesson started by Teacher.");
    // Optionally connect on start
    if (!media.isConnected) media.join();
  };

  const handleReportIssue = (issue: IssueType) => {
    setReportedIssue(issue);
    logEvent(`Technical issue reported: ${issue}`);
    setTimeout(() => setReportedIssue(null), 3000);
  };

  const teacherVideoRef = useRef<HTMLVideoElement>(null);
  const studentVideoRef = useRef<HTMLVideoElement>(null);

  // Mount or update local video as soon as stream is available,
  // and always display the local user's stream in their panel.
  useEffect(() => {
    // Always clean up previous srcObject to avoid leaks
    const teacherVideo = teacherVideoRef.current;
    const studentVideo = studentVideoRef.current;

    // Assign stream if present
    if (media.stream) {
      if (isTeacher && teacherVideo) {
        teacherVideo.srcObject = media.stream;
      }
      if (!isTeacher && studentVideo) {
        studentVideo.srcObject = media.stream;
      }
    }

    // On cleanup, remove srcObject (releasing device)
    return () => {
      if (teacherVideo) teacherVideo.srcObject = null;
      if (studentVideo) studentVideo.srcObject = null;
    };
  }, [media.stream, isTeacher]); // Only depend on stream and role

  return (
    <div className="h-full flex flex-col gap-4">
      <Card className="p-0 bg-white/80 border-0 shadow-2xl glass-enhanced rounded-3xl overflow-hidden ring-1 ring-white/30 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white/50 to-purple-100 pointer-events-none"></div>
        <div className="aspect-video relative flex items-center justify-center">
          {!lessonStarted ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              {isTeacher ? (
                <>
                  <span className="font-bold text-xl text-gray-700 mb-2">
                    Ready to Start the Lesson?
                  </span>
                  <Button
                    onClick={handleStartLesson}
                    className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg text-lg hover:bg-blue-700 transition"
                  >
                    Start Lesson
                  </Button>
                  <span className="mt-4 text-sm text-gray-500">Students will join when you start.</span>
                </>
              ) : (
                <>
                  <span className="font-bold text-xl text-gray-700 mb-2">
                    Waiting for Teacher to Start the Lesson...
                  </span>
                  <div className="mt-2 text-sm text-gray-400">
                    This window will automatically connect once your teacher begins.<br />
                    If the lesson doesn't start in 5 minutes the teacher will be marked absent.
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              {/* --- LIVE VIDEO PANELS --- */}
              <div
                id="teacher-panel"
                className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-center"
                style={{ zIndex: 2 }}
              >
                {isTeacher ? (
                  media.stream && !media.isCameraOff ? (
                    <video
                      autoPlay
                      muted // Always mute local preview to prevent feedback!
                      playsInline
                      className="w-11/12 h-5/6 object-cover rounded-2xl shadow-lg border-2 border-blue-200"
                      ref={teacherVideoRef}
                      onError={e => console.error("Teacher video error", e)}
                    />
                  ) : (
                    <div className="w-36 h-36 rounded-full bg-blue-400 flex items-center justify-center shadow-xl">
                      <span className="text-3xl font-bold text-white">T</span>
                    </div>
                  )
                ) : (
                  // Student sees teacher avatar
                  <div className="w-36 h-36 rounded-full bg-blue-300 flex items-center justify-center shadow-xl">
                    <span className="text-3xl font-semibold text-white">T</span>
                  </div>
                )}
              </div>

              <div
                id="student-panel"
                className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-center"
                style={{ zIndex: 2 }}
              >
                {!isTeacher ? (
                  media.stream && !media.isCameraOff ? (
                    <video
                      autoPlay
                      muted // Always mute local preview for student!
                      playsInline
                      className="w-11/12 h-5/6 object-cover rounded-2xl shadow-lg border-2 border-purple-200"
                      ref={studentVideoRef}
                      onError={e => console.error("Student video error", e)}
                    />
                  ) : (
                    <div className="w-36 h-36 rounded-full bg-purple-400 flex items-center justify-center shadow-xl">
                      <span className="text-3xl font-bold text-white">S</span>
                    </div>
                  )
                ) : (
                  // Teacher sees student avatar
                  <div className="w-36 h-36 rounded-full bg-purple-300 flex items-center justify-center shadow-xl">
                    <span className="text-3xl font-semibold text-white">S</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Live, Recording, and Status Badges */}
          {lessonStarted && media.isConnected && (
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-green-500 text-white shadow-lg flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold animate-pulse">
                <Sparkles size={14} className="mr-1" />
                LIVE
              </Badge>
            </div>
          )}
          {/* Skipping isRecording badge in demo */}

          {lessonStarted && (
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
              <Button
                variant={media.isMuted ? "destructive" : "outline"}
                size="icon"
                onClick={media.toggleMicrophone}
              >
                {media.isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </Button>
              <Button
                variant={media.isCameraOff ? "destructive" : "outline"}
                size="icon"
                onClick={media.toggleCamera}
              >
                {media.isCameraOff ? <VideoOff size={18} /> : <Video size={18} />}
              </Button>
              <Button
                variant={media.isConnected ? "destructive" : "outline"}
                size="icon"
                onClick={media.isConnected ? media.leave : media.join}
              >
                {media.isConnected ? (
                  <span className="text-xs" title="Disconnect">⏻</span>
                ) : (
                  <span className="text-xs" title="Connect">▶️</span>
                )}
              </Button>
              <ReportIssueDropdown onReport={handleReportIssue} />
            </div>
          )}

          {reportedIssue && (
            <div className="absolute bottom-16 right-3 z-10 bg-yellow-50 border border-yellow-300 px-4 py-2 rounded-lg shadow-md text-yellow-900 font-medium">
              Reported: {reportedIssue}
            </div>
          )}
        </div>

        {/* XP & Progress Section */}
        <div className="p-4 flex flex-col items-center">
          <div className="w-full flex items-center justify-between">
            <div>
              <span className="font-semibold text-md text-gray-800">
                XP Progress
              </span>
              <span className="ml-2 font-bold text-orange-600 text-lg">{studentXP % 100}/100</span>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white border-0 shadow-xl px-4 py-2 rounded-full flex items-center gap-2">
              <Star size={18} className="mr-1" />
              Level {Math.floor(studentXP/100)}
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-3 relative overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 h-3 rounded-full transition-all duration-700 ease-out shadow-md"
              style={{width: `${studentXP % 100}%`}} />
            {showRewardPopup && (
              <div className="absolute right-0 -top-8 text-green-600 font-bold text-sm animate-bounce-in bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-xl shadow-lg border border-green-200">
                <Sparkles className="inline h-3 w-3 mr-1" /> +50 XP ✨
              </div>
            )}
          </div>
        </div>
      </Card>

      {isTeacher && (
        <div className="flex-shrink-0">
          <Card className="p-3 mt-2">
            <OneOnOneRewards
              studentXP={studentXP}
              onAwardPoints={onAwardPoints || (() => {})}
              showRewardPopup={showRewardPopup}
            />
          </Card>
        </div>
      )}

      {logMessages.length > 0 && (
        <div className="mt-4 bg-white/70 rounded-lg shadow p-2 max-h-32 overflow-y-auto text-xs text-gray-500">
          <div className="font-bold mb-1 text-gray-700">Session Log</div>
          {logMessages.map((msg, idx) => (
            <div key={idx}>{msg}</div>
          ))}
        </div>
      )}

      {/* Show error if media fails - now with enhanced guidance */}
      {media.error && (
        <div className="mt-2 text-xs text-red-600 text-center bg-red-50 rounded p-2">
          {media.error}
          <br />
          Please check camera/microphone settings and allow access if prompted.
        </div>
      )}
    </div>
  );
}
