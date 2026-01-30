import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useClassroomSync } from '@/hooks/useClassroomSync';
import { StudentClassroomHeader } from './StudentClassroomHeader';
import { StudentCommunicationSidebar } from './StudentCommunicationSidebar';
import { StudentMainStage } from './StudentMainStage';
import { StarCelebration } from '@/components/teacher/classroom/StarCelebration';
import { DiceRoller } from '@/components/teacher/classroom/DiceRoller';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Dice6 } from 'lucide-react';

interface StudentClassroomProps {
  roomId: string;
  studentId: string;
  studentName: string;
}

export const StudentClassroom: React.FC<StudentClassroomProps> = ({
  roomId,
  studentId,
  studentName
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMuted, setIsMuted] = useState(true);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [activeColor, setActiveColor] = useState('#FF6B6B');

  const {
    currentSlide,
    activeTool,
    studentCanDraw,
    lessonSlides,
    lessonTitle,
    isConnected,
    strokes,
    addStroke,
    quizActive,
    quizLocked,
    quizRevealAnswer,
    pollActive,
    pollShowResults,
    // Shared display state from teacher
    embeddedUrl,
    isScreenSharing,
    starCount,
    showStarCelebration,
    isMilestone,
    timerValue,
    timerRunning,
    diceValue
  } = useClassroomSync({
    roomId,
    userId: studentId,
    userName: studentName,
    role: 'student'
  });

  const handleLeaveClass = () => {
    toast({
      title: 'Left Classroom',
      description: 'You have left the classroom session.'
    });
    navigate('/playground');
  };

  // Convert lesson slides to expected format
  const slides = lessonSlides.length > 0 
    ? lessonSlides 
    : [{ id: '1', title: 'Waiting for teacher...' }];

  return (
    <div className="h-screen w-full bg-gray-950 text-gray-100 flex flex-col overflow-hidden">
      {/* Star Celebration Overlay - visible to students */}
      <StarCelebration
        isVisible={showStarCelebration}
        starCount={starCount}
        studentName={studentName}
        isMilestone={isMilestone}
        onComplete={() => {}}
      />

      {/* Timer Overlay - visible to students */}
      <AnimatePresence>
        {timerRunning && timerValue !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl px-8 py-4 border border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <div className="flex items-center gap-4">
                <Timer className="w-8 h-8 text-blue-400" />
                <div className="text-5xl font-mono font-bold text-blue-400">
                  {Math.floor(timerValue / 60).toString().padStart(2, '0')}:
                  {(timerValue % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dice Result Overlay - visible to students */}
      <AnimatePresence>
        {diceValue !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
          >
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 shadow-[0_0_50px_rgba(168,85,247,0.5)]">
              <div className="flex flex-col items-center gap-4">
                <Dice6 className="w-12 h-12 text-white" />
                <div className="text-7xl font-bold text-white">{diceValue}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <StudentClassroomHeader
        lessonTitle={lessonTitle}
        isConnected={isConnected}
        isMuted={isMuted}
        isCameraOff={isCameraOff}
        onToggleMute={() => setIsMuted(!isMuted)}
        onToggleCamera={() => setIsCameraOff(!isCameraOff)}
        onLeaveClass={handleLeaveClass}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Communication only */}
        <StudentCommunicationSidebar
          studentName={studentName}
          teacherName="Teacher"
          isMuted={isMuted}
          isCameraOff={isCameraOff}
          onToggleMute={() => setIsMuted(!isMuted)}
          onToggleCamera={() => setIsCameraOff(!isCameraOff)}
        />

        {/* Main Stage - Slides/Screen Share/Embedded Content */}
        <StudentMainStage
          slides={slides}
          currentSlideIndex={currentSlide}
          studentCanDraw={studentCanDraw}
          activeTool={activeTool}
          activeColor={activeColor}
          strokes={strokes}
          roomId={roomId}
          userId={studentId}
          userName={studentName}
          quizActive={quizActive}
          quizLocked={quizLocked}
          quizRevealAnswer={quizRevealAnswer}
          pollActive={pollActive}
          pollShowResults={pollShowResults}
          embeddedUrl={embeddedUrl}
          isScreenSharing={isScreenSharing}
          onAddStroke={addStroke}
        />
      </div>
    </div>
  );
};
