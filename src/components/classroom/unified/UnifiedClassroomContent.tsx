
import React, { useState } from "react";
import { UnifiedCenterPanel } from "./UnifiedCenterPanel";
import { useUnifiedClassroomContext } from "./UnifiedClassroomProvider";
import { RightRail, RailTool } from "./components/RightRail";
import { ToolRailOverlay } from "./components/ToolRailOverlay";
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
        <div className="h-full glass-enhanced rounded-3xl overflow-auto backdrop-blur-lg classroom-ambient floating-animation relative rgb-background">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/12 via-accent/8 to-secondary/10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-accent/8 via-secondary/6 to-primary/10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/6 via-primary/8 to-accent/10 pointer-events-none animate-pulse"></div>
          <UnifiedCenterPanel
            activeCenterTab={activeCenterTab}
            onTabChange={setActiveCenterTab}
            currentUser={currentUser}
          />
        </div>
      </div>

      {/* Right rail - 15-20% width */}
      <div className="w-80 h-full">
        <div className="h-full glass-subtle rounded-3xl overflow-auto backdrop-blur-sm animate-fade-in interactive-hover relative rgb-background">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/12 via-accent/8 to-primary/10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/6 via-secondary/8 to-accent/6 pointer-events-none animate-pulse"></div>
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
              className="w-full justify-start" 
              onClick={() => awardPoints(10, 'Good answer')}
            >
              +10 Points - Good answer
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => awardPoints(25, 'Great effort')}
            >
              +25 Points - Great effort
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => awardPoints(50, 'Excellent work')}
            >
              +50 Points - Excellent work
            </Button>
          </div>
        </ToolRailOverlay>
      )}

      {openTool === 'timer' && (
        <ToolRailOverlay title="Timer" onClose={() => setOpenTool(null)}>
          <div className="text-center">
            <div className="text-4xl font-mono text-foreground">{formatTime(classTime)}</div>
            <p className="text-sm text-muted-foreground mt-2">Elapsed class time</p>
          </div>
        </ToolRailOverlay>
      )}


      {openTool === 'ai' && (
        <ToolRailOverlay title="AI Tools" onClose={() => setOpenTool(null)}>
          <div className="text-sm text-muted-foreground">
            Coming soon: AI activity & picture creator
          </div>
        </ToolRailOverlay>
      )}
    </div>
  );
}
