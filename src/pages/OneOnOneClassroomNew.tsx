
import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ClassroomAccessGuard } from "@/components/classroom/ClassroomAccessGuard";
import { OneOnOneVideoSection } from "@/components/classroom/oneonone/OneOnOneVideoSection";
import { MediaProvider } from "@/components/classroom/oneonone/video/MediaContext";
import { useOneOnOneClassroom } from "@/hooks/useOneOnOneClassroom";

export default function OneOnOneClassroomNew() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const roomId = searchParams.get("roomId") || "unified-classroom-1";
  const roleParam = searchParams.get("role") || "student";
  const nameParam = searchParams.get("name") || "User";
  const userIdParam = searchParams.get("userId") || "user-1";

  const authedUserId = user?.id || userIdParam;
  const authedName = (user as any)?.full_name || (user?.user_metadata as any)?.full_name || nameParam;
  const authedRole = (user?.role as 'teacher' | 'student' | 'admin' | undefined) || (roleParam === 'teacher' ? 'teacher' : 'student');
  const isTeacher = authedRole === "teacher";
  const userRole = isTeacher ? "teacher" : "student";

  const {
    studentXP,
    showRewardPopup,
    awardPoints
  } = useOneOnOneClassroom();

  const handleAccessDenied = () => {
    navigate(isTeacher ? "/teacher" : "/student");
  };

  return (
    <ClassroomAccessGuard
      roomId={roomId}
      userId={authedUserId}
      userRole={userRole}
      onAccessDenied={handleAccessDenied}
    >
      <MediaProvider roomId={roomId}>
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5">
          <div className="container mx-auto px-4 py-6 h-screen flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
                  {authedName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">{authedName}</h1>
                  <p className="text-sm text-muted-foreground capitalize">{userRole} • Room: {roomId}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0">
              <OneOnOneVideoSection
                enhancedClassroom={null}
                currentUserId={authedUserId}
                currentUserName={authedName}
                isTeacher={isTeacher}
                studentXP={studentXP}
                onAwardPoints={awardPoints}
                showRewardPopup={showRewardPopup}
                lessonStarted={false}
              />
            </div>
          </div>
        </div>
      </MediaProvider>
    </ClassroomAccessGuard>
  );
}
