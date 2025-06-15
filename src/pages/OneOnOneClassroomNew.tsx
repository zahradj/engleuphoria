
import React, { useState } from "react";
import { useOneOnOneClassroom } from "@/hooks/useOneOnOneClassroom";
import { useEnhancedClassroom } from "@/hooks/useEnhancedClassroom";
import { MediaProvider } from "@/components/classroom/oneonone/video/MediaContext";
import { OneOnOneTopBar } from "@/components/classroom/oneonone/OneOnOneTopBar";
import { OneOnOneVideoSection } from "@/components/classroom/oneonone/OneOnOneVideoSection";
import { OneOnOneCenterPanel } from "@/components/classroom/oneonone/OneOnOneCenterPanel";
import { OneOnOneRightPanel } from "@/components/classroom/oneonone/OneOnOneRightPanel";
import { OneOnOneRewardPopup } from "@/components/classroom/oneonone/OneOnOneRewardPopup";

const OneOnOneClassroomNew = () => {
  console.log("OneOnOneClassroomNew component is rendering");
  
  const {
    classTime,
    activeRightTab,
    activeCenterTab,
    studentXP,
    studentLevel,
    showRewardPopup,
    setActiveRightTab,
    setActiveCenterTab,
    awardPoints
  } = useOneOnOneClassroom();

  // Add user identification - this would normally come from auth context
  const currentUserId = "teacher-1"; // Change to "student-1" to test student view
  const currentUserName = "Ms. Johnson";
  const isTeacher = currentUserId === "teacher-1";
  const roomId = "classroom-room-1";

  // Single source of truth for enhanced classroom state
  const enhancedClassroom = useEnhancedClassroom({
    roomId,
    userId: currentUserId,
    displayName: currentUserName,
    userRole: isTeacher ? 'teacher' : 'student'
  });

  console.log("Enhanced classroom state:", {
    isConnected: enhancedClassroom.isConnected,
    isMuted: enhancedClassroom.isMuted,
    isCameraOff: enhancedClassroom.isCameraOff,
    hasLocalStream: !!enhancedClassroom.localStream,
    participantsCount: enhancedClassroom.participants.length
  });

  try {
    return (
      <MediaProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
          {/* Enhanced Top Bar with All Controls */}
          <div className="h-20 flex-shrink-0 p-4">
            <OneOnOneTopBar
              classTime={classTime}
              studentName="Emma Thompson"
              studentLevel={studentLevel}
              enhancedClassroom={enhancedClassroom}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
              isTeacher={isTeacher}
              roomId={roomId}
            />
          </div>

          {/* Main Classroom Layout - Simplified */}
          <div className="min-h-[calc(100vh-5rem)] px-4 pb-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[600px]">
              
              {/* Left Panel - Simplified Video Section */}
              <div className="lg:col-span-3 min-h-[500px]">
                <OneOnOneVideoSection
                  enhancedClassroom={enhancedClassroom}
                  currentUserId={currentUserId}
                  currentUserName={currentUserName}
                  isTeacher={isTeacher}
                  studentXP={studentXP}
                  onAwardPoints={awardPoints}
                  showRewardPopup={showRewardPopup}
                />
              </div>

              {/* Center Panel - Interactive Content */}
              <div className="lg:col-span-6 min-h-[500px]">
                <OneOnOneCenterPanel
                  activeCenterTab={activeCenterTab}
                  onTabChange={setActiveCenterTab}
                />
              </div>

              {/* Right Panel - Student Video & Interactions */}
              <div className="lg:col-span-3 min-h-[500px]">
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
      </MediaProvider>
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
