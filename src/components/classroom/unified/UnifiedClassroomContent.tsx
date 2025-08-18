
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
    <div className="h-full flex gap-4">
      {/* Main lesson area - 80-85% width */}
      <div className="flex-1 h-full">
        <div className="h-full rounded-2xl overflow-hidden relative border border-neutral-200 bg-surface shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-neutral-50/20 to-accent-50/30 pointer-events-none"></div>
          <UnifiedCenterPanel
            activeCenterTab={activeCenterTab}
            onTabChange={setActiveCenterTab}
            currentUser={currentUser}
          />
        </div>
      </div>

      {/* Right rail - 15-20% width */}
      <div className="w-80 h-full">
        <div className="h-full rounded-2xl overflow-hidden relative border border-neutral-200 bg-surface shadow-md">
          <div className="absolute inset-0 bg-gradient-to-b from-accent-50/20 via-neutral-50/10 to-primary-50/20 pointer-events-none"></div>
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
              className="w-full justify-start border-neutral-200 text-primary-600 hover:bg-primary-50" 
              onClick={() => awardPoints(10, 'Good answer')}
            >
              +10 Points - Good answer
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-neutral-200 text-primary-600 hover:bg-primary-50" 
              onClick={() => awardPoints(25, 'Great effort')}
            >
              +25 Points - Great effort
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-neutral-200 text-primary-600 hover:bg-primary-50" 
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
