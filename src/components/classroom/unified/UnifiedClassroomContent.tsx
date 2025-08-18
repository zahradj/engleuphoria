
import React, { useState } from "react";
import { UnifiedCenterPanel } from "./UnifiedCenterPanel";
import { useUnifiedClassroomContext } from "./UnifiedClassroomProvider";
import { RightRail, RailTool } from "./components/RightRail";
import { ToolRailOverlay } from "./components/ToolRailOverlay";
import { AITranslator } from "@/components/classroom/ai/AITranslator";
import { ClassroomChat } from "@/components/classroom/ClassroomChat";
import { SpinningWheelGame } from "@/components/classroom/oneonone/games/SpinningWheelGame";
import { Button } from "@/components/ui/button";

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

  const [openTool, setOpenTool] = useState<RailTool | null>(null);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex gap-6">
      {/* Main lesson area - 80-85% width */}
      <div className="flex-1 h-full">
        <div className="h-full rounded-3xl overflow-hidden backdrop-blur-lg relative border-2 border-brand-300 bg-gradient-to-br from-brand-50 via-surface to-brand-100 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-100/30 via-brand-200/20 to-brand-300/10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-brand-200/20 via-brand-100/15 to-brand-300/10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-100/10 via-brand-200/15 to-brand-300/10 pointer-events-none animate-pulse"></div>
          <UnifiedCenterPanel
            activeCenterTab={activeCenterTab}
            onTabChange={setActiveCenterTab}
            currentUser={currentUser}
          />
        </div>
      </div>

      {/* Right rail - 15-20% width */}
      <div className="w-80 h-full">
        <div className="h-full rounded-3xl overflow-hidden backdrop-blur-sm relative border-2 border-brand-200 bg-gradient-to-b from-brand-50 to-brand-100 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-100/20 via-brand-200/10 to-brand-300/10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-100/10 via-brand-200/15 to-brand-100/10 pointer-events-none animate-pulse"></div>
          <RightRail
            localStream={enhancedClassroom?.localStream || null}
            remoteStream={null}
            isTeacher={isTeacher}
            isCameraOff={enhancedClassroom?.isCameraOff}
            teacherName={teacherName}
            studentName={studentName}
            onOpenTool={setOpenTool}
          />
        </div>
      </div>

      {/* Tool Overlays */}
      {openTool === 'chat' && (
        <ToolRailOverlay title="Chat" onClose={() => setOpenTool(null)}>
          <ClassroomChat teacherName={teacherName} studentName={studentName} />
        </ToolRailOverlay>
      )}

      {openTool === 'rewards' && (
        <ToolRailOverlay title="Rewards" onClose={() => setOpenTool(null)}>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start border-brand-300 text-brand-600 hover:bg-brand-50" 
              onClick={() => awardPoints(10, 'Good answer')}
            >
              +10 Points - Good answer
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-brand-300 text-brand-600 hover:bg-brand-50" 
              onClick={() => awardPoints(25, 'Great effort')}
            >
              +25 Points - Great effort
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-brand-300 text-brand-600 hover:bg-brand-50" 
              onClick={() => awardPoints(50, 'Excellent work')}
            >
              +50 Points - Excellent work
            </Button>
          </div>
        </ToolRailOverlay>
      )}



      {openTool === 'translator' && (
        <ToolRailOverlay title="AI Translator" onClose={() => setOpenTool(null)}>
          <AITranslator 
            onInsertToWhiteboard={(text) => {
              console.log('Inserting translation to whiteboard:', text);
              // This would integrate with the whiteboard system
            }}
          />
        </ToolRailOverlay>
      )}
    </div>
  );
}
