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
  return;
}