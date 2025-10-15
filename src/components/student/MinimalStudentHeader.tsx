import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MinimalStudentHeaderProps {
  studentName: string;
  studentId: string;
  hasProfile?: boolean;
  studentProfile?: any;
}

export const MinimalStudentHeader: React.FC<MinimalStudentHeaderProps> = ({
  studentName,
  studentId,
  hasProfile = false,
  studentProfile
}) => {
  const initials = studentName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="sticky top-0 z-10 border-b-2 border-purple-200/50 bg-gradient-to-r from-purple-100/80 via-pink-100/80 to-blue-100/80 backdrop-blur-lg shadow-lg">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-3 border-purple-400 shadow-lg shadow-purple-500/50 ring-2 ring-pink-300">
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white font-bold text-base">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {studentName}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-purple-600 font-semibold">
                ID: {studentId}
              </span>
              {hasProfile && studentProfile && (
                <Badge variant="secondary" className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 border-0 font-bold shadow-md">
                  ⭐ {studentProfile.points || 0} XP
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Button 
          variant="ghost" 
          size="sm" 
          className="text-purple-600 hover:bg-purple-100 hover:text-purple-700 transition-colors relative rounded-xl shadow-md"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-pink-500 rounded-full animate-pulse"></span>
        </Button>
      </div>
    </div>
  );
};