
import React, { useState } from "react";
import { useOneOnOneClassroom } from "@/hooks/useOneOnOneClassroom";
import { useEnhancedClassroom } from "@/hooks/useEnhancedClassroom";
import { useToast } from "@/hooks/use-toast";
import { CleanTopHeader } from "@/components/classroom/enhanced/CleanTopHeader";
import { CompactTeacherCard } from "@/components/classroom/enhanced/CompactTeacherCard";
import { StudentProgressCard } from "@/components/classroom/enhanced/StudentProgressCard";
import { TodaysGoalsCard } from "@/components/classroom/enhanced/TodaysGoalsCard";
import { CleanLearningCenter } from "@/components/classroom/enhanced/CleanLearningCenter";
import { StudentProfileCard } from "@/components/classroom/enhanced/StudentProfileCard";
import { CleanChatInterface } from "@/components/classroom/enhanced/CleanChatInterface";

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
    name: "Teacher Sarah",
    role: 'teacher' as const,
    avatar: "/api/placeholder/100/100",
    level: 5,
    isOnline: true
  };

  const remoteUser = {
    id: "student-1", 
    name: "Emma",
    role: 'student' as const,
    avatar: "/api/placeholder/100/100",
    level: 12,
    xp: 50,
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

  // State for active tabs
  const [activeCenterTab, setActiveCenterTab] = useState("whiteboard");
  const [activeRightTab, setActiveRightTab] = useState("chat");
  const [currentPage, setCurrentPage] = useState(1);

  // Goals state
  const [goals, setGoals] = useState([
    { id: '1', text: 'Learn 5 new words', completed: true },
    { id: '2', text: 'Practice pronunciation', completed: true },
    { id: '3', text: 'Complete worksheet', completed: false }
  ]);

  // Achievements data
  const achievements = [
    { id: '1', name: 'First Steps', icon: '🏆', unlocked: true },
    { id: '2', name: 'Word Master', icon: '📚', unlocked: true },
    { id: '3', name: 'Speaker', icon: '🎤', unlocked: true },
    { id: '4', name: 'Grammar Pro', icon: '📝', unlocked: false }
  ];

  // Media controls
  const mediaControls = {
    isMuted: enhancedClassroom.isMuted,
    isCameraOff: enhancedClassroom.isCameraOff,
    onToggleMute: enhancedClassroom.toggleMicrophone,
    onToggleCamera: enhancedClassroom.toggleCamera
  };

  const handleGoalToggle = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, completed: !goal.completed }
        : goal
    ));
    
    const goal = goals.find(g => g.id === goalId);
    if (goal && !goal.completed) {
      awardPoints();
      toast({
        title: "Goal Completed! 🎉",
        description: "Great job! Keep up the excellent work."
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Top Header */}
      <CleanTopHeader 
        classTime={classTime}
        mediaControls={mediaControls}
        isConnected={enhancedClassroom.isConnected}
      />

      {/* Main Layout - Clean 3-column grid */}
      <div className="h-[calc(100vh-4rem)] p-4">
        <div className="grid grid-cols-12 gap-4 h-full">
          {/* Left Panel - Teacher & Progress */}
          <div className="col-span-3 space-y-4">
            <CompactTeacherCard user={currentUser} />
            <StudentProgressCard 
              student={remoteUser}
              achievements={achievements}
            />
            <TodaysGoalsCard 
              goals={goals}
              onGoalToggle={handleGoalToggle}
            />
          </div>

          {/* Center Panel - Learning Center */}
          <div className="col-span-6">
            <CleanLearningCenter 
              activeCenterTab={activeCenterTab}
              currentPage={currentPage}
              onTabChange={setActiveCenterTab}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Right Panel - Student & Chat */}
          <div className="col-span-3 space-y-4">
            <StudentProfileCard student={remoteUser} />
            <CleanChatInterface 
              activeTab={activeRightTab}
              onTabChange={setActiveRightTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedOneOnOneClassroom;
