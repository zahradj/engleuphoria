
import React, { useEffect } from "react";
import { useEnhancedClassroom } from "@/hooks/useEnhancedClassroom";
import { useOneOnOneClassroom } from "@/hooks/useOneOnOneClassroom";
import { useToast } from "@/hooks/use-toast";
import { MediaProvider } from "@/components/classroom/oneonone/video/MediaContext";
import { UnifiedClassroomProvider, useUnifiedClassroomContext } from "@/components/classroom/unified/UnifiedClassroomProvider";
import { UnifiedClassroomLayout } from "@/components/classroom/unified/UnifiedClassroomLayout";
import { UnifiedClassroomContent } from "@/components/classroom/unified/UnifiedClassroomContent";
import { UnifiedClassroomErrorBoundary } from "@/components/classroom/unified/UnifiedClassroomErrorBoundary";
import { MobileClassroomLayout } from "@/components/classroom/mobile/MobileClassroomLayout";
import { MobileVideoPanel } from "@/components/classroom/mobile/MobileVideoPanel";
import { CelebrationOverlay } from "@/components/classroom/rewards/CelebrationOverlay";
import { useRewardNotifications } from "@/hooks/classroom/useRewardNotifications";
import { useIsMobile } from "@/hooks/use-mobile";

function UnifiedClassroomInner() {
  console.log("UnifiedClassroom component is rendering");
  
  const { toast } = useToast();
  const { currentUser, finalRoomId } = useUnifiedClassroomContext();
  const isMobile = useIsMobile();
  
  const classroomState = useOneOnOneClassroom();
  const {
    classTime,
    activeRightTab,
    activeCenterTab,
    studentXP,
    studentLevel,
    showRewardPopup,
    setActiveRightTab,
    setActiveCenterTab,
    awardPoints
  } = classroomState;

  // Add reward notifications for celebrations
  const { 
    showRewardNotification, 
    celebration, 
    hideCelebration 
  } = useRewardNotifications();

  // Enhanced classroom with real-time features
  const enhancedClassroom = useEnhancedClassroom({
    roomId: finalRoomId,
    userId: currentUser.id,
    displayName: currentUser.name,
    userRole: currentUser.role
  });

  console.log("Enhanced unified classroom state:", {
    isConnected: enhancedClassroom.isConnected,
    isMuted: enhancedClassroom.isMuted,
    isCameraOff: enhancedClassroom.isCameraOff,
    hasLocalStream: !!enhancedClassroom.localStream,
    participantsCount: enhancedClassroom.participants.length,
    userRole: currentUser.role,
    roomId: finalRoomId,
    error: enhancedClassroom.error,
    hasSession: !!enhancedClassroom.session,
    syncConnected: enhancedClassroom.realTimeSync?.isConnected
  });

  // Enhanced award points function with celebrations
  const enhancedAwardPoints = (points: number, reason?: string) => {
    awardPoints(points, reason);
    showRewardNotification(points, reason);
  };

  // Show error if there are issues
  useEffect(() => {
    if (enhancedClassroom.error) {
      toast({
        title: "Connection Issue",
        description: enhancedClassroom.error,
        variant: "destructive"
      });
    }
  }, [enhancedClassroom.error, toast]);

  // Mobile video component
  const mobileVideoContent = (
    <MobileVideoPanel
      currentUser={currentUser}
      stream={enhancedClassroom.localStream}
      isConnected={enhancedClassroom.isConnected}
      isMuted={enhancedClassroom.isMuted}
      isCameraOff={enhancedClassroom.isCameraOff}
      onToggleMicrophone={() => enhancedClassroom.toggleMicrophone()}
      onToggleCamera={() => enhancedClassroom.toggleCamera()}
      onLeaveCall={() => enhancedClassroom.leaveRoom()}
      isExpanded={true}
    />
  );

  try {
    return (
      <MediaProvider roomId={finalRoomId}>
        <div className="min-h-screen overflow-hidden">
          {isMobile ? (
            <MobileClassroomLayout
              currentUser={currentUser}
              classTime={classTime}
              videoContent={mobileVideoContent}
              chatContent={<div className="p-4 text-center text-gray-500">Chat coming soon</div>}
              whiteboardContent={<div className="p-4 text-center text-gray-500">Whiteboard coming soon</div>}
              studentsContent={<div className="p-4 text-center text-gray-500">Students panel coming soon</div>}
            />
          ) : (
            <UnifiedClassroomLayout 
              classTime={classTime} 
              enhancedClassroom={enhancedClassroom}
            >
              <UnifiedClassroomContent 
                classroomState={{
                  activeRightTab,
                  activeCenterTab,
                  studentXP,
                  showRewardPopup,
                  setActiveRightTab,
                  setActiveCenterTab,
                  awardPoints: enhancedAwardPoints
                }}
                enhancedClassroom={enhancedClassroom}
              />
            </UnifiedClassroomLayout>
          )}

          {/* Celebration Overlay - Full screen center */}
          {celebration && (
            <CelebrationOverlay
              isVisible={celebration.isVisible}
              points={celebration.points}
              reason={celebration.reason}
              onComplete={hideCelebration}
            />
          )}
        </div>
      </MediaProvider>
    );
  } catch (error) {
    console.error("Error rendering UnifiedClassroom:", error);
    return <UnifiedClassroomErrorBoundary error={enhancedClassroom.error} />;
  }
}

const UnifiedClassroom = () => {
  return (
    <UnifiedClassroomProvider>
      <UnifiedClassroomInner />
    </UnifiedClassroomProvider>
  );
};

export default UnifiedClassroom;
