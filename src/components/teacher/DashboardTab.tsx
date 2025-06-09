
import React from "react";
import { useTeacherHandlers } from "@/hooks/useTeacherHandlers";
import { useNavigate } from "react-router-dom";
import { WelcomeSection } from "./dashboard/WelcomeSection";
import { UpcomingClassesCard } from "./dashboard/UpcomingClassesCard";
import { PendingHomeworkCard } from "./dashboard/PendingHomeworkCard";
import { NotificationsCard } from "./dashboard/NotificationsCard";
import { QuickActionsCard } from "./dashboard/QuickActionsCard";

interface DashboardTabProps {
  teacherName: string;
}

export const DashboardTab = ({ teacherName }: DashboardTabProps) => {
  const navigate = useNavigate();
  const { 
    handleJoinClass, 
    handleScheduleClass, 
    handleCreateAssignment, 
    handleSendMessage, 
    handleManageStudents 
  } = useTeacherHandlers();

  const handleJoinClassroom = () => {
    navigate("/oneonone-classroom-new");
  };

  const todaysClasses = [
    {
      id: 1,
      title: "Beginner English - Group A",
      time: "9:00 AM",
      student: "Alex, Maria, Li",
      studentCount: 3,
      status: "upcoming" as const
    },
    {
      id: 2,
      title: "Intermediate Conversation",
      time: "2:00 PM", 
      student: "Emma Johnson",
      studentCount: 1,
      status: "ready" as const
    },
    {
      id: 3,
      title: "Grammar Fundamentals",
      time: "4:00 PM",
      student: "Carlos, Sophia",
      studentCount: 2,
      status: "upcoming" as const
    }
  ];

  const pendingHomework = [
    {
      student: "Alex Johnson",
      assignment: "Past Tense Exercises",
      submitted: "2 hours ago",
      urgent: false
    },
    {
      student: "Maria Garcia", 
      assignment: "Vocabulary Practice",
      submitted: "1 day ago",
      urgent: true
    }
  ];

  const notifications = [
    {
      type: "message" as const,
      text: "New message from Emma Johnson",
      time: "5 min ago"
    },
    {
      type: "homework" as const,
      text: "3 homework submissions to grade",
      time: "1 hour ago"
    },
    {
      type: "schedule" as const,
      text: "Class rescheduled by Alex Johnson",
      time: "2 hours ago"
    }
  ];

  return (
    <div className="space-y-6">
      <WelcomeSection 
        teacherName={teacherName}
        onJoinClassroom={handleJoinClassroom}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingClassesCard 
          classes={todaysClasses}
          onJoinClass={handleJoinClass}
        />
        <PendingHomeworkCard homework={pendingHomework} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <NotificationsCard notifications={notifications} />
        <QuickActionsCard 
          onScheduleClass={handleScheduleClass}
          onCreateAssignment={handleCreateAssignment}
          onSendMessage={handleSendMessage}
          onManageStudents={handleManageStudents}
        />
      </div>
    </div>
  );
};
