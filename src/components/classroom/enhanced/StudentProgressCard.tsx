
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";

interface RemoteUser {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  avatar: string;
  level: number;
  xp: number;
  maxXp: number;
  isOnline: boolean;
}

interface Achievement {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
}

interface StudentProgressCardProps {
  student: RemoteUser;
  achievements: Achievement[];
}

export function StudentProgressCard({ student, achievements }: StudentProgressCardProps) {
  return (
    <Card className="p-4 bg-white shadow-sm border border-gray-200">
      {/* Progress Header */}
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="text-yellow-500 w-5 h-5" />
        <h3 className="font-semibold text-gray-900">Student Progress</h3>
      </div>

      {/* Level and XP */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{student.name}</span>
          <Badge className="bg-blue-100 text-blue-700 text-xs">
            Level {student.level}
          </Badge>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>XP Progress</span>
            <span>{student.xp}/{student.maxXp}</span>
          </div>
          <Progress value={(student.xp / student.maxXp) * 100} className="h-2" />
        </div>
      </div>

      {/* Achievements Grid */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Achievements</h4>
        <div className="grid grid-cols-2 gap-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-3 rounded-lg text-center transition-all ${
                achievement.unlocked 
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <div className="text-lg mb-1">{achievement.icon}</div>
              <div className="text-xs font-medium">{achievement.name}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
