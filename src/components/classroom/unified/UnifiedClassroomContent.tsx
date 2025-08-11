
import React, { useState } from "react";
import { UnifiedCenterPanel } from "./UnifiedCenterPanel";
// Removed panel-heavy imports to focus on minimalist layout
import { useUnifiedClassroomContext } from "./UnifiedClassroomProvider";
import { MinimalSidebar, MinimalTool } from "./minimal/MinimalSidebar";
import { ToolOverlay } from "./minimal/ToolOverlay";
import { FloatingVideos } from "./minimal/FloatingVideos";
import { ClassroomChat } from "@/components/classroom/ClassroomChat";
import { SpinningWheelGame } from "@/components/classroom/oneonone/games/SpinningWheelGame";

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
  classTime: number;
}

export function UnifiedClassroomContent({ 
  classroomState, 
  enhancedClassroom,
  classTime
}: UnifiedClassroomContentProps) {
  const { currentUser } = useUnifiedClassroomContext();
  const isTeacher = currentUser.role === 'teacher';
  const teacherName = isTeacher ? currentUser.name : "Teacher";
  const studentName = !isTeacher ? currentUser.name : "Student";

  const {
    activeRightTab,
    activeCenterTab,
    studentXP,
    setActiveRightTab,
    setActiveCenterTab,
    awardPoints
  } = classroomState;

  const [openTool, setOpenTool] = useState<MinimalTool | null>(null);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

return (
    <div className="relative">
      {/* Floating videos */}
      <FloatingVideos
        localStream={enhancedClassroom?.localStream || null}
        remoteStream={null}
        isTeacher={isTeacher}
        isCameraOff={enhancedClassroom?.isCameraOff}
        teacherName={teacherName}
        studentName={studentName}
      />

      {/* Minimal collapsible sidebar with tools */}
      <MinimalSidebar side="left" onOpenTool={setOpenTool} />

      {/* Central lesson stage - at least 70% width and height */}
      <div className="container mx-auto px-2 sm:px-4 py-4">
        <div className="mx-auto w-full lg:w-[72%] min-h-[70vh]">
          <div className="h-[70vh]">
            <UnifiedCenterPanel
              activeCenterTab={activeCenterTab}
              onTabChange={setActiveCenterTab}
              currentUser={currentUser}
            />
          </div>
        </div>
      </div>

      {/* Overlays */}
      {openTool === 'chat' && (
        <ToolOverlay title="Chat" onClose={() => setOpenTool(null)}>
          <ClassroomChat teacherName={teacherName} studentName={studentName} />
        </ToolOverlay>
      )}

      {openTool === 'rewards' && (
        <ToolOverlay title="Rewards" onClose={() => setOpenTool(null)}>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 rounded border" onClick={() => awardPoints(10, 'Good answer')}>+10</button>
            <button className="px-3 py-2 rounded border" onClick={() => awardPoints(25, 'Great effort')}>+25</button>
            <button className="px-3 py-2 rounded border" onClick={() => awardPoints(50, 'Excellent work')}>+50</button>
          </div>
        </ToolOverlay>
      )}

      {openTool === 'timer' && (
        <ToolOverlay title="Timer" onClose={() => setOpenTool(null)}>
          <div className="text-center">
            <div className="text-4xl font-mono">{formatTime(classTime)}</div>
            <p className="text-sm text-muted-foreground mt-1">Elapsed class time</p>
          </div>
        </ToolOverlay>
      )}

      {openTool === 'wheel' && (
        <ToolOverlay title="AI Spinning Wheel" onClose={() => setOpenTool(null)}>
          <SpinningWheelGame />
        </ToolOverlay>
      )}

      {openTool === 'ai' && (
        <ToolOverlay title="AI Tools" onClose={() => setOpenTool(null)}>
          <div className="text-sm text-muted-foreground">Coming soon: AI activity & picture creator</div>
        </ToolOverlay>
      )}
    </div>
  );
}
