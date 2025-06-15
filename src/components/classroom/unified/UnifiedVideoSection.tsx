
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Trophy, Target, Award, Zap, BookOpen, Crown, Users, CheckCircle, Sparkles, TrendingUp } from "lucide-react";

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

  const achievements = [
    { 
      id: 'first-steps', 
      name: 'First Steps', 
      icon: Target, 
      earned: true, 
      gradient: 'from-emerald-400 via-green-500 to-teal-600', 
      bgGradient: 'from-emerald-50 via-green-50 to-teal-50',
      shadow: 'shadow-emerald-200'
    },
    { 
      id: 'word-master', 
      name: 'Word Master', 
      icon: Trophy, 
      earned: true, 
      gradient: 'from-blue-400 via-cyan-500 to-sky-600', 
      bgGradient: 'from-blue-50 via-cyan-50 to-sky-50',
      shadow: 'shadow-blue-200'
    },
    { 
      id: 'speaker', 
      name: 'Speaker', 
      icon: Star, 
      earned: true, 
      gradient: 'from-purple-400 via-violet-500 to-indigo-600', 
      bgGradient: 'from-purple-50 via-violet-50 to-indigo-50',
      shadow: 'shadow-purple-200'
    },
    { 
      id: 'grammar-pro', 
      name: 'Grammar Pro', 
      icon: Award, 
      earned: false, 
      gradient: 'from-gray-300 to-gray-400', 
      bgGradient: 'from-gray-50 to-gray-100',
      shadow: 'shadow-gray-200'
    }
  ];

  const todaysGoals = [
    { task: 'Learn 5 new words', completed: true, xp: 25 },
    { task: 'Practice pronunciation', completed: true, xp: 30 },
    { task: 'Complete worksheet', completed: false, xp: 45 }
  ];

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Enhanced Video Card with Real Video Simulation */}
      <Card className="p-6 glass-enhanced backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden ring-1 ring-white/20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-white/20 pointer-events-none"></div>
        
        <div className="aspect-video bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center relative overflow-hidden group">
          {/* Video simulation background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200/60 via-purple-200/40 to-violet-200/60 animate-pulse-gentle"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.2),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(147,51,234,0.15),transparent_50%)]"></div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-white/60 rounded-full animate-float-particle"></div>
          <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-blue-300/80 rounded-full animate-float-particle" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-6 left-8 w-1 h-1 bg-purple-300/70 rounded-full animate-float-particle" style={{ animationDelay: '2s' }}></div>
          
          <div className="text-center relative z-10">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl ring-4 ring-white/60">
                {isTeacher ? (
                  <Crown className="h-10 w-10 text-white" />
                ) : (
                  <span className="text-3xl font-bold text-white">T</span>
                )}
              </div>
              
              {/* Enhanced animated status ring */}
              <div className="absolute -inset-3 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 rounded-2xl opacity-80 animate-pulse-gentle"></div>
              <div className="absolute -inset-2 bg-white rounded-2xl"></div>
            </div>
            
            <div className="space-y-3">
              <p className="font-bold text-gray-800 text-xl">Teacher Sarah</p>
              <Badge className="bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 text-white border-0 shadow-xl px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse-gentle"></div>
                <Sparkles className="h-3 w-3 mr-2" />
                Live & Interactive
              </Badge>
              <div className="flex items-center justify-center gap-3 mt-4">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600 font-semibold">Enhanced Session</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-gentle"></div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Enhanced Progress Card */}
      <Card className="p-6 glass-enhanced backdrop-blur-xl border-0 shadow-2xl rounded-3xl ring-1 ring-white/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-white/20 pointer-events-none"></div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="font-bold text-gray-800 flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-xl ring-3 ring-white/50">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent text-lg">
              Learning Progress
            </span>
          </h3>
          <Badge className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white border-0 shadow-xl px-4 py-2 rounded-full">
            <Trophy className="h-4 w-4 mr-2" />
            Level {studentLevel}
          </Badge>
        </div>
        
        {/* Enhanced XP Progress Section */}
        <div className="mb-6 relative z-10">
          <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
            <span className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              XP Progress
            </span>
            <span className="font-bold text-orange-600 text-lg">{xpInCurrentLevel}/100 XP</span>
          </div>
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 h-5 rounded-full transition-all duration-1000 ease-out relative shadow-lg" 
                style={{ width: `${xpInCurrentLevel}%` }}
              >
                {/* Enhanced shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
                <div className="absolute inset-y-0 right-0 w-1 bg-white/60 rounded-full"></div>
              </div>
            </div>
            
            {/* XP gain animation */}
            {showRewardPopup && (
              <div className="absolute right-0 -top-12 text-green-600 font-bold text-sm animate-bounce-in bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-xl shadow-lg border border-green-200">
                <Sparkles className="inline h-3 w-3 mr-1" />
                +50 XP ✨
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Teacher Award Button */}
        {isTeacher && onAwardPoints && (
          <Button 
            onClick={onAwardPoints}
            className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white font-bold py-4 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ring-2 ring-orange-200 hover:ring-orange-300 relative z-10 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Star size={22} className="mr-3 animate-pulse-gentle" />
            Award Achievement Star
            <span className="ml-3 text-xs bg-white/25 px-3 py-1 rounded-full font-semibold">+50 XP</span>
          </Button>
        )}
      </Card>

      {/* Enhanced Achievement Badges */}
      <Card className="p-6 glass-enhanced backdrop-blur-xl border-0 shadow-2xl rounded-3xl ring-1 ring-white/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-white/20 pointer-events-none"></div>
        
        <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-xl ring-3 ring-white/50">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent text-lg">
            Achievements
          </span>
        </h3>
        <div className="grid grid-cols-2 gap-4 relative z-10">
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`relative p-5 rounded-2xl transition-all duration-500 hover:scale-105 border-2 overflow-hidden group ${
                  achievement.earned 
                    ? `bg-gradient-to-br ${achievement.bgGradient} border-white ${achievement.shadow} shadow-xl ring-2 ring-white/30` 
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 opacity-70 shadow-sm hover:opacity-90'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {achievement.earned && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/20 to-transparent rounded-2xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-slow"></div>
                  </>
                )}
                
                <div className="relative text-center">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${achievement.gradient} flex items-center justify-center mx-auto mb-4 shadow-xl ring-3 ring-white/60 transition-transform group-hover:scale-110`}>
                    <IconComponent size={20} className="text-white" />
                  </div>
                  <p className="text-xs font-bold text-gray-700 leading-tight">{achievement.name}</p>
                  
                  {achievement.earned && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center animate-scale-in">
                      <CheckCircle size={10} className="text-white" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Enhanced Today's Goals */}
      <Card className="p-6 glass-enhanced backdrop-blur-xl border-0 shadow-2xl rounded-3xl ring-1 ring-white/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-white/20 pointer-events-none"></div>
        
        <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-cyan-500 to-sky-600 rounded-xl flex items-center justify-center shadow-xl ring-3 ring-white/50">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent text-lg">
            Today's Goals
          </span>
        </h3>
        
        <div className="space-y-4 relative z-10">
          {todaysGoals.map((goal, index) => (
            <div key={index} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-white/50 hover:to-blue-50/50 transition-all duration-300 border border-white/40 shadow-sm hover:shadow-md group">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                goal.completed 
                  ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg ring-3 ring-emerald-200' 
                  : 'bg-gray-300 hover:bg-gray-400 group-hover:scale-110'
              }`}>
                {goal.completed && (
                  <CheckCircle size={14} className="text-white" />
                )}
              </div>
              
              <div className="flex-1">
                <span className={`text-sm transition-all duration-200 ${
                  goal.completed 
                    ? 'text-gray-600 line-through' 
                    : 'text-gray-800 font-medium group-hover:text-gray-900'
                }`}>
                  {goal.task}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {goal.completed && (
                  <Badge className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-1">
                    +{goal.xp} XP
                  </Badge>
                )}
                {goal.completed && (
                  <Star size={16} className="text-yellow-500" />
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Enhanced Progress indicator */}
        <div className="mt-6 pt-5 border-t border-white/40 relative z-10">
          <div className="flex justify-between items-center text-xs text-gray-600 mb-3">
            <span className="font-semibold flex items-center gap-2">
              <Target className="h-3 w-3 text-blue-500" />
              Daily Progress
            </span>
            <span className="font-bold text-blue-600 text-sm">2/3 completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner overflow-hidden">
            <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-violet-500 h-4 rounded-full transition-all duration-700 shadow-lg relative" style={{ width: '67%' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer rounded-full"></div>
              <div className="absolute inset-y-0 right-0 w-1 bg-white/60 rounded-full"></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
