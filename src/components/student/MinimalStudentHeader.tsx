import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HubLogo } from "@/components/student/HubLogo";
import { ThemeModeToggle } from "@/components/ui/ThemeModeToggle";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useStudentLevel } from "@/hooks/useStudentLevel";
import { useThemeMode } from "@/hooks/useThemeMode";
import { useAuth } from "@/contexts/AuthContext";

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
  const { studentLevel } = useStudentLevel();
  const { resolvedTheme } = useThemeMode();
  const { user } = useAuth();
  const isDark = resolvedTheme === 'dark';
  const hubId = (studentLevel || 'playground') as 'playground' | 'academy' | 'professional';

  const initials = studentName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`sticky top-0 z-10 border-b backdrop-blur-xl transition-colors duration-300 ${
      isDark
        ? 'bg-black/30 border-white/10'
        : 'bg-white/40 border-black/5'
    }`}>
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center gap-3">
          <HubLogo hubId={hubId} size="sm" />
          <div className={`w-px h-8 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
          <Avatar className={`h-9 w-9 border ${isDark ? 'border-white/15' : 'border-black/10'}`}>
            <AvatarFallback className={`font-medium text-sm ${
              hubId === 'playground'
                ? isDark ? 'bg-orange-900/40 text-orange-300' : 'bg-orange-100 text-orange-700'
                : hubId === 'academy'
                  ? isDark ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                  : isDark ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="hidden sm:block">
            <h1 className={`text-sm font-semibold ${isDark ? 'text-white/90' : 'text-foreground'}`}>
              {studentName}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs ${isDark ? 'text-white/50' : 'text-muted-foreground'}`}>
                ID: {studentId}
              </span>
              {hasProfile && studentProfile && (
                <Badge variant="secondary" className={`text-xs border-0 font-medium ${
                  hubId === 'playground'
                    ? isDark ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-700'
                    : hubId === 'academy'
                      ? isDark ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                      : isDark ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  ⭐ {studentProfile.points || 0} XP
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user && <NotificationBell />}
          <ThemeModeToggle className={`${isDark ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-muted-foreground hover:text-foreground hover:bg-black/5'}`} />
        </div>
      </div>
    </div>
  );
};
