
import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ClassroomAccessGuard } from "@/components/classroom/ClassroomAccessGuard";
import { OneOnOneVideoSection } from "@/components/classroom/oneonone/OneOnOneVideoSection";
import { MediaProvider } from "@/components/classroom/oneonone/video/MediaContext";
import { useOneOnOneClassroom } from "@/hooks/useOneOnOneClassroom";

export default function OneOnOneClassroomNew() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const roomId = searchParams.get("roomId") || "unified-classroom-1";
  const role = searchParams.get("role") || "student";
  const name = searchParams.get("name") || "User";
  const userId = searchParams.get("userId") || "user-1";

  const isTeacher = role === "teacher";
  const userRole = isTeacher ? "teacher" : "student";

  const {
    studentXP,
    showRewardPopup,
    awardPoints
  } = useOneOnOneClassroom();

  const handleAccessDenied = () => {
    navigate("/teacher-dashboard");
  };

  return (
    <ClassroomAccessGuard
      roomId={roomId}
      userId={userId}
      userRole={userRole}
      onAccessDenied={handleAccessDenied}
    >
      <MediaProvider roomId={roomId}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
          <div className="max-w-7xl mx-auto h-[calc(100vh-2rem)]">
            <OneOnOneVideoSection
              enhancedClassroom={null}
              currentUserId={userId}
              currentUserName={name}
              isTeacher={isTeacher}
              studentXP={studentXP}
              onAwardPoints={awardPoints}
              showRewardPopup={showRewardPopup}
              lessonStarted={false}
            />
          </div>
        </div>
      </MediaProvider>
    </ClassroomAccessGuard>
  );
}
