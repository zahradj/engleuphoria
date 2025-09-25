
import React, { useState } from "react";
import { useUnifiedClassroomContext } from "./UnifiedClassroomProvider";
import { TeacherClassroomView } from "./TeacherClassroomView";
import { StudentClassroomView } from "./StudentClassroomView";
import { RightRail, RailTool } from "./components/RightRail";
import { ToolRailOverlay } from "./components/ToolRailOverlay";
import { AITranslator } from "@/components/classroom/ai/AITranslator";
import { ClassroomChat } from "@/components/classroom/ClassroomChat";
import { Button } from "@/components/ui/button";
import { LeftSidebar } from "./components/LeftSidebar";
import { Whiteboard } from "@/components/Whiteboard";
import { EnhancedDictionary } from "@/components/classroom/oneonone/dictionary/EnhancedDictionary";

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
  const [selectedLeftTool, setSelectedLeftTool] = useState<string>("");

  const handleLeftToolSelect = (tool: string) => {
    setSelectedLeftTool(tool === selectedLeftTool ? "" : tool);
  };

  // Render teacher or student view based on role
  if (isTeacher) {
    return (
      <div className="flex h-full">
        {/* Left Sidebar */}
        <LeftSidebar 
          onToolSelect={handleLeftToolSelect}
          selectedTool={selectedLeftTool}
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex">
          <TeacherClassroomView
            currentUser={currentUser}
            enhancedClassroom={enhancedClassroom}
            classTime={classTime}
          />
        </div>
        
        {/* Tool Overlays for Teacher */}
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

        {openTool === 'translator' && (
          <ToolRailOverlay title="AI Translator" onClose={() => setOpenTool(null)}>
            <AITranslator 
              onInsertToWhiteboard={(text) => {
                console.log('Inserting translation to whiteboard:', text);
              }}
            />
          </ToolRailOverlay>
        )}

        {/* Left Sidebar Tool Overlays */}
        {selectedLeftTool === 'embed' && (
          <ToolRailOverlay title="Embed Link" onClose={() => setSelectedLeftTool("")}>
            <div className="space-y-4">
              <input 
                type="url" 
                placeholder="Enter link to embed..." 
                className="w-full p-3 border rounded-lg"
              />
              <Button className="w-full">Embed Link</Button>
            </div>
          </ToolRailOverlay>
        )}


        {selectedLeftTool === 'awards' && (
          <ToolRailOverlay title="Give Awards" onClose={() => setSelectedLeftTool("")}>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => awardPoints(10, 'Good answer')}
              >
                🌟 +10 Points - Good answer
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => awardPoints(25, 'Great effort')}
              >
                ⭐ +25 Points - Great effort
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => awardPoints(50, 'Excellent work')}
              >
                🏆 +50 Points - Excellent work
              </Button>
            </div>
          </ToolRailOverlay>
        )}

        {selectedLeftTool === 'chat' && (
          <ToolRailOverlay title="Classroom Chat" onClose={() => setSelectedLeftTool("")}>
            <ClassroomChat teacherName={teacherName} studentName={studentName} />
          </ToolRailOverlay>
        )}

        {selectedLeftTool === 'dictionary' && (
          <ToolRailOverlay title="Dictionary" onClose={() => setSelectedLeftTool("")}>
            <EnhancedDictionary 
              onAddToVocab={(word, definition) => {
                console.log('Adding to vocabulary:', { word, definition });
              }}
            />
          </ToolRailOverlay>
        )}
      </div>
    );
  }

  // Simplified Student view - only material, teacher, and rewards
  return (
    <div className="h-full">
      {/* Simplified Student View - No Sidebar, No Chat, No Tools */}
      <StudentClassroomView
        currentUser={currentUser}
        enhancedClassroom={enhancedClassroom}
        classTime={classTime}
        studentXP={studentXP}
      />
    </div>
  );

}
