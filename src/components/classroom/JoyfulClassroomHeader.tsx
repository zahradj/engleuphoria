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
      "flex items-center justify-between border-b-2 border-border/50 relative overflow-hidden",
      isTeacher ? "p-2" : "p-4", // Smaller padding for teachers
      className
    )} style={{ background: 'linear-gradient(135deg, hsl(var(--joy-pink) / 0.1), hsl(var(--joy-purple) / 0.1), hsl(var(--joy-teal) / 0.1))' }}>
      
      {/* Animated background elements - more joyful */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 overflow-hidden pointer-events-none">
        <div className="absolute top-1 left-4 text-lg animate-sparkle" style={{ color: 'hsl(var(--joy-yellow))' }}>🌟</div>
        <div className="absolute top-2 right-8 text-md animate-float-slow" style={{ color: 'hsl(var(--joy-green))' }}>📚</div>
        <div className="absolute bottom-1 left-12 text-sm animate-sparkle" style={{ animationDelay: '1s', color: 'hsl(var(--joy-orange))' }}>✨</div>
        <div className="absolute bottom-1 right-4 text-md animate-float-delayed" style={{ color: 'hsl(var(--joy-purple))' }}>🎓</div>
        <div className="absolute top-1/2 left-1/4 text-sm animate-sparkle" style={{ animationDelay: '2s', color: 'hsl(var(--joy-pink))' }}>💫</div>
      </div>

      {/* Left side - Class info */}
      <div className="flex items-center gap-4 relative z-10">
        {/* Class time */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl shadow-soft" 
             style={{ background: 'linear-gradient(135deg, hsl(var(--joy-teal) / 0.15), hsl(var(--joy-green) / 0.15))' }}>
          <Clock size={isTeacher ? 16 : 20} style={{ color: 'hsl(var(--joy-teal))' }} className="animate-gentle-pulse" />
          <span className={`font-medium text-foreground ${isTeacher ? 'text-xs' : 'text-sm'}`}>
            {formatTime(classTime || 0)}
          </span>
        </div>

        {/* Student count */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl shadow-soft"
             style={{ background: 'linear-gradient(135deg, hsl(var(--joy-purple) / 0.15), hsl(var(--joy-pink) / 0.15))' }}>
          <Users size={isTeacher ? 16 : 20} style={{ color: 'hsl(var(--joy-purple))' }} />
          <span className={`font-medium text-foreground ${isTeacher ? 'text-xs' : 'text-sm'}`}>
            {studentCount} student{studentCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Center - Logo in joyful bubble */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className={`relative flex items-center justify-center rounded-full animate-gentle-pulse ${isTeacher ? 'w-12 h-12' : 'w-16 h-16'}`}
             style={{ background: 'linear-gradient(135deg, hsl(var(--joy-orange)), hsl(var(--joy-yellow)), hsl(var(--joy-pink)))' }}>
          {/* Outer glow effect */}
          <div className="absolute inset-0 rounded-full opacity-40 animate-gentle-pulse blur-md"
               style={{ background: 'hsl(var(--joy-orange))', animationDelay: '0.5s' }}></div>
          
          {/* Logo */}
          <img 
            src={englePhoriaLogo} 
            alt="EnglEphoria Logo" 
            className={`object-contain relative z-10 drop-shadow-sm ${isTeacher ? 'w-6 h-6' : 'w-10 h-10'}`}
          />
          
          {/* Sparkle effects */}
          <div className="absolute -top-1 -right-1 text-xs animate-sparkle opacity-90" style={{ color: 'hsl(var(--joy-yellow))' }}>✨</div>
          <div className="absolute -bottom-1 -left-1 text-xs animate-sparkle opacity-80" 
               style={{ animationDelay: '0.3s', color: 'hsl(var(--joy-pink))' }}>⭐</div>
        </div>
      </div>

      {/* Right side - Student progress (only for students) */}
      {!isTeacher && (
        <div className="flex items-center relative z-10">
          <div className="px-4 py-2 rounded-xl shadow-soft"
               style={{ background: 'linear-gradient(135deg, hsl(var(--joy-yellow) / 0.15), hsl(var(--joy-orange) / 0.15))' }}>
            <AnimatedXPCounter 
              currentXP={xpValue}
              previousXP={previousXP}
              level={levelValue}
              className="text-foreground"
            />
          </div>
        </div>
      )}

      {/* Decorative corner elements - more joyful */}
      <div className="absolute top-0 left-0 w-6 h-6 rounded-br-full opacity-15"
           style={{ background: 'linear-gradient(135deg, hsl(var(--joy-pink)), hsl(var(--joy-purple)))' }}></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 rounded-tl-full opacity-15"
           style={{ background: 'linear-gradient(135deg, hsl(var(--joy-orange)), hsl(var(--joy-yellow)))' }}></div>
    </div>
  );
}