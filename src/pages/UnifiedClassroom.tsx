
import React, { useEffect } from "react";
import { useEnhancedClassroom } from "@/hooks/useEnhancedClassroom";
import { useOneOnOneClassroom } from "@/hooks/useOneOnOneClassroom";
import { useToast } from "@/hooks/use-toast";
import { UnifiedClassroomProvider, useUnifiedClassroomContext } from "@/components/classroom/unified/UnifiedClassroomProvider";
import { UnifiedClassroomLayout } from "@/components/classroom/unified/UnifiedClassroomLayout";
import { UnifiedClassroomContent } from "@/components/classroom/unified/UnifiedClassroomContent";
import { UnifiedClassroomErrorBoundary } from "@/components/classroom/unified/UnifiedClassroomErrorBoundary";
import { Lesson, User } from "@/services/classroomDatabase";
import { UnifiedUser, getDisplayName } from "@/types/user";

interface UnifiedClassroomProps {
  lesson?: Lesson;
  userRole?: 'teacher' | 'student';
  currentUser?: User;
}

function UnifiedClassroomInner({ lesson, userRole, currentUser: propCurrentUser }: UnifiedClassroomProps) {
  console.log("UnifiedClassroom component is rendering");
  
  const { toast } = useToast();
  const { currentUser: contextCurrentUser, finalRoomId } = useUnifiedClassroomContext();
  
  // Convert to unified user type and use prop currentUser if provided, otherwise fall back to context
  const currentUser: UnifiedUser = propCurrentUser ? {
    id: propCurrentUser.id,
    full_name: propCurrentUser.full_name,
    email: propCurrentUser.email,
    role: propCurrentUser.role,
    avatar_url: propCurrentUser.avatar_id ? `/avatars/avatar-${propCurrentUser.avatar_id}.svg` : undefined
  } : {
    id: contextCurrentUser.id,
    name: contextCurrentUser.name,
    role: contextCurrentUser.role,
    avatar: contextCurrentUser.avatar
  };
  
  // Use lesson's room_id if provided, otherwise fall back to context
  const roomId = lesson?.room_id || finalRoomId;
  
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

  // Get display name using helper function
  const displayName = getDisplayName(currentUser);

  // Enhanced classroom with real-time features
  const enhancedClassroom = useEnhancedClassroom({
    roomId,
    userId: currentUser.id,
    displayName,
    userRole: userRole || currentUser.role
  });

  console.log("Enhanced unified classroom state:", {
    isConnected: enhancedClassroom.isConnected,
    isMuted: enhancedClassroom.isMuted,
    isCameraOff: enhancedClassroom.isCameraOff,
    hasLocalStream: !!enhancedClassroom.localStream,
    participantsCount: enhancedClassroom.participants.length,
    userRole: userRole || currentUser.role,
    roomId,
    error: enhancedClassroom.error,
    hasSession: !!enhancedClassroom.session,
    syncConnected: enhancedClassroom.realTimeSync?.isConnected
  });

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
            awardPoints
          }}
          enhancedClassroom={enhancedClassroom}
        />
      </UnifiedClassroomLayout>
    );
  } catch (error) {
    console.error("Error rendering UnifiedClassroom:", error);
    return <UnifiedClassroomErrorBoundary error={enhancedClassroom.error} />;
  }
}

const UnifiedClassroom = (props: UnifiedClassroomProps = {}) => {
  return (
    <UnifiedClassroomProvider>
      <UnifiedClassroomInner {...props} />
    </UnifiedClassroomProvider>
  );
};

export default UnifiedClassroom;
