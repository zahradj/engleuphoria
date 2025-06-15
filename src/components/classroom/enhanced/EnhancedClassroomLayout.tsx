
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Star,
  Trophy,
  Target,
  MessageCircle,
  Clock,
  CheckCircle
} from "lucide-react";

interface EnhancedClassroomLayoutProps {
  children: React.ReactNode;
  currentUser: {
    id: string;
    name: string;
    role: 'teacher' | 'student';
    avatar?: string;
    level?: number;
    xp?: number;
    maxXp?: number;
  };
  remoteUser?: {
    id: string;
    name: string;
    role: 'teacher' | 'student';
    avatar?: string;
    level?: number;
    xp?: number;
    isOnline?: boolean;
  };
  connectionStatus: {
    isConnected: boolean;
    quality: 'excellent' | 'good' | 'poor';
    duration: string;
  };
  mediaControls: {
    isMuted: boolean;
    isCameraOff: boolean;
    onToggleMute: () => void;
    onToggleCamera: () => void;
    onEndCall: () => void;
  };
  goals: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  achievements: Array<{
    id: string;
    name: string;
    icon: string;
    unlocked: boolean;
  }>;
  onGoalToggle: (goalId: string) => void;
}

export function EnhancedClassroomLayout({
  children,
  currentUser,
  remoteUser,
  connectionStatus,
  mediaControls,
  goals,
  achievements,
  onGoalToggle
}: EnhancedClassroomLayoutProps) {
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getQualityBg = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Enhanced Header */}
      <div className="h-16 bg-white/80 backdrop-blur-xl border-b border-white/20 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getQualityBg(connectionStatus.quality)} animate-pulse`}></div>
            <span className="text-sm font-medium text-gray-700">
              {connectionStatus.isConnected ? 'Connected' : 'Disconnected'}
            </span>
            <Badge variant="outline" className="text-xs">
              {connectionStatus.duration}
            </Badge>
          </div>
        </div>

        {/* Media Controls */}
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
          <Button
            size="sm"
            variant="destructive"
            onClick={mediaControls.onEndCall}
          >
            <PhoneOff size={16} />
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="h-[calc(100vh-4rem)] flex gap-4 p-4">
        {/* Left Panel - Teacher/Student Info & Progress */}
        <div className="w-80 flex flex-col gap-4">
          {/* Current User Card */}
          <Card className="p-4 bg-white/90 backdrop-blur-sm border-white/20 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                    {currentUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{currentUser.name}</h3>
                <Badge className={currentUser.role === 'teacher' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}>
                  {currentUser.role === 'teacher' ? 'Teacher' : `Level ${currentUser.level || 1}`}
                </Badge>
              </div>
            </div>

            {currentUser.role === 'student' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>XP Progress</span>
                  <span>{currentUser.xp || 0}/{currentUser.maxXp || 100}</span>
                </div>
                <Progress value={((currentUser.xp || 0) / (currentUser.maxXp || 100)) * 100} className="h-2" />
              </div>
            )}
          </Card>

          {/* Remote User Card */}
          {remoteUser && (
            <Card className="p-4 bg-white/90 backdrop-blur-sm border-white/20 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={remoteUser.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-600 text-white font-bold">
                      {remoteUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    remoteUser.isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{remoteUser.name}</h3>
                  <Badge className={remoteUser.role === 'teacher' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}>
                    {remoteUser.role === 'teacher' ? 'Teacher' : `Level ${remoteUser.level || 1}`}
                  </Badge>
                </div>
              </div>

              {remoteUser.role === 'student' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>XP Progress</span>
                    <span>{remoteUser.xp || 0}/100</span>
                  </div>
                  <Progress value={remoteUser.xp || 0} className="h-2" />
                </div>
              )}
            </Card>
          )}

          {/* Goals Card */}
          <Card className="p-4 bg-white/90 backdrop-blur-sm border-white/20 shadow-xl flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-orange-500" size={20} />
              <h3 className="font-semibold text-gray-900">Today's Goals</h3>
            </div>
            <div className="space-y-3">
              {goals.map((goal) => (
                <div key={goal.id} className="flex items-center gap-3">
                  <button
                    onClick={() => onGoalToggle(goal.id)}
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
                </div>
              ))}
            </div>
          </Card>

          {/* Achievements Card */}
          <Card className="p-4 bg-white/90 backdrop-blur-sm border-white/20 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="text-yellow-500" size={20} />
              <h3 className="font-semibold text-gray-900">Achievements</h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl transition-all ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                  title={achievement.name}
                >
                  {achievement.icon}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Center Panel - Main Content */}
        <div className="flex-1">
          {children}
        </div>

        {/* Right Panel - Chat & Tools */}
        <div className="w-80">
          <Card className="h-full bg-white/90 backdrop-blur-sm border-white/20 shadow-xl">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b">
                <div className="flex items-center gap-2">
                  <MessageCircle className="text-blue-500" size={20} />
                  <h3 className="font-semibold text-gray-900">Chat & Tools</h3>
                </div>
              </div>
              <div className="flex-1 p-4">
                {/* Chat content will be rendered here */}
                <div className="text-center text-gray-500 mt-8">
                  <MessageCircle size={32} className="mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Chat and tools will appear here</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
