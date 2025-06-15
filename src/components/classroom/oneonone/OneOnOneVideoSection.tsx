import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Mic, MicOff, Video, VideoOff, Sparkles, Users, Circle } from "lucide-react";
import { OneOnOneRewards } from "./OneOnOneRewards";
import { ReportIssueDropdown } from "./ReportIssueDropdown";

interface OneOnOneVideoSectionProps {
  enhancedClassroom: any; // Enhanced classroom hook return value
  currentUserId: string;
  currentUserName: string;
  isTeacher: boolean;
  studentXP?: number;
  onAwardPoints?: () => void;
  showRewardPopup?: boolean;
  lessonStarted?: boolean; // optional external control (for unified logic)
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
  const {
    isConnected,
    connectionQuality,
    participants,
    isRecording,
    localStream,
    isMuted,
    isCameraOff,
    toggleMicrophone,
    toggleCamera,
    // ...other props/actions from enhancedClassroom if needed
  } = enhancedClassroom;

  const [lessonStarted, setLessonStarted] = useState(externalLessonStarted ?? false);
  const [waitingSince, setWaitingSince] = useState<number | null>(null);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const lessonStartTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [reportedIssue, setReportedIssue] = useState<IssueType | null>(null);

  // Attendance/absence logic
  useEffect(() => {
    if (!lessonStarted) {
      setWaitingSince(Date.now());
      // Start timeout check for 5 min (300000 ms)
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
    return () => {
      if (lessonStartTimeout.current) clearTimeout(lessonStartTimeout.current);
    };
  }, [lessonStarted, isTeacher, waitingSince]);

  // Event logging handlers
  const logEvent = (msg: string) => {
    setLogMessages(old => [...old, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    // Log join/leave/connection error events with minimal proof-of-concept
    if (isConnected) {
      logEvent(`${isTeacher ? "Teacher" : "Student"} joined the session.`);
    }
    // No connection error sample, but extra logic could go here...
    // eslint-disable-next-line
  }, [isConnected, isTeacher]);

  // Teacher starts lesson
  const handleStartLesson = () => {
    setLessonStarted(true);
    logEvent("Lesson started by Teacher.");
    // (In real integration: trigger enhancedClassroom.connect or similar)
  };

  // Report issue
  const handleReportIssue = (issue: IssueType) => {
    setReportedIssue(issue);
    logEvent(`Technical issue reported: ${issue}`);
    setTimeout(() => setReportedIssue(null), 3000);
  };

  // Separate containers for video as per requirements
  const teacherVideoRef = useRef<HTMLDivElement>(null);
  const studentVideoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Attach teacher and student video frames to containers with correct IDs
    // Simulate teacher sees own video on left, student on right, and vice versa for student
    const teacherContainer = document.getElementById("teacher-video");
    const studentContainer = document.getElementById("student-video");
    if (teacherContainer && teacherVideoRef.current) {
      teacherContainer.innerHTML = "";
      teacherContainer.appendChild(teacherVideoRef.current);
    }
    if (studentContainer && studentVideoRef.current) {
      studentContainer.innerHTML = "";
      studentContainer.appendChild(studentVideoRef.current);
    }
  }, [lessonStarted]);

  // Flexible rendering based on role and lesson status
  return (
    <div className="h-full flex flex-col gap-4">
      <Card className="p-0 bg-white/80 border-0 shadow-2xl glass-enhanced rounded-3xl overflow-hidden ring-1 ring-white/30 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white/50 to-purple-100 pointer-events-none"></div>
        <div className="aspect-video relative flex items-center justify-center">
          {/* Show teacher-only "Start Lesson" and waiting state */}
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
            // Video containers per requirements
            <>
              <div
                ref={teacherVideoRef}
                id="teacher-panel"
                className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-center"
                style={{ zIndex: 2 }}
              >
                {/* This node will be moved to #teacher-video */}
                {isTeacher ? (
                  localStream && !isCameraOff ? (
                    <video
                      autoPlay
                      muted={isMuted}
                      playsInline
                      className="w-11/12 h-5/6 object-cover rounded-2xl shadow-lg border-2 border-blue-200"
                      ref={el => { if (el) el.srcObject = localStream; }}
                    />
                  ) : (
                    <div className="w-36 h-36 rounded-full bg-blue-400 flex items-center justify-center shadow-xl">
                      <span className="text-3xl font-bold text-white">T</span>
                    </div>
                  )
                ) : (
                  // Student sees teacher's video (mock, for demo)
                  <div className="w-36 h-36 rounded-full bg-blue-300 flex items-center justify-center shadow-xl">
                    <span className="text-3xl font-semibold text-white">T</span>
                  </div>
                )}
              </div>

              <div
                ref={studentVideoRef}
                id="student-panel"
                className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-center"
                style={{ zIndex: 2 }}
              >
                {/* This node will be moved to #student-video */}
                {!isTeacher ? (
                  localStream && !isCameraOff ? (
                    <video
                      autoPlay
                      muted={isMuted}
                      playsInline
                      className="w-11/12 h-5/6 object-cover rounded-2xl shadow-lg border-2 border-purple-200"
                      ref={el => { if (el) el.srcObject = localStream; }}
                    />
                  ) : (
                    <div className="w-36 h-36 rounded-full bg-purple-400 flex items-center justify-center shadow-xl">
                      <span className="text-3xl font-bold text-white">S</span>
                    </div>
                  )
                ) : (
                  // Teacher sees student video (mock demo)
                  <div className="w-36 h-36 rounded-full bg-purple-300 flex items-center justify-center shadow-xl">
                    <span className="text-3xl font-semibold text-white">S</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Live, Recording, and Status Badges */}
          {lessonStarted && isConnected && (
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-green-500 text-white shadow-lg flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold animate-pulse">
                <Sparkles size={14} className="mr-1" />
                LIVE
              </Badge>
            </div>
          )}
          {isRecording && lessonStarted && (
            <div className="absolute top-3 right-3 z-10">
              <Badge variant="destructive" className="animate-pulse shadow-lg flex items-center gap-1 px-2 py-1">
                <Circle className="h-3 w-3 mr-1 fill-current animate-pulse" />
                RECORDING
              </Badge>
            </div>
          )}

          {/* Mute/Camera/Screen Share Controls + Issue Reporting */}
          {lessonStarted && (
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
              <Button
                variant={isMuted ? "destructive" : "outline"}
                size="icon"
                onClick={() => toggleMicrophone && toggleMicrophone()}
              >
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </Button>
              <Button
                variant={isCameraOff ? "destructive" : "outline"}
                size="icon"
                onClick={() => toggleCamera && toggleCamera()}
              >
                {isCameraOff ? <VideoOff size={18} /> : <Video size={18} />}
              </Button>
              {/* Future: Add screen share control */}
              <ReportIssueDropdown onReport={handleReportIssue} />
            </div>
          )}

          {/* Technical issue toast */}
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

      {/* Teacher Rewards */}
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

      {/* Event/activity log for demo/debug/admins */}
      {logMessages.length > 0 && (
        <div className="mt-4 bg-white/70 rounded-lg shadow p-2 max-h-32 overflow-y-auto text-xs text-gray-500">
          <div className="font-bold mb-1 text-gray-700">Session Log</div>
          {logMessages.map((msg, idx) => (
            <div key={idx}>{msg}</div>
          ))}
        </div>
      )}
    </div>
  );
}
