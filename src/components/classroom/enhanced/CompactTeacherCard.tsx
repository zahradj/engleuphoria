
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  avatar: string;
  level: number;
  isOnline: boolean;
}

interface CompactTeacherCardProps {
  user: User;
}

export function CompactTeacherCard({ user }: CompactTeacherCardProps) {
  return (
    <Card className="p-4 bg-white shadow-sm border border-gray-200">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-blue-500 text-white font-bold">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {user.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{user.name}</h3>
          <Badge className="bg-purple-100 text-purple-700 text-xs">
            Teacher
          </Badge>
        </div>
      </div>
    </Card>
  );
}
