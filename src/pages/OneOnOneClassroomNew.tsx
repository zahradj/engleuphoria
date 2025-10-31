
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ClassroomAccessGuard } from "@/components/classroom/ClassroomAccessGuard";
import { MediaProvider } from "@/components/classroom/oneonone/video/MediaContext";
import { useOneOnOneClassroom } from "@/hooks/useOneOnOneClassroom";
import { useSessionTimer } from "@/hooks/classroom/useSessionTimer";
import { useClassroomLayout } from "@/hooks/classroom/useClassroomLayout";
import { useRewards } from "@/hooks/classroom/useRewards";
import { useLessonSlides } from "@/hooks/classroom/useLessonSlides";
import { ModernClassroomLayout } from "@/components/classroom/modern/ModernClassroomLayout";
import { ModernClassroomTopBar } from "@/components/classroom/modern/ModernClassroomTopBar";
import { QuickAccessToolbar } from "@/components/classroom/modern/QuickAccessToolbar";
import { EnhancedWhiteboard } from "@/components/classroom/modern/EnhancedWhiteboard";
import { ModernRewardsPanel } from "@/components/classroom/modern/ModernRewardsPanel";
import { ModernChatPanel } from "@/components/classroom/modern/ModernChatPanel";
import { ModernDictionaryPanel } from "@/components/classroom/modern/ModernDictionaryPanel";
import { ModernLessonSlidesPanel } from "@/components/classroom/modern/ModernLessonSlidesPanel";
import { ModernUserControls } from "@/components/classroom/modern/ModernUserControls";
import { KeyboardShortcutsModal } from "@/components/classroom/modern/KeyboardShortcutsModal";
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

  const {
    slides,
    currentSlide,
    isFullScreen,
    goToSlide,
    toggleFullScreen
  } = useLessonSlides();

  const [connectionQuality] = useState<"excellent" | "good" | "poor">("excellent");
  const [showRewardToast, setShowRewardToast] = useState(false);
  const [rewardXP, setRewardXP] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Mock video states
  const [teacherVideo, setTeacherVideo] = useState({ isVideoOn: true, isAudioOn: true });
  const [studentVideo, setStudentVideo] = useState({ isVideoOn: true, isAudioOn: true });
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

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
    <MediaProvider roomId={roomId}>
        <ModernClassroomLayout
          topBar={
            <ModernClassroomTopBar
              onBack={handleBack}
              lessonTitle={activeView === "slides" ? `Lesson Slides (${currentSlide + 1}/${slides.length})` : "Interactive One-on-One Lesson"}
              roomCode={roomId}
              sessionTime={formattedTime}
              connectionQuality={connectionQuality}
              onExitClick={handleExit}
              onHelpClick={() => setShowKeyboardShortcuts(true)}
              onSettingsClick={() => toast.info("Settings panel coming soon!")}
            />
          }
          leftPanel={null}
          centerContent={
            <div className="h-full">
              {activeView === "slides" ? (
                <ModernLessonSlidesPanel
                  slides={slides}
                  currentSlide={currentSlide}
                  onSlideChange={goToSlide}
                  isTeacher={isTeacher}
                  isFullScreen={isFullScreen}
                  onToggleFullScreen={toggleFullScreen}
                />
              ) : (
                <EnhancedWhiteboard />
              )}
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
                isTeacher={isTeacher}
                onAwardStar={handleTestReward}
              />
            ) : activeView === "chat" ? (
              <ModernChatPanel
                roomId={roomId}
                currentUser={{
                  id: authedUserId,
                  name: authedName,
                  role: authedRole === 'admin' ? 'teacher' : authedRole
                }}
              />
            ) : activeView === "dictionary" ? (
              <ModernDictionaryPanel
                onAddToVocab={(word, definition) => {
                  toast.success(`Added "${word}" to vocabulary`);
                  addXP(5, "Added new word to vocabulary");
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <p className="text-sm">No content selected</p>
                  <p className="text-xs mt-2">Choose a tool from the bottom toolbar</p>
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
                toast.success("Lesson slides opened");
              }}
              onChatClick={() => {
                setActiveView("chat");
                clearUnreadChat();
                toast.success("Chat opened");
              }}
              onDictionaryClick={() => {
                setActiveView("dictionary");
                toast.success("Dictionary opened");
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

        {/* User Video Controls */}
        <ModernUserControls
          teacher={{
            id: isTeacher ? authedUserId : "teacher-id",
            name: isTeacher ? authedName : "Teacher",
            isVideoOn: teacherVideo.isVideoOn,
            isAudioOn: teacherVideo.isAudioOn
          }}
          student={{
            id: !isTeacher ? authedUserId : "student-id",
            name: !isTeacher ? authedName : "Student",
            isVideoOn: studentVideo.isVideoOn,
            isAudioOn: studentVideo.isAudioOn
          }}
          connectionQuality={connectionQuality}
          onToggleTeacherVideo={() => setTeacherVideo(prev => ({ ...prev, isVideoOn: !prev.isVideoOn }))}
          onToggleTeacherAudio={() => setTeacherVideo(prev => ({ ...prev, isAudioOn: !prev.isAudioOn }))}
          onToggleStudentVideo={() => setStudentVideo(prev => ({ ...prev, isVideoOn: !prev.isVideoOn }))}
          onToggleStudentAudio={() => setStudentVideo(prev => ({ ...prev, isAudioOn: !prev.isAudioOn }))}
          isTeacher={isTeacher}
        />

        {/* Keyboard Shortcuts Modal */}
        <KeyboardShortcutsModal
          isOpen={showKeyboardShortcuts}
          onClose={() => setShowKeyboardShortcuts(false)}
        />
      </MediaProvider>
  );
}
