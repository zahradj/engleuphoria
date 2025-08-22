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
    <div className="bg-surface border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {studentName}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                ID: {studentId}
              </span>
              {hasProfile && studentProfile && (
                <Badge variant="secondary" className="text-xs">
                  {studentProfile.points || 0} XP
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};