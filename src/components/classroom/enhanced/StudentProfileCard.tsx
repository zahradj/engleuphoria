
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

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

interface StudentProfileCardProps {
  student: RemoteUser;
}

export function StudentProfileCard({ student }: StudentProfileCardProps) {
  return (
    <Card className="p-6 bg-white shadow-sm border border-gray-200">
      <div className="text-center">
        {/* Large Avatar */}
        <div className="relative inline-block mb-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={student.avatar} />
            <AvatarFallback className="bg-green-500 text-white text-2xl font-bold">
              {student.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {student.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </div>
        
        {/* Student Info */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{student.name}</h3>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <Badge className="bg-blue-100 text-blue-700">
            Level {student.level}
          </Badge>
          <Badge className="bg-green-100 text-green-700">
            Online
          </Badge>
        </div>

        {/* XP Progress */}
        <div className="w-full">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{student.xp}/{student.maxXp} XP</span>
          </div>
          <Progress value={(student.xp / student.maxXp) * 100} className="h-3" />
        </div>
      </div>
    </Card>
  );
}
