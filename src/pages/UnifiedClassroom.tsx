
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useEnhancedClassroom } from "@/hooks/useEnhancedClassroom";
import { useOneOnOneClassroom } from "@/hooks/useOneOnOneClassroom";
import { UnifiedTopBar } from "@/components/classroom/unified/UnifiedTopBar";
import { UnifiedVideoSection } from "@/components/classroom/unified/UnifiedVideoSection";
import { UnifiedCenterPanel } from "@/components/classroom/unified/UnifiedCenterPanel";
import { UnifiedRightPanel } from "@/components/classroom/unified/UnifiedRightPanel";
import { OneOnOneRewardPopup } from "@/components/classroom/oneonone/OneOnOneRewardPopup";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, Wifi, WifiOff, Clock, Sparkles } from "lucide-react";

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
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  
  // Enhanced role parameter extraction with debugging and persistence
  const currentUser = useMemo<UserProfile>(() => {
    const roleParam = searchParams.get('role');
    const nameParam = searchParams.get('name');
    const userIdParam = searchParams.get('userId');
    
    console.log('🔍 URL Parameters Debug:', {
      roleParam,
      nameParam,
      userIdParam,
      fullSearchParams: Object.fromEntries(searchParams.entries()),
      currentUrl: window.location.href
    });

    // Check session storage for persisted role
    const persistedRole = sessionStorage.getItem('classroom-user-role') as 'teacher' | 'student' | null;
    const persistedName = sessionStorage.getItem('classroom-user-name');
    const persistedUserId = sessionStorage.getItem('classroom-user-id');

    // Determine final role with fallback logic
    const finalRole = roleParam as 'teacher' | 'student' || persistedRole || 'student';
    const finalName = nameParam || persistedName || (finalRole === 'teacher' ? 'Teacher' : 'Student');
    const finalUserId = userIdParam || persistedUserId || `user-${Date.now()}`;

    console.log('👤 User Role Resolution:', {
      fromUrl: roleParam,
      fromStorage: persistedRole,
      finalRole,
      finalName,
      finalUserId
    });

    // Persist to session storage
    sessionStorage.setItem('classroom-user-role', finalRole);
    sessionStorage.setItem('classroom-user-name', finalName);
    sessionStorage.setItem('classroom-user-id', finalUserId);

    return {
      id: finalUserId,
      name: finalName,
      role: finalRole
    };
  }, [searchParams]);

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

  // Enhanced classroom with real-time features
  const enhancedClassroom = useEnhancedClassroom({
    roomId: finalRoomId,
    userId: currentUser.id,
    displayName: currentUser.name,
    userRole: currentUser.role
  });

  // Memoize tab change handlers to prevent recreating functions
  const handleRightTabChange = useCallback((tab: string) => {
    setActiveRightTab(tab);
  }, [setActiveRightTab]);

  const handleCenterTabChange = useCallback((tab: string) => {
    setActiveCenterTab(tab);
    enhancedClassroom.realTimeSync?.syncActiveTab(tab);
  }, [setActiveCenterTab, enhancedClassroom.realTimeSync]);

  const handleAwardPoints = useCallback(() => {
    if (currentUser.role === 'teacher') {
      awardPoints();
    }
  }, [currentUser.role, awardPoints]);

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

  // Show enhanced welcome message only once
  useEffect(() => {
    if (!hasShownWelcome && currentUser.role) {
      const welcomeMessage = currentUser.role === 'teacher' 
        ? `Welcome to the enhanced classroom, ${currentUser.name}! You have full teaching controls and session management.`
        : `Welcome to the enhanced classroom, ${currentUser.name}! Enjoy the interactive learning experience.`;
      
      toast({
        title: `${currentUser.role === 'teacher' ? '👩‍🏫' : '👨‍🎓'} Enhanced ${currentUser.role === 'teacher' ? 'Teacher' : 'Student'} Mode`,
        description: welcomeMessage,
      });
      
      setHasShownWelcome(true);
    }
  }, [currentUser.role, currentUser.name, toast, hasShownWelcome]);

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

  // Calculate connection progress for loading state
  const connectionProgress = useMemo(() => {
    if (enhancedClassroom.isConnected) return 100;
    if (enhancedClassroom.session) return 75;
    if (enhancedClassroom.localStream) return 50;
    return 25;
  }, [enhancedClassroom.isConnected, enhancedClassroom.session, enhancedClassroom.localStream]);

  try {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Enhanced Connection Status Bar */}
        {!enhancedClassroom.isConnected && (
          <div className="bg-blue-600 text-white p-2">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span className="text-sm font-medium">Connecting to Enhanced Classroom...</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={connectionProgress} className="w-24 h-2" />
                <span className="text-xs">{connectionProgress}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Top Bar without status badges */}
        <div className="h-20 flex-shrink-0 p-4">
          <Card className="p-4 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <UnifiedTopBar
                classTime={classTime}
                currentUser={currentUser}
                enhancedClassroom={enhancedClassroom}
                roomId={finalRoomId}
              />
              
              {/* Removed all status indicators/badges */}
            </div>
          </Card>
        </div>

        {/* Main Enhanced Classroom Layout */}
        <div className="min-h-[calc(100vh-5rem)] px-4 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
            
            {/* Left Panel - Enhanced Video Section with Animations */}
            <div className="lg:col-span-3 min-h-[500px] animate-fade-in">
              <UnifiedVideoSection
                enhancedClassroom={enhancedClassroom}
                currentUser={currentUser}
                studentXP={studentXP}
                onAwardPoints={currentUser.role === 'teacher' ? handleAwardPoints : undefined}
                showRewardPopup={showRewardPopup}
              />
            </div>

            {/* Center Panel - Synchronized Interactive Content */}
            <div className="lg:col-span-6 min-h-[500px] animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <UnifiedCenterPanel
                activeCenterTab={activeCenterTab}
                onTabChange={handleCenterTabChange}
                currentUser={currentUser}
              />
            </div>

            {/* Right Panel - Enhanced Communication & Tools */}
            <div className="lg:col-span-3 min-h-[500px] animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <UnifiedRightPanel
                studentXP={studentXP}
                activeRightTab={activeRightTab}
                onTabChange={handleRightTabChange}
                currentUser={currentUser}
                enhancedClassroom={enhancedClassroom}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Success Indicator */}
        {enhancedClassroom.isConnected && enhancedClassroom.realTimeSync?.isConnected && (
          <div className="fixed bottom-4 right-4 z-50">
            <Badge className="bg-green-500 text-white animate-pulse shadow-lg">
              <Sparkles size={12} className="mr-1" />
              Enhanced Classroom Active
            </Badge>
          </div>
        )}

        {/* Enhanced Reward Popup - Teacher Only */}
        {currentUser.role === 'teacher' && (
          <OneOnOneRewardPopup isVisible={showRewardPopup} />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error rendering UnifiedClassroom:", error);
    return (
      <div className="min-h-screen bg-red-50 p-4 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Enhanced Classroom Error</h1>
          <p className="text-red-600 mb-4">There was an error loading the enhanced classroom. Please check your camera and microphone permissions.</p>
          <div className="text-sm text-gray-600 mb-4">
            <p>Room: {finalRoomId}</p>
            <p>Role: {currentUser.role}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Enhanced Classroom
          </button>
        </Card>
      </div>
    );
  }
};

export default UnifiedClassroom;
