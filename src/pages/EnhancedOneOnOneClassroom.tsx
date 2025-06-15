
import React, { useState } from "react";
import { useOneOnOneClassroom } from "@/hooks/useOneOnOneClassroom";
import { useEnhancedClassroom } from "@/hooks/useEnhancedClassroom";
import { EnhancedClassroomLayout } from "@/components/classroom/enhanced/EnhancedClassroomLayout";
import { EnhancedCenterPanel } from "@/components/classroom/enhanced/EnhancedCenterPanel";
import { useToast } from "@/hooks/use-toast";

const EnhancedOneOnOneClassroom = () => {
  console.log("EnhancedOneOnOneClassroom component is rendering");
  
  const { toast } = useToast();
  const {
    classTime,
    studentXP,
    awardPoints
  } = useOneOnOneClassroom();

  // Mock user data
  const currentUser = {
    id: "teacher-1",
    name: "Ms. Johnson",
    role: 'teacher' as const,
    avatar: "/api/placeholder/100/100",
    level: 5
  };

  const remoteUser = {
    id: "student-1", 
    name: "Emma Thompson",
    role: 'student' as const,
    avatar: "/api/placeholder/100/100",
    level: 3,
    xp: studentXP % 100,
    maxXp: 100,
    isOnline: true
  };

  // Enhanced classroom state
  const enhancedClassroom = useEnhancedClassroom({
    roomId: "enhanced-classroom-1",
    userId: currentUser.id,
    displayName: currentUser.name,
    userRole: currentUser.role
  });

  // Mock connection status
  const connectionStatus = {
    isConnected: enhancedClassroom.isConnected,
    quality: 'excellent' as const,
    duration: `${Math.floor(classTime / 60)}:${(classTime % 60).toString().padStart(2, '0')}`
  };

  // Media controls
  const mediaControls = {
    isMuted: enhancedClassroom.isMuted,
    isCameraOff: enhancedClassroom.isCameraOff,
    onToggleMute: enhancedClassroom.toggleMicrophone,
    onToggleCamera: enhancedClassroom.toggleCamera,
    onEndCall: () => {
      toast({
        title: "Class Ended",
        description: "The lesson has been ended successfully."
      });
    }
  };

  // Goals state
  const [goals, setGoals] = useState([
    { id: '1', text: 'Practice new vocabulary words', completed: false },
    { id: '2', text: 'Complete reading exercise', completed: true },
    { id: '3', text: 'Participate in conversation practice', completed: false },
    { id: '4', text: 'Review homework assignment', completed: false }
  ]);

  // Achievements data
  const achievements = [
    { id: '1', name: 'First Lesson', icon: '🎓', unlocked: true },
    { id: '2', name: 'Perfect Week', icon: '📅', unlocked: true },
    { id: '3', name: 'Vocabulary Master', icon: '📚', unlocked: false },
    { id: '4', name: 'Conversation Pro', icon: '💬', unlocked: true },
    { id: '5', name: 'Reading Champion', icon: '📖', unlocked: false },
    { id: '6', name: 'Grammar Expert', icon: '✏️', unlocked: false },
    { id: '7', name: 'Listening Skills', icon: '👂', unlocked: true },
    { id: '8', name: 'Speaking Star', icon: '🌟', unlocked: false }
  ];

  // Page state
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const handleGoalToggle = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, completed: !goal.completed }
        : goal
    ));
    
    // Award points for completing goals
    const goal = goals.find(g => g.id === goalId);
    if (goal && !goal.completed) {
      awardPoints();
      toast({
        title: "Goal Completed! 🎉",
        description: "Great job! Keep up the excellent work."
      });
    }
  };

  const formatClassTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <EnhancedClassroomLayout
      currentUser={currentUser}
      remoteUser={remoteUser}
      connectionStatus={connectionStatus}
      mediaControls={mediaControls}
      goals={goals}
      achievements={achievements}
      onGoalToggle={handleGoalToggle}
    >
      <EnhancedCenterPanel
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        userRole={currentUser.role}
      />
    </EnhancedClassroomLayout>
  );
};

export default EnhancedOneOnOneClassroom;
