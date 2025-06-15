
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
  awardPoints: () => void;
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
    showRewardPopup,
    setActiveRightTab,
    setActiveCenterTab,
    awardPoints
  } = classroomState;

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-6rem)]">
      {/* Left: Video Section */}
      <div className="col-span-12 lg:col-span-3">
        <UnifiedVideoSection
          enhancedClassroom={enhancedClassroom}
          currentUser={currentUser}
          studentXP={studentXP}
          onAwardPoints={awardPoints}
          showRewardPopup={showRewardPopup}
        />
      </div>

      {/* Center: Main Content */}
      <div className="col-span-12 lg:col-span-6">
        <UnifiedCenterPanel
          activeCenterTab={activeCenterTab}
          onTabChange={setActiveCenterTab}
          currentUser={currentUser}
        />
      </div>

      {/* Right: Side Panel */}
      <div className="col-span-12 lg:col-span-3">
        <UnifiedRightPanel
          studentXP={studentXP}
          activeRightTab={activeRightTab}
          onTabChange={setActiveRightTab}
          currentUser={currentUser}
          enhancedClassroom={enhancedClassroom}
        />
      </div>
    </div>
  );
}
