
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
import { TopLevelBar } from "@/components/classroom/gamification/TopLevelBar";
import { EnhancedWhiteboard } from "@/components/classroom/modern/EnhancedWhiteboard";
import { ModernRewardsPanel } from "@/components/classroom/modern/ModernRewardsPanel";
import { ModernChatPanel } from "@/components/classroom/modern/ModernChatPanel";
import { ModernDictionaryPanel } from "@/components/classroom/modern/ModernDictionaryPanel";
import { ModernLessonSlidesPanel } from "@/components/classroom/modern/ModernLessonSlidesPanel";
import { KeyboardShortcutsModal } from "@/components/classroom/modern/KeyboardShortcutsModal";
import { EnhancedConfetti, LevelUpAnimation, BadgeReveal } from "@/components/classroom/modern/EnhancedConfetti";
import { RewardToast } from "@/components/classroom/modern/RewardToast";
import { CelebrationOverlay } from "@/components/classroom/rewards/CelebrationOverlay";
import { UnifiedRightSidebar } from "@/components/classroom/unified/UnifiedRightSidebar";
import { soundEffectsService } from "@/services/soundEffectsService";
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
    awardPoints,
    celebration,
    hideCelebration
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
    awardPoints(xpAmount, "Great work!");
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
        {/* Top Level Progress Bar */}
        <TopLevelBar 
          currentXP={studentXP}
          maxXP={100}
          level={Math.floor(studentXP / 100)}
          starCount={starCount}
        />

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
            <UnifiedRightSidebar
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
              onToggleTeacherVideo={() => {
                soundEffectsService.playButtonClick();
                setTeacherVideo(prev => ({ ...prev, isVideoOn: !prev.isVideoOn }));
              }}
              onToggleTeacherAudio={() => {
                soundEffectsService.playButtonClick();
                setTeacherVideo(prev => ({ ...prev, isAudioOn: !prev.isAudioOn }));
              }}
              onToggleStudentVideo={() => {
                soundEffectsService.playButtonClick();
                setStudentVideo(prev => ({ ...prev, isVideoOn: !prev.isVideoOn }));
              }}
              onToggleStudentAudio={() => {
                soundEffectsService.playButtonClick();
                setStudentVideo(prev => ({ ...prev, isAudioOn: !prev.isAudioOn }));
              }}
              activeTab={activeView}
              onTabChange={setActiveView}
              roomId={roomId}
              currentUser={{
                id: authedUserId,
                name: authedName,
                role: authedRole === 'admin' ? 'teacher' : authedRole
              }}
              currentXP={currentXP}
              nextLevelXP={nextLevelXP}
              level={level}
              badges={badges}
              recentAchievements={recentAchievements}
              starCount={starCount}
              isTeacher={isTeacher}
              onAwardStar={handleTestReward}
              onAddToVocab={(word, definition) => {
                soundEffectsService.playCorrect();
                toast.success(`Added "${word}" to vocabulary`);
                addXP(5, "Added new word to vocabulary");
              }}
              unreadChatCount={unreadChatCount}
            />
          }
          bottomToolbar={
            <QuickAccessToolbar
              onWhiteboardClick={() => {
                soundEffectsService.playButtonClick();
                setActiveView("whiteboard");
                toast.success("Whiteboard activated");
              }}
              onSlidesClick={() => {
                soundEffectsService.playButtonClick();
                setActiveView("slides");
                toast.success("Lesson slides opened");
              }}
              onChatClick={() => {
                soundEffectsService.playButtonClick();
                setActiveView("chat");
                clearUnreadChat();
                toast.success("Chat opened");
              }}
              onDictionaryClick={() => {
                soundEffectsService.playButtonClick();
                setActiveView("dictionary");
                toast.success("Dictionary opened");
              }}
              onRewardsClick={() => {
                soundEffectsService.playButtonClick();
                setActiveView("rewards");
                toast.success("Rewards panel opened");
              }}
              onEmbedClick={() => {
                soundEffectsService.playButtonClick();
                setActiveView("embed");
                toast.info("Embed feature coming soon");
              }}
              onSettingsClick={() => {
                soundEffectsService.playButtonClick();
                toast.info("Settings coming soon");
              }}
              unreadChatCount={unreadChatCount}
              activeView={activeView}
            />
          }
          showLeftPanel={showLeftPanel}
          showRightSidebar={showRightSidebar}
        />

        {/* Center-Screen Celebration Overlay - Game-like! */}
        {celebration && (
          <CelebrationOverlay
            isVisible={celebration.isVisible}
            points={celebration.points}
            reason={celebration.reason}
            onComplete={hideCelebration}
            duration={2500}
          />
        )}

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

        {/* Keyboard Shortcuts Modal */}
        <KeyboardShortcutsModal
          isOpen={showKeyboardShortcuts}
          onClose={() => setShowKeyboardShortcuts(false)}
        />
      </MediaProvider>
  );
}
