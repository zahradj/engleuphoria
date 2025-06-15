
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Trophy, Target, Award, Zap, BookOpen, Crown, Users, CheckCircle } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  avatar?: string;
}

interface UnifiedVideoSectionProps {
  enhancedClassroom: any;
  currentUser: UserProfile;
  studentXP?: number;
  onAwardPoints?: () => void;
  showRewardPopup?: boolean;
}

export function UnifiedVideoSection({
  enhancedClassroom,
  currentUser,
  studentXP = 1250,
  onAwardPoints,
  showRewardPopup = false
}: UnifiedVideoSectionProps) {
  const isTeacher = currentUser.role === 'teacher';
  const studentLevel = Math.floor(studentXP / 100);
  const xpInCurrentLevel = studentXP % 100;

  // Enhanced achievement badges with better styling
  const achievements = [
    { id: 'first-steps', name: 'First Steps', icon: Target, earned: true, color: 'from-emerald-400 to-green-500', bgColor: 'from-emerald-50 to-green-50' },
    { id: 'word-master', name: 'Word Master', icon: Trophy, earned: true, color: 'from-blue-400 to-cyan-500', bgColor: 'from-blue-50 to-cyan-50' },
    { id: 'speaker', name: 'Speaker', icon: Star, earned: true, color: 'from-purple-400 to-violet-500', bgColor: 'from-purple-50 to-violet-50' },
    { id: 'grammar-pro', name: 'Grammar Pro', icon: Award, earned: false, color: 'from-gray-300 to-gray-400', bgColor: 'from-gray-50 to-gray-100' }
  ];

  const todaysGoals = [
    { task: 'Learn 5 new words', completed: true },
    { task: 'Practice pronunciation', completed: true },
    { task: 'Complete worksheet', completed: false }
  ];

  return (
    <div className="h-full flex flex-col gap-5">
      {/* Enhanced Teacher Video Card */}
      <Card className="p-5 bg-white/85 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-black/5">
        <div className="aspect-video bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-xl flex items-center justify-center relative overflow-hidden group">
          {/* Animated background layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/40 to-purple-200/40 animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)]"></div>
          
          <div className="text-center relative z-10">
            <div className="relative mb-4">
              <div className="w-18 h-18 bg-gradient-to-br from-blue-500 via-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto shadow-2xl ring-4 ring-white/50">
                {isTeacher ? (
                  <Crown className="h-8 w-8 text-white" />
                ) : (
                  <span className="text-2xl font-bold text-white">T</span>
                )}
              </div>
              {/* Enhanced status ring */}
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 rounded-full opacity-80 animate-pulse"></div>
              <div className="absolute -inset-1 bg-white rounded-full"></div>
            </div>
            
            <div className="space-y-2">
              <p className="font-bold text-gray-800 text-lg">Teacher Sarah</p>
              <Badge className="bg-gradient-to-r from-emerald-400 to-green-500 text-white border-0 shadow-lg px-3 py-1">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                Online & Ready
              </Badge>
              <div className="flex items-center justify-center gap-2 mt-3">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600 font-medium">Interactive Session</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Enhanced Student Progress Card */}
      <Card className="p-5 bg-white/85 backdrop-blur-sm border-0 shadow-2xl rounded-2xl ring-1 ring-black/5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Progress
            </span>
          </h3>
          <Badge className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white border-0 shadow-lg px-3 py-1">
            <Trophy className="h-3 w-3 mr-1" />
            Level {studentLevel}
          </Badge>
        </div>
        
        {/* Enhanced XP Progress Section */}
        <div className="mb-5">
          <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
            <span className="font-semibold">XP Progress</span>
            <span className="font-bold text-orange-600">{xpInCurrentLevel}/100 XP</span>
          </div>
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 h-4 rounded-full transition-all duration-1000 ease-out relative shadow-lg" 
                style={{ width: `${xpInCurrentLevel}%` }}
              >
                {/* Enhanced shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
            {/* XP gain animation */}
            {showRewardPopup && (
              <div className="absolute right-0 -top-10 text-green-600 font-bold text-sm animate-bounce bg-green-50 px-2 py-1 rounded-lg shadow-lg">
                +50 XP ✨
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Teacher Award Button */}
        {isTeacher && onAwardPoints && (
          <Button 
            onClick={onAwardPoints}
            className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ring-2 ring-orange-200 hover:ring-orange-300"
          >
            <Star size={20} className="mr-2 animate-pulse" />
            Award Achievement Star
            <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">+50 XP</span>
          </Button>
        )}
      </Card>

      {/* Enhanced Achievement Badges */}
      <Card className="p-5 bg-white/85 backdrop-blur-sm border-0 shadow-2xl rounded-2xl ring-1 ring-black/5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-violet-500 rounded-lg flex items-center justify-center shadow-lg">
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Achievements
          </span>
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {achievements.map((achievement) => {
            const IconComponent = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`relative p-4 rounded-xl transition-all duration-300 hover:scale-105 border-2 ${
                  achievement.earned 
                    ? `bg-gradient-to-br ${achievement.bgColor} border-white shadow-xl ring-2 ring-black/5` 
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 opacity-60 shadow-sm'
                }`}
              >
                {achievement.earned && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent rounded-xl"></div>
                )}
                <div className="relative text-center">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center mx-auto mb-3 shadow-lg ring-2 ring-white/50`}>
                    <IconComponent size={18} className="text-white" />
                  </div>
                  <p className="text-xs font-bold text-gray-700 leading-tight">{achievement.name}</p>
                  {achievement.earned && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                      <CheckCircle size={8} className="text-white" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Enhanced Today's Goals */}
      <Card className="p-5 bg-white/85 backdrop-blur-sm border-0 shadow-2xl rounded-2xl ring-1 ring-black/5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Today's Goals
          </span>
        </h3>
        <div className="space-y-3">
          {todaysGoals.map((goal, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200 border border-gray-100">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                goal.completed 
                  ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg ring-2 ring-emerald-200' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}>
                {goal.completed && (
                  <CheckCircle size={12} className="text-white" />
                )}
              </div>
              <span className={`text-sm transition-all duration-200 flex-1 ${
                goal.completed 
                  ? 'text-gray-600 line-through' 
                  : 'text-gray-800 font-medium'
              }`}>
                {goal.task}
              </span>
              {goal.completed && (
                <div className="ml-auto">
                  <Star size={14} className="text-yellow-500" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Enhanced Progress indicator */}
        <div className="mt-5 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
            <span className="font-semibold">Daily Progress</span>
            <span className="font-bold text-blue-600">2/3 completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-violet-500 h-3 rounded-full transition-all duration-700 shadow-sm" style={{ width: '67%' }}>
              <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
