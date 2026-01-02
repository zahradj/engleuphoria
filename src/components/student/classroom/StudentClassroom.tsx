import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useClassroomSync } from '@/hooks/useClassroomSync';
import { StudentClassroomHeader } from './StudentClassroomHeader';
import { StudentSidebar } from './StudentSidebar';
import { StudentCenterStage } from './StudentCenterStage';

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
    clearCanvas
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

  const handleRaiseHand = () => {
    toast({
      title: '✋ Hand Raised',
      description: 'Your teacher has been notified.',
      className: 'bg-yellow-900 border-yellow-700'
    });
  };

  // Convert lesson slides to expected format
  const slides = lessonSlides.length > 0 
    ? lessonSlides 
    : [{ id: '1', title: 'Waiting for teacher...' }];

  return (
    <div className="h-screen w-full bg-gray-950 text-gray-100 flex flex-col overflow-hidden">
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
        {/* Left Sidebar */}
        <StudentSidebar
          studentName={studentName}
          studentCanDraw={studentCanDraw}
          activeColor={activeColor}
          onColorChange={setActiveColor}
          onRaiseHand={handleRaiseHand}
        />

        {/* Center Stage */}
        <StudentCenterStage
          slides={slides}
          currentSlideIndex={currentSlide}
          studentCanDraw={studentCanDraw}
          activeTool={activeTool}
          activeColor={activeColor}
          strokes={strokes}
          roomId={roomId}
          userId={studentId}
          userName={studentName}
          onAddStroke={addStroke}
          onClearMyStrokes={clearCanvas}
        />
      </div>
    </div>
  );
};
