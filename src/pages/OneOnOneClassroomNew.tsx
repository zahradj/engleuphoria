
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ClassroomAccessGuard } from "@/components/classroom/ClassroomAccessGuard";
import { MediaProvider } from "@/components/classroom/oneonone/video/MediaContext";
import { useOneOnOneClassroom } from "@/hooks/useOneOnOneClassroom";
import { useSessionTimer } from "@/hooks/classroom/useSessionTimer";
import { useClassroomLayout } from "@/hooks/classroom/useClassroomLayout";
import { useRewards } from "@/hooks/classroom/useRewards";
import { ModernClassroomLayout } from "@/components/classroom/modern/ModernClassroomLayout";
import { ModernClassroomTopBar } from "@/components/classroom/modern/ModernClassroomTopBar";
import { QuickAccessToolbar } from "@/components/classroom/modern/QuickAccessToolbar";
import { EnhancedWhiteboard } from "@/components/classroom/modern/EnhancedWhiteboard";
import { ModernRewardsPanel } from "@/components/classroom/modern/ModernRewardsPanel";
import { EnhancedConfetti, LevelUpAnimation, BadgeReveal } from "@/components/classroom/modern/EnhancedConfetti";
import { RewardToast } from "@/components/classroom/modern/RewardToast";
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

  const {
    currentXP,
    level,
    nextLevelXP,
    starCount,
    badges,
    recentAchievements,
    showLevelUp,
    showBadgeReveal,
    newBadge,
    addXP,
    addStars,
    earnBadge
  } = useRewards();

  const [connectionQuality] = useState<"excellent" | "good" | "poor">("excellent");
  const [showRewardToast, setShowRewardToast] = useState(false);
  const [rewardXP, setRewardXP] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Demo function to test rewards
  const handleTestReward = () => {
    const xpAmount = 25;
    setRewardXP(xpAmount);
    setShowRewardToast(true);
    setShowConfetti(true);
    addXP(xpAmount, "Completed activity");
    addStars(1);
  };

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
            activeView === "rewards" ? (
              <ModernRewardsPanel
                currentXP={currentXP}
                nextLevelXP={nextLevelXP}
                level={level}
                badges={badges}
                recentAchievements={recentAchievements}
                starCount={starCount}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <p className="text-sm">Chat / Dictionary</p>
                  <p className="text-xs mt-2">Coming in Phases 5-6</p>
                </div>
              </div>
            )
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
                toast.success("Rewards panel opened");
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

        {/* Reward Animations */}
        <EnhancedConfetti trigger={showConfetti} pattern="burst" />
        <LevelUpAnimation show={showLevelUp} level={level} />
        {newBadge && (
          <BadgeReveal
            show={showBadgeReveal}
            badge={{
              icon: newBadge.icon,
              name: newBadge.name,
              description: newBadge.description
            }}
          />
        )}
        <RewardToast
          show={showRewardToast}
          xp={rewardXP}
          message="Great work!"
          onComplete={() => setShowRewardToast(false)}
        />
      </MediaProvider>
    </ClassroomAccessGuard>
  );
}
