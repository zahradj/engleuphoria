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
    <div className="border-b border-border/50 p-4 bg-gradient-to-r from-surface-2 to-muted shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-lg">
            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-accent/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {studentName}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted">
                ID: {studentId}
              </span>
              {hasProfile && studentProfile && (
                <Badge variant="secondary" className="text-xs bg-success-soft text-success border-success/30">
                  {studentProfile.points || 0} XP
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Button variant="ghost" size="sm" className="text-text-muted hover:bg-primary/10 hover:text-primary transition-colors">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};