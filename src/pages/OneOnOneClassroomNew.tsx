
import React, { useState } from "react";
import { useOneOnOneClassroom } from "@/hooks/useOneOnOneClassroom";
import { OneOnOneTopBar } from "@/components/classroom/oneonone/OneOnOneTopBar";
import { OneOnOneVideoSection } from "@/components/classroom/oneonone/OneOnOneVideoSection";
import { OneOnOneCenterPanel } from "@/components/classroom/oneonone/OneOnOneCenterPanel";
import { OneOnOneRightPanel } from "@/components/classroom/oneonone/OneOnOneRightPanel";
import { OneOnOneRewardPopup } from "@/components/classroom/oneonone/OneOnOneRewardPopup";
import { FloatingDictionary } from "@/components/classroom/oneonone/dictionary/FloatingDictionary";
import { Button } from "@/components/ui/button";
import { Search, BookOpen } from "lucide-react";

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

  // Dictionary state
  const [showDictionary, setShowDictionary] = useState(false);
  const [dictionaryWord, setDictionaryWord] = useState('');

  console.log("Hook data loaded:", { isRecording, isMuted, isCameraOff, classTime });

  // Add user identification - this would normally come from auth context
  const currentUserId = "teacher-1"; // Change to "student-1" to test student view
  const currentUserName = "Ms. Johnson";
  const isTeacher = currentUserId === "teacher-1";
  const roomId = "classroom-room-1";

  console.log("User data:", { currentUserId, currentUserName, isTeacher, roomId });

  // Handle dictionary word lookup from selection
  const handleTextSelection = () => {
    const selection = window.getSelection()?.toString().trim();
    if (selection && selection.length > 0 && selection.length < 50) {
      setDictionaryWord(selection);
      setShowDictionary(true);
    }
  };

  // Handle adding word to vocabulary
  const handleAddToVocab = (word: string, definition: string) => {
    console.log('Adding to vocabulary:', word, definition);
    // This would integrate with student vocabulary tracking
  };

  try {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
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

        {/* Floating Dictionary Button */}
        <div className="fixed top-24 right-4 z-40 flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDictionary(true)}
            className="bg-white shadow-lg hover:shadow-xl transition-all duration-200"
            title="Open Dictionary (Ctrl+D)"
          >
            <Search size={14} className="mr-1" />
            Dictionary
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTextSelection}
            className="bg-white shadow-lg hover:shadow-xl transition-all duration-200"
            title="Select text and click to lookup"
          >
            <BookOpen size={14} className="mr-1" />
            Lookup
          </Button>
        </div>

        {/* Main Classroom Layout - Flexible height with scrolling enabled */}
        <div className="min-h-[calc(100vh-5rem)] px-4 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[600px]">
            
            {/* Left Panel - Video Section with Rewards for Teacher */}
            <div className="lg:col-span-3 min-h-[500px]">
              <OneOnOneVideoSection
                roomId={roomId}
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

        {/* Floating Components */}
        <FloatingDictionary
          isVisible={showDictionary}
          onClose={() => setShowDictionary(false)}
          initialWord={dictionaryWord}
          onAddToVocab={handleAddToVocab}
        />

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
