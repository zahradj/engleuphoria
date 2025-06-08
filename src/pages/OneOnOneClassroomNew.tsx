
import React from "react";
import { useOneOnOneClassroom } from "@/hooks/useOneOnOneClassroom";
import { OneOnOneTopBar } from "@/components/classroom/oneonone/OneOnOneTopBar";
import { OneOnOneVideoSection } from "@/components/classroom/oneonone/OneOnOneVideoSection";
import { OneOnOneCenterPanel } from "@/components/classroom/oneonone/OneOnOneCenterPanel";
import { OneOnOneRightPanel } from "@/components/classroom/oneonone/OneOnOneRightPanel";
import { OneOnOneRewardPopup } from "@/components/classroom/oneonone/OneOnOneRewardPopup";

const OneOnOneClassroomNew = () => {
  console.log("OneOnOneClassroomNew component is rendering");
  
  const {
    isRecording,
    isMuted,
    isCameraOff,
    classTime,
    activeRightTab,
    activeCenterTab,
    studentXP,
    studentLevel,
    showRewardPopup,
    setIsMuted,
    setIsCameraOff,
    setActiveRightTab,
    setActiveCenterTab,
    toggleRecording,
    awardPoints
  } = useOneOnOneClassroom();

  console.log("Hook data loaded:", { isRecording, isMuted, isCameraOff, classTime });

  // Add user identification - this would normally come from auth context
  const currentUserId = "teacher-1"; // Change to "student-1" to test student view
  const currentUserName = "Ms. Johnson";
  const isTeacher = currentUserId === "teacher-1";
  const roomId = "classroom-room-1";

  console.log("User data:", { currentUserId, currentUserName, isTeacher, roomId });

  try {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
        {/* Top Bar - Fixed height */}
        <div className="h-20 flex-shrink-0 p-4">
          <OneOnOneTopBar
            classTime={classTime}
            studentName="Emma Thompson"
            studentLevel={studentLevel}
            isMuted={isMuted}
            isCameraOff={isCameraOff}
            isRecording={isRecording}
            onToggleMute={() => setIsMuted(!isMuted)}
            onToggleCamera={() => setIsCameraOff(!isCameraOff)}
            onToggleRecording={toggleRecording}
          />
        </div>

        {/* Main Classroom Layout - Calculated height */}
        <div className="h-[calc(100vh-5rem)] px-4 pb-4">
          <div className="grid grid-cols-12 gap-4 h-full">
            
            {/* Left Panel - Video Section */}
            <div className="col-span-3 h-full">
              <OneOnOneVideoSection
                roomId={roomId}
                currentUserId={currentUserId}
                currentUserName={currentUserName}
                isTeacher={isTeacher}
              />
            </div>

            {/* Center Panel - Interactive Content */}
            <div className="col-span-6 h-full">
              <OneOnOneCenterPanel
                activeCenterTab={activeCenterTab}
                onTabChange={setActiveCenterTab}
              />
            </div>

            {/* Right Panel - Student Video & Interactions */}
            <div className="col-span-3 h-full">
              <OneOnOneRightPanel
                studentName="Emma"
                studentXP={studentXP}
                activeRightTab={activeRightTab}
                onTabChange={setActiveRightTab}
                currentUserId={currentUserId}
                currentUserName={currentUserName}
                isTeacher={isTeacher}
              />
            </div>
          </div>
        </div>

        {/* Floating Reward Popup */}
        <OneOnOneRewardPopup isVisible={showRewardPopup} />
      </div>
    );
  } catch (error) {
    console.error("Error rendering OneOnOneClassroomNew:", error);
    return (
      <div className="min-h-screen bg-red-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Classroom Loading Error</h1>
          <p className="text-red-600">There was an error loading the classroom. Please check the console for details.</p>
        </div>
      </div>
    );
  }
};

export default OneOnOneClassroomNew;
