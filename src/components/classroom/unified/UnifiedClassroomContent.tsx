
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
  awardPoints: (points: number, reason?: string) => void;
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

  return (
    <div className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] px-2 sm:px-4 pb-2 sm:pb-4">
      {/* Mobile Layout - Stack vertically */}
      <div className="block lg:hidden space-y-4">
        {/* Video Section */}
        <div className="h-48 sm:h-64">
          <UnifiedVideoSection currentUser={currentUser} />
        </div>
        
        {/* Center Panel - Main Content */}
        <div className="h-96 sm:h-[32rem]">
          <UnifiedCenterPanel
            activeCenterTab={activeCenterTab}
            onTabChange={setActiveCenterTab}
            currentUser={currentUser}
          />
        </div>

        {/* Right Panel Content - Student Info & Chat */}
        <div className="h-80 sm:h-96">
          <UnifiedRightPanel
            studentName="Emma"
            studentXP={studentXP}
            activeRightTab={activeRightTab}
            onTabChange={setActiveRightTab}
            currentUser={currentUser}
          />
        </div>

        {/* Left Sidebar Content - Progress/Rewards */}
        <div className="h-64 sm:h-80">
          <UnifiedLeftSidebar 
            studentXP={studentXP}
            currentUser={currentUser}
            onAwardPoints={currentUser.role === 'teacher' ? awardPoints : undefined}
          />
        </div>
      </div>

      {/* Desktop Layout - Grid */}
      <div className="hidden lg:grid grid-cols-12 gap-4 h-[calc(100vh-6rem)]">
        {/* Left Section - Current User's Video + Role-based Panels */}
        <div className="col-span-3 flex flex-col gap-4 min-h-0">
          {/* Current User's Video Section */}
          <div className="h-[300px] flex-shrink-0">
            <UnifiedVideoSection currentUser={currentUser} />
          </div>
          
          {/* Bottom Left Panels - Role-based functionality */}
          <div className="flex-1 min-h-0">
            <UnifiedLeftSidebar 
              studentXP={studentXP}
              currentUser={currentUser}
              onAwardPoints={currentUser.role === 'teacher' ? awardPoints : undefined}
            />
          </div>
        </div>

        {/* Center Panel - Main Content (Whiteboard, Activities, etc.) */}
        <div className="col-span-6 min-h-0">
          <UnifiedCenterPanel
            activeCenterTab={activeCenterTab}
            onTabChange={setActiveCenterTab}
            currentUser={currentUser}
          />
        </div>

        {/* Right Panel - Chat & Student Management */}
        <div className="col-span-3 min-h-0">
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
