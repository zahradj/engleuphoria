
import React, { useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { UnifiedVideoSection } from "./UnifiedVideoSection";
import { UnifiedCenterPanel } from "./UnifiedCenterPanel";
import { UnifiedRightPanel } from "./UnifiedRightPanel";
import { OneOnOneRewardPopup } from "@/components/classroom/oneonone/OneOnOneRewardPopup";
import { EnhancedSessionManager } from "../enhanced/EnhancedSessionManager";
import { useUnifiedClassroomContext } from "./UnifiedClassroomProvider";

interface UnifiedClassroomContentProps {
  classroomState: {
    activeRightTab: string;
    activeCenterTab: string;
    studentXP: number;
    showRewardPopup: boolean;
    setActiveRightTab: (tab: string) => void;
    setActiveCenterTab: (tab: string) => void;
    awardPoints: () => void;
  };
  enhancedClassroom: any;
}

export function UnifiedClassroomContent({ 
  classroomState, 
  enhancedClassroom 
}: UnifiedClassroomContentProps) {
  const { currentUser } = useUnifiedClassroomContext();
  
  const {
    activeRightTab,
    activeCenterTab,
    studentXP,
    showRewardPopup,
    setActiveRightTab,
    setActiveCenterTab,
    awardPoints
  } = classroomState;

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

  const handleSessionEnd = useCallback((sessionData: any) => {
    console.log('Session ended:', sessionData);
    // Could integrate with analytics or reporting system
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Panel - Video Section with Session Manager */}
        <div className="xl:col-span-3 space-y-4">
          <UnifiedVideoSection
            enhancedClassroom={enhancedClassroom}
            currentUser={currentUser}
            studentXP={studentXP}
            onAwardPoints={currentUser.role === 'teacher' ? handleAwardPoints : undefined}
            showRewardPopup={showRewardPopup}
          />
          
          {/* Session Manager */}
          <EnhancedSessionManager
            currentUser={currentUser}
            enhancedClassroom={enhancedClassroom}
            onSessionEnd={handleSessionEnd}
          />
        </div>

        {/* Center Panel */}
        <div className="xl:col-span-6">
          <UnifiedCenterPanel
            activeCenterTab={activeCenterTab}
            onTabChange={handleCenterTabChange}
            currentUser={currentUser}
          />
        </div>

        {/* Right Panel */}
        <div className="xl:col-span-3">
          <UnifiedRightPanel
            studentXP={studentXP}
            activeRightTab={activeRightTab}
            onTabChange={handleRightTabChange}
            currentUser={currentUser}
            enhancedClassroom={enhancedClassroom}
          />
        </div>
      </div>

      {/* Success Indicator */}
      {enhancedClassroom.isConnected && enhancedClassroom.realTimeSync?.isConnected && (
        <div className="fixed bottom-4 right-4 z-50">
          <Badge className="bg-green-500 text-white shadow-lg">
            <Sparkles size={12} className="mr-1" />
            Enhanced Classroom Active
          </Badge>
        </div>
      )}

      {/* Connection Status */}
      {!enhancedClassroom.isConnected && (
        <div className="fixed bottom-4 left-4 z-50">
          <Badge variant="destructive" className="shadow-lg">
            Connecting to classroom...
          </Badge>
        </div>
      )}

      {/* Reward Popup - Teacher Only */}
      {currentUser.role === 'teacher' && (
        <OneOnOneRewardPopup isVisible={showRewardPopup} />
      )}
    </>
  );
}
