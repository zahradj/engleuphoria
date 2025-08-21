
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
import { useConnectionRecovery } from "@/hooks/enhanced-classroom/useConnectionRecovery";
import { ThemeSelector } from "@/components/ui/theme-selector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Star } from "lucide-react";

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

  // Enhanced connection recovery with better error handling
  const { isRecovering, manualRetry } = useConnectionRecovery({
    isConnected: enhancedClassroom.isConnected,
    error: enhancedClassroom.error,
    onReconnect: async () => {
      try {
        console.log('🔄 Attempting classroom reconnection...');
        
        // Try to rejoin the room using available methods
        if (!enhancedClassroom.isConnected && enhancedClassroom.joinRoom) {
          await enhancedClassroom.joinRoom();
        }
        
        // Reconnect real-time sync if available
        if (enhancedClassroom.realTimeSync && !enhancedClassroom.realTimeSync.isConnected) {
          await enhancedClassroom.realTimeSync.connectToSync();
        }
        
        console.log('✅ Classroom reconnection attempt completed');
        
      } catch (error) {
        console.error('❌ Classroom reconnection failed:', error);
        throw error;
      }
    },
    maxRetries: 5,
    retryDelay: 3000
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
    syncConnected: enhancedClassroom.realTimeSync?.isConnected,
    isRecovering
  });

  // Enhanced award points function with celebrations
  const enhancedAwardPoints = (points: number, reason?: string) => {
    awardPoints(points, reason);
    showRewardNotification(points, reason);
  };

  // Show error toast but don't block the UI
  useEffect(() => {
    if (enhancedClassroom.error && !isRecovering) {
      console.warn('Classroom error detected:', enhancedClassroom.error);
      
      // Only show error toast if it's not a recoverable connection issue
      if (!enhancedClassroom.error.includes('session') && !enhancedClassroom.error.includes('connection')) {
        toast({
          title: "Classroom Warning",
          description: enhancedClassroom.error,
          variant: "destructive"
        });
      }
    }
  }, [enhancedClassroom.error, toast, isRecovering]);

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
        <div className="min-h-screen bg-background launch-ready overflow-hidden">
          {/* Clean Header */}
          <div className="h-16 bg-card border-b clean-border flex items-center justify-between px-6 professional-shadow z-50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <h1 className="font-semibold text-foreground">Live Classroom</h1>
              </div>
              {classTime && (
                <Badge variant="secondary" className="font-mono">
                  {classTime}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {currentUser.role === 'teacher' && (
                <Button
                  onClick={() => enhancedAwardPoints(10, 'Teacher recognition')}
                  size="sm"
                  variant="outline"
                  className="hover-lift smooth-transition"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Award Points
                </Button>
              )}
              <ThemeSelector />
            </div>
          </div>
          
          {isMobile ? (
            <MobileClassroomLayout
              currentUser={currentUser}
              classTime={classTime}
              videoContent={mobileVideoContent}
              chatContent={<div className="p-4 text-center text-muted-foreground">Chat feature coming soon</div>}
              whiteboardContent={<div className="p-4 text-center text-muted-foreground">Whiteboard loading...</div>}
              studentsContent={<div className="p-4 text-center text-muted-foreground">Students panel loading...</div>}
            />
          ) : (
            <div className="flex h-[calc(100vh-4rem)]">
              {/* Main Content Area */}
              <div className="flex-1 flex flex-col">
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
                  classTime={classTime}
                />
              </div>
            </div>
          )}

          {/* Celebration Overlay - Clean and Focused */}
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
    return (
      <UnifiedClassroomErrorBoundary 
        error={enhancedClassroom.error || 'An unexpected error occurred'} 
      />
    );
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
