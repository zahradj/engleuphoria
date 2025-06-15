
import React, { useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { UnifiedVideoSection } from "./UnifiedVideoSection";
import { UnifiedCenterPanel } from "./UnifiedCenterPanel";
import { UnifiedRightPanel } from "./UnifiedRightPanel";
import { OneOnOneRewardPopup } from "@/components/classroom/oneonone/OneOnOneRewardPopup";
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

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-6rem)]">
        {/* Left Panel - Fixed Height with Internal Scroll */}
        <div className="lg:col-span-3 animate-fade-in h-full">
          <div className="h-full overflow-hidden">
            <UnifiedVideoSection
              enhancedClassroom={enhancedClassroom}
              currentUser={currentUser}
              studentXP={studentXP}
              onAwardPoints={currentUser.role === 'teacher' ? handleAwardPoints : undefined}
              showRewardPopup={showRewardPopup}
            />
          </div>
        </div>

        {/* Center Panel - Independent Scrolling */}
        <div className="lg:col-span-6 animate-fade-in h-full" style={{ animationDelay: '0.1s' }}>
          <div className="h-full overflow-hidden">
            <UnifiedCenterPanel
              activeCenterTab={activeCenterTab}
              onTabChange={handleCenterTabChange}
              currentUser={currentUser}
            />
          </div>
        </div>

        {/* Right Panel - Fixed Height with Internal Scroll */}
        <div className="lg:col-span-3 animate-fade-in h-full" style={{ animationDelay: '0.2s' }}>
          <div className="h-full overflow-hidden">
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
    </>
  );
}
