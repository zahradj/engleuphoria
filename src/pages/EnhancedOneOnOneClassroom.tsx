
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

  // Goals state
  const [goals, setGoals] = useState([
    { id: '1', text: 'Learn 5 new words', completed: true },
    { id: '2', text: 'Practice pronunciation', completed: true },
    { id: '3', text: 'Complete worksheet', completed: false }
  ]);

  // Achievements data
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Clean background with subtle gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/20"></div>
      
      {/* Top Header - Fixed */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <EnhancedTopHeader 
          classTime={classTime}
          mediaControls={mediaControls}
        />
      </div>

      {/* Main Layout - Clean 3-column grid */}
      <div className="relative z-10 h-[calc(100vh-5rem)]">
        <div className="grid grid-cols-12 gap-4 h-full p-4">
          {/* Left Panel - Compact */}
          <div className="col-span-3">
            <EnhancedLeftPanel 
              currentUser={currentUser}
              remoteUser={remoteUser}
              goals={goals}
              achievements={achievements}
              onGoalToggle={handleGoalToggle}
            />
          </div>

          {/* Center Panel - Main Content */}
          <div className="col-span-6">
            <EnhancedCenterPanel 
              activeCenterTab={activeCenterTab}
              currentPage={1}
              onTabChange={setActiveCenterTab}
            />
          </div>

          {/* Right Panel - Student & Tools */}
          <div className="col-span-3">
            <EnhancedRightPanel 
              remoteUser={remoteUser}
              activeRightTab={activeRightTab}
              onTabChange={setActiveRightTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedOneOnOneClassroom;
