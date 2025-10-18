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
    <div className="sticky top-0 z-10 border-b border-border bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarFallback className="bg-lavender text-lavender-dark font-medium text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-lg font-semibold text-text">
              {studentName}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-text-muted">
                ID: {studentId}
              </span>
              {hasProfile && studentProfile && (
                <Badge variant="secondary" className="text-xs bg-peach text-peach-dark border-0 font-medium">
                  ⭐ {studentProfile.points || 0} XP
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Button 
          variant="ghost" 
          size="sm" 
          className="text-text-muted hover:bg-surface-soft hover:text-text transition-colors relative rounded-lg"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </Button>
      </div>
    </div>
  );
};