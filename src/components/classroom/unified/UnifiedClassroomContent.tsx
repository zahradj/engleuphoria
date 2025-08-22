
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
    <div className="h-full flex gap-6 p-2" style={{ backgroundColor: '#FBFBFB' }}>
      {/* Main lesson area - 80-85% width */}
      <div className="flex-1 h-full relative">
        {/* Ambient background effects */}
        <div className="absolute -inset-4 rounded-3xl blur-xl animate-pulse-subtle opacity-60" style={{ background: 'linear-gradient(135deg, #E8F9FF 0%, #C4D9FF 50%, #C5BAFF 100%)' }}></div>
        
        <div className="relative h-full rounded-2xl overflow-hidden shadow-xl" style={{ 
          backgroundColor: '#FBFBFB', 
          border: '1px solid rgba(196, 217, 255, 0.3)',
          backdropFilter: 'blur(8px)'
        }}>
          {/* Multiple layered gradients for depth */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(232, 249, 255, 0.3) 0%, transparent 50%, rgba(197, 186, 255, 0.2) 100%)' }}></div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(45deg, rgba(196, 217, 255, 0.2) 0%, transparent 50%, rgba(232, 249, 255, 0.1) 100%)' }}></div>
          
          {/* Subtle animated overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent translate-x-[-100%] animate-[slide-in-right_8s_ease-in-out_infinite] pointer-events-none" style={{ 
            background: 'linear-gradient(to right, transparent 0%, rgba(196, 217, 255, 0.1) 50%, transparent 100%)'
          }}></div>
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
        <div className="absolute -inset-2 rounded-3xl blur-lg opacity-50" style={{ background: 'linear-gradient(270deg, rgba(197, 186, 255, 0.3) 0%, rgba(232, 249, 255, 0.2) 50%, transparent 100%)' }}></div>
        
        <div className="relative h-full rounded-2xl overflow-hidden shadow-lg" style={{ 
          backgroundColor: '#FBFBFB', 
          border: '1px solid rgba(196, 217, 255, 0.3)',
          backdropFilter: 'blur(12px)'
        }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(197, 186, 255, 0.2) 0%, rgba(232, 249, 255, 0.1) 50%, rgba(196, 217, 255, 0.15) 100%)' }}></div>
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
              className="w-full justify-start transition-colors duration-200" 
              style={{ 
                borderColor: '#C4D9FF', 
                color: '#6366F1',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E8F9FF'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => awardPoints(10, 'Good answer')}
            >
              +10 Points - Good answer
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start transition-colors duration-200" 
              style={{ 
                borderColor: '#C4D9FF', 
                color: '#6366F1',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E8F9FF'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => awardPoints(25, 'Great effort')}
            >
              +25 Points - Great effort
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start transition-colors duration-200" 
              style={{ 
                borderColor: '#C4D9FF', 
                color: '#6366F1',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E8F9FF'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
