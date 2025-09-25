import React from "react";
import { Clock, Users, Star, Trophy, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import englePhoriaLogo from "@/assets/englephoria-logo.png";

interface JoyfulClassroomHeaderProps {
  classTime?: string | number;
  studentCount?: number;
  className?: string;
  studentXP?: number | string;
  studentLevel?: number | string;
}

export function JoyfulClassroomHeader({ 
  classTime, 
  studentCount = 0, 
  className,
  studentXP = 0,
  studentLevel = 1
}: JoyfulClassroomHeaderProps) {
  const xpValue = typeof studentXP === 'string' ? parseInt(studentXP) || 0 : studentXP;
  const levelValue = typeof studentLevel === 'string' ? parseInt(studentLevel) || 1 : studentLevel;
  
  // Format time from number of seconds to MM:SS
  const formatTime = (time: string | number) => {
    if (typeof time === 'string') return time;
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  return (
    <div className={cn(
      "flex items-center justify-between p-4 border-b-2 border-border/50 relative overflow-hidden",
      className
    )} style={{ background: 'var(--gradient-card)' }}>
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 overflow-hidden pointer-events-none">
        <div className="absolute top-2 left-8 text-xl animate-sparkle">🌟</div>
        <div className="absolute top-4 right-12 text-lg animate-float-slow">📚</div>
        <div className="absolute bottom-2 left-20 text-sm animate-sparkle" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-3 right-8 text-lg animate-float-delayed">🎓</div>
      </div>

      {/* Left side - Class info */}
      <div className="flex items-center gap-6 relative z-10">
        {/* Class time */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl shadow-soft" 
             style={{ background: 'var(--surface-2)' }}>
          <Clock size={20} className="text-primary animate-gentle-pulse" />
          <span className="font-medium text-foreground text-sm">
            {formatTime(classTime || 0)}
          </span>
        </div>

        {/* Student count */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl shadow-soft"
             style={{ background: 'var(--surface-2)' }}>
          <Users size={20} style={{ color: 'hsl(var(--joy-teal))' }} />
          <span className="font-medium text-foreground text-sm">
            {studentCount} student{studentCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Center - Logo in purple bubble */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full animate-gentle-pulse"
             style={{ background: 'linear-gradient(135deg, hsl(var(--joy-purple)), hsl(var(--primary)))' }}>
          {/* Outer glow effect */}
          <div className="absolute inset-0 rounded-full opacity-30 animate-gentle-pulse blur-md"
               style={{ background: 'hsl(var(--joy-purple))', animationDelay: '0.5s' }}></div>
          
          {/* Logo */}
          <img 
            src={englePhoriaLogo} 
            alt="EnglEphoria Logo" 
            className="w-10 h-10 object-contain relative z-10 drop-shadow-sm"
          />
          
          {/* Sparkle effects */}
          <div className="absolute -top-1 -right-1 text-xs animate-sparkle opacity-80">✨</div>
          <div className="absolute -bottom-1 -left-1 text-xs animate-sparkle opacity-70" 
               style={{ animationDelay: '0.3s' }}>⭐</div>
        </div>
      </div>

      {/* Right side - Student progress */}
      <div className="flex items-center gap-4 relative z-10">
        {/* XP Display */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl shadow-soft"
             style={{ background: 'linear-gradient(135deg, hsl(var(--joy-yellow) / 0.1), hsl(var(--joy-orange) / 0.1))' }}>
          <Star size={20} style={{ color: 'hsl(var(--joy-yellow))' }} className="animate-sparkle" />
          <span className="font-bold text-foreground text-sm">
            {xpValue} XP
          </span>
        </div>

        {/* Level Display */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl shadow-soft"
             style={{ background: 'linear-gradient(135deg, hsl(var(--joy-purple) / 0.1), hsl(var(--primary) / 0.1))' }}>
          <Trophy size={20} style={{ color: 'hsl(var(--joy-purple))' }} className="animate-gentle-pulse" />
          <span className="font-bold text-foreground text-sm">
            Level {levelValue}
          </span>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-8 h-8 rounded-br-full opacity-10"
           style={{ background: 'var(--gradient-rainbow)' }}></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 rounded-tl-full opacity-10"
           style={{ background: 'var(--gradient-rainbow)' }}></div>
    </div>
  );
}