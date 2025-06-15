
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.08),transparent_50%)]"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.08),transparent_50%)]"></div>
      <div className="fixed top-0 left-1/2 w-96 h-96 bg-gradient-to-r from-purple-200/30 to-blue-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-72 h-72 bg-gradient-to-r from-pink-200/30 to-orange-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Enhanced Top Header - Fixed Position */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <EnhancedTopHeader 
          classTime={classTime}
          mediaControls={mediaControls}
        />
      </div>

      {/* Enhanced Main Layout - Scrollable Content */}
      <div className="relative z-10 p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6 min-h-[calc(100vh-6rem)]">
          {/* Enhanced Left Panel */}
          <div className="xl:col-span-3 order-2 xl:order-1">
            <div className="sticky top-24">
              <EnhancedLeftPanel 
                currentUser={currentUser}
                remoteUser={remoteUser}
                goals={goals}
                achievements={achievements}
                onGoalToggle={handleGoalToggle}
              />
            </div>
          </div>

          {/* Enhanced Center Panel */}
          <div className="xl:col-span-6 order-1 xl:order-2">
            <EnhancedCenterPanel 
              activeCenterTab={activeCenterTab}
              currentPage={currentPage}
              onTabChange={setActiveCenterTab}
            />
          </div>

          {/* Enhanced Right Panel */}
          <div className="xl:col-span-3 order-3">
            <div className="sticky top-24">
              <EnhancedRightPanel 
                remoteUser={remoteUser}
                activeRightTab={activeRightTab}
                onTabChange={setActiveRightTab}
              />
            </div>
          </div>
        </div>

        {/* Additional Content Section for Scrolling */}
        <div className="mt-8 space-y-6">
          {/* Lesson Summary Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">📝</span>
              </div>
              Today's Lesson Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Topics Covered</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Past Tense Practice</li>
                  <li>• Vocabulary Building</li>
                  <li>• Pronunciation Drills</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Skills Practiced</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Speaking Confidence</li>
                  <li>• Grammar Application</li>
                  <li>• Listening Comprehension</li>
                </ul>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Next Session</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Review today's words</li>
                  <li>• Future tense introduction</li>
                  <li>• Conversation practice</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Resources Section */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">📚</span>
              </div>
              Learning Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Grammar Guide", desc: "Complete reference", color: "from-blue-400 to-blue-600" },
                { title: "Vocabulary Cards", desc: "Interactive flashcards", color: "from-green-400 to-green-600" },
                { title: "Pronunciation Tool", desc: "Audio practice", color: "from-purple-400 to-purple-600" },
                { title: "Progress Tracker", desc: "Track your journey", color: "from-orange-400 to-orange-600" }
              ].map((resource, index) => (
                <div key={index} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group">
                  <div className={`w-12 h-12 bg-gradient-to-br ${resource.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <span className="text-white font-bold text-lg">📖</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">{resource.title}</h4>
                  <p className="text-sm text-gray-600">{resource.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Space */}
          <div className="h-20"></div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedOneOnOneClassroom;
