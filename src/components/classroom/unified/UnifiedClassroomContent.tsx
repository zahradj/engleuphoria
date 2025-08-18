
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
    <div className="h-full flex gap-6 p-2">
      {/* Main lesson area - 80-85% width */}
      <div className="flex-1 h-full relative">
        {/* Ambient background effects */}
        <div className="absolute -inset-4 bg-gradient-to-br from-primary-100/20 via-accent-50/30 to-neutral-100/20 rounded-3xl blur-xl animate-pulse-subtle opacity-60"></div>
        
        <div className="relative h-full rounded-2xl overflow-hidden border border-neutral-200/80 bg-surface/95 backdrop-blur-sm shadow-xl">
          {/* Multiple layered gradients for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/40 via-transparent to-accent-50/30 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-neutral-50/20 via-primary-50/10 to-accent-100/20 pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-100/20 via-transparent to-transparent pointer-events-none"></div>
          
          {/* Subtle animated overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-50/5 to-transparent translate-x-[-100%] animate-[slide-in-right_8s_ease-in-out_infinite] pointer-events-none"></div>
          <UnifiedCenterPanel
            activeCenterTab={activeCenterTab}
            onTabChange={setActiveCenterTab}
            currentUser={currentUser}
          />
        </div>
      </div>

      {/* Right rail - 15-20% width */}
      <div className="w-80 h-full relative">
        {/* Ambient glow for right rail */}
        <div className="absolute -inset-2 bg-gradient-to-l from-accent-100/30 via-primary-50/20 to-transparent rounded-3xl blur-lg opacity-50"></div>
        
        <div className="relative h-full rounded-2xl overflow-hidden border border-neutral-200/80 bg-surface/98 backdrop-blur-md shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-b from-accent-50/30 via-neutral-50/10 to-primary-50/20 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-primary-100/10 via-transparent to-accent-50/15 pointer-events-none"></div>
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
