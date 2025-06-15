
import React from "react";
import { UnifiedCenterPanel } from "./UnifiedCenterPanel";
import { UnifiedRightPanel } from "./UnifiedRightPanel";
import { UnifiedVideoSection } from "./UnifiedVideoSection";
import { UnifiedLeftSidebar } from "./UnifiedLeftSidebar";
import { useUnifiedClassroomContext } from "./UnifiedClassroomProvider";

interface ClassroomState {
  activeRightTab: string;
  activeCenterTab: string;
  studentXP: number;
  showRewardPopup: boolean;
  setActiveRightTab: (tab: string) => void;
  setActiveCenterTab: (tab: string) => void;
  awardPoints: (points: number) => void;
}

interface UnifiedClassroomContentProps {
  classroomState: ClassroomState;
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
    setActiveRightTab,
    setActiveCenterTab,
    awardPoints
  } = classroomState;

  // Enhanced award points function that accepts optional reason
  const handleAwardPoints = (points: number, reason?: string) => {
    console.log(`Awarding ${points} points to student${reason ? ` for: ${reason}` : ''}`);
    awardPoints(points);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 pb-4">
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-6rem)]">
        
        {/* Left Section - Teacher Video + Reward System/Progress Panels */}
        <div className="col-span-3 flex flex-col gap-4">
          {/* Teacher Video Section - Fixed height for consistency */}
          <div className="h-[300px]">
            <UnifiedVideoSection currentUser={currentUser} />
          </div>
          
          {/* Bottom Left Panels - Reward System for Teachers, Progress for Students */}
          <div className="flex-1">
            <UnifiedLeftSidebar 
              studentXP={studentXP}
              currentUser={currentUser}
              onAwardPoints={currentUser.role === 'teacher' ? handleAwardPoints : undefined}
            />
          </div>
        </div>

        {/* Center Panel - Main Content (Whiteboard, Activities, etc.) */}
        <div className="col-span-6">
          <UnifiedCenterPanel
            activeCenterTab={activeCenterTab}
            onTabChange={setActiveCenterTab}
            currentUser={currentUser}
          />
        </div>

        {/* Right Panel - Student Video + Student Info & Chat */}
        <div className="col-span-3">
          <UnifiedRightPanel
            studentName="Emma"
            studentXP={studentXP}
            activeRightTab={activeRightTab}
            onTabChange={setActiveRightTab}
            currentUser={currentUser}
          />
        </div>
      </div>
    </div>
  );
}
