import React, { useEffect, useState } from "react";
import { Clock, Users, Star, Trophy, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import englePhoriaLogo from "@/assets/englephoria-logo.png";
import { AnimatedXPCounter } from "./rewards/AnimatedXPCounter";
interface JoyfulClassroomHeaderProps {
  classTime?: string | number;
  studentCount?: number;
  className?: string;
  studentXP?: number | string;
  studentLevel?: number | string;
  userRole?: string; // Add user role to control what to show
}
export function JoyfulClassroomHeader({
  classTime,
  studentCount = 0,
  className,
  studentXP = 0,
  studentLevel = 1,
  userRole = "student"
}: JoyfulClassroomHeaderProps) {
  const xpValue = typeof studentXP === 'string' ? parseInt(studentXP) || 0 : studentXP;
  const levelValue = typeof studentLevel === 'string' ? parseInt(studentLevel) || 1 : studentLevel;
  const [previousXP, setPreviousXP] = useState(xpValue);
  const isTeacher = userRole === "teacher";

  // Track XP changes for animation
  useEffect(() => {
    if (xpValue !== previousXP) {
      setTimeout(() => setPreviousXP(xpValue), 100);
    }
  }, [xpValue, previousXP]);

  // Format time from number of seconds to MM:SS
  const formatTime = (time: string | number) => {
    if (typeof time === 'string') return time;
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  return (
    <div className={cn(
      "flex items-center justify-between px-6 py-3 backdrop-blur-sm",
      className
    )}>
      {/* Left Side - Logo and Branding */}
      <div className="flex items-center gap-4">
        <img src={englePhoriaLogo} alt="EnglePhoria" className="h-8 w-auto" />
        <div className="flex items-center gap-2 text-white">
          <Heart className="h-4 w-4 text-red-400" />
          <span className="text-sm font-medium">Learning Together</span>
        </div>
      </div>

      {/* Center - Class Info */}
      <div className="flex items-center gap-6 text-white">
        {classTime && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">{formatTime(classTime)}</span>
          </div>
        )}
        
        {studentCount > 0 && (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">{studentCount} Students</span>
          </div>
        )}
      </div>

      {/* Right Side - Student Progress (only for students) */}
      {!isTeacher && (
        <div className="flex items-center gap-4 text-white">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium">Level {levelValue}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-400" />
            <AnimatedXPCounter 
              currentXP={xpValue} 
              previousXP={previousXP}
              level={levelValue}
              className="text-sm font-medium"
            />
          </div>
        </div>
      )}
    </div>
  );
}