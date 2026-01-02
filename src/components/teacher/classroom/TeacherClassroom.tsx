import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ClassroomTopBar } from "./ClassroomTopBar";
import { CommunicationZone } from "./CommunicationZone";
import { CenterStage } from "./CenterStage";
import { SlideNavigator } from "./SlideNavigator";
import { DiceRoller } from "./DiceRoller";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TeacherClassroomProps {
  classId?: string;
  studentName?: string;
  lessonTitle?: string;
  teacherName?: string;
}

export const TeacherClassroom: React.FC<TeacherClassroomProps> = ({
  classId = "101",
  studentName = "Emma",
  lessonTitle = "Magic Forest: Lesson 1",
  teacherName = "Teacher"
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [participantCount, setParticipantCount] = useState(2);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [activeTool, setActiveTool] = useState('pointer');
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [diceDialogOpen, setDiceDialogOpen] = useState(false);
  const [timerDialogOpen, setTimerDialogOpen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerValue, setTimerValue] = useState(60);

  // Generate unique room name based on class ID
  const roomName = `MySchool_Class_${classId}`;

  // Mock slides data
  const slides = [
    { id: '1', title: 'Welcome to the Lesson' },
    { id: '2', title: 'Vocabulary: Animals' },
    { id: '3', title: 'Practice: Matching Game' },
    { id: '4', title: 'Sentence Building' },
    { id: '5', title: 'Speaking Practice' },
    { id: '6', title: 'Quiz Time!' },
    { id: '7', title: 'Great Job! Summary' },
  ];

  const handleEndClass = useCallback(() => {
    toast({
      title: "Class Ended",
      description: "The class session has been ended.",
    });
    navigate('/admin');
  }, [navigate, toast]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const toggleCamera = useCallback(() => {
    setIsCameraOff(prev => !prev);
  }, []);

  const handleGiveStar = useCallback(() => {
    toast({
      title: "⭐ Star Awarded!",
      description: `You gave ${studentName} a star!`,
      className: "bg-yellow-900 border-yellow-700 text-white",
    });
  }, [studentName, toast]);

  const handleOpenTimer = useCallback(() => {
    setTimerDialogOpen(true);
  }, []);

  const handleRollDice = useCallback(() => {
    setDiceDialogOpen(true);
  }, []);

  const handleSendSticker = useCallback(() => {
    toast({
      title: "😊 Sticker Sent!",
      description: "Sticker sent to the student's screen",
    });
  }, [toast]);

  const handlePrevSlide = useCallback(() => {
    setCurrentSlideIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleNextSlide = useCallback(() => {
    setCurrentSlideIndex(prev => Math.min(slides.length - 1, prev + 1));
  }, [slides.length]);

  const handleSlideSelect = useCallback((index: number) => {
    setCurrentSlideIndex(index);
  }, []);

  // Timer logic
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerValue > 0) {
      interval = setInterval(() => {
        setTimerValue(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            toast({
              title: "⏰ Time's Up!",
              description: "The timer has finished.",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerValue, toast]);

  const startTimer = () => {
    setTimerValue(timerSeconds);
    setTimerRunning(true);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerValue(timerSeconds);
  };

  return (
    <div className="h-screen w-full bg-gray-950 text-gray-100 flex flex-col overflow-hidden">
      {/* Top Control Bar */}
      <ClassroomTopBar
        lessonTitle={lessonTitle}
        roomName={roomName}
        participantCount={participantCount}
        isMuted={isMuted}
        isCameraOff={isCameraOff}
        onToggleMute={toggleMute}
        onToggleCamera={toggleCamera}
        onEndClass={handleEndClass}
      />

      {/* 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Communication Zone */}
        <CommunicationZone
          studentName={studentName}
          teacherName={teacherName}
          onGiveStar={handleGiveStar}
          onOpenTimer={handleOpenTimer}
          onRollDice={handleRollDice}
          onSendSticker={handleSendSticker}
        />

        {/* Center: Main Stage */}
        <CenterStage
          slides={slides}
          currentSlideIndex={currentSlideIndex}
          onPrevSlide={handlePrevSlide}
          onNextSlide={handleNextSlide}
          activeTool={activeTool}
          onToolChange={setActiveTool}
        />

        {/* Right: Slide Navigator */}
        <SlideNavigator
          slides={slides}
          currentSlideIndex={currentSlideIndex}
          onSlideSelect={handleSlideSelect}
          lessonTitle={lessonTitle}
          isCollapsed={rightSidebarCollapsed}
          onToggleCollapse={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
        />
      </div>

      {/* Dice Roller Dialog */}
      <DiceRoller open={diceDialogOpen} onOpenChange={setDiceDialogOpen} />

      {/* Timer Dialog */}
      <Dialog open={timerDialogOpen} onOpenChange={setTimerDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-center">Activity Timer</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-4 gap-4">
            <div className="text-6xl font-mono font-bold text-blue-400">
              {Math.floor(timerValue / 60).toString().padStart(2, '0')}:
              {(timerValue % 60).toString().padStart(2, '0')}
            </div>
            {!timerRunning && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Set time (seconds):</span>
                <Input
                  type="number"
                  value={timerSeconds}
                  onChange={(e) => setTimerSeconds(Math.max(1, parseInt(e.target.value) || 60))}
                  className="w-20 bg-gray-800 border-gray-700 text-center"
                  min={1}
                />
              </div>
            )}
            <div className="flex gap-2">
              {!timerRunning ? (
                <Button onClick={startTimer} className="bg-blue-600 hover:bg-blue-700">
                  Start Timer
                </Button>
              ) : (
                <>
                  <Button onClick={() => setTimerRunning(false)} variant="outline" className="border-gray-700">
                    Pause
                  </Button>
                  <Button onClick={resetTimer} variant="destructive">
                    Reset
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
