
import React, { useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 h-[calc(100vh-6rem)]">
        {/* Left Panel - Enhanced with Teacher Rewards - Now visible on all screen sizes */}
        <div className="col-span-1 md:col-span-1 lg:col-span-3 animate-fade-in">
          <ScrollArea className="h-full">
            <UnifiedVideoSection
              enhancedClassroom={enhancedClassroom}
              currentUser={currentUser}
              studentXP={studentXP}
              onAwardPoints={currentUser.role === 'teacher' ? handleAwardPoints : undefined}
              showRewardPopup={showRewardPopup}
            />
          </ScrollArea>
        </div>

        {/* Center Panel - Scrollable Content */}
        <div className="col-span-1 md:col-span-2 lg:col-span-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <ScrollArea className="h-full">
            <UnifiedCenterPanel
              activeCenterTab={activeCenterTab}
              onTabChange={handleCenterTabChange}
              currentUser={currentUser}
            />
          </ScrollArea>
        </div>

        {/* Right Panel - Scrollable with Enhanced Student Progress */}
        <div className="col-span-1 md:col-span-1 lg:col-span-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <ScrollArea className="h-full">
            <UnifiedRightPanel
              studentXP={studentXP}
              activeRightTab={activeRightTab}
              onTabChange={handleRightTabChange}
              currentUser={currentUser}
              enhancedClassroom={enhancedClassroom}
            />
          </ScrollArea>
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
