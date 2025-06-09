
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, MessageCircle, Users } from "lucide-react";

interface QuickActionsCardProps {
  onScheduleClass: () => void;
  onCreateAssignment: () => void;
  onSendMessage: () => void;
  onManageStudents: () => void;
}

export const QuickActionsCard = ({ 
  onScheduleClass, 
  onCreateAssignment, 
  onSendMessage, 
  onManageStudents 
}: QuickActionsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" className="w-full justify-start" onClick={onScheduleClass}>
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Class
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={onCreateAssignment}>
          <FileText className="mr-2 h-4 w-4" />
          Create Assignment
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={onSendMessage}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Send Message
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={onManageStudents}>
          <Users className="mr-2 h-4 w-4" />
          View Students
        </Button>
      </CardContent>
    </Card>
  );
};
