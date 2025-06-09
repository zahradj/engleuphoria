
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, MessageCircle, Users, UserPlus, DollarSign } from "lucide-react";

interface QuickActionsCardProps {
  onScheduleClass: () => void;
  onCreateAssignment: () => void;
  onSendMessage: () => void;
  onManageStudents: () => void;
  onAddStudent: () => void;
  onViewEarnings: () => void;
}

export const QuickActionsCard = ({ 
  onScheduleClass, 
  onCreateAssignment, 
  onSendMessage, 
  onManageStudents,
  onAddStudent,
  onViewEarnings
}: QuickActionsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="default" className="w-full justify-start bg-teal-500 hover:bg-teal-600" onClick={onAddStudent}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Student
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={onScheduleClass}>
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Class
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={onCreateAssignment}>
          <FileText className="mr-2 h-4 w-4" />
          Create Assignment
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={onViewEarnings}>
          <DollarSign className="mr-2 h-4 w-4" />
          View Earnings
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
