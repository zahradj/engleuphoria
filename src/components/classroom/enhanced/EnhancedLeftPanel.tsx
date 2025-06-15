
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle,
  Trophy,
  Target,
  Star,
  Zap
} from "lucide-react";

interface User {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  avatar: string;
  level: number;
  isOnline: boolean;
}

interface RemoteUser extends User {
  xp: number;
  maxXp: number;
}

interface Goal {
  id: string;
  text: string;
  completed: boolean;
}

interface Achievement {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  color: string;
}

interface EnhancedLeftPanelProps {
  currentUser: User;
  remoteUser: RemoteUser;
  goals: Goal[];
  achievements: Achievement[];
  onGoalToggle: (goalId: string) => void;
}

export function EnhancedLeftPanel({ 
  currentUser, 
  remoteUser, 
  goals, 
  achievements, 
  onGoalToggle 
}: EnhancedLeftPanelProps) {
  return (
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
                onClick={() => onGoalToggle(goal.id)}
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
  );
}
