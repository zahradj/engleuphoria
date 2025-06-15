
import React from "react";
import { UnifiedCenterPanel } from "./UnifiedCenterPanel";
import { UnifiedRightPanel } from "./UnifiedRightPanel";
import { UnifiedVideoSection } from "./UnifiedVideoSection";
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
    setActiveCenterTab
  } = classroomState;

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[600px]">
        
        {/* Left Panel - Video Section */}
        <div className="lg:col-span-3 min-h-[500px]">
          <UnifiedVideoSection currentUser={currentUser} />
        </div>

        {/* Center Panel - Interactive Content */}
        <div className="lg:col-span-6 min-h-[500px]">
          <UnifiedCenterPanel
            activeCenterTab={activeCenterTab}
            onTabChange={setActiveCenterTab}
          />
        </div>

        {/* Right Panel - Student Info & Interactions */}
        <div className="lg:col-span-3 min-h-[500px]">
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
