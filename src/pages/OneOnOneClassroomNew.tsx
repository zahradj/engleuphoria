
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ClassroomAccessGuard } from "@/components/classroom/ClassroomAccessGuard";
import { MediaProvider } from "@/components/classroom/oneonone/video/MediaContext";
import { useOneOnOneClassroom } from "@/hooks/useOneOnOneClassroom";
import { useSessionTimer } from "@/hooks/classroom/useSessionTimer";
import { useClassroomLayout } from "@/hooks/classroom/useClassroomLayout";
import { ModernClassroomLayout } from "@/components/classroom/modern/ModernClassroomLayout";
import { ModernClassroomTopBar } from "@/components/classroom/modern/ModernClassroomTopBar";
import { QuickAccessToolbar } from "@/components/classroom/modern/QuickAccessToolbar";
import { EnhancedWhiteboard } from "@/components/classroom/modern/EnhancedWhiteboard";
import { toast } from "sonner";

export default function OneOnOneClassroomNew() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formattedTime } = useSessionTimer();
  
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

  const {
    activeView,
    showLeftPanel,
    showRightSidebar,
    unreadChatCount,
    setActiveView,
    toggleLeftPanel,
    toggleRightSidebar,
    clearUnreadChat
  } = useClassroomLayout();

  const [connectionQuality] = useState<"excellent" | "good" | "poor">("excellent");

  const handleAccessDenied = () => {
    navigate(isTeacher ? "/teacher" : "/student");
  };

  const handleExit = () => {
    if (confirm("Are you sure you want to leave the classroom?")) {
      navigate(isTeacher ? "/teacher" : "/student");
    }
  };

  const handleBack = () => {
    if (confirm("Are you sure you want to leave the classroom?")) {
      navigate(isTeacher ? "/teacher" : "/student");
    }
  };

  return (
    <ClassroomAccessGuard
      roomId={roomId}
      userId={authedUserId}
      userRole={userRole}
      onAccessDenied={handleAccessDenied}
    >
      <MediaProvider roomId={roomId}>
        <ModernClassroomLayout
          topBar={
            <ModernClassroomTopBar
              onBack={handleBack}
              lessonTitle="Interactive One-on-One Lesson"
              roomCode={roomId}
              sessionTime={formattedTime}
              connectionQuality={connectionQuality}
              onExitClick={handleExit}
              onHelpClick={() => toast.info("Help documentation coming soon!")}
              onSettingsClick={() => toast.info("Settings panel coming soon!")}
            />
          }
          leftPanel={
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-sm">Lesson Slides Panel</p>
                <p className="text-xs mt-2">Coming in Phase 2</p>
              </div>
            </div>
          }
          centerContent={
            <div className="h-full">
              <EnhancedWhiteboard />
            </div>
          }
          rightSidebar={
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-sm">Chat / Dictionary / Rewards</p>
                <p className="text-xs mt-2">Coming in Phases 4-6</p>
              </div>
            </div>
          }
          bottomToolbar={
            <QuickAccessToolbar
              onWhiteboardClick={() => {
                setActiveView("whiteboard");
                toast.success("Whiteboard activated");
              }}
              onSlidesClick={() => {
                setActiveView("slides");
                toast.info("Slides panel coming soon");
              }}
              onChatClick={() => {
                setActiveView("chat");
                clearUnreadChat();
                toast.info("Chat panel coming soon");
              }}
              onDictionaryClick={() => {
                setActiveView("dictionary");
                toast.info("Dictionary panel coming soon");
              }}
              onRewardsClick={() => {
                setActiveView("rewards");
                toast.info("Rewards panel coming soon");
              }}
              onEmbedClick={() => {
                setActiveView("embed");
                toast.info("Embed feature coming soon");
              }}
              onSettingsClick={() => {
                toast.info("Settings coming soon");
              }}
              unreadChatCount={unreadChatCount}
              activeView={activeView}
            />
          }
          showLeftPanel={showLeftPanel}
          showRightSidebar={showRightSidebar}
        />
      </MediaProvider>
    </ClassroomAccessGuard>
  );
}
