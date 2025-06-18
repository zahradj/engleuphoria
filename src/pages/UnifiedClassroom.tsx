
import React, { useEffect } from "react";
import { useEnhancedClassroom } from "@/hooks/useEnhancedClassroom";
import { useOneOnOneClassroom } from "@/hooks/useOneOnOneClassroom";
import { useToast } from "@/hooks/use-toast";
import { MediaProvider } from "@/components/classroom/oneonone/video/MediaContext";
import { UnifiedClassroomProvider, useUnifiedClassroomContext } from "@/components/classroom/unified/UnifiedClassroomProvider";
import { UnifiedClassroomLayout } from "@/components/classroom/unified/UnifiedClassroomLayout";
import { UnifiedClassroomContent } from "@/components/classroom/unified/UnifiedClassroomContent";
import { UnifiedClassroomErrorBoundary } from "@/components/classroom/unified/UnifiedClassroomErrorBoundary";
import { CelebrationOverlay } from "@/components/classroom/rewards/CelebrationOverlay";
import { useRewardNotifications } from "@/hooks/classroom/useRewardNotifications";

function UnifiedClassroomInner() {
  console.log("UnifiedClassroom component is rendering");
  
  const { toast } = useToast();
  const { currentUser, finalRoomId } = useUnifiedClassroomContext();
  
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

  try {
    return (
      <MediaProvider roomId={finalRoomId}>
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

        {/* Celebration Overlay - Full screen center */}
        {celebration && (
          <CelebrationOverlay
            isVisible={celebration.isVisible}
            points={celebration.points}
            reason={celebration.reason}
            onComplete={hideCelebration}
          />
        )}
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
