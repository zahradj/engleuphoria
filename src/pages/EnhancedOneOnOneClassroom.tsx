
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
  Star,
  Zap,
  Users,
  Clock
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const centerTabs = [
    { id: "whiteboard", label: "Whiteboard", icon: PenTool, color: "text-blue-600", bgColor: "bg-blue-50" },
    { id: "activities", label: "Activities", icon: Gamepad2, color: "text-purple-600", bgColor: "bg-purple-50" },
    { id: "ai", label: "AI Assistant", icon: Sparkles, badge: "New", color: "text-orange-600", bgColor: "bg-orange-50" },
    { id: "resources", label: "Resources", icon: Link, color: "text-green-600", bgColor: "bg-green-50" }
  ];

  const rightTabs = [
    { id: "chat", label: "Chat", icon: MessageCircle, color: "text-blue-600" },
    { id: "tasks", label: "Tasks", icon: BookOpen, color: "text-purple-600" },
    { id: "dictionary", label: "Dictionary", icon: Book, color: "text-orange-600" }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden relative">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-r from-pink-300 to-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Enhanced Top Header */}
      <div className="h-20 bg-white/80 backdrop-blur-xl border-b border-white/20 px-6 flex items-center justify-between shadow-lg relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                S
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <div className="font-bold text-gray-900 text-lg">Enhanced Classroom</div>
              <div className="text-sm text-gray-600 font-medium">Interactive Learning Session</div>
            </div>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 px-3 py-1 animate-pulse">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Connected
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/60 rounded-lg px-4 py-2 backdrop-blur-sm">
            <Clock size={16} className="text-gray-600" />
            <span className="text-xl font-bold text-gray-800">{formatTime(classTime)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant={mediaControls.isMuted ? "destructive" : "outline"}
            onClick={mediaControls.onToggleMute}
            className="bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200"
          >
            {mediaControls.isMuted ? <MicOff size={16} /> : <Mic size={16} />}
          </Button>
          <Button
            size="sm"
            variant={mediaControls.isCameraOff ? "destructive" : "outline"}
            onClick={mediaControls.onToggleCamera}
            className="bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200"
          >
            {mediaControls.isCameraOff ? <VideoOff size={16} /> : <Video size={16} />}
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
            <Users size={16} className="mr-2" />
            Active Session
          </Button>
        </div>
      </div>

      {/* Enhanced Main Layout */}
      <div className="h-[calc(100vh-5rem)] flex gap-6 p-6">
        {/* Enhanced Left Panel */}
        <div className="w-80 flex flex-col gap-6">
          {/* Enhanced Teacher Card */}
          <Card className="p-6 bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="w-20 h-20 ring-4 ring-white shadow-lg">
                  <AvatarImage src="/api/placeholder/100/100" />
                  <AvatarFallback className="bg-gradient-to-br from-teal-400 to-teal-600 text-white text-2xl font-bold">
                    T
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{currentUser.name}</h3>
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg">
                <Trophy size={12} className="mr-1" />
                Expert Teacher
              </Badge>
            </div>
          </Card>

          {/* Enhanced Progress Card */}
          <Card className="p-6 bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Trophy className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">Student Progress</h3>
                <p className="text-sm text-gray-600">Emma's Learning Journey</p>
              </div>
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                Level {remoteUser.level}
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-700">XP Progress</span>
                <span className="text-purple-600 font-bold">{remoteUser.xp}/{remoteUser.maxXp}</span>
              </div>
              <div className="relative">
                <Progress value={remoteUser.xp} className="h-3 bg-gray-200" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full h-3" style={{ width: `${remoteUser.xp}%` }}></div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Zap size={14} className="text-yellow-500" />
                <span>{100 - remoteUser.xp} XP to next level</span>
              </div>
            </div>
          </Card>

          {/* Enhanced Achievements Card */}
          <Card className="p-6 bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                <Star className="text-white" size={20} />
              </div>
              <h3 className="font-bold text-gray-900">Achievements</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement, index) => (
                <div
                  key={achievement.id}
                  className={`relative p-4 rounded-xl text-center transition-all duration-300 hover:scale-105 ${achievement.color} ${
                    achievement.unlocked ? 'text-white shadow-lg' : 'text-gray-400'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-2xl mb-2">{achievement.icon}</div>
                  <div className="text-xs font-bold">{achievement.name}</div>
                  {achievement.unlocked && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Star size={8} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Enhanced Today's Goals */}
          <Card className="p-6 bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 flex-1 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <Target className="text-white" size={20} />
              </div>
              <h3 className="font-bold text-gray-900">Today's Goals</h3>
            </div>
            <div className="space-y-4">
              {goals.map((goal, index) => (
                <div key={goal.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200">
                  <button
                    onClick={() => handleGoalToggle(goal.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      goal.completed 
                        ? 'bg-gradient-to-r from-green-400 to-green-600 border-green-500 text-white shadow-lg' 
                        : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                    }`}
                  >
                    {goal.completed && <CheckCircle size={14} />}
                  </button>
                  <span className={`text-sm font-medium flex-1 ${goal.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                    {goal.text}
                  </span>
                  {goal.completed && <Star size={14} className="text-yellow-500 animate-pulse" />}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Enhanced Center Panel */}
        <div className="flex-1">
          <Card className="h-full bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {/* Enhanced Learning Center Header */}
            <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-white/30">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-12 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Learning Center</h2>
                    <p className="text-sm text-gray-600 font-medium">Interactive Educational Space</p>
                  </div>
                </div>
                
                {/* Enhanced Page Navigation */}
                <div className="flex items-center gap-3 bg-white/80 rounded-lg p-2 backdrop-blur-sm">
                  <Button variant="ghost" size="sm" className="hover:bg-blue-100">
                    <ChevronLeft size={16} />
                  </Button>
                  <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md text-sm font-bold">
                    Page {currentPage}
                  </div>
                  <Button variant="ghost" size="sm" className="hover:bg-blue-100">
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
              
              {/* Enhanced Tab Navigation */}
              <div className="flex gap-3">
                {centerTabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeCenterTab === tab.id;
                  
                  return (
                    <Button
                      key={tab.id}
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveCenterTab(tab.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                          : `text-gray-600 hover:${tab.bgColor} hover:${tab.color} hover:shadow-md`
                      }`}
                    >
                      <IconComponent size={18} />
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 animate-pulse">
                          {tab.badge}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Tab Content */}
            <div className="flex-1 overflow-hidden">
              {activeCenterTab === "whiteboard" && (
                <div className="h-full p-6">
                  <div className="h-full bg-white rounded-xl shadow-inner border border-gray-100 overflow-hidden">
                    <OneOnOneWhiteboard />
                  </div>
                </div>
              )}
              {activeCenterTab === "activities" && (
                <div className="h-full p-6 overflow-y-auto">
                  <OneOnOneGames />
                </div>
              )}
              {activeCenterTab === "ai" && (
                <div className="h-full p-6 overflow-y-auto bg-gradient-to-br from-orange-50 to-yellow-50">
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
                <div className="h-full p-6 flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Link size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Educational Resources</h3>
                    <p className="text-gray-600 mb-6">Access curated learning materials and educational links.</p>
                    <Button className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white shadow-lg">
                      Browse Resources
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Enhanced Right Panel - Now with separate video and tabs sections */}
        <div className="w-80 flex flex-col gap-4">
          {/* Student Video Section */}
          <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="p-6 bg-gradient-to-r from-green-50 to-teal-50">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="w-20 h-20 ring-4 ring-white shadow-lg">
                    <AvatarImage src="/api/placeholder/100/100" />
                    <AvatarFallback className="bg-gradient-to-br from-teal-400 to-green-600 text-white text-2xl font-bold">
                      E
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{remoteUser.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                    <Star size={12} className="mr-1" />
                    Level {remoteUser.level}
                  </Badge>
                  <Badge className="bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                    Online
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Video Feed Placeholder */}
            <div className="p-4">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <Video size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Student Video Feed</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Chat/Tasks/Dictionary Tabs Section */}
          <Card className="flex-1 bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {/* Tab Navigation */}
            <div className="p-4 border-b border-white/20 bg-gray-50/50">
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
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                          : `text-gray-600 hover:bg-white hover:${tab.color} hover:shadow-md`
                      }`}
                    >
                      <IconComponent size={14} />
                      <span className="text-xs font-medium">{tab.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              {activeRightTab === "chat" && (
                <div className="h-full p-4">
                  <OneOnOneChat />
                </div>
              )}
              {activeRightTab === "tasks" && (
                <div className="h-full p-4">
                  <OneOnOneHomework />
                </div>
              )}
              {activeRightTab === "dictionary" && (
                <div className="h-full p-4">
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
