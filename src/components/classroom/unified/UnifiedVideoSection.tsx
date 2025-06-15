
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Trophy, Target, Award, Zap, BookOpen } from "lucide-react";

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
    { id: 'first-steps', name: 'First Steps', icon: Target, earned: true, color: 'from-emerald-400 to-green-500', bgColor: 'bg-emerald-50' },
    { id: 'word-master', name: 'Word Master', icon: Trophy, earned: true, color: 'from-blue-400 to-cyan-500', bgColor: 'bg-blue-50' },
    { id: 'speaker', name: 'Speaker', icon: Star, earned: true, color: 'from-purple-400 to-violet-500', bgColor: 'bg-purple-50' },
    { id: 'grammar-pro', name: 'Grammar Pro', icon: Award, earned: false, color: 'from-gray-300 to-gray-400', bgColor: 'bg-gray-50' }
  ];

  const todaysGoals = [
    { task: 'Learn 5 new words', completed: true },
    { task: 'Practice pronunciation', completed: true },
    { task: 'Complete worksheet', completed: false }
  ];

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Enhanced Teacher Video with Modern Styling */}
      <Card className="p-4 pt-2 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-xl flex items-center justify-center relative overflow-hidden group">
          {/* Subtle animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-purple-200/30 animate-pulse"></div>
          
          <div className="text-center relative z-10">
            <div className="relative mb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <span className="text-2xl font-bold text-white">T</span>
              </div>
              {/* Status ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full opacity-80 animate-pulse"></div>
            </div>
            
            <p className="font-semibold text-gray-800 mb-2">Teacher Sarah</p>
            <Badge className="bg-gradient-to-r from-emerald-400 to-green-500 text-white border-0 shadow-md">
              Online
            </Badge>
          </div>
        </div>
      </Card>

      {/* Enhanced Student Progress with Animation */}
      <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            Progress
          </h3>
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-md">
            Level {studentLevel}
          </Badge>
        </div>
        
        {/* Enhanced XP Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
            <span className="font-medium">XP Progress</span>
            <span className="font-bold">{xpInCurrentLevel}/100</span>
          </div>
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-700 ease-out relative" 
                style={{ width: `${xpInCurrentLevel}%` }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
            {/* XP gain animation placeholder */}
            {showRewardPopup && (
              <div className="absolute right-0 -top-8 text-green-600 font-bold text-sm animate-bounce">
                +50 XP
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Teacher Award Button */}
        {isTeacher && onAwardPoints && (
          <Button 
            onClick={onAwardPoints}
            className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            <Star size={18} className="mr-2 animate-pulse" />
            Award Star (+50 XP)
          </Button>
        )}
      </Card>

      {/* Enhanced Achievement Badges */}
      <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
          Achievements
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement) => {
            const IconComponent = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`relative p-3 rounded-xl text-center transition-all duration-200 hover:scale-105 ${
                  achievement.earned 
                    ? `${achievement.bgColor} border border-white shadow-md` 
                    : 'bg-gray-100 border border-gray-200 opacity-60'
                }`}
              >
                {achievement.earned && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-xl"></div>
                )}
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center mx-auto mb-2 shadow-sm`}>
                  <IconComponent size={14} className="text-white" />
                </div>
                <p className="text-xs font-medium text-gray-700">{achievement.name}</p>
                {achievement.earned && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Enhanced Today's Goals */}
      <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-500" />
          Today's Goals
        </h3>
        <div className="space-y-3">
          {todaysGoals.map((goal, index) => (
            <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50/80 transition-colors">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200 ${
                goal.completed 
                  ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-md' 
                  : 'bg-gray-300'
              }`}>
                {goal.completed && (
                  <div className="text-white text-xs">✓</div>
                )}
              </div>
              <span className={`text-sm transition-all duration-200 ${
                goal.completed 
                  ? 'text-gray-600 line-through' 
                  : 'text-gray-800 font-medium'
              }`}>
                {goal.task}
              </span>
              {goal.completed && (
                <div className="ml-auto">
                  <Star size={12} className="text-yellow-500" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Progress indicator */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
            <span>Daily Progress</span>
            <span>2/3 completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-300" style={{ width: '67%' }}></div>
          </div>
        </div>
      </Card>
    </div>
  );
}
