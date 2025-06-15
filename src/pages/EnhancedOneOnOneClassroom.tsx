
import React, { useState } from "react";
import { useOneOnOneClassroom } from "@/hooks/useOneOnOneClassroom";
import { useEnhancedClassroom } from "@/hooks/useEnhancedClassroom";
import { useToast } from "@/hooks/use-toast";
import { EnhancedTopHeader } from "@/components/classroom/enhanced/EnhancedTopHeader";
import { EnhancedLeftPanel } from "@/components/classroom/enhanced/EnhancedLeftPanel";
import { EnhancedCenterPanel } from "@/components/classroom/enhanced/EnhancedCenterPanel";
import { EnhancedRightPanel } from "@/components/classroom/enhanced/EnhancedRightPanel";

const EnhancedOneOnOneClassroom = () => {
  console.log("EnhancedOneOnOneClassroom component is rendering");
  
  const { toast } = useToast();
  const {
    classTime,
    studentXP,
    awardPoints
  } = useOneOnOneClassroom();

  // Mock user data matching the template
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
    name: "Emma (Student)",
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

  // Goals state matching template
  const [goals, setGoals] = useState([
    { id: '1', text: 'Learn 5 new words', completed: true },
    { id: '2', text: 'Practice pronunciation', completed: true },
    { id: '3', text: 'Complete worksheet', completed: false }
  ]);

  // Achievements data matching template
  const achievements = [
    { id: '1', name: 'First Steps', icon: '✓', unlocked: true, color: 'bg-gradient-to-br from-green-400 to-green-600' },
    { id: '2', name: 'Word Master', icon: '📚', unlocked: true, color: 'bg-gradient-to-br from-blue-400 to-blue-600' },
    { id: '3', name: 'Speaker', icon: '🎤', unlocked: true, color: 'bg-gradient-to-br from-purple-400 to-purple-600' },
    { id: '4', name: 'Grammar Pro', icon: 'G', unlocked: false, color: 'bg-gradient-to-br from-gray-300 to-gray-400' }
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
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden relative">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-r from-pink-300 to-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Enhanced Top Header */}
      <EnhancedTopHeader 
        classTime={classTime}
        mediaControls={mediaControls}
      />

      {/* Enhanced Main Layout */}
      <div className="h-[calc(100vh-5rem)] flex gap-6 p-6">
        {/* Enhanced Left Panel */}
        <EnhancedLeftPanel 
          currentUser={currentUser}
          remoteUser={remoteUser}
          goals={goals}
          achievements={achievements}
          onGoalToggle={handleGoalToggle}
        />

        {/* Enhanced Center Panel */}
        <EnhancedCenterPanel 
          activeCenterTab={activeCenterTab}
          currentPage={currentPage}
          onTabChange={setActiveCenterTab}
        />

        {/* Enhanced Right Panel */}
        <EnhancedRightPanel 
          remoteUser={remoteUser}
          activeRightTab={activeRightTab}
          onTabChange={setActiveRightTab}
        />
      </div>
    </div>
  );
};

export default EnhancedOneOnOneClassroom;
