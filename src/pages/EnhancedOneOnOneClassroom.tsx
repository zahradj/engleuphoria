
import React, { useState } from "react";
import { useOneOnOneClassroom } from "@/hooks/useOneOnOneClassroom";
import { useEnhancedClassroom } from "@/hooks/useEnhancedClassroom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  PenTool, 
  Gamepad2, 
  Sparkles, 
  Link,
  CheckCircle,
  Trophy,
  Target,
  MessageCircle,
  BookOpen,
  Book,
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  ChevronLeft,
  ChevronRight,
  Star
} from "lucide-react";
import { OneOnOneWhiteboard } from "@/components/classroom/oneonone/OneOnOneWhiteboard";
import { OneOnOneGames } from "@/components/classroom/oneonone/OneOnOneGames";
import { EnhancedAIAssistant } from "@/components/classroom/oneonone/ai/EnhancedAIAssistant";
import { OneOnOneChat } from "@/components/classroom/oneonone/OneOnOneChat";
import { OneOnOneHomework } from "@/components/classroom/oneonone/OneOnOneHomework";
import { EnhancedDictionary } from "@/components/classroom/oneonone/dictionary/EnhancedDictionary";

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
    { id: '1', name: 'First Steps', icon: '✓', unlocked: true, color: 'bg-green-500' },
    { id: '2', name: 'Word Master', icon: '📚', unlocked: true, color: 'bg-blue-500' },
    { id: '3', name: 'Speaker', icon: '🎤', unlocked: true, color: 'bg-purple-500' },
    { id: '4', name: 'Grammar Pro', icon: 'G', unlocked: false, color: 'bg-gray-300' }
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const centerTabs = [
    { id: "whiteboard", label: "Whiteboard", icon: PenTool },
    { id: "activities", label: "Activities", icon: Gamepad2 },
    { id: "ai", label: "AI Assistant", icon: Sparkles, badge: "Limited" },
    { id: "resources", label: "Resources", icon: Link }
  ];

  const rightTabs = [
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "tasks", label: "Tasks", icon: BookOpen },
    { id: "dictionary", label: "Dictionary", icon: Book }
  ];

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {/* Top Header */}
      <div className="h-16 bg-white border-b px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
              S
            </div>
            <div>
              <div className="font-semibold">Student</div>
              <div className="text-xs text-gray-500">Enhanced Classroom</div>
            </div>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-200">
            Connecting...
          </Badge>
        </div>

        <div className="text-lg font-semibold">
          {formatTime(classTime)}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={mediaControls.isMuted ? "destructive" : "outline"}
            onClick={mediaControls.onToggleMute}
          >
            {mediaControls.isMuted ? <MicOff size={16} /> : <Mic size={16} />}
          </Button>
          <Button
            size="sm"
            variant={mediaControls.isCameraOff ? "destructive" : "outline"}
            onClick={mediaControls.onToggleCamera}
          >
            {mediaControls.isCameraOff ? <VideoOff size={16} /> : <Video size={16} />}
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
            Join Class
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="h-[calc(100vh-4rem)] flex gap-4 p-4">
        {/* Left Panel */}
        <div className="w-80 flex flex-col gap-4">
          {/* Teacher Card */}
          <Card className="p-4 bg-blue-50">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-16 h-16 mb-3">
                <AvatarImage src="/api/placeholder/100/100" />
                <AvatarFallback className="bg-teal-500 text-white text-xl font-bold">
                  T
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-gray-900">{currentUser.name}</h3>
              <Badge className="bg-green-100 text-green-700 mt-1">
                Online
              </Badge>
            </div>
          </Card>

          {/* Progress Card */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="text-yellow-500" size={20} />
              <h3 className="font-semibold">Progress</h3>
              <Badge className="bg-yellow-100 text-yellow-700 ml-auto">
                Level {remoteUser.level}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>XP Progress</span>
                <span>{remoteUser.xp}/{remoteUser.maxXp}</span>
              </div>
              <Progress value={remoteUser.xp} className="h-2" />
            </div>
          </Card>

          {/* Achievements Card */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="text-yellow-500" size={20} />
              <h3 className="font-semibold">Achievements</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg text-center transition-all ${achievement.color} ${
                    achievement.unlocked ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  <div className="text-lg mb-1">{achievement.icon}</div>
                  <div className="text-xs font-medium">{achievement.name}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Today's Goals */}
          <Card className="p-4 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Target className="text-orange-500" size={20} />
              <h3 className="font-semibold">Today's Goals</h3>
            </div>
            <div className="space-y-3">
              {goals.map((goal) => (
                <div key={goal.id} className="flex items-center gap-3">
                  <button
                    onClick={() => handleGoalToggle(goal.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      goal.completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {goal.completed && <CheckCircle size={12} />}
                  </button>
                  <span className={`text-sm ${goal.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                    {goal.text}
                  </span>
                  {goal.completed && <Star size={12} className="text-yellow-500 ml-auto" />}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Center Panel */}
        <div className="flex-1">
          <Card className="h-full flex flex-col">
            {/* Learning Center Header */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Learning Center</h2>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <ChevronLeft size={16} />
                  </Button>
                  <span className="text-sm">Page {currentPage}</span>
                  <Button variant="ghost" size="sm">
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex gap-2">
                {centerTabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeCenterTab === tab.id;
                  
                  return (
                    <Button
                      key={tab.id}
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveCenterTab(tab.id)}
                      className={`flex items-center gap-2 ${
                        isActive ? 'bg-blue-600 text-white' : 'text-gray-600'
                      }`}
                    >
                      <IconComponent size={16} />
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {tab.badge}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              {activeCenterTab === "whiteboard" && (
                <div className="h-full p-4">
                  <OneOnOneWhiteboard />
                </div>
              )}
              {activeCenterTab === "activities" && (
                <div className="h-full p-4 overflow-y-auto">
                  <OneOnOneGames />
                </div>
              )}
              {activeCenterTab === "ai" && (
                <div className="h-full p-4 overflow-y-auto">
                  <EnhancedAIAssistant
                    studentProfile={{
                      level: "Intermediate",
                      weaknesses: ["Past tense", "Pronunciation"],
                      recentTopics: ["Animals", "Daily routine"],
                      interests: ["Sports", "Music"]
                    }}
                    onContentGenerated={(content, type) => console.log('Generated:', content, type)}
                    onInsertToWhiteboard={(content) => console.log('Insert:', content)}
                  />
                </div>
              )}
              {activeCenterTab === "resources" && (
                <div className="h-full p-4 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Link size={32} className="mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Educational Resources</h3>
                    <p className="text-sm">Access educational materials and links.</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="w-80">
          <Card className="h-full flex flex-col">
            {/* Student Video Section */}
            <div className="p-4 border-b bg-green-50">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-16 h-16 mb-3">
                  <AvatarImage src="/api/placeholder/100/100" />
                  <AvatarFallback className="bg-teal-500 text-white text-xl font-bold">
                    E
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-gray-900">{remoteUser.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-yellow-100 text-yellow-700">
                    Level {remoteUser.level}
                  </Badge>
                  <Badge className="bg-green-100 text-green-700">
                    Online
                  </Badge>
                </div>
              </div>
            </div>

            {/* Right Tab Navigation */}
            <div className="p-3 border-b">
              <div className="flex gap-1">
                {rightTabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeRightTab === tab.id;
                  
                  return (
                    <Button
                      key={tab.id}
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveRightTab(tab.id)}
                      className="flex items-center gap-2"
                    >
                      <IconComponent size={14} />
                      <span className="text-xs">{tab.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Right Tab Content */}
            <div className="flex-1 overflow-hidden">
              {activeRightTab === "chat" && (
                <div className="h-full p-3">
                  <OneOnOneChat />
                </div>
              )}
              {activeRightTab === "tasks" && (
                <div className="h-full p-3">
                  <OneOnOneHomework />
                </div>
              )}
              {activeRightTab === "dictionary" && (
                <div className="h-full p-3">
                  <EnhancedDictionary onAddToVocab={(word, def) => console.log('Add vocab:', word, def)} />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedOneOnOneClassroom;
