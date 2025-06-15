
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle,
  Trophy,
  Target,
  Star
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
    <div className="h-full flex flex-col gap-3">
      {/* Teacher Card - Simplified */}
      <Card className="p-4 bg-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/api/placeholder/100/100" />
              <AvatarFallback className="bg-blue-500 text-white font-bold">
                T
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{currentUser.name}</h3>
            <Badge className="bg-purple-100 text-purple-700 text-xs">
              Teacher
            </Badge>
          </div>
        </div>
      </Card>

      {/* Student Progress - Simplified */}
      <Card className="p-4 bg-white shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <Trophy className="text-yellow-500" size={20} />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Student Progress</h3>
            <p className="text-xs text-gray-600">{remoteUser.name}</p>
          </div>
          <Badge className="bg-yellow-100 text-yellow-700 text-xs">
            Level {remoteUser.level}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">XP Progress</span>
            <span className="font-medium">{remoteUser.xp}/{remoteUser.maxXp}</span>
          </div>
          <Progress value={remoteUser.xp} className="h-2" />
        </div>
      </Card>

      {/* Achievements - Compact Grid */}
      <Card className="p-4 bg-white shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <Star className="text-orange-500" size={20} />
          <h3 className="font-semibold text-gray-900">Achievements</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-3 rounded-lg text-center transition-all ${achievement.color} ${
                achievement.unlocked ? 'text-white shadow-sm' : 'text-gray-400'
              }`}
            >
              <div className="text-lg mb-1">{achievement.icon}</div>
              <div className="text-xs font-medium">{achievement.name}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Goals - Scrollable */}
      <Card className="p-4 bg-white shadow-md flex-1 min-h-0">
        <div className="flex items-center gap-2 mb-3">
          <Target className="text-green-500" size={20} />
          <h3 className="font-semibold text-gray-900">Today's Goals</h3>
        </div>
        <div className="space-y-3 overflow-y-auto">
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
              <span className={`text-sm flex-1 ${goal.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                {goal.text}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
