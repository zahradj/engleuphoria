import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useEnhancedClassroom } from "@/hooks/useEnhancedClassroom";
import { useOneOnOneClassroom } from "@/hooks/useOneOnOneClassroom";
import { UnifiedTopBar } from "@/components/classroom/unified/UnifiedTopBar";
import { UnifiedVideoSection } from "@/components/classroom/unified/UnifiedVideoSection";
import { UnifiedCenterPanel } from "@/components/classroom/unified/UnifiedCenterPanel";
import { UnifiedRightPanel } from "@/components/classroom/unified/UnifiedRightPanel";
import { OneOnOneRewardPopup } from "@/components/classroom/oneonone/OneOnOneRewardPopup";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  avatar?: string;
}

const UnifiedClassroom = () => {
  console.log("UnifiedClassroom component is rendering");
  
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Get user info from URL params or localStorage (in real app, this would come from auth)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const roleParam = searchParams.get('role');
    const nameParam = searchParams.get('name');
    const userIdParam = searchParams.get('userId');
    
    return {
      id: userIdParam || `user-${Date.now()}`,
      name: nameParam || (roleParam === 'teacher' ? 'Teacher' : 'Student'),
      role: (roleParam as 'teacher' | 'student') || 'student'
    };
  });

  const finalRoomId = roomId || "unified-classroom-1";
  
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
  } = useOneOnOneClassroom();

  // Single source of truth for enhanced classroom state
  const enhancedClassroom = useEnhancedClassroom({
    roomId: finalRoomId,
    userId: currentUser.id,
    displayName: currentUser.name,
    userRole: currentUser.role
  });

  console.log("Unified classroom state:", {
    isConnected: enhancedClassroom.isConnected,
    isMuted: enhancedClassroom.isMuted,
    isCameraOff: enhancedClassroom.isCameraOff,
    hasLocalStream: !!enhancedClassroom.localStream,
    participantsCount: enhancedClassroom.participants.length,
    userRole: currentUser.role,
    roomId: finalRoomId,
    error: enhancedClassroom.error
  });

  // Show welcome message based on role
  useEffect(() => {
    const welcomeMessage = currentUser.role === 'teacher' 
      ? `Welcome to the unified classroom, ${currentUser.name}! You have full teaching controls.`
      : `Welcome to the unified classroom, ${currentUser.name}! Your teacher will join shortly.`;
    
    toast({
      title: `${currentUser.role === 'teacher' ? '👩‍🏫' : '👨‍🎓'} ${currentUser.role === 'teacher' ? 'Teacher' : 'Student'} Mode`,
      description: welcomeMessage,
    });
  }, [currentUser.role, currentUser.name, toast]);

  // Show error if media access fails
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        {/* Unified Top Bar with Role-Based Controls */}
        <div className="h-20 flex-shrink-0 p-4">
          <UnifiedTopBar
            classTime={classTime}
            currentUser={currentUser}
            enhancedClassroom={enhancedClassroom}
            roomId={finalRoomId}
          />
        </div>

        {/* Main Classroom Layout */}
        <div className="min-h-[calc(100vh-5rem)] px-4 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[600px]">
            
            {/* Left Panel - Video Section with Role-Based Tools */}
            <div className="lg:col-span-3 min-h-[500px]">
              <UnifiedVideoSection
                enhancedClassroom={enhancedClassroom}
                currentUser={currentUser}
                studentXP={studentXP}
                onAwardPoints={currentUser.role === 'teacher' ? awardPoints : undefined}
                showRewardPopup={showRewardPopup}
              />
            </div>

            {/* Center Panel - Interactive Content */}
            <div className="lg:col-span-6 min-h-[500px]">
              <UnifiedCenterPanel
                activeCenterTab={activeCenterTab}
                onTabChange={setActiveCenterTab}
                currentUser={currentUser}
              />
            </div>

            {/* Right Panel - Communication & Tools */}
            <div className="lg:col-span-3 min-h-[500px]">
              <UnifiedRightPanel
                studentXP={studentXP}
                activeRightTab={activeRightTab}
                onTabChange={setActiveRightTab}
                currentUser={currentUser}
                enhancedClassroom={enhancedClassroom}
              />
            </div>
          </div>
        </div>

        {/* Floating Reward Popup - Teacher Only */}
        {currentUser.role === 'teacher' && (
          <OneOnOneRewardPopup isVisible={showRewardPopup} />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error rendering UnifiedClassroom:", error);
    return (
      <div className="min-h-screen bg-red-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Classroom Loading Error</h1>
          <p className="text-red-600">There was an error loading the classroom. Please check your camera and microphone permissions.</p>
          <p className="text-sm text-gray-600 mt-2">Room: {finalRoomId} | Role: {currentUser.role}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Classroom
          </button>
        </div>
      </div>
    );
  }
};

export default UnifiedClassroom;
